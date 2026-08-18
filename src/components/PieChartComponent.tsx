import type { FC } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/format';

interface Slice {
  name: string;
  value: number;
  color: string;
}

interface PieChartComponentProps {
  data: Slice[];
  centerLabel?: string;
  centerValue?: string;
}

const PieChartComponent: FC<PieChartComponentProps> = ({
  data,
  centerLabel,
  centerValue,
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const isEmpty = total <= 0;

  // When there's no data, render a flat neutral ring so the layout stays put.
  const chartData = isEmpty
    ? [{ name: 'No data', value: 1, color: '#e5e7eb' }]
    : data.filter((d) => d.value > 0);

  return (
    <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
      <div className="relative h-56 w-56 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={92}
              paddingAngle={isEmpty ? 0 : 3}
              cornerRadius={6}
              stroke="none"
            >
              {chartData.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
            {!isEmpty && (
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  fontSize: 13,
                }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerLabel && (
            <span className="text-xs font-medium text-gray-400">{centerLabel}</span>
          )}
          {centerValue && (
            <span className="text-xl font-bold text-gray-900">{centerValue}</span>
          )}
        </div>
      </div>

      {/* Legend */}
      <ul className="flex flex-col gap-3">
        {data.map((slice) => {
          const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
          return (
            <li key={slice.name} className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-sm font-medium text-gray-600">{slice.name}</span>
              <span className="ml-auto text-sm font-semibold text-gray-900">
                {formatCurrency(slice.value)}
              </span>
              <span className="w-10 text-right text-xs text-gray-400">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PieChartComponent;
