import { useState, useMemo, useCallback } from 'react';
import {
  Thermometer, Battery, Disc, Settings, Fuel, Activity,
  TrendingUp, Timer, Shield
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import VehicleImage from '@/components/VehicleImage';
import CircularGauge from '@/components/CircularGauge';
import ControlSliders from '@/components/ControlSliders';
import StatusCard from '@/components/StatusCard';
import AlertsPanel from '@/components/AlertsPanel';
import ProgressBar from '@/components/ProgressBar';

const Index = () => {
  const [mode, setMode] = useState<'normal' | 'racing'>('normal');
  const [params, setParams] = useState({
    aggressiveness: 30,
    speed: 80,
    temperature: 85,
    tireWear: 25,
    battery: 88,
    engineLoad: 45,
  });

  const handleSliderChange = useCallback((id: string, value: number) => {
    setParams((prev) => ({ ...prev, [id]: value }));
  }, []);

  const healthScore = useMemo(() => {
    const tireHealth = 100 - params.tireWear;
    const tempPenalty = params.temperature > 100 ? (params.temperature - 100) * 2 : 0;
    const loadPenalty = params.engineLoad > 80 ? (params.engineLoad - 80) * 1.5 : 0;
    return Math.max(0, Math.min(100, Math.round(
      (tireHealth * 0.2 + params.battery * 0.3 + (100 - tempPenalty) * 0.25 + (100 - loadPenalty) * 0.25)
    )));
  }, [params]);

  const rpm = useMemo(() => Math.min(9000, params.speed * 38 + params.engineLoad * 20), [params.speed, params.engineLoad]);
  const gear = useMemo(() => Math.min(8, Math.max(1, Math.ceil(params.speed / 35))), [params.speed]);
  const acceleration = useMemo(() => (params.aggressiveness / 100 * params.engineLoad / 100 * 4.2).toFixed(1), [params.aggressiveness, params.engineLoad]);

  const alerts = useMemo(() => {
    const a: { id: string; type: 'critical' | 'warning' | 'info' | 'success'; message: string; recommendation?: string }[] = [];
    if (params.temperature > 105) a.push({ id: 'temp', type: 'critical', message: 'Engine temperature critical!', recommendation: 'Reduce load or activate cooling mode.' });
    if (params.tireWear > 70) a.push({ id: 'tire', type: 'warning', message: `Tire wear at ${params.tireWear}%`, recommendation: 'Plan pit stop within 5 laps.' });
    if (params.battery < 30) a.push({ id: 'bat', type: 'warning', message: 'Battery level low', recommendation: 'Switch to energy recovery mode.' });
    if (params.engineLoad > 85) a.push({ id: 'eng', type: 'warning', message: 'Engine load exceeding safe limit', recommendation: 'Reduce aggressiveness.' });
    if (a.length === 0) a.push({ id: 'ok', type: 'success', message: 'All systems nominal', recommendation: 'Vehicle performing optimally.' });
    return a;
  }, [params]);

  const sliders = useMemo(() => [
    { id: 'aggressiveness', label: 'Driving Aggressiveness', value: params.aggressiveness, min: 0, max: 100, unit: '%', color: 'red' as const },
    { id: 'speed', label: 'Speed', value: params.speed, min: 0, max: 280, unit: ' km/h', color: 'neon' as const },
    { id: 'temperature', label: 'Engine Temperature', value: params.temperature, min: 60, max: 130, unit: '°C', color: params.temperature > 105 ? 'red' as const : 'warning' as const },
    { id: 'tireWear', label: 'Tire Wear', value: params.tireWear, min: 0, max: 100, unit: '%', color: params.tireWear > 70 ? 'red' as const : 'neon' as const },
    { id: 'battery', label: 'Battery', value: params.battery, min: 0, max: 100, unit: '%', color: params.battery < 30 ? 'red' as const : 'success' as const },
    { id: 'engineLoad', label: 'Engine Load', value: params.engineLoad, min: 0, max: 100, unit: '%', color: params.engineLoad > 85 ? 'red' as const : 'neon' as const },
  ], [params]);

  const failureProbability = useMemo(() => Math.min(99, Math.round(
    (params.tireWear * 0.3) + (Math.max(0, params.temperature - 90) * 1.5) + (Math.max(0, params.engineLoad - 60) * 0.8) + ((100 - params.battery) * 0.2)
  )), [params]);

  const remainingLife = useMemo(() => Math.max(0, Math.round(
    1000 - params.tireWear * 5 - Math.max(0, params.temperature - 90) * 8 - params.engineLoad * 2
  )), [params]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader mode={mode} onToggleMode={() => setMode(m => m === 'normal' ? 'racing' : 'normal')} healthScore={healthScore} />

      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Top Row: 3D Vehicle + Gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* 3D Vehicle */}
          <div className="lg:col-span-2 amg-panel min-h-[400px]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-xs uppercase tracking-widest text-muted-foreground">Vehicle Overview</h2>
              <span className={`text-xs font-display px-2 py-0.5 rounded border ${
                mode === 'racing' ? 'text-destructive border-destructive/30 bg-destructive/5' : 'text-neon border-primary/30 bg-primary/5'
              }`}>
                {mode === 'racing' ? '🏁 RACE MODE' : '🛣️ NORMAL'}
              </span>
            </div>
            <VehicleImage healthScore={healthScore} />
          </div>

          {/* Main Gauges */}
          <div className="amg-panel flex flex-col items-center justify-center gap-6">
            <h2 className="font-display text-xs uppercase tracking-widest text-muted-foreground self-start">Performance</h2>
            <CircularGauge value={params.speed} max={280} label="Speed" unit="km/h" color="neon" size={160} />
            <div className="flex gap-6">
              <CircularGauge value={rpm} max={9000} label="RPM" unit="rpm" color={rpm > 7500 ? 'red' : 'neon'} size={100} />
              <CircularGauge value={gear} max={8} label="Gear" unit="G" color="neon" size={100} />
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <span className="font-display text-xl font-bold text-foreground">{acceleration}</span>
                <span className="text-xs text-muted-foreground font-body block">0-100 sec</span>
              </div>
              <div className="text-center">
                <span className={`font-display text-xl font-bold ${healthScore > 70 ? 'text-success' : healthScore > 40 ? 'text-warning' : 'text-destructive'}`}>{healthScore}%</span>
                <span className="text-xs text-muted-foreground font-body block">Health</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row: Controls + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard title="Failure Prob." value={`${failureProbability}%`} icon={Shield}
            status={failureProbability > 60 ? 'critical' : failureProbability > 30 ? 'warning' : 'good'}
            subtitle={`RUL: ${remainingLife} km`} />
          <StatusCard title="Brake Wear" value={Math.min(100, Math.round(params.tireWear * 0.8 + params.aggressiveness * 0.2))} unit="%"
            icon={Disc} status={params.tireWear > 70 ? 'critical' : params.tireWear > 40 ? 'warning' : 'good'} subtitle="Friction pads monitored" />
          <StatusCard title="Oil Pressure" value={(3.5 - params.engineLoad * 0.02).toFixed(1)} unit="bar"
            icon={Fuel} status={params.engineLoad > 85 ? 'warning' : 'good'} subtitle="Within operating range" />
          <StatusCard title="Vibration" value={(params.engineLoad * 0.05 + params.speed * 0.01).toFixed(1)} unit="mm/s"
            icon={Activity} status={params.engineLoad > 80 ? 'warning' : 'good'} subtitle="Structural integrity OK" />
        </div>

        {/* Bottom Row: Sliders + Details + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Control Sliders */}
          <ControlSliders sliders={sliders} onChange={handleSliderChange} />

          {/* Tire & Energy Details */}
          <div className="space-y-4">
            <div className="amg-panel space-y-3">
              <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Thermometer className="w-3 h-3" /> Tire & Grip
              </h3>
              <ProgressBar label="Front Left Temp" value={params.temperature - 5} max={130} color={params.temperature > 105 ? 'red' : 'warning'} unit="°C" />
              <ProgressBar label="Front Right Temp" value={params.temperature - 3} max={130} color={params.temperature > 105 ? 'red' : 'warning'} unit="°C" />
              <ProgressBar label="Rear Left Temp" value={params.temperature + 2} max={130} color={params.temperature > 105 ? 'red' : 'warning'} unit="°C" />
              <ProgressBar label="Rear Right Temp" value={params.temperature} max={130} color={params.temperature > 105 ? 'red' : 'warning'} unit="°C" />
              <ProgressBar label="Grip Level" value={Math.max(20, 100 - params.tireWear - (params.temperature > 100 ? 15 : 0))} max={100} color="success" />
            </div>
            <div className="amg-panel space-y-3">
              <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Battery className="w-3 h-3" /> Energy & Battery
              </h3>
              <ProgressBar label="Battery Health" value={params.battery} max={100} color={params.battery < 30 ? 'red' : 'success'} />
              <ProgressBar label="Energy Efficiency" value={Math.max(20, 100 - params.aggressiveness * 0.5 - params.speed * 0.1)} max={100} color="neon" />
              <ProgressBar label="Est. Range" value={Math.max(0, params.battery * 4 - params.speed * 0.5)} max={400} color="neon" unit=" km" />
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-4">
            <AlertsPanel alerts={alerts} />
            <div className="amg-panel space-y-3">
              <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Telemetry
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 rounded bg-secondary border border-border">
                  <span className="text-lg font-display font-bold text-foreground">{(params.speed * 0.36 + 45).toFixed(0)}</span>
                  <span className="text-[10px] font-body text-muted-foreground block">Sector 1 (s)</span>
                </div>
                <div className="text-center p-2 rounded bg-secondary border border-border">
                  <span className="text-lg font-display font-bold text-foreground">{(params.speed * 0.28 + 38).toFixed(0)}</span>
                  <span className="text-[10px] font-body text-muted-foreground block">Sector 2 (s)</span>
                </div>
                <div className="text-center p-2 rounded bg-secondary border border-border">
                  <span className="text-lg font-display font-bold text-neon">{(params.speed * 0.65 + 80).toFixed(0)}</span>
                  <span className="text-[10px] font-body text-muted-foreground block">Lap Time (s)</span>
                </div>
                <div className="text-center p-2 rounded bg-secondary border border-border">
                  <span className="text-lg font-display font-bold text-foreground">{Math.round(params.speed * 0.85 + params.aggressiveness * 0.3)}</span>
                  <span className="text-[10px] font-body text-muted-foreground block">Power (kW)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-4 border-t border-border">
          <span className="text-[10px] font-display uppercase tracking-[0.3em] text-muted-foreground">
            AMG Predictive AI Dashboard • Real-Time Telemetry System
          </span>
        </footer>
      </div>
    </div>
  );
};

export default Index;
