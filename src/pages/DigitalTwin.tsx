import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, Cpu, Layers, ChevronRight, AlertTriangle, Activity,
  Thermometer, Battery, Disc, Cog, Shield, Zap, Wind
} from 'lucide-react';

// --- Types ---
interface SystemComponent {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'nominal' | 'warning' | 'critical';
  health: number;
  temp: string;
  detail: string;
  faultCode?: string;
  prediction?: string;
}

interface DiagnosticAlert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  recommendation: string;
  timestamp: string;
}

// --- Helpers ---
function getStatusColor(status: string) {
  if (status === 'nominal') return 'text-success';
  if (status === 'warning') return 'text-warning';
  return 'text-destructive';
}

function getStatusGlow(status: string) {
  if (status === 'nominal') return 'hover-glow-success border-success/30';
  if (status === 'warning') return 'hover-glow-warning border-warning/30';
  return 'hover-glow-critical border-destructive/30';
}

function getHealthBarColor(health: number) {
  if (health > 80) return 'bg-success';
  if (health > 50) return 'bg-warning';
  return 'bg-destructive';
}

function getOverallGlow(health: number) {
  if (health > 80) return 'shadow-[0_0_60px_hsl(145_70%_45%/0.25)]';
  if (health > 50) return 'shadow-[0_0_60px_hsl(45_100%_55%/0.25)]';
  return 'shadow-[0_0_60px_hsl(0_85%_55%/0.3)]';
}

