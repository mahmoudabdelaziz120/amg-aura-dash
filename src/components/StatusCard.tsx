import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status?: 'good' | 'warning' | 'critical';
  subtitle?: string;
}

const statusStyles = {
  good: 'border-success/30 glow-success',
  warning: 'border-warning/30 glow-warning',
  critical: 'border-destructive/30 glow-red',
};

export default function StatusCard({ title, value, unit, icon: Icon, status = 'good', subtitle }: StatusCardProps) {
  return (
    <motion.div
      className={`amg-panel ${statusStyles[status]} transition-all duration-500`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">{title}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-display font-bold text-foreground">{value}</span>
        {unit && <span className="text-xs text-muted-foreground font-body">{unit}</span>}
      </div>
      {subtitle && (
        <span className="text-xs text-muted-foreground font-body mt-1 block">{subtitle}</span>
      )}
    </motion.div>
  );
}
