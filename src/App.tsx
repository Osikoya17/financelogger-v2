import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import './index.css';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

const COLORS = ['#4CAF50', '#FF5722'];

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>();
  const [type, setType] = useState<'income' | 'expense'>('income');

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (!description || !amount) return;
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount,
      type,
    };
    setTransactions([...transactions, newTransaction]);
    setDescription('');
    setAmount(0);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const getBalance = () => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 0);
  };

  const data = [
    { name: 'Income', value: transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0) },
    { name: 'Expense', value: transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0) }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center p-5">
      <div className="w-full max-w-md p-5 bg-white rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">Finance Logger</h2>
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

        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-700">Balance:</h3>
          <div className="text-2xl font-bold text-green-600">${getBalance()}</div>
        </div>

        <PieChart width={300} height={300} className="mx-auto mb-5">
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

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
      </div>
    </div>
  );
};

export default App;

