import { Slider } from '@/components/ui/slider';

interface SliderConfig {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  color: 'neon' | 'red' | 'warning' | 'success';
}

interface ControlSlidersProps {
  sliders: SliderConfig[];
  onChange: (id: string, value: number) => void;
}

const colorClasses = {
  neon: 'text-neon',
  red: 'text-destructive',
  warning: 'text-warning',
  success: 'text-success',
};

export default function ControlSliders({ sliders, onChange }: ControlSlidersProps) {
  return (
    <div className="amg-panel space-y-5">
      <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground">
        Control Parameters
      </h3>
      {sliders.map((s) => (
        <div key={s.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-body text-foreground">{s.label}</span>
            <span className={`text-sm font-display font-bold ${colorClasses[s.color]}`}>
              {Math.round(s.value)}{s.unit}
            </span>
          </div>
          <Slider
            value={[s.value]}
            min={s.min}
            max={s.max}
            step={1}
            onValueChange={(v) => onChange(s.id, v[0])}
            className="cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
}
