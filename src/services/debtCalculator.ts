import type {
  Component,
  ComponentDebtMetrics,
  DimensionScores,
  Severity,
  ComponentIssue,
  StreamingReadiness,
  ConfidenceHandling,
  ErrorHandling,
  DynamicContent,
  InteractionPatterns,
} from '../types';

// Calculate score for streaming readiness dimension
export function calculateStreamingScore(metrics: StreamingReadiness): number {
  let score = 100;

  if (metrics.hasFixedHeight) score -= 30;
  if (!metrics.hasOverflowHandling) score -= 20;
  if (!metrics.supportsStreaming) score -= 25;
  if (!metrics.hasProgressiveRender) score -= 25;

  return Math.max(0, score);
}

// Calculate score for confidence handling dimension
export function calculateConfidenceScore(metrics: ConfidenceHandling): number {
  let score = 100;

  if (!metrics.hasConfidenceIndicators) score -= 25;
  if (!metrics.hasHallucinationDetection) score -= 25;
  if (!metrics.hasAmbiguityStates) score -= 25;
  if (!metrics.hasVerificationBadges) score -= 25;

  return Math.max(0, score);
}

// Calculate score for error handling dimension
export function calculateErrorScore(metrics: ErrorHandling): number {
  let score = 100;

  if (!metrics.hasGracefulDegradation) score -= 20;
  if (!metrics.hasTimeoutHandling) score -= 20;
  if (!metrics.hasCircuitBreaker) score -= 20;
  if (!metrics.hasHumanHandoff) score -= 20;

  // Expect at least 5 error states
  const missingErrorStates = Math.max(0, 5 - metrics.errorStateCount);
  score -= missingErrorStates * 4;

  return Math.max(0, score);
}

// Calculate score for dynamic content dimension
export function calculateDynamicContentScore(metrics: DynamicContent): number {
  let score = 100;

  if (!metrics.handlesVariableLength) score -= 25;
  if (!metrics.supportsMultiModal) score -= 25;
  if (!metrics.hasTokenLimitManagement) score -= 25;
  if (!metrics.supportsContentSwitching) score -= 25;

  return Math.max(0, score);
}

// Calculate score for interaction patterns dimension
export function calculateInteractionScore(metrics: InteractionPatterns): number {
  let score = 100;

  if (!metrics.hasIntentConstruction) score -= 25;
  if (!metrics.hasRefinementJourney) score -= 25;
  if (!metrics.hasContextualActions) score -= 25;
  if (!metrics.hasFeedbackLoops) score -= 25;

  return Math.max(0, score);
}

// Calculate all dimension scores
export function calculateDimensionScores(metrics: ComponentDebtMetrics): DimensionScores {
  return {
    streamingReadiness: calculateStreamingScore(metrics.streamingReadiness),
    confidenceHandling: calculateConfidenceScore(metrics.confidenceHandling),
    errorHandling: calculateErrorScore(metrics.errorHandling),
    dynamicContent: calculateDynamicContentScore(metrics.dynamicContent),
    interactionPatterns: calculateInteractionScore(metrics.interactionPatterns),
  };
}

// Calculate composite debt score with weighted average
export function calculateCompositeScore(dimensionScores: DimensionScores): number {
  const weights = {
    streamingReadiness: 0.25,
    confidenceHandling: 0.20,
    errorHandling: 0.25,
    dynamicContent: 0.15,
    interactionPatterns: 0.15,
  };

  const score = (
    dimensionScores.streamingReadiness * weights.streamingReadiness +
    dimensionScores.confidenceHandling * weights.confidenceHandling +
    dimensionScores.errorHandling * weights.errorHandling +
    dimensionScores.dynamicContent * weights.dynamicContent +
    dimensionScores.interactionPatterns * weights.interactionPatterns
  );

  // Invert the score so lower is better (debt score)
  return 100 - score;
}

// Get severity classification based on debt score
export function getSeverity(debtScore: number): Severity {
  if (debtScore >= 80) return 'critical';
  if (debtScore >= 60) return 'high';
  if (debtScore >= 40) return 'medium';
  return 'low';
}

