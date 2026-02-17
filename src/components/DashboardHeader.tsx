import { motion } from 'framer-motion';
import { Activity, Gauge, Zap } from 'lucide-react';

interface DashboardHeaderProps {
  mode: 'normal' | 'racing';
  onToggleMode: () => void;
  healthScore: number;
}

export default function DashboardHeader({ mode, onToggleMode, healthScore }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-carbon/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Gauge className="w-6 h-6 text-neon" />
          <h1 className="font-display text-lg font-bold tracking-wider text-foreground">
            AMG <span className="text-neon">CONTROL</span>
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 ml-4">
          <Activity className="w-3 h-3 text-success animate-neon-pulse" />
          <span className="text-xs font-body text-muted-foreground">LIVE TELEMETRY</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary border border-border">
          <span className="text-[10px] font-display uppercase tracking-wider text-muted-foreground">Health</span>
          <span className={`text-sm font-display font-bold ${
            healthScore > 70 ? 'text-success' : healthScore > 40 ? 'text-warning' : 'text-destructive'
          }`}>
            {healthScore}%
          </span>
        </div>

        <motion.button
          onClick={onToggleMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-display text-xs uppercase tracking-wider transition-all duration-300 border ${
            mode === 'racing'
              ? 'bg-destructive/10 border-destructive/50 text-destructive glow-red'
              : 'bg-primary/10 border-primary/30 text-primary glow-neon'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="w-3.5 h-3.5" />
          {mode === 'racing' ? 'Racing' : 'Normal'}
        </motion.button>
      </div>
    </header>
  );
}
