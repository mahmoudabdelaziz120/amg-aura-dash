import type { SensorData } from '@/hooks/useSensorData';

const STORAGE_KEY = 'amg_sensor_data';

const defaults: SensorData = {
  rpm: 3000,
  speed: 80,
  engineTemperature: 85,
  maf: 45,
  throttlePosition: 30,
  fuelPressure: 3.5,
  intakeManifoldPressure: 1.0,
  tireWear: 25,
  battery: 88,
  engineLoad: 45,
  aggressiveness: 30,
};

/**
 * Pure function — reads current sensor values from localStorage
 * and returns a clean SensorData object. No side effects.
 */
export function getSensorSnapshot(): SensorData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaults, ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return { ...defaults };
}

/** Sensor field metadata for rendering editable inputs */
export interface SensorFieldMeta {
  key: keyof SensorData;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export const sensorFields: SensorFieldMeta[] = [
  { key: 'rpm',                    label: 'RPM',                    unit: 'rpm',  min: 0,    max: 9000, step: 100 },
  { key: 'speed',                  label: 'Speed',                  unit: 'km/h', min: 0,    max: 350,  step: 5 },
  { key: 'engineTemperature',      label: 'Engine Temp',            unit: '°C',   min: 0,    max: 150,  step: 1 },
  { key: 'maf',                    label: 'MAF',                    unit: 'g/s',  min: 0,    max: 200,  step: 1 },
  { key: 'throttlePosition',      label: 'Throttle Position',      unit: '%',    min: 0,    max: 100,  step: 1 },
  { key: 'fuelPressure',          label: 'Fuel Pressure',          unit: 'bar',  min: 0,    max: 10,   step: 0.1 },
  { key: 'intakeManifoldPressure', label: 'Intake Manifold Press.', unit: 'bar',  min: 0,    max: 3,    step: 0.1 },
  { key: 'tireWear',              label: 'Tire Wear',              unit: '%',    min: 0,    max: 100,  step: 1 },
  { key: 'battery',               label: 'Battery',                unit: '%',    min: 0,    max: 100,  step: 1 },
  { key: 'engineLoad',            label: 'Engine Load',            unit: '%',    min: 0,    max: 100,  step: 1 },
  { key: 'aggressiveness',        label: 'Aggressiveness',         unit: '%',    min: 0,    max: 100,  step: 1 },
];
