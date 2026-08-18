import { useState, type FC, type MouseEvent } from 'react';
import type { Transaction } from '../types';
import { formatCurrency, formatDate, getInitials } from '../utils/format';
import { SortIcon, MoreVerticalIcon, TrashIcon, ListIcon } from './icons';

interface TransactionsTableProps {
  transactions: Transaction[]; // already filtered/searched
  totalCount: number; // unfiltered count, for empty-state messaging
  onDelete: (id: string) => void;
}

type SortKey = 'date' | 'amount';
interface SortState {
  key: SortKey;
  dir: 'asc' | 'desc';
}

const TransactionsTable: FC<TransactionsTableProps> = ({
  transactions,
  totalCount,
  onDelete,
}) => {
  const [sort, setSort] = useState<SortState>({ key: 'date', dir: 'desc' });
  const [menu, setMenu] = useState<{ id: string; top: number; left: number } | null>(null);

  const toggleSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' },
    );

  const rows = [...transactions].sort((a, b) => {
    const cmp = sort.key === 'date' ? a.date.localeCompare(b.date) : a.amount - b.amount;
    return sort.dir === 'asc' ? cmp : -cmp;
  });

  const openMenu = (e: MouseEvent, id: string) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenu({ id, top: r.bottom + 4, left: Math.max(8, r.right - 160) });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-gray-800">Transactions list</h3>
        <span className="text-xs text-gray-400">
          {rows.length} of {totalCount}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <ListIcon className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-gray-700">
            {totalCount === 0 ? 'No transactions yet' : 'No matching transactions'}
          </p>
          <p className="max-w-xs text-sm text-gray-400">
            {totalCount === 0
              ? 'Click “New transaction” to log your first income or expense.'
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">
                  <button
                    type="button"
                    onClick={() => toggleSort('date')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Date
                    <SortIcon
                      className={`h-3.5 w-3.5 ${sort.key === 'date' ? 'text-brand-600' : 'text-gray-300'}`}
                    />
                  </button>
                </th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort('amount')}
                    className="ml-auto flex items-center gap-1 hover:text-gray-700"
                  >
                    Amount
                    <SortIcon
                      className={`h-3.5 w-3.5 ${sort.key === 'amount' ? 'text-brand-600' : 'text-gray-300'}`}
                    />
                  </button>
                </th>
                <th className="px-5 py-3 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((t) => {
                const income = t.type === 'income';
                return (
                  <tr key={t.id} className="text-sm transition hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                          {getInitials(t.description)}
                        </span>
                        <span className="font-medium text-gray-800">{t.description}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          income ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${income ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        />
                        {t.type}
                      </span>
                    </td>
                    <td
                      className={`whitespace-nowrap px-5 py-4 text-right font-semibold ${
                        income ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {income ? '+' : '−'}
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => openMenu(e, t.id)}
                        aria-label={`Actions for ${t.description}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                      >
                        <MoreVerticalIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Row action menu (fixed position to avoid clipping inside the scroll container) */}
      {menu && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setMenu(null)} />
          <div
            className="fixed z-40 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
            style={{ top: menu.top, left: menu.left }}
          >
            <button
              type="button"
              onClick={() => {
                onDelete(menu.id);
                setMenu(null);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsTable;
