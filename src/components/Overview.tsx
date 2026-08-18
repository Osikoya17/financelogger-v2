import type { FC } from 'react';
import StatCard from './StatCard';
import PieChartComponent from './PieChartComponent';
import { WalletIcon, TrendingUpIcon, TrendingDownIcon, ListIcon } from './icons';
import { formatCurrency } from '../utils/format';
import { INCOME_COLOR, EXPENSE_COLOR } from '../constants';

interface OverviewProps {
  balance: number;
  income: number;
  expense: number;
  count: number;
}

const Overview: FC<OverviewProps> = ({ balance, income, expense, count }) => {
  const chartData = [
    { name: 'Income', value: income, color: INCOME_COLOR },
    { name: 'Expense', value: expense, color: EXPENSE_COLOR },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Balance"
          value={formatCurrency(balance)}
          Icon={WalletIcon}
          accent="brand"
          valueClassName={balance < 0 ? 'text-rose-600' : 'text-gray-900'}
          hint="Income minus expenses"
        />
        <StatCard
          label="Income"
          value={formatCurrency(income)}
          Icon={TrendingUpIcon}
          accent="emerald"
          valueClassName="text-emerald-600"
        />
        <StatCard
          label="Expenses"
          value={formatCurrency(expense)}
          Icon={TrendingDownIcon}
          accent="rose"
          valueClassName="text-rose-600"
        />
        <StatCard
          label="Transactions"
          value={String(count)}
          Icon={ListIcon}
          accent="gray"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800">Income vs. Expenses</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Breakdown across all logged transactions
        </p>
        <PieChartComponent
          data={chartData}
          centerLabel="Balance"
          centerValue={formatCurrency(balance)}
        />
      </div>
    </div>
  );
};

export default Overview;
