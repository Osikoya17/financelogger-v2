import type { TransactionType } from './types';

/** Category options, scoped to the transaction type. */
export const CATEGORIES: Record<TransactionType, string[]> = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: [
    'Food',
    'Rent',
    'Transport',
    'Utilities',
    'Entertainment',
    'Shopping',
    'Health',
    'Other',
  ],
};

/** Fallback category for records that predate the category field. */
export const DEFAULT_CATEGORY = 'Other';

/** Every category across both types, for the filter dropdown. */
export const ALL_CATEGORIES: string[] = Array.from(
  new Set([...CATEGORIES.income, ...CATEGORIES.expense]),
);

// Semantic colors used by the chart, pills and amounts.
export const INCOME_COLOR = '#10b981'; // emerald-500
export const EXPENSE_COLOR = '#f43f5e'; // rose-500
