interface TransactionFormProps {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    setDescription: (value: string) => void;
    setAmount: (value: number) => void;
    setType: (value: 'income' | 'expense') => void;
    addTransaction: () => void;
  }
  
  const TransactionForm: React.FC<TransactionFormProps> = ({
    description,
    amount,
    type,
    setDescription,
    setAmount,
    setType,
    addTransaction,
  }) => {
    return (
      <div className="space-y-3 mb-5">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          value={type}
          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button
          onClick={addTransaction}
          className="w-full p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
        >
          Add Transaction
        </button>
      </div>
    );
  };
  
  export default TransactionForm;