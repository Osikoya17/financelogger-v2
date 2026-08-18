import { useEffect, useRef, useState, type FC, type FormEvent } from 'react';
import type { Transaction, TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { todayISO } from '../utils/format';
import { CloseIcon } from './icons';

interface NewTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const fieldClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100';
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700';

const NewTransactionModal: FC<NewTransactionModalProps> = ({ open, onClose, onAdd }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('income');
  const [date, setDate] = useState(todayISO());
  const [category, setCategory] = useState(CATEGORIES.income[0]);
  const descriptionRef = useRef<HTMLInputElement>(null);

  // Reset the form each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setDescription('');
    setAmount('');
    setType('income');
    setDate(todayISO());
    setCategory(CATEGORIES.income[0]);
    const id = window.setTimeout(() => descriptionRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  // Keep the selected category valid when the type changes.
  const changeType = (next: TransactionType) => {
    setType(next);
    if (!CATEGORIES[next].includes(category)) setCategory(CATEGORIES[next][0]);
  };

  if (!open) return null;

  const parsedAmount = Number(amount);
  const isValid = description.trim() !== '' && Number.isFinite(parsedAmount) && parsedAmount > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onAdd({
      description: description.trim(),
      amount: parsedAmount,
      type,
      date,
      category,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-transaction-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="new-transaction-title" className="text-lg font-bold text-gray-900">
            New transaction
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
            {(['income', 'expense'] as TransactionType[]).map((t) => {
              const active = type === t;
              const activeColor = t === 'income' ? 'text-emerald-700' : 'text-rose-700';
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => changeType(t)}
                  className={`rounded-md py-2 text-sm font-semibold capitalize transition ${
                    active ? `bg-white shadow-sm ${activeColor}` : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div>
            <label htmlFor="ntx-description" className={labelClass}>
              Description
            </label>
            <input
              id="ntx-description"
              ref={descriptionRef}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Groceries, Salary"
              className={fieldClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ntx-amount" className={labelClass}>
                Amount
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  $
                </span>
                <input
                  id="ntx-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`${fieldClass} pl-7`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="ntx-date" className={labelClass}>
                Date
              </label>
              <input
                id="ntx-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="ntx-category" className={labelClass}>
              Category
            </label>
            <select
              id="ntx-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={fieldClass}
            >
              {CATEGORIES[type].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransactionModal;
