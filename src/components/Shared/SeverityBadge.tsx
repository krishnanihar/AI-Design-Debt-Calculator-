import type { Severity } from '../../types';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

export function SeverityBadge({ severity, className = '' }: SeverityBadgeProps) {
  const colors = {
    critical: 'bg-debt-critical text-white',
    high: 'bg-debt-high text-white',
    medium: 'bg-debt-medium text-white',
    low: 'bg-debt-low text-white',
  };

  const labels = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[severity]} ${className}`}
    >
      {labels[severity]}
    </span>
  );
}
