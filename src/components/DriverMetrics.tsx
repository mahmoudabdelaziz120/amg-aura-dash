import { User, Clock, Trophy } from 'lucide-react';

interface DriverMetricsProps {
  speed: number;
  healthScore: number;
}

export default function DriverMetrics({ speed, healthScore }: DriverMetricsProps) {
  const lapTime1 = (200 - speed * 0.3 + 20).toFixed(2);
  const lapTime2 = (173 - speed * 0.25 + 10).toFixed(2);
  const bestLap = Math.min(Number(lapTime1), Number(lapTime2)).toFixed(2);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${secs.padStart(5, '0')}`;
  };

  return (
    <div className="amg-panel h-full flex flex-col gap-4">
      <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Trophy className="w-3 h-3" /> Driver & Lap Metrics
      </h3>

      {/* Player Score */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Player Score</span>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-foreground">{healthScore}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
      </div>

      {/* Driver Info */}
      <div className="space-y-1 border-t border-border pt-3">
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground font-body">NAME</span>
          <span className="text-xs font-display font-bold text-foreground">T.SEVEN</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground font-body">TEAM</span>
          <span className="text-xs font-display text-primary">AMG PETRONAS</span>
        </div>
      </div>

      {/* Lap Times */}
      <div className="space-y-2 border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Lap Times</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center p-2 rounded bg-secondary border border-border">
            <span className="text-xs text-muted-foreground font-body">1st LAP</span>
            <span className="font-display text-sm font-bold text-foreground">{formatTime(Number(lapTime1))}</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-secondary border border-border">
            <span className="text-xs text-muted-foreground font-body">2nd LAP</span>
            <span className="font-display text-sm font-bold text-foreground">{formatTime(Number(lapTime2))}</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-destructive/5 border border-destructive/30">
            <span className="text-xs text-destructive font-body">BEST LAP</span>
            <span className="font-display text-sm font-bold text-destructive">{formatTime(Number(bestLap))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
