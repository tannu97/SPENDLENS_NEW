import { useState, useEffect } from 'react';

const STORAGE_KEY = 'spendlens_audit_form';

const defaultState = {
  tools: [],
  teamSize: 5,
  useCase: 'mixed',
};

export function useAuditStore() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const addTool = (toolId) => {
    if (state.tools.find(t => t.toolId === toolId)) return;
    setState(s => ({
      ...s,
      tools: [...s.tools, { toolId, plan: '', seats: 1, monthlySpend: 0 }],
    }));
  };

  const removeTool = (toolId) => {
    setState(s => ({ ...s, tools: s.tools.filter(t => t.toolId !== toolId) }));
  };

  const updateTool = (toolId, updates) => {
    setState(s => ({
      ...s,
      tools: s.tools.map(t => t.toolId === toolId ? { ...t, ...updates } : t),
    }));
  };

  const setTeamSize = (teamSize) => setState(s => ({ ...s, teamSize }));
  const setUseCase = (useCase) => setState(s => ({ ...s, useCase }));

  const reset = () => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { ...state, addTool, removeTool, updateTool, setTeamSize, setUseCase, reset };
}
