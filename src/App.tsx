import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TransactionForm from './components/TransactionForm';
import Balance from './components/Balance';
import PieChartComponent from './components/PieChartComponent';
import TransactionList from './components/TransactionList';

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
  const [amount, setAmount] = useState<number>(0);
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
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center p-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="w-full max-w-md p-5 bg-white rounded-xl shadow-2xl">
        <Header />
        <TransactionForm
          description={description}
          amount={amount}
          type={type}
          setDescription={setDescription}
          setAmount={setAmount}
          setType={setType}
          addTransaction={addTransaction}
        />
        <Balance balance={getBalance()} />
        <PieChartComponent data={data} colors={COLORS} />
        <TransactionList transactions={transactions} deleteTransaction={deleteTransaction} />
      </div>
    </div>
  );
};

export default App;