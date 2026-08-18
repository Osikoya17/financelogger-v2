export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO 'YYYY-MM-DD'
  category: string;
}

export type TabKey = 'overview' | 'transactions';

/** Filter applied to the transactions table. `type: 'all'` shows both. */
export interface TransactionFilter {
  type: TransactionType | 'all';
  category: string | 'all';
}
