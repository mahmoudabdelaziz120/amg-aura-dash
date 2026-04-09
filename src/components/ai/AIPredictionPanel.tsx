import { Brain, Clock, Shield, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PredictionResult } from '@/services/predictionApi';

const riskConfig = {
  OK:      { color: 'text-success', bg: 'bg-success/10', border: 'border-success/30', icon: Shield, label: 'NOMINAL' },
  Warning: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', icon: AlertTriangle, label: 'WARNING' },
  Danger:  { color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', icon: AlertTriangle, label: 'CRITICAL' },
};

interface AIPredictionPanelProps {
  prediction: PredictionResult | null;
}

/** Determine winning class from probabilities */
function getDecision(probs: PredictionResult['probabilities']) {
  const entries = [
    { key: 'OK', value: probs.ok },
    { key: 'Warning', value: probs.warning },
    { key: 'Danger', value: probs.danger },
  ];
  return entries.reduce((a, b) => (b.value > a.value ? b : a)).key;
}

/**
 * Card 2 — AI Prediction
 * Pure display component: receives prediction data as props,
 * no internal data-fetching logic.
 */
export default function AIPredictionPanel({ prediction }: AIPredictionPanelProps) {
  const risk = prediction ? riskConfig[prediction.riskLevel] : null;

  return (
    <div className="amg-panel space-y-5">
      <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Brain className="w-4 h-4" /> AI Prediction Result
      </h3>

      <AnimatePresence mode="wait">
        {prediction && risk ? (
          <motion.div
            key={prediction.timestamp}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* Fault Code — monospace, prominent */}
            <div className={`p-5 rounded-md border ${risk.border} ${risk.bg}`}>
              <span className="text-xs font-display uppercase tracking-wider text-muted-foreground block mb-1">Predicted Fault Code</span>
              <span className={`text-3xl font-display font-bold ${risk.color}`} style={{ fontFamily: 'monospace' }}>
                {prediction.faultCode}
              </span>
            </div>

            {/* Fault Description */}
            <div className="p-4 rounded-md border border-border bg-secondary/10">
              <span className="text-xs font-display uppercase tracking-wider text-muted-foreground block mb-1">Fault Description</span>
              <p className="text-sm font-body text-foreground leading-relaxed">{prediction.faultDescription}</p>
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
              {new Date(prediction.timestamp).toLocaleString()}
            </div>

            {/* Model Decision — large visual cards */}
            <div className="space-y-3">
              <span className="text-sm font-display uppercase tracking-wider text-muted-foreground">Model Decision</span>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { key: 'ok' as const, label: 'OK', colorClass: 'text-success', borderClass: 'border-success/40', bgClass: 'bg-success/10' },
                  { key: 'warning' as const, label: 'Warning', colorClass: 'text-warning', borderClass: 'border-warning/40', bgClass: 'bg-warning/10' },
                  { key: 'danger' as const, label: 'Danger', colorClass: 'text-destructive', borderClass: 'border-destructive/40', bgClass: 'bg-destructive/10' },
                ]).map((cls) => {
                  const isDecision = getDecision(prediction.probabilities) === cls.label ||
                    (cls.label === 'OK' && getDecision(prediction.probabilities) === 'OK');
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
              Adjust sensor parameters and click <strong>"Run Prediction"</strong> to get a result.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
