import type { SensorData } from '@/hooks/useSensorData';

export interface PredictionResult {
  prediction: number;                              // 0=OK, 1=Warning, 2=Danger
  status: 'OK' | 'WARNING' | 'DANGER';
  confidence: number;                              // 0-100
  probabilities: { ok: number; warning: number; danger: number };
  faultCode: string;
  faultDescription: string;
  riskLevel: 'OK' | 'Warning' | 'Danger';          // legacy alias for status
  riskTier: 'Low' | 'Medium' | 'High';
  topFeatures: { name: string; importance: number }[];
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
const STATUS_MAP: Record<number, PredictionResult['status']> = { 0: 'OK', 1: 'WARNING', 2: 'DANGER' };
const TIER_MAP: Record<number, PredictionResult['riskTier']> = { 0: 'Low', 1: 'Medium', 2: 'High' };

const FAULT_CODES: Record<number, { code: string; description: string }> = {
  0: { code: 'P0000', description: 'All systems nominal — no faults detected.' },
  1: { code: 'P0301', description: 'Early degradation detected — schedule maintenance soon.' },
  2: { code: 'P0700', description: 'Critical failure imminent — immediate intervention required.' },
};

/** Map the app's SensorData → the ML backend's expected 8-field payload. */
export function buildMLPayload(data: SensorData) {
  return {
    engine_rpm: data.rpm,
    vehicle_speed: data.speed,
    engine_coolant_temp: data.engineTemperature,
    maf: data.maf,
    throttle_position: data.throttlePosition,
    fuel_pressure: data.fuelPressure,
    intake_manifold_pressure: data.intakeManifoldPressure,
    air_intake_temp: data.airIntakeTemp,
  };
}

/**
 * Send sensor data to /Car_Info backend and parse the prediction response.
 * Falls back to a local rule-based prediction if the backend is unreachable.
 */
export async function fetchPrediction(data: SensorData): Promise<PredictionResult> {
  try {
    const response = await fetch('/Car_Info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildMLPayload(data)),
    });

    if (response.ok) {
      const ct = response.headers.get('content-type') ?? '';
      if (ct.includes('application/json')) {
        const json = await response.json();
        // Backend response shape: { prediction, confidence, description, risk_level, timestamp }
        const statusStr = (json.prediction ?? json.status ?? 'OK').toString().toUpperCase();
        const pred = statusStr === 'DANGER' ? 2 : statusStr === 'WARNING' ? 1 : 0;
        const confidence = typeof json.confidence === 'number'
          ? json.confidence
          : computeLocalConfidence(data, pred);
        const proba = json.probabilities ?? null;
        return {
          prediction: pred,
          status: STATUS_MAP[pred],
          confidence: Math.round(confidence),
          probabilities: proba
            ? { ok: proba[0] ?? proba.ok ?? 0, warning: proba[1] ?? proba.warning ?? 0, danger: proba[2] ?? proba.danger ?? 0 }
            : computeLocalProbabilities(data),
          faultCode: json.fault_code ?? FAULT_CODES[pred].code,
          faultDescription: json.description ?? json.fault_description ?? FAULT_CODES[pred].description,
          riskLevel: RISK_MAP[pred],
          riskTier: (json.risk_level as PredictionResult['riskTier']) ?? TIER_MAP[pred],
          topFeatures: json.top_features ?? computeLocalFeatureImportance(data),
          timestamp: json.timestamp ?? new Date().toISOString(),
        };
      }
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
    status: STATUS_MAP[prediction],
    confidence: Math.round(computeLocalConfidence(data, prediction)),
    probabilities: proba,
    faultCode: FAULT_CODES[prediction].code,
    faultDescription: FAULT_CODES[prediction].description,
    riskLevel: RISK_MAP[prediction],
    riskTier: TIER_MAP[prediction],
    topFeatures: computeLocalFeatureImportance(data),
    timestamp: new Date().toISOString(),
  };
}

function computeLocalConfidence(_d: SensorData, pred: number): number {
  const proba = computeLocalProbabilities(_d);
  const winning = pred === 2 ? proba.danger : pred === 1 ? proba.warning : proba.ok;
  // map raw [0..1] onto a 60-99 range for a more realistic display
  return 60 + winning * 39;
}

/** Heuristic feature importance based on which sensors are out of nominal range. */
function computeLocalFeatureImportance(d: SensorData): { name: string; importance: number }[] {
  const scores = [
    { name: 'Coolant Temp',          importance: Math.min(1, Math.max(0, (d.engineTemperature - 80) / 50)) },
    { name: 'Engine RPM',            importance: Math.min(1, Math.max(0, (d.rpm - 3000) / 6000)) },
    { name: 'Throttle Position',     importance: Math.min(1, d.throttlePosition / 100) * 0.8 },
    { name: 'MAF',                   importance: Math.min(1, d.maf / 200) * 0.6 },
    { name: 'Intake Manifold Press.',importance: Math.min(1, d.intakeManifoldPressure / 3) * 0.7 },
    { name: 'Fuel Pressure',         importance: Math.min(1, Math.abs(d.fuelPressure - 3.5) / 6) },
    { name: 'Air Intake Temp',       importance: Math.min(1, Math.max(0, (d.airIntakeTemp - 25) / 75)) },
    { name: 'Vehicle Speed',         importance: Math.min(1, d.speed / 350) * 0.5 },
  ];
  return scores.sort((a, b) => b.importance - a.importance).slice(0, 5);
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