// Identify specific issues in a component
export function identifyIssues(metrics: ComponentDebtMetrics): ComponentIssue[] {
  const issues: ComponentIssue[] = [];

  // Streaming readiness issues
  if (metrics.streamingReadiness.hasFixedHeight) {
    issues.push({
      type: 'removeFixedHeight',
      description: 'Component has fixed height constraints',
      severity: 'high',
      effort: 3,
      recommendation: 'Remove fixed height, implement min-height with auto-expansion',
    });
  }

  if (!metrics.streamingReadiness.hasOverflowHandling) {
    issues.push({
      type: 'addOverflowHandling',
      description: 'Missing overflow handling for dynamic content',
      severity: 'medium',
      effort: 2,
      recommendation: 'Add overflow-y: auto with max-height constraint',
    });
  }

  if (!metrics.streamingReadiness.supportsStreaming) {
    issues.push({
      type: 'addStreamingState',
      description: 'No streaming state support',
      severity: 'critical',
      effort: 5,
      recommendation: 'Implement streaming state with progressive content reveal',
    });
  }

  if (!metrics.streamingReadiness.hasProgressiveRender) {
    issues.push({
      type: 'addProgressiveRender',
      description: 'Missing progressive rendering capability',
      severity: 'high',
      effort: 5,
      recommendation: 'Add skeleton states and progressive content loading',
    });
  }

  // Confidence handling issues
  if (!metrics.confidenceHandling.hasConfidenceIndicators) {
    issues.push({
      type: 'addConfidenceIndicator',
      description: 'No confidence score visualization',
      severity: 'medium',
      effort: 3,
      recommendation: 'Add visual confidence indicators (e.g., badges, colors)',
    });
  }

  if (!metrics.confidenceHandling.hasHallucinationDetection) {
    issues.push({
      type: 'addHallucinationDetection',
      description: 'Missing hallucination detection UI',
      severity: 'high',
      effort: 5,
      recommendation: 'Implement warning states for low-confidence content',
    });
  }

  if (!metrics.confidenceHandling.hasAmbiguityStates) {
    issues.push({
      type: 'addAmbiguityStates',
      description: 'No handling for ambiguous AI responses',
      severity: 'medium',
      effort: 3,
      recommendation: 'Add disambiguation UI patterns',
    });
  }

  if (!metrics.confidenceHandling.hasVerificationBadges) {
    issues.push({
      type: 'addVerificationBadges',
      description: 'Missing verification status indicators',
      severity: 'low',
      effort: 2,
      recommendation: 'Add badges for verified/unverified content',
    });
  }

  // Error handling issues
  if (!metrics.errorHandling.hasGracefulDegradation) {
    issues.push({
      type: 'addGracefulDegradation',
      description: 'No graceful degradation strategy',
      severity: 'high',
      effort: 4,
      recommendation: 'Implement fallback content and partial success states',
    });
  }

  if (!metrics.errorHandling.hasTimeoutHandling) {
    issues.push({
      type: 'addTimeoutHandling',
      description: 'Missing timeout handling',
      severity: 'high',
      effort: 3,
      recommendation: 'Add timeout states with retry options',
    });
  }

  if (!metrics.errorHandling.hasCircuitBreaker) {
    issues.push({
      type: 'addCircuitBreaker',
      description: 'No circuit breaker pattern',
      severity: 'medium',
      effort: 5,
      recommendation: 'Implement circuit breaker to prevent cascade failures',
    });
  }

  if (!metrics.errorHandling.hasHumanHandoff) {
    issues.push({
      type: 'addHumanHandoff',
      description: 'Missing human handoff mechanism',
      severity: 'critical',
      effort: 8,
      recommendation: 'Add escalation path to human support',
    });
  }

  if (metrics.errorHandling.errorStateCount < 5) {
    const missing = 5 - metrics.errorHandling.errorStateCount;
    issues.push({
      type: 'addErrorState',
      description: `Missing ${missing} error states (need 5 minimum)`,
      severity: 'medium',
      effort: missing * 2,
      recommendation: 'Add comprehensive error states (network, timeout, validation, server, rate-limit)',
    });
  }

  // Dynamic content issues
  if (!metrics.dynamicContent.handlesVariableLength) {
    issues.push({
      type: 'addVariableLengthHandling',
      description: 'Cannot handle variable-length content',
      severity: 'high',
      effort: 4,
      recommendation: 'Implement flexible layouts for variable content lengths',
    });
  }

  if (!metrics.dynamicContent.supportsMultiModal) {
    issues.push({
      type: 'addMultiModalSupport',
      description: 'No support for multiple content types',
      severity: 'medium',
      effort: 6,
      recommendation: 'Add rendering for text, images, code, tables, etc.',
    });
  }

  if (!metrics.dynamicContent.hasTokenLimitManagement) {
    issues.push({
      type: 'implementTokenCounter',
      description: 'Missing token limit management',
      severity: 'medium',
      effort: 5,
      recommendation: 'Add token counter with limit warnings',
    });
  }

  if (!metrics.dynamicContent.supportsContentSwitching) {
    issues.push({
      type: 'addContentSwitching',
      description: 'No dynamic content switching capability',
      severity: 'low',
      effort: 3,
      recommendation: 'Support seamless content type transitions',
    });
  }

  // Interaction pattern issues
  if (!metrics.interactionPatterns.hasIntentConstruction) {
    issues.push({
      type: 'addIntentConstruction',
      description: 'Missing intent construction UI',
      severity: 'medium',
      effort: 5,
      recommendation: 'Add guided intent building interface',
    });
  }

  if (!metrics.interactionPatterns.hasRefinementJourney) {
    issues.push({
      type: 'addRefinementJourney',
      description: 'No refinement workflow',
      severity: 'medium',
      effort: 6,
      recommendation: 'Implement iterative refinement patterns',
    });
  }

  if (!metrics.interactionPatterns.hasContextualActions) {
    issues.push({
      type: 'addContextualActions',
      description: 'Missing contextual action suggestions',
      severity: 'low',
      effort: 4,
      recommendation: 'Add smart action recommendations based on content',
    });
  }

  if (!metrics.interactionPatterns.hasFeedbackLoops) {
    issues.push({
      type: 'addFeedbackLoops',
      description: 'No user feedback mechanisms',
      severity: 'medium',
      effort: 4,
      recommendation: 'Implement thumbs up/down and improvement suggestions',
    });
  }

  return issues;
}

// Calculate total remediation effort
export function calculateRemediationEffort(issues: ComponentIssue[]): number {
  return issues.reduce((total, issue) => total + issue.effort, 0);
}

// Main function to analyze a component
export function analyzeComponent(component: Omit<Component, 'debtScore' | 'dimensionScores' | 'severity' | 'issues' | 'remediationEffort'>): Component {
  const dimensionScores = calculateDimensionScores(component.metrics);
  const debtScore = calculateCompositeScore(dimensionScores);
  const severity = getSeverity(debtScore);
  const issues = identifyIssues(component.metrics);
  const remediationEffort = calculateRemediationEffort(issues);

  return {
    ...component,
    dimensionScores,
    debtScore: Math.round(debtScore),
    severity,
    issues,
    remediationEffort,
  };
}
