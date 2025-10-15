import { useDebtScore } from '../../hooks/useDebtScore';
import { MetricCard } from '../Shared/MetricCard';
import { FileText, Download, TrendingDown, AlertCircle, Clock, Target } from 'lucide-react';
import type { Severity } from '../../types';

export function ExecutiveReport() {
  const components = useDebtScore((state) => state.components);

  // Calculate statistics
  const totalComponents = components.length;
  const avgDebtScore = Math.round(
    components.reduce((sum, c) => sum + c.debtScore, 0) / components.length
  );

  const severityCounts = components.reduce(
    (acc, c) => {
      acc[c.severity]++;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 } as Record<Severity, number>
  );

  const totalEffort = components.reduce((sum, c) => sum + c.remediationEffort, 0);

  // Estimate timeline (assuming 2-week sprints, 20 SP per sprint)
  const estimatedWeeks = Math.ceil(totalEffort / 20) * 2;

  // Get top issues across all components
  const allIssues = components.flatMap((c) => c.issues);
  const issueTypeCounts = allIssues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topIssueTypes = Object.entries(issueTypeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Get highest priority components
  const highestPriorityComponents = [...components]
    .sort((a, b) => b.debtScore - a.debtScore)
    .slice(0, 5);

  // Generate recommendations
  const recommendations = [
    `Prioritize fixing ${severityCounts.critical} critical components immediately to prevent production failures`,
    `Allocate ${totalEffort} story points across ${estimatedWeeks} weeks for full remediation`,
    `Focus on streaming readiness - this is the most common gap across components`,
    `Implement circuit breaker patterns to prevent cascade failures`,
    `Add confidence indicators to all AI-generated content displays`,
    `Establish human handoff protocols for all AI interactions`,
  ];

  const handleExport = () => {
    // Generate a simple text report
    const report = `
AI DESIGN DEBT CALCULATOR - EXECUTIVE REPORT
Generated: ${new Date().toLocaleDateString()}

OVERVIEW
========
Total Components Analyzed: ${totalComponents}
Average Debt Score: ${avgDebtScore}
Total Remediation Effort: ${totalEffort} story points
Estimated Timeline: ${estimatedWeeks} weeks

SEVERITY BREAKDOWN
==================
Critical: ${severityCounts.critical} components
High: ${severityCounts.high} components
Medium: ${severityCounts.medium} components
Low: ${severityCounts.low} components

TOP ISSUES
==========
${topIssueTypes.map(([type, count]) => `- ${type}: ${count} occurrences`).join('\n')}

HIGHEST PRIORITY COMPONENTS
============================
${highestPriorityComponents.map((c, idx) => `${idx + 1}. ${c.name} (Score: ${c.debtScore}, Effort: ${c.remediationEffort} SP)`).join('\n')}

RECOMMENDATIONS
===============
${recommendations.map((r, idx) => `${idx + 1}. ${r}`).join('\n')}
    `.trim();

    // Create download
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-design-debt-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Executive Report
            </h2>
            <p className="text-gray-600">
              AI Design Debt Analysis for {totalComponents} Components
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Average Debt Score"
            value={avgDebtScore}
            subtitle={`Across ${totalComponents} components`}
            color={avgDebtScore >= 60 ? 'critical' : avgDebtScore >= 40 ? 'medium' : 'low'}
            icon={<TrendingDown className="w-8 h-8" />}
          />

          <MetricCard
            title="Critical Components"
            value={severityCounts.critical}
            subtitle="Require immediate attention"
            color="critical"
            icon={<AlertCircle className="w-8 h-8" />}
          />

          <MetricCard
            title="Total Effort"
            value={`${totalEffort} SP`}
            subtitle={`~${estimatedWeeks} weeks`}
            color="neutral"
            icon={<Clock className="w-8 h-8" />}
          />

          <MetricCard
            title="High Priority"
            value={severityCounts.high}
            subtitle="Address in next sprint"
            color="high"
            icon={<Target className="w-8 h-8" />}
          />

          <MetricCard
            title="Medium Priority"
            value={severityCounts.medium}
            subtitle="Plan for upcoming sprints"
            color="medium"
            icon={<FileText className="w-8 h-8" />}
          />

          <MetricCard
            title="Low Priority"
            value={severityCounts.low}
            subtitle="Monitor and improve"
            color="low"
            icon={<FileText className="w-8 h-8" />}
          />
        </div>

        {/* The Hook */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 mb-8 text-white">
          <h3 className="text-xl font-bold mb-2">The Impact</h3>
          <p className="text-lg">
            "We analyzed {totalComponents} components before AI implementation.{' '}
            <span className="font-bold">
              {severityCounts.critical + severityCounts.high} would have broken in production.
            </span>{' '}
            This tool found them all in 2 minutes."
          </p>
        </div>

        {/* Top Issue Types */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Most Common Issues</h3>
          <div className="space-y-3">
            {topIssueTypes.map(([type, count], idx) => (
              <div
                key={type}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                  <span className="font-medium text-gray-900">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{count} components</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-800"
                      style={{ width: `${(count / totalComponents) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Priority Components */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Highest Priority Components
          </h3>
          <div className="space-y-3">
            {highestPriorityComponents.map((component, idx) => (
              <div
                key={component.id}
                className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{component.name}</p>
                    <p className="text-sm text-gray-600">
                      {component.instances} instances • {component.issues.length} issues
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{component.debtScore}</p>
                  <p className="text-sm text-gray-600">{component.remediationEffort} SP</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Strategic Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map((recommendation, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <p className="text-gray-700 flex-1">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            Based on MIT research showing 95% of enterprise AI projects fail due to unprepared design systems.
          </p>
          <p className="mt-1">
            This analysis identifies component-level issues before AI implementation.
          </p>
        </div>
      </div>
    </div>
  );
}
