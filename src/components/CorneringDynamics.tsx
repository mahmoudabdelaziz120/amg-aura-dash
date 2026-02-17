import { Compass } from 'lucide-react';

interface CorneringDynamicsProps {
  speed: number;
  aggressiveness: number;
}

export default function CorneringDynamics({ speed, aggressiveness }: CorneringDynamicsProps) {
  const entrySpeed = (speed * 0.85).toFixed(0);
  const exitSpeed = (speed * 0.92).toFixed(0);
  const lateralG = (aggressiveness * 0.025 + 0.5).toFixed(2);

  return (
    <div className="amg-panel h-full flex flex-col gap-3">
      <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Compass className="w-3 h-3" /> Cornering Dynamics
      </h3>
      <p className="text-[9px] font-body text-muted-foreground uppercase tracking-wider">
        Monitoring Steering Wheel Angle & Lateral Acceleration
      </p>

      {/* Track Corner SVG */}
      <div className="flex-1 flex items-center justify-center min-h-[140px]">
        <svg viewBox="0 0 300 180" className="w-full max-w-[280px]">
          {/* Road surface */}
          <path
            d="M 20 160 Q 20 40, 150 40 Q 280 40, 280 160"
            fill="none"
            stroke="hsl(220, 15%, 15%)"
            strokeWidth="40"
            strokeLinecap="round"
          />
          {/* Racing line */}
          <path
            d="M 30 155 Q 40 60, 150 50 Q 260 60, 270 155"
            fill="none"
            stroke="hsl(0, 85%, 55%)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 4"
            className="animate-neon-pulse"
          />
          {/* Ideal line */}
          <path
            d="M 35 155 Q 50 70, 150 55 Q 250 70, 265 155"
            fill="none"
            stroke="hsl(205, 100%, 55%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Labels */}
          <text x="25" y="175" fill="hsl(220, 10%, 50%)" fontSize="8" fontFamily="Orbitron">CORNER ENTRY</text>
          <text x="120" y="30" fill="hsl(0, 85%, 55%)" fontSize="8" fontFamily="Orbitron">TURNING</text>
          <text x="215" y="175" fill="hsl(220, 10%, 50%)" fontSize="8" fontFamily="Orbitron">CORNER EXIT</text>
          {/* Car dot */}
          <circle cx={150} cy={48} r="5" fill="hsl(205, 100%, 55%)" opacity="0.9">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 rounded bg-secondary border border-border">
          <span className="text-sm font-display font-bold text-foreground">{entrySpeed}</span>
          <span className="text-[9px] font-body text-muted-foreground block">Entry km/h</span>
        </div>
        <div className="text-center p-2 rounded bg-destructive/5 border border-destructive/30">
          <span className="text-sm font-display font-bold text-destructive">{lateralG}G</span>
          <span className="text-[9px] font-body text-muted-foreground block">Lateral G</span>
        </div>
        <div className="text-center p-2 rounded bg-secondary border border-border">
          <span className="text-sm font-display font-bold text-foreground">{exitSpeed}</span>
          <span className="text-[9px] font-body text-muted-foreground block">Exit km/h</span>
        </div>
      </div>
    </div>
  );
}
