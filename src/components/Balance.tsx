interface BalanceProps {
    balance: number;
  }
  
  const Balance: React.FC<BalanceProps> = ({ balance }) => {
    return (
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-700">Balance:</h3>
        <div className="text-2xl font-bold text-green-600">${balance}</div>
      </div>
    );
  };
  
  export default Balance;