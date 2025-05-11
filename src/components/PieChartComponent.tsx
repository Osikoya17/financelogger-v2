import { PieChart, Pie, Cell, Tooltip } from 'recharts';

interface PieChartComponentProps {
  data: { name: string; value: number }[];
  colors: string[];
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, colors }) => {
  return (
    <PieChart width={300} height={300} className="mx-auto mb-5">
      <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default PieChartComponent;