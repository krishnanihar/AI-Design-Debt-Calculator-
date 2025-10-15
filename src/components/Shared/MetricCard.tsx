interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'critical' | 'high' | 'medium' | 'low' | 'neutral';
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = 'neutral',
}: MetricCardProps) {
  const colorClasses = {
    critical: 'border-debt-critical bg-debt-critical/5',
    high: 'border-debt-high bg-debt-high/5',
    medium: 'border-debt-medium bg-debt-medium/5',
    low: 'border-debt-low bg-debt-low/5',
    neutral: 'border-gray-200 bg-white',
  };

  const textColors = {
    critical: 'text-debt-critical',
    high: 'text-debt-high',
    medium: 'text-debt-medium',
    low: 'text-debt-low',
    neutral: 'text-gray-900',
  };

  return (
    <div
      className={`rounded-lg border-2 p-6 ${colorClasses[color]} transition-all hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`mt-2 text-3xl font-bold ${textColors[color]}`}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && <div className="ml-4 text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}
