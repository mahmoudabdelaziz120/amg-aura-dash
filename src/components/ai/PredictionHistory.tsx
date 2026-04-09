import { Timer, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import type { PredictionHistoryEntry } from '@/services/predictionApi';

const riskConfig = {
  OK:      { color: 'text-success', bg: 'bg-success/10', border: 'border-success/30', icon: Shield },
  Warning: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', icon: AlertTriangle },
  Danger:  { color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', icon: AlertTriangle },
};

interface PredictionHistoryProps {
  history: PredictionHistoryEntry[];
  onClear: () => void;
}

/**
 * Scrollable history list of past predictions.
 * Shows timestamp + fault code + risk badge per row.
 */
export default function PredictionHistory({ history, onClear }: PredictionHistoryProps) {
  return (
    <div className="amg-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Timer className="w-4 h-4" /> Prediction History ({history.length})
        </h3>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-display uppercase text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground font-body text-center py-6">
          No predictions yet. Adjust sensors and run a prediction.
        </p>
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
                    <span className="text-base font-display text-foreground" style={{ fontFamily: 'monospace' }}>
                      {entry.result.faultCode}
                    </span>
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
  );
}
