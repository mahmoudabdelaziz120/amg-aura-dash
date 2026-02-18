import { useMemo } from 'react';
import f1Side from '@/assets/f1-side.png';

interface VehicleImageProps {
  healthScore: number;
}

function getHaloColor(score: number): string {
  if (score > 70) return 'shadow-[0_0_80px_rgba(0,255,100,0.25),0_0_120px_rgba(0,229,255,0.15)]';
  if (score > 40) return 'shadow-[0_0_80px_rgba(255,200,0,0.3),0_0_120px_rgba(255,150,0,0.15)]';
  return 'shadow-[0_0_80px_rgba(255,50,50,0.4),0_0_120px_rgba(255,0,60,0.2)]';
}

function getGlowBorder(score: number): string {
  if (score > 70) return 'border-success/30';
  if (score > 40) return 'border-warning/30';
  return 'border-destructive/40';
}

export default function VehicleImage({ healthScore }: VehicleImageProps) {
  const haloClass = useMemo(() => getHaloColor(healthScore), [healthScore]);
  const borderClass = useMemo(() => getGlowBorder(healthScore), [healthScore]);

  return (
    <div className={`relative w-full h-full min-h-[300px] rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-b from-secondary/20 to-background border ${borderClass} ${haloClass} transition-all duration-700`}>
      <img
        src={f1Side}
        alt="Mercedes-AMG Petronas F1 W15"
        className="w-full h-full object-contain max-h-[350px] p-4 drop-shadow-[0_0_30px_rgba(0,229,255,0.2)]"
      />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
