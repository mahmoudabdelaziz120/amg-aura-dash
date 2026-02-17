import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  message: string;
  recommendation?: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertConfig = {
  critical: { icon: AlertTriangle, className: 'border-destructive/40 bg-destructive/5' },
  warning: { icon: Zap, className: 'border-warning/40 bg-warning/5' },
  info: { icon: Info, className: 'border-primary/40 bg-primary/5' },
  success: { icon: CheckCircle, className: 'border-success/40 bg-success/5' },
};

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div className="amg-panel space-y-3">
      <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <AlertTriangle className="w-3 h-3" />
        AI Alerts & Recommendations
      </h3>
      <AnimatePresence mode="popLayout">
        {alerts.map((alert) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={alert.id}
              className={`border rounded-md p-3 ${config.className}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="flex items-start gap-2">
                <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-body text-foreground">{alert.message}</p>
                  {alert.recommendation && (
                    <p className="text-xs text-muted-foreground mt-1 font-body">{alert.recommendation}</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
