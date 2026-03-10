import { useState, useCallback, useEffect } from 'react';
import type { PredictionHistoryEntry } from '@/services/predictionApi';

const HISTORY_KEY = 'amg_prediction_history';
const MAX_HISTORY = 50;

function loadHistory(): PredictionHistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return [];
}

export function usePredictionHistory() {
  const [history, setHistory] = useState<PredictionHistoryEntry[]>(loadHistory);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addEntry = useCallback((entry: PredictionHistoryEntry) => {
    setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addEntry, clearHistory };
}
