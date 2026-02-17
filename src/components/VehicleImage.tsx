import { useMemo } from 'react';
import amgImage from '@/assets/amg-gt-black.png';

interface VehicleImageProps {
  healthScore: number;
}

function getHaloColor(score: number): string {
  if (score > 70) return 'shadow-[0_0_60px_rgba(0,255,100,0.3)]';
  if (score > 40) return 'shadow-[0_0_60px_rgba(255,200,0,0.3)]';
  return 'shadow-[0_0_60px_rgba(255,50,50,0.4)]';
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
    <div className={`relative w-full h-full min-h-[350px] rounded-lg overflow-hidden flex items-center justify-center bg-secondary/30 border ${borderClass} ${haloClass} transition-all duration-700`}>
      <img
        src={amgImage}
        alt="Mercedes AMG GT Black Series"
        className="w-full h-full object-contain max-h-[400px] p-4"
      />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
