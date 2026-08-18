import type { FC } from 'react';
import { BellIcon, ChevronDownIcon, PlusIcon, RefreshIcon } from './icons';

interface TopbarProps {
  title: string;
  onNewTransaction: () => void;
  onRefresh: () => void;
}

const iconButton =
  'flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-700';

const Topbar: FC<TopbarProps> = ({ title, onNewTransaction, onRefresh }) => (
  <div className="bg-white">
    {/* Top strip: workspace + status */}
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-100 text-xs font-bold text-brand-700">
          F
        </div>
        <span className="text-sm font-semibold text-gray-800">Finance Logger</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Saved locally
      </span>
    </div>

    {/* Page title + actions */}
    <div className="flex items-center justify-between px-4 pb-4 pt-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
      <div className="flex items-center gap-2 sm:gap-3">
        <button type="button" className={iconButton} title="Notifications" aria-label="Notifications">
          <BellIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          className={iconButton}
          title="Reload saved data"
          aria-label="Reload saved data"
          onClick={onRefresh}
        >
          <RefreshIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onNewTransaction}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="hidden sm:inline">New transaction</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
    </div>
  </div>
);

export default Topbar;