// --- Simulated sensor data with slight drift ---
function useSimulatedData(initial: SystemComponent[]): SystemComponent[] {
  const [data, setData] = useState(initial);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev =>
        prev.map(c => {
          const drift = (Math.random() - 0.5) * 2;
          const newHealth = Math.max(5, Math.min(100, c.health + drift));
          const status: SystemComponent['status'] =
            newHealth > 80 ? 'nominal' : newHealth > 50 ? 'warning' : 'critical';
          return { ...c, health: Math.round(newHealth), status };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return data;
}

// --- Initial data ---
const initialComponents: SystemComponent[] = [
  { id: 'engine', name: 'Power Unit', icon: Cog, status: 'nominal', health: 97, temp: '92°C', detail: 'V6 1.6L Turbo Hybrid — 1000+ BHP' },
  { id: 'battery', name: 'ERS Battery', icon: Battery, status: 'nominal', health: 94, temp: '38°C', detail: 'Energy Recovery System — 161 BHP boost', prediction: 'Stable for 2400 km' },
  { id: 'brakes', name: 'Brake System', icon: Disc, status: 'warning', health: 68, temp: '420°C', detail: 'Carbon-ceramic — High thermal load', faultCode: 'BRK-T03', prediction: 'Pad replacement in ~180 km' },
  { id: 'cooling', name: 'Cooling System', icon: Thermometer, status: 'warning', health: 75, temp: '78°C', detail: 'Radiator efficiency at 75%', faultCode: 'CLG-E01', prediction: 'Flush recommended in 500 km' },
  { id: 'gearbox', name: 'Transmission', icon: Cog, status: 'nominal', health: 88, temp: '62°C', detail: '8-speed seamless shift — 50ms shift time' },
  { id: 'suspension', name: 'Suspension', icon: Activity, status: 'nominal', health: 91, temp: '45°C', detail: 'Push-rod front, Pull-rod rear' },
  { id: 'aero', name: 'Aerodynamics', icon: Wind, status: 'nominal', health: 99, temp: 'N/A', detail: 'Active DRS — Low drag config' },
  { id: 'tires', name: 'Tire System', icon: Shield, status: 'nominal', health: 82, temp: '105°C', detail: 'Pirelli P Zero — Medium compound', prediction: 'Estimated life: 320 km' },
];

const diagnosticAlerts: DiagnosticAlert[] = [
  { id: '1', type: 'warning', message: 'Brake disc temperature exceeding optimal range', recommendation: 'Reduce braking intensity; inspect pad wear at next pit stop.', timestamp: '00:12:34' },
  { id: '2', type: 'warning', message: 'Cooling system efficiency declining', recommendation: 'Schedule coolant flush; check radiator blockages.', timestamp: '00:08:11' },
  { id: '3', type: 'info', message: 'Predictive model updated with latest telemetry', recommendation: 'No action required. AI confidence at 94.2%.', timestamp: '00:05:44' },
  { id: '4', type: 'critical', message: 'Vibration anomaly detected — front left bearing', recommendation: 'Inspect front-left wheel bearing; replace if above 0.8mm deviation.', timestamp: '00:02:15' },
];

const alertTypeConfig = {
  info: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30', icon: Zap },
  warning: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', icon: AlertTriangle },
  critical: { color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', icon: AlertTriangle },
};

// --- Sketchfab 3D Embed ---
function Vehicle3DEmbed({ overallHealth }: { overallHealth: number }) {
  const glowClass = getOverallGlow(overallHealth);

  return (
    <div className={`relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-border transition-shadow duration-1000 ${glowClass}`}>
      <iframe
        title="F1 Mercedes W11 2020"
        className="w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        src="https://sketchfab.com/models/aeb8ed9bd3e24741a3b06029e8454d54/embed?autostart=1"
        loading="lazy"
      />
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      {/* Corner scan lines */}
      <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-primary/40 pointer-events-none" />
      <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-primary/40 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-primary/40 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-primary/40 pointer-events-none" />
    </div>
  );
}

// --- Floating Status Card ---
function FloatingStatusCard({ comp, isSelected, onSelect }: {
  comp: SystemComponent;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = comp.icon;

  return (
    <motion.button
      onClick={onSelect}
      className={`w-full text-left p-3 rounded-lg border transition-all hover-card-glow ${getStatusGlow(comp.status)} ${
        isSelected ? 'bg-primary/10 border-primary/40' : 'bg-carbon border-border'
      }`}
      layout
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${getStatusColor(comp.status)}`} />
          <span className="text-sm font-body text-foreground">{comp.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-display font-bold ${getStatusColor(comp.status)}`}>
            {comp.health}%
          </span>
          <ChevronRight className={`w-3 h-3 text-muted-foreground transition-transform ${isSelected ? 'rotate-90' : ''}`} />
        </div>
      </div>
      <div className="mt-2 h-1 w-full bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getHealthBarColor(comp.health)}`}
          initial={{ width: 0 }}
          animate={{ width: `${comp.health}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground font-body">Temperature</span>
                <span className="font-display text-foreground">{comp.temp}</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-body">{comp.detail}</p>
              {comp.faultCode && (
                <div className="flex items-center gap-1 text-[10px] text-destructive font-display">
                  <AlertTriangle className="w-3 h-3" /> Fault: {comp.faultCode}
                </div>
              )}
              {comp.prediction && (
                <p className="text-[10px] text-primary font-body italic">⏱ {comp.prediction}</p>
              )}
              <span className={`text-[9px] font-display uppercase tracking-wider ${getStatusColor(comp.status)}`}>
                ● {comp.status}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// --- Main Component ---
export default function DigitalTwin() {
  const components = useSimulatedData(initialComponents);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const overallHealth = Math.round(
    components.reduce((sum, c) => sum + c.health, 0) / components.length
  );

  const toggleComponent = useCallback((id: string) => {
    setSelectedComponent(prev => (prev === id ? null : id));
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-3">
            <Car className="w-5 h-5 text-primary" />
            Digital Twin
          </h1>
          <p className="text-xs text-muted-foreground font-body mt-1">
            Interactive 3D Model • Real-Time Diagnostics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-[10px] font-display uppercase tracking-wider border ${
            overallHealth > 80
              ? 'bg-success/10 border-success/30 text-success'
              : overallHealth > 50
              ? 'bg-warning/10 border-warning/30 text-warning'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          }`}>
            Health: {overallHealth}%
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-primary animate-neon-pulse" />
            <span className="text-[9px] font-display uppercase tracking-wider text-primary">Live</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Model + Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* 3D Model — center */}
        <div className="lg:col-span-3 space-y-4">
          <Vehicle3DEmbed overallHealth={overallHealth} />

          {/* Diagnostics Panel */}
          <div className="amg-panel">
            <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-3">
              <AlertTriangle className="w-3 h-3" /> Diagnostics & AI Recommendations
            </h3>
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {diagnosticAlerts.map(alert => {
                const config = alertTypeConfig[alert.type];
                const AlertIcon = config.icon;
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex gap-3 p-3 rounded-lg border ${config.bg} ${config.border} hover-card-glow`}
                  >
                    <AlertIcon className={`w-4 h-4 mt-0.5 shrink-0 ${config.color}`} />
                    <div className="space-y-1 flex-1">
                      <p className="text-xs font-body text-foreground">{alert.message}</p>
                      <p className="text-[10px] text-muted-foreground font-body">💡 {alert.recommendation}</p>
                    </div>
                    <span className="text-[9px] font-display text-muted-foreground shrink-0">{alert.timestamp}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel — Component Status */}
        <div className="space-y-3">
          <div className="amg-panel p-3">
            <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-3">
              <Layers className="w-3 h-3" /> System Status
            </h3>
            <div className="space-y-2">
              {components.map(comp => (
                <FloatingStatusCard
                  key={comp.id}
                  comp={comp}
                  isSelected={selectedComponent === comp.id}
                  onSelect={() => toggleComponent(comp.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 border-t border-border">
        <span className="text-[10px] font-display uppercase tracking-[0.3em] text-muted-foreground">
          Digital Twin Module • Real-Time 3D Vehicle Simulation
        </span>
      </footer>
    </div>
  );
}
