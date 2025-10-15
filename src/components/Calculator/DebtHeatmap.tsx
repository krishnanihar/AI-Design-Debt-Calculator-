import { useDebtScore } from '../../hooks/useDebtScore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Severity } from '../../types';

export function DebtHeatmap() {
  const components = useDebtScore((state) => state.components);

  const getSeverityColor = (severity: Severity) => {
    const colors = {
      critical: '#ef4444',
      high: '#f59e0b',
      medium: '#eab308',
      low: '#10b981',
    };
    return colors[severity];
  };

  // Prepare data for the chart
  const chartData = components.map((component) => ({
    name: component.name,
    debtScore: component.debtScore,
    effort: component.remediationEffort,
    severity: component.severity,
    instances: component.instances,
  }));

  // Sort by debt score descending
  const sortedData = [...chartData].sort((a, b) => b.debtScore - a.debtScore);

  // Calculate statistics
  const avgDebtScore = Math.round(
    components.reduce((sum, c) => sum + c.debtScore, 0) / components.length
  );

  const totalEffort = components.reduce((sum, c) => sum + c.remediationEffort, 0);

  const severityCounts = components.reduce(
    (acc, c) => {
      acc[c.severity]++;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 } as Record<Severity, number>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Debt Heatmap</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <p className="text-sm text-purple-800 mb-1">Average Debt Score</p>
            <p className="text-3xl font-bold text-purple-900">{avgDebtScore}</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
            <p className="text-sm text-red-800 mb-1">Critical Components</p>
            <p className="text-3xl font-bold text-red-900">{severityCounts.critical}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
            <p className="text-sm text-amber-800 mb-1">High Priority</p>
            <p className="text-3xl font-bold text-amber-900">{severityCounts.high}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-1">Total Effort (SP)</p>
            <p className="text-3xl font-bold text-blue-900">{totalEffort}</p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Component Debt Scores
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sortedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                label={{ value: 'Debt Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                        <p className="font-semibold text-gray-900">{data.name}</p>
                        <p className="text-sm text-gray-600">Debt Score: {data.debtScore}</p>
                        <p className="text-sm text-gray-600">Effort: {data.effort} SP</p>
                        <p className="text-sm text-gray-600">Instances: {data.instances}</p>
                        <p className="text-sm">
                          <span
                            className="inline-block px-2 py-1 rounded text-white text-xs"
                            style={{ backgroundColor: getSeverityColor(data.severity) }}
                          >
                            {data.severity.toUpperCase()}
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="debtScore" radius={[8, 8, 0, 0]}>
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getSeverityColor(entry.severity)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grid View */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Grid</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {sortedData.map((component) => (
              <div
                key={component.name}
                className="aspect-square rounded-lg flex items-center justify-center text-white font-semibold text-xs p-2 hover:scale-105 transition-transform cursor-pointer"
                style={{ backgroundColor: getSeverityColor(component.severity) }}
                title={`${component.name}: ${component.debtScore} debt score`}
              >
                <span className="text-center truncate">{component.name}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-debt-critical" />
              <span className="text-xs text-gray-600">Critical (80+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-debt-high" />
              <span className="text-xs text-gray-600">High (60-79)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-debt-medium" />
              <span className="text-xs text-gray-600">Medium (40-59)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-debt-low" />
              <span className="text-xs text-gray-600">Low (0-39)</span>
            </div>
          </div>
        </div>

        {/* Top Issues */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Highest Priority Components
          </h3>
          <div className="space-y-2">
            {sortedData.slice(0, 5).map((component, idx) => (
              <div
                key={component.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{component.name}</p>
                    <p className="text-sm text-gray-600">
                      {component.instances} instances across the system
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{component.debtScore}</p>
                    <p className="text-xs text-gray-600">{component.effort} SP to fix</p>
                  </div>
                  <div
                    className="w-3 h-12 rounded"
                    style={{ backgroundColor: getSeverityColor(component.severity) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
