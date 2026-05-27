import { useState, useCallback } from 'react';
import { Brain, Cpu, Send } from 'lucide-react';
import { useSensorData } from '@/hooks/useSensorData';
import { usePredictionHistory } from '@/hooks/usePredictionHistory';
import { fetchPrediction, type PredictionResult, type PredictionHistoryEntry } from '@/services/predictionApi';
import { useToast } from '@/hooks/use-toast';
import SensorDataCard from '@/components/ai/SensorDataCard';
import AIPredictionPanel from '@/components/ai/AIPredictionPanel';
import FaultRiskIndicator from '@/components/ai/FaultRiskIndicator';
import PredictionHistory from '@/components/ai/PredictionHistory';
import FeatureImportancePanel from '@/components/ai/FeatureImportancePanel';

/**
 * AI Intelligence page — composes separated components:
 *  1. SensorDataCard — editable sensor inputs
 *  2. AIPredictionPanel — prediction display
 *  3. FaultRiskIndicator — risk gauge + model info
 *  4. PredictionHistory — scrollable history list
 *
 * Data flow: edit sensors → click "Run Prediction" →
 * getSensorSnapshot (via hook) → fetchPrediction(/Car_Info) → display result
 */
export default function AIIntelligence() {
  const { sensorData, updateSensor } = useSensorData();
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

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
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
            {loading ? 'Analyzing...' : 'Send Data'}
          </button>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-success animate-neon-pulse" />
            <span className="text-xs font-display uppercase tracking-wider text-success">
              {loading ? 'Processing...' : 'Model Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Card 1 — Sensor Data (editable inputs) */}
      <SensorDataCard sensorData={sensorData} onUpdate={updateSensor} />

      {/* Cards 2 & 3 — Prediction + Risk Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AIPredictionPanel prediction={currentPrediction} />
        <FaultRiskIndicator prediction={currentPrediction} />
      </div>

      {/* Feature Importance Insight */}
      <FeatureImportancePanel prediction={currentPrediction} />

      {/* Prediction History */}
      <PredictionHistory history={history} onClear={clearHistory} />
    </div>
  );
}
