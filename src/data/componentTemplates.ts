import type { ComponentDebtMetrics } from '../types';

export interface ComponentTemplate {
  id: string;
  name: string;
  type: 'interactive' | 'display' | 'input' | 'layout' | 'feedback';
  description: string;
  metrics: ComponentDebtMetrics;
}

export const componentTemplates: ComponentTemplate[] = [
  {
    id: 'button',
    name: 'Button',
    type: 'interactive',
    description: 'Standard button component with common patterns',
    metrics: {
      streamingReadiness: {
        hasFixedHeight: true,
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
        hasGracefulDegradation: true,
        hasTimeoutHandling: false,
        hasCircuitBreaker: false,
        hasHumanHandoff: false,
        errorStateCount: 2,
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
    },
  },
  {
    id: 'modal',
    name: 'Modal/Dialog',
    type: 'layout',
    description: 'Modal dialog for displaying content',
    metrics: {
      streamingReadiness: {
        hasFixedHeight: true,
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
        errorStateCount: 1,
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
    },
  },
  {
    id: 'text-input',
    name: 'Text Input',
    type: 'input',
    description: 'Text field or input component',
    metrics: {
      streamingReadiness: {
        hasFixedHeight: true,
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
        errorStateCount: 3,
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
    },
  },
  {
    id: 'card',
    name: 'Card',
    type: 'display',
    description: 'Content card for displaying information',
    metrics: {
      streamingReadiness: {
        hasFixedHeight: true,
        hasOverflowHandling: false,
        supportsStreaming: false,
        hasProgressiveRender: true,
      },
      confidenceHandling: {
        hasConfidenceIndicators: false,
        hasHallucinationDetection: false,
        hasAmbiguityStates: false,
        hasVerificationBadges: false,
      },
      errorHandling: {
        hasGracefulDegradation: true,
        hasTimeoutHandling: false,
        hasCircuitBreaker: false,
        hasHumanHandoff: false,
        errorStateCount: 2,
      },
      dynamicContent: {
        handlesVariableLength: false,
        supportsMultiModal: true,
        hasTokenLimitManagement: false,
        supportsContentSwitching: false,
      },
      interactionPatterns: {
        hasIntentConstruction: false,
        hasRefinementJourney: false,
        hasContextualActions: true,
        hasFeedbackLoops: false,
      },
    },
  },
  {
    id: 'notification',
    name: 'Notification/Toast',
    type: 'feedback',
    description: 'Notification or toast component',
    metrics: {
      streamingReadiness: {
        hasFixedHeight: false,
        hasOverflowHandling: true,
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
        hasGracefulDegradation: true,
        hasTimeoutHandling: true,
        hasCircuitBreaker: false,
        hasHumanHandoff: false,
        errorStateCount: 4,
      },
      dynamicContent: {
        handlesVariableLength: true,
        supportsMultiModal: false,
        hasTokenLimitManagement: false,
        supportsContentSwitching: false,
      },
      interactionPatterns: {
        hasIntentConstruction: false,
        hasRefinementJourney: false,
        hasContextualActions: true,
        hasFeedbackLoops: false,
      },
    },
  },
  {
    id: 'data-table',
    name: 'Data Table',
    type: 'display',
    description: 'Table component for displaying structured data',
    metrics: {
      streamingReadiness: {
        hasFixedHeight: true,
        hasOverflowHandling: true,
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
        hasTimeoutHandling: true,
        hasCircuitBreaker: false,
        hasHumanHandoff: false,
        errorStateCount: 3,
      },
      dynamicContent: {
        handlesVariableLength: true,
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
    },
  },
  {
    id: 'ai-ready',
    name: 'AI-Ready Component',
    type: 'interactive',
    description: 'Ideal component with full AI readiness',
    metrics: {
      streamingReadiness: {
        hasFixedHeight: false,
        hasOverflowHandling: true,
        supportsStreaming: true,
        hasProgressiveRender: true,
      },
      confidenceHandling: {
        hasConfidenceIndicators: true,
        hasHallucinationDetection: true,
        hasAmbiguityStates: true,
        hasVerificationBadges: true,
      },
      errorHandling: {
        hasGracefulDegradation: true,
        hasTimeoutHandling: true,
        hasCircuitBreaker: true,
        hasHumanHandoff: true,
        errorStateCount: 7,
      },
      dynamicContent: {
        handlesVariableLength: true,
        supportsMultiModal: true,
        hasTokenLimitManagement: true,
        supportsContentSwitching: true,
      },
      interactionPatterns: {
        hasIntentConstruction: true,
        hasRefinementJourney: true,
        hasContextualActions: true,
        hasFeedbackLoops: true,
      },
    },
  },
];
