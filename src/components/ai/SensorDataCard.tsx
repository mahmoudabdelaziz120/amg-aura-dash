import { Settings, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import type { SensorData } from '@/hooks/useSensorData';
import { sensorFields } from '@/utils/sensorUtils';

interface SensorDataCardProps {
  sensorData: SensorData;
  onUpdate: (key: string, value: number) => void;
}

/**
 * Card 1 — Sensor Data
 * Editable grid of all sensor values. Pure display + input component,
 * delegates state changes to parent via onUpdate callback.
 */
export default function SensorDataCard({ sensorData, onUpdate }: SensorDataCardProps) {
  const prevRef = useRef<SensorData>(sensorData);
  const [trends, setTrends] = useState<Record<string, 'up' | 'down' | 'flat'>>({});

  useEffect(() => {
    const next: Record<string, 'up' | 'down' | 'flat'> = {};
    sensorFields.forEach((f) => {
      const prev = (prevRef.current as any)[f.key] ?? 0;
      const curr = (sensorData as any)[f.key] ?? 0;
      next[f.key] = curr > prev ? 'up' : curr < prev ? 'down' : 'flat';
    });
    setTrends(next);
    prevRef.current = sensorData;
  }, [sensorData]);

  return (
    <div className="amg-panel space-y-4">
      <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Settings className="w-4 h-4" /> Sensor Data (8 ML Inputs)
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sensorFields.map((field) => {
          const trend = trends[field.key] ?? 'flat';
          const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : ArrowRight;
          const trendColor = trend === 'up' ? 'text-warning' : trend === 'down' ? 'text-success' : 'text-muted-foreground';
          return (
          <div key={field.key} className="p-3 rounded-md border border-border bg-secondary/10 space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-display uppercase tracking-wider text-muted-foreground block">
                {field.label}
              </label>
              <TrendIcon className={`w-3 h-3 ${trendColor}`} />
            </div>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={sensorData[field.key]}
                min={field.min}
                max={field.max}
                step={field.step}
                onChange={(e) => onUpdate(field.key, parseFloat(e.target.value) || 0)}
                className="h-8 text-base font-display bg-background/50 border-border/50 text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-xs text-muted-foreground font-body whitespace-nowrap">{field.unit}</span>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
