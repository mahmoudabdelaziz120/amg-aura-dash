import { motion } from 'framer-motion';

interface CircularGaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  size?: number;
  color?: 'neon' | 'red' | 'warning' | 'success';
}

const colorMap = {
  neon: { stroke: 'hsl(205, 100%, 55%)', shadow: 'hsl(205, 100%, 55%)' },
  red: { stroke: 'hsl(0, 85%, 55%)', shadow: 'hsl(0, 85%, 55%)' },
  warning: { stroke: 'hsl(45, 100%, 55%)', shadow: 'hsl(45, 100%, 55%)' },
  success: { stroke: 'hsl(145, 70%, 45%)', shadow: 'hsl(145, 70%, 45%)' },
};

export default function CircularGauge({ value, max, label, unit, size = 140, color = 'neon' }: CircularGaugeProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius * 0.75; // 270 degrees
  const progress = (value / max) * circumference;
  const colors = colorMap[color];

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="amg-gauge-ring">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(220, 15%, 12%)"
            strokeWidth="6"
            strokeDasharray={`${circumference} ${2 * Math.PI * radius - circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(135 ${size / 2} ${size / 2})`}
          />
          {/* Value arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="6"
            strokeDasharray={`${circumference} ${2 * Math.PI * radius}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
            transform={`rotate(135 ${size / 2} ${size / 2})`}
            style={{ filter: `drop-shadow(0 0 6px ${colors.shadow})` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-display text-2xl font-bold text-foreground"
            key={value}
            initial={{ scale: 1.2, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {Math.round(value)}
          </motion.span>
          <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">{unit}</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground font-display uppercase tracking-widest">{label}</span>
    </div>
  );
}
