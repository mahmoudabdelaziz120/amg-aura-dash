import { useState, useCallback } from 'react';
import {
  Brain, Cpu, Activity, Target, Zap, TrendingUp, AlertTriangle,
  Send, Clock, Shield, Gauge, Thermometer, Battery, Timer, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CircularGauge from '@/components/CircularGauge';
import { useSensorData } from '@/hooks/useSensorData';
import { usePredictionHistory } from '@/hooks/usePredictionHistory';
import { fetchPrediction, type PredictionResult, type PredictionHistoryEntry } from '@/services/predictionApi';
import { useToast } from '@/hooks/use-toast';

const riskConfig = {
  OK:      { color: 'text-success', bg: 'bg-success/10', border: 'border-success/30', icon: Shield, label: 'NOMINAL' },
  Warning: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', icon: AlertTriangle, label: 'WARNING' },
  Danger:  { color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', icon: AlertTriangle, label: 'CRITICAL' },
};

export default function AIIntelligence() {
  const { sensorData } = useSensorData();
  const { history, addEntry, clearHistory } = usePredictionHistory();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);

  const handlePredict = useCallback(async () => {
    setLoading(true);
    try {
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

  const getDecision = (probs: PredictionResult['probabilities']) => {
    const entries = [
      { key: 'OK', value: probs.ok },
      { key: 'Warning', value: probs.warning },
      { key: 'Danger', value: probs.danger },
    ];
    return entries.reduce((a, b) => (b.value > a.value ? b : a)).key;
  };

  const risk = currentPrediction ? riskConfig[currentPrediction.riskLevel] : null;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary" />
            AI Predictive Intelligence
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Sensor Data → ML Model → Fault Prediction
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePredict}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-3 rounded-md font-display text-sm uppercase tracking-wider transition-all duration-300 border ${
              loading
                ? 'bg-muted/20 border-muted/30 text-muted-foreground cursor-wait'
                : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 glow-neon'
            }`}
          >
            <Send className="w-4 h-4" />
            {loading ? 'Analyzing...' : 'Send to Model & Predict'}
          </button>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-success animate-neon-pulse" />
            <span className="text-xs font-display uppercase tracking-wider text-success">
              {loading ? 'Processing...' : 'Model Ready'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT — AI Prediction Card */}
        <div className="amg-panel space-y-5">
          <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Brain className="w-4 h-4" /> AI Prediction Result
          </h3>

          <AnimatePresence mode="wait">
            {currentPrediction && risk ? (
              <motion.div
                key={currentPrediction.timestamp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Fault Code */}
                <div className={`p-5 rounded-md border ${risk.border} ${risk.bg}`}>
                  <span className="text-xs font-display uppercase tracking-wider text-muted-foreground block mb-1">Predicted Fault Code</span>
                  <span className={`text-3xl font-display font-bold ${risk.color}`}>
                    {currentPrediction.faultCode}
                  </span>
                </div>

                {/* Fault Description */}
                <div className="p-4 rounded-md border border-border bg-secondary/10">
                  <span className="text-xs font-display uppercase tracking-wider text-muted-foreground block mb-1">Fault Description</span>
                  <p className="text-sm font-body text-foreground">{currentPrediction.faultDescription}</p>
                </div>

                {/* Risk Level */}
                <div className={`p-5 rounded-md border ${risk.border} ${risk.bg} flex items-center justify-between`}>
                  <div>
                    <span className="text-xs font-display uppercase tracking-wider text-muted-foreground block mb-1">Risk Level</span>
                    <span className={`text-xl font-display font-bold ${risk.color}`}>{risk.label}</span>
                  </div>
                  <risk.icon className={`w-10 h-10 ${risk.color}`} />
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                  <Clock className="w-4 h-4" />
                  {new Date(currentPrediction.timestamp).toLocaleString()}
                </div>

                {/* Class Decision */}
                <div className="space-y-3">
                  <span className="text-sm font-display uppercase tracking-wider text-muted-foreground">Model Decision</span>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { key: 'ok' as const, label: 'OK', colorClass: 'text-success', borderClass: 'border-success/40', bgClass: 'bg-success/10' },
                      { key: 'warning' as const, label: 'Warning', colorClass: 'text-warning', borderClass: 'border-warning/40', bgClass: 'bg-warning/10' },
                      { key: 'danger' as const, label: 'Danger', colorClass: 'text-destructive', borderClass: 'border-destructive/40', bgClass: 'bg-destructive/10' },
                    ]).map((cls) => {
                      const isDecision = getDecision(currentPrediction.probabilities) === cls.label ||
                        (cls.label === 'OK' && getDecision(currentPrediction.probabilities) === 'OK');
                      return (
                        <div
                          key={cls.key}
                          className={`p-5 rounded-lg border-2 text-center transition-all ${
                            isDecision
                              ? `${cls.borderClass} ${cls.bgClass} scale-105 shadow-lg`
                              : 'border-border bg-secondary/10 opacity-50'
                          }`}
                        >
                          <span className={`font-display text-3xl font-bold block ${isDecision ? cls.colorClass : 'text-muted-foreground'}`}>
                            {isDecision ? '✓' : '—'}
                          </span>
                          <span className={`font-display text-lg font-semibold block mt-1 ${isDecision ? cls.colorClass : 'text-muted-foreground'}`}>
                            {cls.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <Brain className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground font-body">
                  Adjust sensor parameters on the main dashboard and click <strong>"Send to Model"</strong> to get a prediction.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT — Fault Risk Indicator + Model Info */}
        <div className="space-y-5">
          <div className="amg-panel flex flex-col items-center justify-center gap-4 py-8">
            <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground">Fault Risk Gauge</h3>
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
              size={200}
            />
          </div>

          {/* Model Info */}
          <div className="amg-panel space-y-3">
            <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Model Info
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded bg-secondary/20 border border-border">
                <span className="text-muted-foreground font-body block text-xs">Algorithm</span>
                <span className="font-display text-foreground">Gradient Boosting</span>
              </div>
              <div className="p-3 rounded bg-secondary/20 border border-border">
                <span className="text-muted-foreground font-body block text-xs">Accuracy</span>
                <span className="font-display text-primary">96%</span>
              </div>
              <div className="p-3 rounded bg-secondary/20 border border-border">
                <span className="text-muted-foreground font-body block text-xs">Dataset</span>
                <span className="font-display text-foreground">20.6K rows</span>
              </div>
              <div className="p-3 rounded bg-secondary/20 border border-border">
                <span className="text-muted-foreground font-body block text-xs">Classes</span>
                <span className="font-display text-foreground">OK / Warn / Danger</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction History */}
      <div className="amg-panel">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Timer className="w-4 h-4" /> Prediction History ({history.length})
          </h3>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-xs font-display uppercase text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground font-body text-center py-6">No predictions yet. Adjust sensors and run a prediction.</p>
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
                    <r.icon className={`w-5 h-5 ${r.color}`} />
                    <div>
                      <span className="text-base font-display text-foreground">{entry.result.faultCode}</span>
                      <span className="text-xs text-muted-foreground block font-body truncate max-w-[300px]">
                        {entry.result.faultDescription}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-base font-display font-bold ${r.color}`}>{entry.result.riskLevel}</span>
                    <span className="text-xs text-muted-foreground block font-body">
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
