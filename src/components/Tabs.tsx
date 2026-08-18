import type { FC } from 'react';
import type { TabKey } from '../types';

interface TabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'transactions', label: 'Transactions' },
];

const Tabs: FC<TabsProps> = ({ activeTab, onTabChange }) => (
  <div className="flex gap-6 border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
    {TABS.map(({ key, label }) => {
      const active = activeTab === key;
      return (
        <button
          key={key}
          type="button"
          onClick={() => onTabChange(key)}
          aria-current={active ? 'page' : undefined}
          className={`-mb-px border-b-2 px-1 py-3 text-sm font-semibold transition ${
            active
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

export default Tabs;
