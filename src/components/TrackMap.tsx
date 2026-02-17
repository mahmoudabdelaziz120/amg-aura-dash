import { MapPin } from 'lucide-react';

interface TrackMapProps {
  speed: number;
  aggressiveness: number;
}

export default function TrackMap({ speed, aggressiveness }: TrackMapProps) {
  const sector1 = (speed * 0.36 + 45).toFixed(1);
  const sector2 = (speed * 0.28 + 38).toFixed(1);
  const sector3 = (speed * 0.31 + 42).toFixed(1);

  return (
    <div className="amg-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <MapPin className="w-3 h-3" /> 3D Track Map — Circuit Overview
        </h3>
        <span className="text-[9px] font-display uppercase tracking-wider text-destructive animate-neon-pulse">● LIVE</span>
      </div>

      <div className="relative w-full h-[200px] flex items-center justify-center overflow-hidden rounded-lg bg-secondary/30 border border-border">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(hsl(220, 10%, 30%) 1px, transparent 1px), linear-gradient(90deg, hsl(220, 10%, 30%) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* Track SVG */}
        <svg viewBox="0 0 600 180" className="w-full max-w-[550px] relative z-10">
          {/* Track outline */}
          <path
            d="M 80 140 L 80 60 Q 80 30, 110 30 L 250 30 Q 280 30, 300 50 L 340 90 Q 360 110, 390 110 L 490 110 Q 520 110, 520 90 L 520 60 Q 520 30, 490 30 L 460 30 Q 440 30, 440 50 L 440 80 Q 440 110, 410 140 L 110 140 Q 80 140, 80 140 Z"
            fill="none"
            stroke="hsl(0, 85%, 55%)"
            strokeWidth="3"
            opacity="0.8"
          />
          {/* Glow track */}
          <path
            d="M 80 140 L 80 60 Q 80 30, 110 30 L 250 30 Q 280 30, 300 50 L 340 90 Q 360 110, 390 110 L 490 110 Q 520 110, 520 90 L 520 60 Q 520 30, 490 30 L 460 30 Q 440 30, 440 50 L 440 80 Q 440 110, 410 140 L 110 140 Q 80 140, 80 140 Z"
            fill="none"
            stroke="hsl(0, 85%, 55%)"
            strokeWidth="8"
            opacity="0.15"
          />

          {/* Sector markers */}
          <circle cx="80" cy="100" r="4" fill="hsl(205, 100%, 55%)" />
          <text x="55" y="95" fill="hsl(220, 10%, 50%)" fontSize="7" fontFamily="Orbitron">S1</text>

          <circle cx="300" cy="50" r="4" fill="hsl(45, 100%, 55%)" />
          <text x="305" y="45" fill="hsl(220, 10%, 50%)" fontSize="7" fontFamily="Orbitron">S2</text>

          <circle cx="520" cy="60" r="4" fill="hsl(145, 70%, 45%)" />
          <text x="525" y="55" fill="hsl(220, 10%, 50%)" fontSize="7" fontFamily="Orbitron">S3</text>

          {/* Start/Finish */}
          <rect x="76" y="135" width="8" height="12" fill="hsl(0, 0%, 100%)" opacity="0.5" />
          <text x="65" y="160" fill="hsl(220, 10%, 60%)" fontSize="6" fontFamily="Orbitron">START</text>

          {/* Car position dot */}
          <circle cx={80 + (aggressiveness / 100) * 440} cy={100 - Math.sin(aggressiveness / 100 * Math.PI) * 60} r="6" fill="hsl(205, 100%, 55%)">
            <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Sector Times */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="text-center p-3 rounded bg-primary/5 border border-primary/20">
          <span className="text-[9px] font-display uppercase tracking-widest text-muted-foreground block mb-1">Sector 1</span>
          <span className="text-lg font-display font-bold text-primary">{sector1}s</span>
        </div>
        <div className="text-center p-3 rounded bg-warning/5 border border-warning/20">
          <span className="text-[9px] font-display uppercase tracking-widest text-muted-foreground block mb-1">Sector 2</span>
          <span className="text-lg font-display font-bold text-warning">{sector2}s</span>
        </div>
        <div className="text-center p-3 rounded bg-success/5 border border-success/20">
          <span className="text-[9px] font-display uppercase tracking-widest text-muted-foreground block mb-1">Sector 3</span>
          <span className="text-lg font-display font-bold text-success">{sector3}s</span>
        </div>
      </div>
    </div>
  );
}
