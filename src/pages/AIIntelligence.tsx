import { useState, useCallback, useMemo } from 'react';
import {
  Brain, Cpu, Activity, Target, Zap, TrendingUp, AlertTriangle, Database,
  Send, Clock, Shield, Gauge, Thermometer, Battery, Timer, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CircularGauge from '@/components/CircularGauge';
import ProgressBar from '@/components/ProgressBar';
import { useSensorData, sendSensorData } from '@/hooks/useSensorData';
import { usePredictionHistory } from '@/hooks/usePredictionHistory';
import { fetchPrediction, type PredictionResult, type PredictionHistoryEntry } from '@/services/predictionApi';
import { useToast } from '@/hooks/use-toast';

const riskConfig = {
  OK:      { color: 'text-success', bg: 'bg-success/10', border: 'border-success/30', icon: Shield, label: 'NOMINAL' },
  Warning: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', icon: AlertTriangle, label: 'WARNING' },
  Danger:  { color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', icon: AlertTriangle, label: 'CRITICAL' },
};

export default function AIIntelligence() {
  const { sensorData, updateSensor } = useSensorData();
  const { history, addEntry, clearHistory } = usePredictionHistory();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);

  const handlePredict = useCallback(async () => {
    setLoading(true);
    try {
      // Send to /Car_Info and get prediction
      const result = await fetchPrediction(sensorData);
      setCurrentPrediction(result);
      const entry: PredictionHistoryEntry = {
        id: crypto.randomUUID(),
        sensorSnapshot: { ...sensorData },
        result,
      };
      addEntry(entry);
      toast({ title: 'Prediction Complete', description: `Risk: ${result.riskLevel} — ${result.faultCode}` });
    } catch {
      toast({ title: 'Prediction Failed', description: 'Could not reach the model endpoint.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [sensorData, addEntry, toast]);

  const sensorSliders = useMemo(() => [
    { id: 'engineTemperature', label: 'Engine Temp', value: sensorData.engineTemperature, min: 60, max: 130, unit: '°C', icon: Thermometer },
    { id: 'speed', label: 'Speed', value: sensorData.speed, min: 0, max: 350, unit: 'km/h', icon: Gauge },
    { id: 'engineLoad', label: 'Engine Load', value: sensorData.engineLoad, min: 0, max: 100, unit: '%', icon: Activity },
    { id: 'aggressiveness', label: 'Aggressiveness', value: sensorData.aggressiveness, min: 0, max: 100, unit: '', icon: Zap },
    { id: 'tireWear', label: 'Tire Wear', value: sensorData.tireWear, min: 0, max: 100, unit: '%', icon: Target },
    { id: 'battery', label: 'Battery', value: sensorData.battery, min: 0, max: 100, unit: '%', icon: Battery },
    { id: 'rpm', label: 'RPM', value: sensorData.rpm, min: 0, max: 15000, unit: '', icon: Activity },
    { id: 'maf', label: 'MAF', value: sensorData.maf, min: 0, max: 200, unit: 'g/s', icon: Activity },
    { id: 'throttlePosition', label: 'Throttle', value: sensorData.throttlePosition, min: 0, max: 100, unit: '%', icon: Gauge },
    { id: 'fuelPressure', label: 'Fuel Pressure', value: sensorData.fuelPressure, min: 0, max: 10, unit: 'bar', icon: Gauge },
    { id: 'intakeManifoldPressure', label: 'Intake Pressure', value: sensorData.intakeManifoldPressure, min: 0, max: 3, unit: 'bar', icon: Gauge },
  ], [sensorData]);

  const risk = currentPrediction ? riskConfig[currentPrediction.riskLevel] : null;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            AI Predictive Intelligence
          </h1>
          <p className="text-xs text-muted-foreground font-body mt-1">
            Sensor Data → ML Model → Fault Prediction
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3 text-success animate-neon-pulse" />
          <span className="text-[9px] font-display uppercase tracking-wider text-success">
            {loading ? 'Processing...' : 'Model Ready'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT — Sensor Data Card */}
        <div className="amg-panel space-y-4">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Database className="w-3 h-3" /> Sensor Data (Control Parameters)
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {sensorSliders.map((s) => (
              <div key={s.id} className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-body text-muted-foreground flex items-center gap-1">
                    <s.icon className="w-3 h-3" /> {s.label}
                  </span>
                  <span className="font-display text-foreground">
                    {typeof s.value === 'number' && s.value % 1 !== 0 ? s.value.toFixed(1) : s.value}{s.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.max <= 10 ? 0.1 : 1}
                  value={s.value}
                  onChange={(e) => updateSensor(s.id, parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-secondary/40 accent-primary cursor-pointer"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-display text-xs uppercase tracking-wider transition-all duration-300 border ${
              loading
                ? 'bg-muted/20 border-muted/30 text-muted-foreground cursor-wait'
                : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 glow-neon'
            }`}
          >
            <Send className="w-3 h-3" />
            {loading ? 'Analyzing...' : 'Send to Model & Predict'}
          </button>
        </div>

        {/* CENTER — AI Prediction Card */}
        <div className="amg-panel space-y-4">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Brain className="w-3 h-3" /> AI Prediction Result
          </h3>

          <AnimatePresence mode="wait">
            {currentPrediction && risk ? (
              <motion.div
                key={currentPrediction.timestamp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Fault Code */}
                <div className={`p-4 rounded-md border ${risk.border} ${risk.bg}`}>
                  <span className="text-[9px] font-display uppercase tracking-wider text-muted-foreground block mb-1">Predicted Fault Code</span>
                  <span className={`text-2xl font-display font-bold ${risk.color}`}>
                    {currentPrediction.faultCode}
                  </span>
                </div>

                {/* Fault Description */}
                <div className="p-3 rounded-md border border-border bg-secondary/10">
                  <span className="text-[9px] font-display uppercase tracking-wider text-muted-foreground block mb-1">Fault Description</span>
                  <p className="text-xs font-body text-foreground">{currentPrediction.faultDescription}</p>
                </div>

                {/* Risk Level */}
                <div className={`p-4 rounded-md border ${risk.border} ${risk.bg} flex items-center justify-between`}>
                  <div>
                    <span className="text-[9px] font-display uppercase tracking-wider text-muted-foreground block mb-1">Risk Level</span>
                    <span className={`text-lg font-display font-bold ${risk.color}`}>{risk.label}</span>
                  </div>
                  <risk.icon className={`w-8 h-8 ${risk.color}`} />
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-body">
                  <Clock className="w-3 h-3" />
                  {new Date(currentPrediction.timestamp).toLocaleString()}
                </div>

                {/* Probabilities */}
                <div className="space-y-2">
                  <span className="text-[9px] font-display uppercase tracking-wider text-muted-foreground">Class Probabilities</span>
                  <ProgressBar label="OK" value={Math.round(currentPrediction.probabilities.ok * 100)} max={100} color="success" />
                  <ProgressBar label="Warning" value={Math.round(currentPrediction.probabilities.warning * 100)} max={100} color="warning" />
                  <ProgressBar label="Danger" value={Math.round(currentPrediction.probabilities.danger * 100)} max={100} color="red" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <Brain className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-xs text-muted-foreground font-body">
                  Adjust sensor parameters and click <strong>"Send to Model"</strong> to get a prediction.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT — Fault Risk Indicator + Gauge */}
        <div className="space-y-4">
          <div className="amg-panel flex flex-col items-center justify-center gap-3">
            <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground">Fault Risk Gauge</h3>
            <CircularGauge
              value={currentPrediction ? Math.round(currentPrediction.probabilities.danger * 100) : 0}
              max={100}
              label="Danger"
              unit="%"
              color={
                currentPrediction
                  ? currentPrediction.probabilities.danger > 0.5 ? 'red' : currentPrediction.probabilities.danger > 0.2 ? 'warning' : 'success'
                  : 'neon'
              }
              size={160}
            />
            <div className="grid grid-cols-3 gap-2 w-full text-center text-[10px]">
              {(['ok', 'warning', 'danger'] as const).map((key) => {
                const val = currentPrediction ? Math.round(currentPrediction.probabilities[key] * 100) : 0;
                const colors = { ok: 'text-success', warning: 'text-warning', danger: 'text-destructive' };
                return (
                  <div key={key} className="p-2 rounded bg-secondary/20 border border-border">
                    <span className={`font-display font-bold block ${colors[key]}`}>{val}%</span>
                    <span className="text-muted-foreground capitalize">{key}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Info */}
          <div className="amg-panel space-y-3">
            <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> Model Info
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded bg-secondary/20 border border-border">
                <span className="text-muted-foreground font-body block">Algorithm</span>
                <span className="font-display text-foreground">Gradient Boosting</span>
              </div>
              <div className="p-2 rounded bg-secondary/20 border border-border">
                <span className="text-muted-foreground font-body block">Accuracy</span>
                <span className="font-display text-primary">96%</span>
              </div>
              <div className="p-2 rounded bg-secondary/20 border border-border">
                <span className="text-muted-foreground font-body block">Dataset</span>
                <span className="font-display text-foreground">20.6K rows</span>
              </div>
              <div className="p-2 rounded bg-secondary/20 border border-border">
                <span className="text-muted-foreground font-body block">Classes</span>
                <span className="font-display text-foreground">OK / Warn / Danger</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction History */}
      <div className="amg-panel">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Timer className="w-3 h-3" /> Prediction History ({history.length})
          </h3>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-[9px] font-display uppercase text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-muted-foreground font-body text-center py-6">No predictions yet. Adjust sensors and run a prediction.</p>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {history.map((entry, i) => {
              const r = riskConfig[entry.result.riskLevel];
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center justify-between p-3 rounded-md border hover-card-glow ${r.border} ${r.bg}`}
                >
                  <div className="flex items-center gap-3">
                    <r.icon className={`w-4 h-4 ${r.color}`} />
                    <div>
                      <span className="text-sm font-display text-foreground">{entry.result.faultCode}</span>
                      <span className="text-[10px] text-muted-foreground block font-body truncate max-w-[260px]">
                        {entry.result.faultDescription}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-sm font-display font-bold ${r.color}`}>{entry.result.riskLevel}</span>
                    <span className="text-[9px] text-muted-foreground block font-body">
                      {new Date(entry.result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
