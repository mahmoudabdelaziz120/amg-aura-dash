import { motion } from 'framer-motion';

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color?: 'neon' | 'red' | 'warning' | 'success';
  unit?: string;
}

const barColors = {
  neon: 'bg-primary',
  red: 'bg-destructive',
  warning: 'bg-warning',
  success: 'bg-success',
};

const glowColors = {
  neon: 'shadow-[0_0_10px_hsl(205,100%,55%,0.4)]',
  red: 'shadow-[0_0_10px_hsl(0,85%,55%,0.4)]',
  warning: 'shadow-[0_0_10px_hsl(45,100%,55%,0.4)]',
  success: 'shadow-[0_0_10px_hsl(145,70%,45%,0.4)]',
};

export default function ProgressBar({ label, value, max, color = 'neon', unit = '%' }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-body text-muted-foreground">{label}</span>
        <span className="text-xs font-display text-foreground">{Math.round(value)}{unit}</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColors[color]} ${glowColors[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
