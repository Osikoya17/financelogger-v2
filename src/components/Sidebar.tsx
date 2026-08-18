import type { ComponentType, SVGProps, FC } from 'react';
import type { TabKey } from '../types';
import {
  WalletIcon,
  DashboardIcon,
  TransactionsIcon,
  SettingsIcon,
  SupportIcon,
} from './icons';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface SidebarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const NAV_ITEMS: { key: TabKey; label: string; Icon: IconType }[] = [
  { key: 'overview', label: 'Overview', Icon: DashboardIcon },
  { key: 'transactions', label: 'Activity', Icon: TransactionsIcon },
];
// Rail labels stay short (the tab bar spells out "Transactions"); both drive activeTab.

const BOTTOM_ITEMS: { label: string; Icon: IconType }[] = [
  { label: 'Settings', Icon: SettingsIcon },
  { label: 'Support', Icon: SupportIcon },
];

const railButton =
  'group flex w-14 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition';

const Sidebar: FC<SidebarProps> = ({ activeTab, onTabChange }) => (
  <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col items-center gap-2 border-r border-gray-200 bg-white py-4 sm:w-20">
    {/* Brand mark */}
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
      <WalletIcon className="h-5 w-5" />
    </div>

    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map(({ key, label, Icon }) => {
        const active = activeTab === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            aria-current={active ? 'page' : undefined}
            className={`${railButton} ${
              active
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>

    <div className="flex flex-col gap-1">
      {BOTTOM_ITEMS.map(({ label, Icon }) => (
        <button
          key={label}
          type="button"
          title="Coming soon"
          className={`${railButton} cursor-default text-gray-400 hover:bg-gray-50`}
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  </aside>
);

export default Sidebar;
