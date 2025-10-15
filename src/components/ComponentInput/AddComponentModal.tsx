import { useState } from 'react';
import { X, Sparkles, HelpCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDebtScore } from '../../hooks/useDebtScore';
import { analyzeComponent } from '../../services/debtCalculator';
import { componentTemplates } from '../../data/componentTemplates';
import type { ComponentDebtMetrics } from '../../types';
import toast from 'react-hot-toast';

const componentSchema = z.object({
  name: z.string().min(1, 'Component name is required'),
  type: z.enum(['interactive', 'display', 'input', 'layout', 'feedback']),
  instances: z.number().min(0, 'Instances must be 0 or greater'),
  team: z.string().min(1),
  dependencies: z.string().optional(),
});

type ComponentFormData = z.infer<typeof componentSchema>;

interface AddComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddComponentModal({ isOpen, onClose }: AddComponentModalProps) {
  const { addComponent, currentProjectId } = useDebtScore();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Metrics state
  const [metrics, setMetrics] = useState<ComponentDebtMetrics>({
    streamingReadiness: {
      hasFixedHeight: false,
      hasOverflowHandling: false,
      supportsStreaming: false,
      hasProgressiveRender: false,
    },
    confidenceHandling: {
      hasConfidenceIndicators: false,
      hasHallucinationDetection: false,
      hasAmbiguityStates: false,
      hasVerificationBadges: false,
    },
    errorHandling: {
      hasGracefulDegradation: false,
      hasTimeoutHandling: false,
      hasCircuitBreaker: false,
      hasHumanHandoff: false,
      errorStateCount: 0,
    },
    dynamicContent: {
      handlesVariableLength: false,
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
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ComponentFormData>({
    resolver: zodResolver(componentSchema),
    defaultValues: {
      instances: 0,
      team: 'Unknown',
    },
  });

  if (!isOpen) return null;

  const handleTemplateSelect = (templateId: string) => {
    const template = componentTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setMetrics(template.metrics);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      setMetrics({
        streamingReadiness: {
          hasFixedHeight: false,
          hasOverflowHandling: false,
          supportsStreaming: false,
          hasProgressiveRender: false,
        },
        confidenceHandling: {
          hasConfidenceIndicators: false,
          hasHallucinationDetection: false,
          hasAmbiguityStates: false,
          hasVerificationBadges: false,
        },
        errorHandling: {
          hasGracefulDegradation: false,
          hasTimeoutHandling: false,
          hasCircuitBreaker: false,
          hasHumanHandoff: false,
          errorStateCount: 0,
        },
        dynamicContent: {
          handlesVariableLength: false,
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
      });
      setSelectedTemplate(null);
      onClose();
    }
  };

  const onSubmit = async (data: ComponentFormData) => {
    if (!currentProjectId) {
      toast.error('Please select a project first');
      return;
    }

    setLoading(true);

    try {
      // Parse dependencies
      const dependencies = data.dependencies
        ? data.dependencies.split(',').map((d) => d.trim()).filter(Boolean)
        : [];

      // Analyze component with metrics
      const analyzed = analyzeComponent({
        id: `comp-${Date.now()}`,
        name: data.name,
        type: data.type,
        instances: data.instances,
        dependencies,
        lastModified: new Date().toISOString().split('T')[0],
        team: data.team,
        metrics,
      });

      // Add to store
      await addComponent(analyzed, currentProjectId);

      toast.success(`Component "${data.name}" added successfully`);
      handleClose();
    } catch (error) {
      toast.error('Failed to add component');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Component</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Template Selection */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-900">
                Start from Template (Optional)
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {componentTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    selectedTemplate === template.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">
                    {template.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Basic Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Component Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="e.g., Button, Modal, TextField"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Component Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('type')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="interactive">Interactive</option>
                    <option value="display">Display</option>
                    <option value="input">Input</option>
                    <option value="layout">Layout</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instances
                  </label>
                  <input
                    type="number"
                    {...register('instances', { valueAsNumber: true })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team
                  </label>
                  <input
                    type="text"
                    {...register('team')}
                    placeholder="e.g., Core, Forms"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dependencies (comma-separated)
                </label>
                <input
                  type="text"
                  {...register('dependencies')}
                  placeholder="e.g., Icon, Button, Spinner"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Streaming Readiness */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Streaming Readiness
                </h3>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'hasFixedHeight', label: 'Has Fixed Height', negative: true },
                  { key: 'hasOverflowHandling', label: 'Has Overflow Handling' },
                  { key: 'supportsStreaming', label: 'Supports Streaming' },
                  { key: 'hasProgressiveRender', label: 'Has Progressive Render' },
                ].map(({ key, label, negative }) => (
                  <label
                    key={key}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={metrics.streamingReadiness[key as keyof typeof metrics.streamingReadiness] as boolean}
                      onChange={(e) =>
                        setMetrics({
                          ...metrics,
                          streamingReadiness: {
                            ...metrics.streamingReadiness,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                    {negative && <span className="text-xs text-red-500">(negative)</span>}
                  </label>
                ))}
              </div>
            </div>

            {/* Confidence Handling */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Confidence Handling
                </h3>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'hasConfidenceIndicators', label: 'Has Confidence Indicators' },
                  { key: 'hasHallucinationDetection', label: 'Has Hallucination Detection' },
                  { key: 'hasAmbiguityStates', label: 'Has Ambiguity States' },
                  { key: 'hasVerificationBadges', label: 'Has Verification Badges' },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={metrics.confidenceHandling[key as keyof typeof metrics.confidenceHandling] as boolean}
                      onChange={(e) =>
                        setMetrics({
                          ...metrics,
                          confidenceHandling: {
                            ...metrics.confidenceHandling,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Error Handling */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Error Handling
                </h3>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'hasGracefulDegradation', label: 'Has Graceful Degradation' },
                  { key: 'hasTimeoutHandling', label: 'Has Timeout Handling' },
                  { key: 'hasCircuitBreaker', label: 'Has Circuit Breaker' },
                  { key: 'hasHumanHandoff', label: 'Has Human Handoff' },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={metrics.errorHandling[key as keyof typeof metrics.errorHandling] as boolean}
                      onChange={(e) =>
                        setMetrics({
                          ...metrics,
                          errorHandling: {
                            ...metrics.errorHandling,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Error State Count (minimum 5 recommended)
                </label>
                <input
                  type="number"
                  min="0"
                  value={metrics.errorHandling.errorStateCount}
                  onChange={(e) =>
                    setMetrics({
                      ...metrics,
                      errorHandling: {
                        ...metrics.errorHandling,
                        errorStateCount: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Dynamic Content
                </h3>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'handlesVariableLength', label: 'Handles Variable Length' },
                  { key: 'supportsMultiModal', label: 'Supports Multi-Modal' },
                  { key: 'hasTokenLimitManagement', label: 'Has Token Limit Management' },
                  { key: 'supportsContentSwitching', label: 'Supports Content Switching' },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={metrics.dynamicContent[key as keyof typeof metrics.dynamicContent] as boolean}
                      onChange={(e) =>
                        setMetrics({
                          ...metrics,
                          dynamicContent: {
                            ...metrics.dynamicContent,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interaction Patterns */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Interaction Patterns
                </h3>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'hasIntentConstruction', label: 'Has Intent Construction' },
                  { key: 'hasRefinementJourney', label: 'Has Refinement Journey' },
                  { key: 'hasContextualActions', label: 'Has Contextual Actions' },
                  { key: 'hasFeedbackLoops', label: 'Has Feedback Loops' },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={metrics.interactionPatterns[key as keyof typeof metrics.interactionPatterns] as boolean}
                      onChange={(e) =>
                        setMetrics({
                          ...metrics,
                          interactionPatterns: {
                            ...metrics.interactionPatterns,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Adding...' : 'Add Component'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
