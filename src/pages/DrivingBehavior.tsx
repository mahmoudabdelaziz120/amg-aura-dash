import { Zap, AlertTriangle, TrendingDown, Gauge, Shield } from 'lucide-react';
import CircularGauge from '@/components/CircularGauge';

const behaviorMetrics = [
  { label: 'Harsh Braking', value: 12, max: 50, unit: 'events', status: 'warning' as const, desc: 'Last 100 km' },
  { label: 'Aggressive Accel.', value: 8, max: 50, unit: 'events', status: 'good' as const, desc: 'Last 100 km' },
  { label: 'Sharp Cornering', value: 15, max: 50, unit: 'events', status: 'warning' as const, desc: 'Last 100 km' },
  { label: 'Over-speed', value: 3, max: 50, unit: 'events', status: 'good' as const, desc: 'Last 100 km' },
];

const impactData = [
  { behavior: 'Harsh Braking', brakeWear: '+18%', energyLoss: '+12%', riskFactor: 'Medium' },
  { behavior: 'Aggressive Acceleration', brakeWear: '+5%', energyLoss: '+25%', riskFactor: 'Low' },
  { behavior: 'Sharp Cornering', brakeWear: '+10%', energyLoss: '+8%', riskFactor: 'High' },
  { behavior: 'High Speed Sustained', brakeWear: '+3%', energyLoss: '+35%', riskFactor: 'Medium' },
];

function getStatusColor(status: string) {
  if (status === 'good') return 'text-success';
  if (status === 'warning') return 'text-warning';
  return 'text-destructive';
}

export default function DrivingBehavior() {
  const drivingScore = 76;
  const safetyIndex = 82;
  const efficiency = 68;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary" />
            Driving Behavior Analysis
          </h1>
          <p className="text-xs text-muted-foreground font-body mt-1">Pattern Recognition • Safety Scoring • Efficiency Metrics</p>
        </div>
      </div>

      {/* Score gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="amg-panel flex flex-col items-center gap-3">
          <h3 className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">Driving Score</h3>
          <CircularGauge value={drivingScore} max={100} label="Overall" unit="pts" color={drivingScore > 70 ? 'success' : 'warning'} size={140} />
        </div>
        <div className="amg-panel flex flex-col items-center gap-3">
          <h3 className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">Safety Index</h3>
          <CircularGauge value={safetyIndex} max={100} label="Safety" unit="pts" color="neon" size={140} />
        </div>
        <div className="amg-panel flex flex-col items-center gap-3">
          <h3 className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">Efficiency</h3>
          <CircularGauge value={efficiency} max={100} label="Energy" unit="%" color={efficiency > 70 ? 'success' : 'warning'} size={140} />
        </div>
      </div>

      {/* Behavior Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
            <AlertTriangle className="w-3 h-3" /> Behavior Events
          </h3>
          <div className="space-y-3">
            {behaviorMetrics.map(m => (
              <div key={m.label} className="flex items-center justify-between p-3 rounded-md bg-secondary/20 border border-border hover-card-glow">
                <div>
                  <span className="text-sm font-body text-foreground">{m.label}</span>
                  <span className="text-[10px] text-muted-foreground block">{m.desc}</span>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-display font-bold ${getStatusColor(m.status)}`}>{m.value}</span>
                  <span className="text-[10px] text-muted-foreground block">{m.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
            <TrendingDown className="w-3 h-3" /> Impact on Vehicle
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-[10px] font-display uppercase tracking-wider text-muted-foreground">Behavior</th>
                  <th className="text-center py-2 text-[10px] font-display uppercase tracking-wider text-muted-foreground">Brake Wear</th>
                  <th className="text-center py-2 text-[10px] font-display uppercase tracking-wider text-muted-foreground">Energy Loss</th>
                  <th className="text-center py-2 text-[10px] font-display uppercase tracking-wider text-muted-foreground">Risk</th>
                </tr>
              </thead>
              <tbody>
                {impactData.map(d => (
                  <tr key={d.behavior} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="py-2 font-body text-foreground">{d.behavior}</td>
                    <td className="py-2 text-center text-warning font-display">{d.brakeWear}</td>
                    <td className="py-2 text-center text-destructive font-display">{d.energyLoss}</td>
                    <td className="py-2 text-center">
                      <span className={`text-[10px] font-display uppercase px-2 py-0.5 rounded ${
                        d.riskFactor === 'High' ? 'bg-destructive/10 text-destructive' :
                        d.riskFactor === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                      }`}>{d.riskFactor}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="amg-panel">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
          <Shield className="w-3 h-3" /> AI Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { text: 'Reduce braking intensity by 15% to extend pad life by ~2000 km.', type: 'warning' },
            { text: 'Cornering G-forces exceed safe threshold in 3 recent events.', type: 'critical' },
            { text: 'Energy recovery improved by 8% after driving style adjustment.', type: 'success' },
          ].map((rec, i) => (
            <div key={i} className={`p-3 rounded-md border hover-card-glow ${
              rec.type === 'critical' ? 'border-destructive/30 bg-destructive/5' :
              rec.type === 'warning' ? 'border-warning/30 bg-warning/5' : 'border-success/30 bg-success/5'
            }`}>
              <p className="text-xs font-body text-foreground">{rec.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
