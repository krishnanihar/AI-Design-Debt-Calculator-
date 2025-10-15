import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { ProgressRing } from '../Shared/ProgressRing';
import { SeverityBadge } from '../Shared/SeverityBadge';
import { analyzeComponent } from '../../services/debtCalculator';
import type { Component, ComponentDebtMetrics } from '../../types';

export function QuickAnalysis() {
  const [componentName, setComponentName] = useState('');
  const [result, setResult] = useState<Component | null>(null);

  // Form state for quick metrics
  const [hasFixedHeight, setHasFixedHeight] = useState(true);
  const [hasOverflowHandling, setHasOverflowHandling] = useState(false);
  const [supportsStreaming, setSupportsStreaming] = useState(false);
  const [hasProgressiveRender, setHasProgressiveRender] = useState(false);
  const [hasConfidenceUI, setHasConfidenceUI] = useState(false);
  const [errorStateCount, setErrorStateCount] = useState(2);
  const [hasVariableLength, setHasVariableLength] = useState(false);

  const handleAnalyze = () => {
    if (!componentName.trim()) return;

    const metrics: ComponentDebtMetrics = {
      streamingReadiness: {
        hasFixedHeight,
        hasOverflowHandling,
        supportsStreaming,
        hasProgressiveRender,
      },
      confidenceHandling: {
        hasConfidenceIndicators: hasConfidenceUI,
        hasHallucinationDetection: false,
        hasAmbiguityStates: false,
        hasVerificationBadges: false,
      },
      errorHandling: {
        hasGracefulDegradation: errorStateCount >= 3,
        hasTimeoutHandling: errorStateCount >= 4,
        hasCircuitBreaker: false,
        hasHumanHandoff: false,
        errorStateCount,
      },
      dynamicContent: {
        handlesVariableLength: hasVariableLength,
        supportsMultiModal: false,
        hasTokenLimitManagement: false,
        supportsContentSwitching: false,
      },
      interactionPatterns: {
        hasIntentConstruction: false,
        hasRefinementJourney: false,
        hasContextualActions: false,
        hasFeedbackLoops: false,
      },
    };

    const analyzed = analyzeComponent({
      id: `quick-${Date.now()}`,
      name: componentName,
      type: 'interactive',
      instances: 0,
      dependencies: [],
      lastModified: new Date().toISOString().split('T')[0],
      team: 'Unknown',
      metrics,
    });

    setResult(analyzed);
  };

  const handleReset = () => {
    setComponentName('');
    setResult(null);
    setHasFixedHeight(true);
    setHasOverflowHandling(false);
    setSupportsStreaming(false);
    setHasProgressiveRender(false);
    setHasConfidenceUI(false);
    setErrorStateCount(2);
    setHasVariableLength(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Quick Analysis
        </h2>
        <p className="text-gray-600 mb-8">
          Enter basic information about your component to get an instant AI readiness score.
        </p>

        <div className="space-y-6">
          {/* Component Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Component Name
            </label>
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="e.g., Button, Modal, TextField"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={hasFixedHeight}
                onChange={(e) => setHasFixedHeight(e.target.checked)}
                className="w-5 h-5 text-purple-600"
              />
              <span className="text-sm text-gray-700">Has Fixed Height</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={hasOverflowHandling}
                onChange={(e) => setHasOverflowHandling(e.target.checked)}
                className="w-5 h-5 text-purple-600"
              />
              <span className="text-sm text-gray-700">Has Overflow Handling</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={supportsStreaming}
                onChange={(e) => setSupportsStreaming(e.target.checked)}
                className="w-5 h-5 text-purple-600"
              />
              <span className="text-sm text-gray-700">Supports Streaming</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={hasProgressiveRender}
                onChange={(e) => setHasProgressiveRender(e.target.checked)}
                className="w-5 h-5 text-purple-600"
              />
              <span className="text-sm text-gray-700">Progressive Rendering</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConfidenceUI}
                onChange={(e) => setHasConfidenceUI(e.target.checked)}
                className="w-5 h-5 text-purple-600"
              />
              <span className="text-sm text-gray-700">Confidence Indicators</span>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={hasVariableLength}
                onChange={(e) => setHasVariableLength(e.target.checked)}
                className="w-5 h-5 text-purple-600"
              />
              <span className="text-sm text-gray-700">Handles Variable Length</span>
            </label>
          </div>

          {/* Error State Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Error States
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={errorStateCount}
              onChange={(e) => setErrorStateCount(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">Minimum 5 recommended for AI components</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAnalyze}
              disabled={!componentName.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Analyze Component
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Analysis Results</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Score Display */}
              <div className="flex flex-col items-center justify-center">
                <ProgressRing score={result.debtScore} severity={result.severity} />
                <div className="mt-4">
                  <SeverityBadge severity={result.severity} className="text-sm" />
                </div>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  {result.remediationEffort} story points to remediate
                </p>
              </div>

              {/* Dimension Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">Dimension Scores</h4>
                {Object.entries(result.dimensionScores).map(([key, score]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
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

            {/* Top Issues */}
            {result.issues.length > 0 && (
              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">Top Issues to Fix</h4>
                <div className="space-y-3">
                  {result.issues.slice(0, 5).map((issue, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <AlertCircle className="w-5 h-5 text-debt-high flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {issue.description}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {issue.recommendation} ({issue.effort} story points)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
