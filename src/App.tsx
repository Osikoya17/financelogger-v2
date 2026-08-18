import { useEffect, useState, type FC } from 'react';
import type { Transaction, TabKey, TransactionFilter } from './types';
import { DEFAULT_CATEGORY } from './constants';
import { todayISO } from './utils/format';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Tabs from './components/Tabs';
import Overview from './components/Overview';
import Toolbar from './components/Toolbar';
import TransactionsTable from './components/TransactionsTable';
import NewTransactionModal from './components/NewTransactionModal';

const STORAGE_KEY = 'transactions';

const genId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

/** Coerce stored data into valid Transactions, backfilling date/category for legacy records. */
function normalize(raw: unknown): Transaction[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
    .map((r) => ({
      id: r.id ? String(r.id) : genId(),
      description: String(r.description ?? ''),
      amount: Number(r.amount) || 0,
      type: r.type === 'expense' ? 'expense' : 'income',
      date: typeof r.date === 'string' && r.date ? r.date : todayISO(),
      category: typeof r.category === 'string' && r.category ? r.category : DEFAULT_CATEGORY,
    }));
}

function readStorage(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? normalize(JSON.parse(stored)) : [];
  } catch {
    return [];
  }
}

const App: FC = () => {
  // Read synchronously on init so the save effect never clobbers stored data.
  const [transactions, setTransactions] = useState<Transaction[]>(readStorage);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<TransactionFilter>({ type: 'all', category: 'all' });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (data: Omit<Transaction, 'id'>) =>
    setTransactions((prev) => [...prev, { ...data, id: genId() }]);

  const deleteTransaction = (id: string) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  const refresh = () => setTransactions(readStorage());

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  const query = search.trim().toLowerCase();
  const filtered = transactions.filter((t) => {
    if (filter.type !== 'all' && t.type !== filter.type) return false;
    if (filter.category !== 'all' && t.category !== filter.category) return false;
    if (
      query &&
      !t.description.toLowerCase().includes(query) &&
      !t.category.toLowerCase().includes(query)
    )
      return false;
    return true;
  });

  const exportCSV = () => {
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      ['Date', 'Description', 'Category', 'Type', 'Amount'],
      ...filtered.map((t) => [t.date, t.description, t.category, t.type, String(t.amount)]),
    ];
    const csv = rows.map((cols) => cols.map(escape).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8fa] text-gray-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20">
          <Topbar
            title="Dashboard"
            onNewTransaction={() => setModalOpen(true)}
            onRefresh={refresh}
          />
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {activeTab === 'overview' ? (
            <Overview
              balance={balance}
              income={income}
              expense={expense}
              count={transactions.length}
            />
          ) : (
            <div className="space-y-4">
              <Toolbar
                search={search}
                onSearchChange={setSearch}
                filter={filter}
                onFilterChange={setFilter}
                onExport={exportCSV}
                canExport={filtered.length > 0}
              />
              <TransactionsTable
                transactions={filtered}
                totalCount={transactions.length}
                onDelete={deleteTransaction}
              />
            </div>
          )}
        </main>
      </div>

      <NewTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addTransaction}
      />
    </div>
  );
};

export default App;
