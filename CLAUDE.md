# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The AI Design Debt Calculator is a React + TypeScript application that quantifies how unprepared design system components are for AI integration. It analyzes components across 5 dimensions and generates debt scores, severity levels, and remediation recommendations.

**Core Concept**: Traditional design systems assume fixed content, binary states, and synchronous rendering. This tool identifies which components will break when AI features (streaming, variable content, uncertainty handling) are introduced.

## Essential Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:5173

# Production
npm run build        # TypeScript compilation + Vite build
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # ESLint check
```

## Architecture

### Scoring Engine (`src/services/debtCalculator.ts`)

**Design Pattern**: Functional composition (not class-based)
- Pure functions for each dimension calculation
- Each function takes metrics, returns 0-100 score
- Higher score = more AI-ready (inverted to debt score at composite level)

**5 Scoring Dimensions** (weighted):
1. **Streaming Readiness (25%)**: Fixed height/width, streaming support, progressive render
2. **Confidence Handling (20%)**: Confidence indicators, hallucination detection, verification badges
3. **Error Handling (25%)**: Graceful degradation, timeout handling, circuit breaker, human handoff
4. **Dynamic Content (15%)**: Variable length, multi-modal, token management
5. **Interaction Patterns (15%)**: Intent construction, refinement journey, feedback loops

**Composite Score Formula**:
```typescript
debtScore = 100 - (
  streamingScore * 0.25 +
  confidenceScore * 0.20 +
  errorScore * 0.25 +
  dynamicScore * 0.15 +
  interactionScore * 0.15
)
```

**Severity Thresholds**:
- Critical: 80-100 (will break in production)
- High: 60-79 (high risk of failure)
- Medium: 40-59 (needs improvement)
- Low: 0-39 (minor issues)

### State Management (`src/hooks/useDebtScore.ts`)

**Pattern**: Zustand store with functional updates
- Pre-initialized with analyzed sample components
- Supports CRUD operations on components array
- Selected component state for detail views

**Key Methods**:
- `setComponents()` - Replace entire component array
- `addComponent()` - Append new analyzed component
- `selectComponent(id)` - Set component for detail modal
- `resetToSamples()` - Reload initial sample data

### Data Flow

1. **Sample Components** (`src/data/sampleComponents.ts`)
   - Raw component data with metrics
   - `analyzeComponent()` called on each to generate scores
   - Pre-calculated results stored in Zustand

2. **User Input** (Quick Analysis tab)
   - User fills form with component metrics
   - `analyzeComponent()` runs client-side
   - Results displayed immediately (no persistence)

3. **Analysis Pipeline**:
   ```
   Raw Metrics → calculateDimensionScores() → calculateCompositeScore() →
   getSeverity() → identifyIssues() → calculateRemediationEffort() →
   Complete Component Object
   ```

### UI Architecture (`src/App.tsx`)

**Pattern**: Tab-based single-page app
- Local state for active tab (no routing)
- Each tab imports data from Zustand store
- Shared components in `src/components/Shared/`

**4 Main Views**:
1. **QuickAnalysis**: Form input → instant scoring (stateless)
2. **ComponentAnalysis**: Grid + filter + detail modal (uses Zustand)
3. **DebtHeatmap**: Recharts visualizations (reads Zustand)
4. **ExecutiveReport**: Summary stats + export (reads Zustand)

## Critical Implementation Details

### TypeScript Configuration

**MUST use type-only imports** for types (due to `verbatimModuleSyntax`):
```typescript
// ✅ Correct
import type { Component, Severity } from '../types';

// ❌ Wrong - will fail build
import { Component, Severity } from '../types';
```

### Tailwind CSS Version

**CRITICAL**: Must use Tailwind v3.4.17, NOT v4 alpha
- v4 uses different PostCSS plugin (`@tailwindcss/postcss`)
- v3 stable is required: `tailwindcss@3.4.17`
- `postcss.config.js` must use `tailwindcss: {}`, not `@tailwindcss/postcss`

**Custom Colors** (defined in `tailwind.config.js`):
```javascript
colors: {
  'debt-critical': '#ef4444',  // Red
  'debt-high': '#f59e0b',      // Orange
  'debt-medium': '#eab308',    // Yellow
  'debt-low': '#10b981',       // Green
}
```

### Issue Generation Logic

Issues are generated based on specific thresholds:
- Fixed height/width → Critical "streaming" issue (3 SP effort)
- No streaming support → High "streaming" issue (5 SP)
- < 5 error states → Medium "error" issue (2 SP per missing state)
- No confidence indicators → High "confidence" issue (3 SP)
- No human handoff → Critical "interaction" issue (8 SP)

Each issue includes: `type`, `severity`, `description`, `impact`, `recommendation`, `effort` (story points)

### Sample Data Pattern

Components in `sampleComponents.ts`:
1. Define raw metrics (all booleans + errorStateCount)
2. Call `analyzeComponent()` to get full object
3. Export analyzed array for Zustand initialization

## Adding New Features

### Adding a New Scoring Dimension

1. Add interface to `src/types/index.ts`:
   ```typescript
   export interface NewDimension {
     hasFeatureA: boolean;
     hasFeatureB: boolean;
   }
   ```

2. Add to `ComponentDebtMetrics`:
   ```typescript
   export interface ComponentDebtMetrics {
     // ... existing
     newDimension: NewDimension;
   }
   ```

3. Create calculator in `debtCalculator.ts`:
   ```typescript
   export function calculateNewDimensionScore(metrics: NewDimension): number {
     let score = 100;
     if (!metrics.hasFeatureA) score -= 50;
     if (!metrics.hasFeatureB) score -= 50;
     return Math.max(0, score);
   }
   ```

4. Update `calculateDimensionScores()` and adjust weights in `calculateCompositeScore()`

5. Add issue generation logic in `identifyIssues()`

### Adding Sample Components

In `src/data/sampleComponents.ts`:
```typescript
{
  id: 'unique-id',
  name: 'ComponentName',
  type: 'button' | 'modal' | 'input' | 'display' | 'feedback',
  instances: 100,
  dependencies: ['OtherComponent'],
  lastModified: '2024-01-01',
  team: 'TeamName',
  metrics: {
    streamingReadiness: { /* all booleans */ },
    confidenceHandling: { /* all booleans */ },
    errorHandling: { /* booleans + errorStateCount number */ },
    dynamicContent: { /* all booleans */ },
    interactionPatterns: { /* all booleans */ }
  }
}
```

Then map through `analyzeComponent()` before export.

### Adding New UI Views

1. Create component in `src/components/Calculator/` or `src/components/Reports/`
2. Import in `src/App.tsx`
3. Add tab definition to `tabs` array
4. Add tab type to `Tab` union type
5. Add conditional render in main content area
6. Use `useDebtScore()` hook to access component data

## Key Constraints

- **Error State Minimum**: 5 error states expected for full score (4 points deducted per missing)
- **Weighted Scoring**: Streaming and Error Handling are most critical (25% each)
- **Inverted Logic**: High readiness score (0-100) → Low debt score (100-0)
- **Severity Breakpoints**: Fixed at 80/60/40, not configurable
- **Export Format**: Plain text report (CSV/PDF export planned for Phase 2)

## Business Context

**MIT Research Finding**: 95% of enterprise AI projects fail
**Core Statistic**: 74% of design system components break when AI is introduced
**Value Proposition**: "Find what breaks before production"

This context drives the severity language and urgency in recommendations.
