import { useState } from 'react';
import { Search, TrendingUp, AlertTriangle } from 'lucide-react';
import { useDebtScore } from '../../hooks/useDebtScore';
import { SeverityBadge } from '../Shared/SeverityBadge';
import type { Component, Severity } from '../../types';

export function ComponentAnalysis() {
  const components = useDebtScore((state) => state.components);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'all'>('all');
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);

  const filteredComponents = components.filter((component) => {
    const matchesSearch = component.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSeverity =
      filterSeverity === 'all' || component.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: Severity) => {
    const colors = {
      critical: 'bg-debt-critical',
      high: 'bg-debt-high',
      medium: 'bg-debt-medium',
      low: 'bg-debt-low',
    };
    return colors[severity];
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Component Analysis</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>{components.length} components analyzed</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as Severity | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredComponents.map((component) => (
            <div
              key={component.id}
              onClick={() => setSelectedComponent(component)}
              className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer hover:border-purple-500"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{component.name}</h3>
                  <p className="text-xs text-gray-500">{component.type}</p>
                </div>
                <SeverityBadge severity={component.severity} />
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-gray-900">
                  {component.debtScore}
                </span>
                <span className="text-xs text-gray-500">Debt Score</span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full ${getSeverityColor(component.severity)}`}
                  style={{ width: `${component.debtScore}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{component.instances} instances</span>
                <span>{component.remediationEffort} SP</span>
              </div>

              {component.issues.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-600">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    <span>{component.issues.length} issues found</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No components match your filters
          </div>
        )}
      </div>

      {/* Component Detail Modal */}
      {selectedComponent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedComponent(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedComponent.name}
                  </h2>
                  <p className="text-gray-600 mt-1">{selectedComponent.type} component</p>
                </div>
                <button
                  onClick={() => setSelectedComponent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Debt Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedComponent.debtScore}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Instances</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedComponent.instances}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Effort (SP)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedComponent.remediationEffort}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Issues</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedComponent.issues.length}
                  </p>
                </div>
              </div>

              {/* Dimension Scores */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Dimension Scores</h3>
                <div className="space-y-3">
                  {Object.entries(selectedComponent.dimensionScores).map(([key, score]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-purple-800"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">
                          {score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues List */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Issues & Recommendations</h3>
                <div className="space-y-3">
                  {selectedComponent.issues.map((issue, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{issue.description}</h4>
                        <SeverityBadge severity={issue.severity} />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{issue.recommendation}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {issue.effort} story points
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
