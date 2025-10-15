// Severity levels
export type Severity = 'critical' | 'high' | 'medium' | 'low';

// Streaming Readiness Metrics
export interface StreamingReadiness {
  hasFixedHeight: boolean;
  hasOverflowHandling: boolean;
  supportsStreaming: boolean;
  hasProgressiveRender: boolean;
}

// Confidence & Uncertainty Metrics
export interface ConfidenceHandling {
  hasConfidenceIndicators: boolean;
  hasHallucinationDetection: boolean;
  hasAmbiguityStates: boolean;
  hasVerificationBadges: boolean;
}

// Error & Fallback Metrics
export interface ErrorHandling {
  hasGracefulDegradation: boolean;
  hasTimeoutHandling: boolean;
  hasCircuitBreaker: boolean;
  hasHumanHandoff: boolean;
  errorStateCount: number;
}

// Dynamic Content Metrics
export interface DynamicContent {
  handlesVariableLength: boolean;
  supportsMultiModal: boolean;
  hasTokenLimitManagement: boolean;
  supportsContentSwitching: boolean;
}

// Interaction Patterns Metrics
export interface InteractionPatterns {
  hasIntentConstruction: boolean;
  hasRefinementJourney: boolean;
  hasContextualActions: boolean;
  hasFeedbackLoops: boolean;
}

// Complete Component Debt Metrics
export interface ComponentDebtMetrics {
  streamingReadiness: StreamingReadiness;
  confidenceHandling: ConfidenceHandling;
  errorHandling: ErrorHandling;
  dynamicContent: DynamicContent;
  interactionPatterns: InteractionPatterns;
}

// Dimension scores
export interface DimensionScores {
  streamingReadiness: number;
  confidenceHandling: number;
  errorHandling: number;
  dynamicContent: number;
  interactionPatterns: number;
}

// Issue identified in component
export interface ComponentIssue {
  type: string;
  description: string;
  severity: Severity;
  effort: number; // story points
  recommendation: string;
}

// Component data structure
export interface Component {
  id: string;
  name: string;
  type: 'interactive' | 'display' | 'input' | 'layout' | 'feedback';
  instances: number;
  dependencies: string[];
  lastModified: string;
  team: string;
  metrics: ComponentDebtMetrics;
  debtScore: number;
  dimensionScores: DimensionScores;
  severity: Severity;
  issues: ComponentIssue[];
  remediationEffort: number; // total story points
}

// Sample component input for quick analysis
export interface QuickAnalysisInput {
  componentName: string;
  hasFixedHeight: boolean;
  hasLoadingState: boolean;
  errorStateCount: number;
  hasStreamingSupport: boolean;
  hasConfidenceUI: boolean;
}

// Report data
export interface ExecutiveReport {
  totalComponents: number;
  averageDebtScore: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  totalRemediationEffort: number;
  estimatedWeeks: number;
  topIssues: string[];
  recommendations: string[];
}
