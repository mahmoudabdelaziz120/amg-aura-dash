import { useState, useCallback, useEffect } from 'react';

export interface SensorData {
  rpm: number;
  speed: number;
  engineTemperature: number;
  maf: number;
  throttlePosition: number;
  fuelPressure: number;
  intakeManifoldPressure: number;
  tireWear: number;
  battery: number;
  engineLoad: number;
  aggressiveness: number;
}

const STORAGE_KEY = 'amg_sensor_data';

const defaultSensorData: SensorData = {
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

function loadFromStorage(): SensorData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSensorData, ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors
  }
  return defaultSensorData;
}

export function useSensorData() {
  const [sensorData, setSensorData] = useState<SensorData>(loadFromStorage);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sensorData));
  }, [sensorData]);

  const updateSensor = useCallback((key: string, value: number) => {
    setSensorData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetSensors = useCallback(() => {
    setSensorData(defaultSensorData);
  }, []);

  return { sensorData, updateSensor, resetSensors };
}

/**
 * Send the current sensor data as JSON to the /Car_Info backend endpoint.
 */
export async function sendSensorData(data: SensorData): Promise<Response> {
  const response = await fetch('/Car_Info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response;
}
