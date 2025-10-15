import { create } from 'zustand';
import type { Component } from '../types';
import { sampleComponents } from '../data/sampleComponents';

interface DebtScoreState {
  components: Component[];
  selectedComponent: Component | null;
  setComponents: (components: Component[]) => void;
  addComponent: (component: Component) => void;
  selectComponent: (id: string | null) => void;
  resetToSamples: () => void;
}

export const useDebtScore = create<DebtScoreState>((set) => ({
  components: sampleComponents,
  selectedComponent: null,

  setComponents: (components) => set({ components }),

  addComponent: (component) =>
    set((state) => ({
      components: [...state.components, component],
    })),

  selectComponent: (id) =>
    set((state) => ({
      selectedComponent: id
        ? state.components.find((c) => c.id === id) || null
        : null,
    })),

  resetToSamples: () =>
    set({
      components: sampleComponents,
      selectedComponent: null,
    }),
}));
