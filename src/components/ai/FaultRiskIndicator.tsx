import { TrendingUp } from 'lucide-react';
import CircularGauge from '@/components/CircularGauge';
import type { PredictionResult } from '@/services/predictionApi';

interface FaultRiskIndicatorProps {
  prediction: PredictionResult | null;
}

/**
 * Card 3 — Fault Risk Indicator
 * Large circular gauge showing danger probability + model metadata.
 */
export default function FaultRiskIndicator({ prediction }: FaultRiskIndicatorProps) {
  const dangerPct = prediction ? Math.round(prediction.probabilities.danger * 100) : 0;
  const gaugeColor = prediction
    ? prediction.probabilities.danger > 0.5 ? 'red' : prediction.probabilities.danger > 0.2 ? 'warning' : 'success'
    : 'neon';
  const tier = prediction?.riskTier ?? 'Low';
  const tierColor = tier === 'High' ? 'text-destructive' : tier === 'Medium' ? 'text-warning' : 'text-success';
  const tierBorder = tier === 'High' ? 'border-destructive/40 bg-destructive/10' : tier === 'Medium' ? 'border-warning/40 bg-warning/10' : 'border-success/40 bg-success/10';

  return (
    <div className="space-y-5">
      <div className="amg-panel flex flex-col items-center justify-center gap-4 py-8">
        <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground">Fault Risk Gauge</h3>
        <CircularGauge
          value={dangerPct}
          max={100}
          label="Danger"
          unit="%"
          color={gaugeColor}
          size={200}
        />
        <div className={`mt-2 px-5 py-2 rounded-md border-2 ${tierBorder}`}>
          <span className="text-xs font-display uppercase tracking-wider text-muted-foreground block">Risk Level</span>
          <span className={`font-display text-2xl font-bold ${tierColor}`}>{tier.toUpperCase()}</span>
        </div>
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
  );
}
