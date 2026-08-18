import type { ComponentType, SVGProps, FC } from 'react';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;
type Accent = 'brand' | 'emerald' | 'rose' | 'gray';

interface StatCardProps {
  label: string;
  value: string;
  Icon: IconType;
  accent?: Accent;
  valueClassName?: string;
  hint?: string;
}

const ACCENTS: Record<Accent, string> = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  rose: 'bg-rose-50 text-rose-600',
  gray: 'bg-gray-100 text-gray-600',
};

const StatCard: FC<StatCardProps> = ({
  label,
  value,
  Icon,
  accent = 'gray',
  valueClassName = 'text-gray-900',
  hint,
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${ACCENTS[accent]}`}>
        <Icon className="h-5 w-5" />
      </span>
    </div>
    <div className={`mt-3 text-2xl font-bold ${valueClassName}`}>{value}</div>
    {hint && <div className="mt-1 text-xs text-gray-400">{hint}</div>}
  </div>
);

export default StatCard;
