import { Settings, ArrowUp, ArrowDown, ArrowRight, Radio } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import type { SensorData } from '@/hooks/useSensorData';
import { sensorFields } from '@/utils/sensorUtils';

interface SensorDataCardProps {
  sensorData: SensorData;
}

/**
 * Card 1 — Sensor Data (Live, Read-Only)
 * Auto-syncs from the shared dashboard sensor stream. Values update
 * automatically; no manual input required.
 */
export default function SensorDataCard({ sensorData }: SensorDataCardProps) {
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
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Settings className="w-4 h-4" /> Sensor Data (Live · 8 ML Inputs)
        </h3>
        <span className="flex items-center gap-1.5 text-xs font-display uppercase tracking-wider text-success">
          <Radio className="w-3 h-3 animate-pulse" /> Auto-Sync
        </span>
      </div>
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
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-display font-bold text-primary tabular-nums">
                {typeof sensorData[field.key] === 'number'
                  ? Number(sensorData[field.key]).toLocaleString(undefined, { maximumFractionDigits: 2 })
                  : '—'}
              </span>
              <span className="text-xs text-muted-foreground font-body whitespace-nowrap">{field.unit}</span>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
