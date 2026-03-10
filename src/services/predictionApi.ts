import type { SensorData } from '@/hooks/useSensorData';

export interface PredictionResult {
  prediction: number;          // 0=OK, 1=Warning, 2=Danger
  probabilities: {
    ok: number;
    warning: number;
    danger: number;
  };
  faultCode: string;
  faultDescription: string;
  riskLevel: 'OK' | 'Warning' | 'Danger';
  timestamp: string;
}

export interface PredictionHistoryEntry {
  id: string;
  sensorSnapshot: SensorData;
  result: PredictionResult;
}

const RISK_MAP: Record<number, PredictionResult['riskLevel']> = {
  0: 'OK',
  1: 'Warning',
  2: 'Danger',
};

const FAULT_CODES: Record<number, { code: string; description: string }> = {
  0: { code: 'P0000', description: 'All systems nominal — no faults detected.' },
  1: { code: 'P0301', description: 'Early degradation detected — schedule maintenance soon.' },
  2: { code: 'P0700', description: 'Critical failure imminent — immediate intervention required.' },
};

/**
 * Send sensor data to /Car_Info backend and parse the prediction response.
 * Falls back to a local rule-based prediction if the backend is unreachable.
 */
export async function fetchPrediction(data: SensorData): Promise<PredictionResult> {
  try {
    const response = await fetch('/Car_Info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const json = await response.json();
      // Handle backend response — adapt to whatever shape your Flask/FastAPI returns
      const pred = typeof json.prediction === 'number' ? json.prediction : 0;
      const proba = json.probabilities ?? json.proba ?? null;
      return {
        prediction: pred,
        probabilities: proba
          ? { ok: proba[0] ?? proba.ok ?? 0, warning: proba[1] ?? proba.warning ?? 0, danger: proba[2] ?? proba.danger ?? 0 }
          : computeLocalProbabilities(data),
        faultCode: json.fault_code ?? FAULT_CODES[pred]?.code ?? 'P0000',
        faultDescription: json.fault_description ?? FAULT_CODES[pred]?.description ?? '',
        riskLevel: RISK_MAP[pred] ?? 'OK',
        timestamp: new Date().toISOString(),
      };
    }
  } catch {
    // Backend unavailable — fall through to local prediction
  }

  // Local fallback prediction based on simple rules
  return computeLocalPrediction(data);
}

function computeLocalPrediction(data: SensorData): PredictionResult {
  const proba = computeLocalProbabilities(data);
  let prediction = 0;
  if (proba.danger >= proba.warning && proba.danger >= proba.ok) prediction = 2;
  else if (proba.warning >= proba.ok) prediction = 1;

  return {
    prediction,
    probabilities: proba,
    faultCode: FAULT_CODES[prediction].code,
    faultDescription: FAULT_CODES[prediction].description,
    riskLevel: RISK_MAP[prediction],
    timestamp: new Date().toISOString(),
  };
}

function computeLocalProbabilities(d: SensorData): PredictionResult['probabilities'] {
  // Heuristic scoring loosely matching the notebook's feature importance
  let dangerScore = 0;
  let warningScore = 0;

  // Temperature
  if (d.engineTemperature > 110) dangerScore += 30;
  else if (d.engineTemperature > 95) warningScore += 20;

  // Engine load
  if (d.engineLoad > 85) dangerScore += 25;
  else if (d.engineLoad > 65) warningScore += 15;

  // Tire wear
  if (d.tireWear > 75) dangerScore += 25;
  else if (d.tireWear > 50) warningScore += 15;

  // Battery
  if (d.battery < 20) dangerScore += 15;
  else if (d.battery < 40) warningScore += 10;

  // Aggressiveness
  if (d.aggressiveness > 80) dangerScore += 10;
  else if (d.aggressiveness > 50) warningScore += 10;

  // Speed
  if (d.speed > 250) dangerScore += 10;
  else if (d.speed > 180) warningScore += 5;

  const total = Math.max(1, dangerScore + warningScore + 100);
  const danger = dangerScore / total;
  const warning = warningScore / total;
  const ok = 1 - danger - warning;

  return { ok: Math.round(ok * 1000) / 1000, warning: Math.round(warning * 1000) / 1000, danger: Math.round(danger * 1000) / 1000 };
}
