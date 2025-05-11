interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
  }
  
  interface TransactionListProps {
    transactions: Transaction[];
    deleteTransaction: (id: string) => void;
  }
  
  const TransactionList: React.FC<TransactionListProps> = ({ transactions, deleteTransaction }) => {
    return (
      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {transactions.map((t) => (
          <li
            key={t.id}
            className={`p-4 flex justify-between items-center rounded-lg shadow-md ${
              t.type === 'income' ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <div>
              <span className="font-semibold text-gray-700">{t.description}</span> — ${t.amount}
            </div>
            <button
              onClick={() => deleteTransaction(t.id)}
              className="text-red-500 hover:text-red-700 transition duration-300"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  };
  
  export default TransactionList;