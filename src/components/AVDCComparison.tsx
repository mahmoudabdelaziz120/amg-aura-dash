import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface AVDCComparisonProps {
  speed: number;
  aggressiveness: number;
  engineLoad: number;
  temperature: number;
}

function generateData(base: number, variance: number, points = 20) {
  return Array.from({ length: points }, (_, i) => ({
    v1: base + Math.sin(i * 0.5) * variance + Math.random() * variance * 0.5,
    v2: base * 0.8 + Math.cos(i * 0.4) * variance * 0.7 + Math.random() * variance * 0.3,
  }));
}

export default function AVDCComparison({ speed, aggressiveness, engineLoad, temperature }: AVDCComparisonProps) {
  const [avdcOn, setAvdcOn] = useState(true);

  const metrics = [
    { label: 'SPEED', value: `${(speed * 0.33).toFixed(1)} KM/H`, data: generateData(speed, 15) },
    { label: 'VERTICAL ACCEL.', value: `${(engineLoad * 0.35).toFixed(1)} M/S²`, data: generateData(engineLoad, 10) },
    { label: 'ANGLE', value: `${(aggressiveness * 0.4).toFixed(0)}°`, data: generateData(aggressiveness, 8) },
    { label: 'LATERAL ACCEL.', value: `${(temperature * 0.32).toFixed(1)} M/S²`, data: generateData(temperature, 12) },
  ];

  return (
    <div className="amg-panel h-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground">
          AVDC Parameter Comparison
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-display uppercase tracking-wider ${avdcOn ? 'text-destructive' : 'text-muted-foreground'}`}>
            AVDC {avdcOn ? 'ON' : 'OFF'}
          </span>
          <Switch checked={avdcOn} onCheckedChange={setAvdcOn} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {metrics.map((m) => (
          <div key={m.label} className="bg-secondary/50 border border-border rounded-md p-2 flex flex-col">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[9px] font-display uppercase tracking-wider text-muted-foreground">{m.label}</span>
              <span className="text-xs font-display font-bold text-primary">{m.value}</span>
            </div>
            <div className="flex-1 min-h-[50px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={m.data}>
                  <YAxis domain={['auto', 'auto']} hide />
                  <Line type="monotone" dataKey="v1" stroke="hsl(0, 85%, 55%)" strokeWidth={1.5} dot={false} />
                  {avdcOn && (
                    <Line type="monotone" dataKey="v2" stroke="hsl(220, 10%, 50%)" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
