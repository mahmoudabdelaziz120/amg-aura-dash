import { BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PredictionResult } from '@/services/predictionApi';

interface FeatureImportancePanelProps {
  prediction: PredictionResult | null;
}

/**
 * Top 5 most influential features for the current prediction.
 */
export default function FeatureImportancePanel({ prediction }: FeatureImportancePanelProps) {
  const features = prediction?.topFeatures ?? [];

  return (
    <div className="amg-panel space-y-4">
      <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <BarChart3 className="w-4 h-4" /> Top Influential Features
      </h3>
      {features.length === 0 ? (
        <p className="text-sm text-muted-foreground font-body py-4 text-center">
          Run a prediction to see which sensors influenced the decision.
        </p>
      ) : (
        <div className="space-y-3">
          {features.map((f, i) => {
            const pct = Math.round(f.importance * 100);
            return (
              <div key={f.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-display">
                  <span className="text-foreground">
                    <span className="text-muted-foreground mr-2">#{i + 1}</span>
                    {f.name}
                  </span>
                  <span className="text-primary tabular-nums">{pct}%</span>
                </div>
                <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="h-full bg-gradient-to-r from-primary/70 to-primary"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}