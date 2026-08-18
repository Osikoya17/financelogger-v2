import { useState, type FC } from 'react';
import type { TransactionFilter } from '../types';
import { ALL_CATEGORIES } from '../constants';
import { SearchIcon, FilterIcon, ChevronDownIcon, DownloadIcon } from './icons';

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: TransactionFilter;
  onFilterChange: (filter: TransactionFilter) => void;
  onExport: () => void;
  canExport: boolean;
}

const TYPE_OPTIONS: TransactionFilter['type'][] = ['all', 'income', 'expense'];

const Toolbar: FC<ToolbarProps> = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  onExport,
  canExport,
}) => {
  const [open, setOpen] = useState(false);
  const activeCount =
    (filter.type !== 'all' ? 1 : 0) + (filter.category !== 'all' ? 1 : 0);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative min-w-0 sm:max-w-xs sm:flex-1">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search transactions"
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Filters */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <FilterIcon className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="rounded-full bg-brand-100 px-1.5 text-xs font-semibold text-brand-700">
                {activeCount}
              </span>
            )}
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </button>

          {open && (
            <>
              <button
                type="button"
                aria-hidden
                tabIndex={-1}
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Type
                </p>
                <div className="flex gap-1.5">
                  {TYPE_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onFilterChange({ ...filter, type: t })}
                      className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition ${
                        filter.type === t
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <p className="mb-1.5 mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Category
                </p>
                <select
                  value={filter.category}
                  onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500"
                >
                  <option value="all">All categories</option>
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={() => onFilterChange({ type: 'all', category: 'all' })}
                    className="mt-4 w-full rounded-lg px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-50"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Export */}
        <button
          type="button"
          onClick={onExport}
          disabled={!canExport}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <DownloadIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
