import { Timer, Wrench, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

const pitHistory = [
  { lap: 15, duration: '2.3s', type: 'Tire Change', issue: 'None', status: 'success' },
  { lap: 32, duration: '3.8s', type: 'Front Wing', issue: 'Damage repair', status: 'warning' },
  { lap: 45, duration: '2.1s', type: 'Tire Change', issue: 'None', status: 'success' },
  { lap: 52, duration: '8.2s', type: 'Emergency', issue: 'Brake duct blockage', status: 'critical' },
  { lap: 60, duration: '2.4s', type: 'Tire Change', issue: 'None', status: 'success' },
];

const maintenanceLog = [
  { date: '2024-12-15', component: 'Power Unit', action: 'Full service', cost: '$12,400', downtime: '4h' },
  { date: '2024-12-10', component: 'Gearbox', action: 'Bearing replacement', cost: '$8,200', downtime: '6h' },
  { date: '2024-12-05', component: 'Cooling System', action: 'Radiator flush', cost: '$2,100', downtime: '2h' },
  { date: '2024-11-28', component: 'Brakes', action: 'Pad replacement', cost: '$5,600', downtime: '3h' },
  { date: '2024-11-20', component: 'ERS Battery', action: 'Cell balancing', cost: '$15,000', downtime: '8h' },
];

const statusColor = {
  success: 'text-success bg-success/10 border-success/30',
  warning: 'text-warning bg-warning/10 border-warning/30',
  critical: 'text-destructive bg-destructive/10 border-destructive/30',
};

export default function PitStop() {
  const avgPitTime = '2.9s';
  const totalStops = 47;
  const fastestStop = '1.9s';
  const totalDowntime = '23h';

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-3">
          <Timer className="w-5 h-5 text-primary" />
          Pit Stop & Maintenance Analytics
        </h1>
        <p className="text-xs text-muted-foreground font-body mt-1">Service History • Downtime Analysis • Cost Tracking</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Pit Time', value: avgPitTime, icon: Clock, color: 'text-primary' },
          { label: 'Total Stops', value: totalStops, icon: Timer, color: 'text-foreground' },
          { label: 'Fastest Stop', value: fastestStop, icon: TrendingUp, color: 'text-success' },
          { label: 'Total Downtime', value: totalDowntime, icon: Wrench, color: 'text-warning' },
        ].map(kpi => (
          <div key={kpi.label} className="amg-panel text-center">
            <kpi.icon className="w-4 h-4 mx-auto mb-2 text-muted-foreground" />
            <span className={`text-2xl font-display font-bold ${kpi.color}`}>{kpi.value}</span>
            <span className="text-[9px] font-display uppercase tracking-wider text-muted-foreground block mt-1">{kpi.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pit History */}
        <div className="amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
            <Timer className="w-3 h-3" /> Pit Stop History
          </h3>
          <div className="space-y-2">
            {pitHistory.map((pit, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-md border hover-card-glow ${statusColor[pit.status as keyof typeof statusColor]}`}>
                <div>
                  <span className="text-sm font-body text-foreground">Lap {pit.lap} — {pit.type}</span>
                  {pit.issue !== 'None' && <span className="text-[10px] text-muted-foreground block">{pit.issue}</span>}
                </div>
                <span className="text-lg font-display font-bold">{pit.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Log */}
        <div className="amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
            <Wrench className="w-3 h-3" /> Maintenance Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-[10px] font-display uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="text-left py-2 text-[10px] font-display uppercase tracking-wider text-muted-foreground">Component</th>
                  <th className="text-right py-2 text-[10px] font-display uppercase tracking-wider text-muted-foreground">Cost</th>
                  <th className="text-right py-2 text-[10px] font-display uppercase tracking-wider text-muted-foreground">Downtime</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceLog.map((log, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="py-2 text-muted-foreground font-body">{log.date}</td>
                    <td className="py-2 font-body text-foreground">{log.component}</td>
                    <td className="py-2 text-right text-warning font-display">{log.cost}</td>
                    <td className="py-2 text-right text-muted-foreground font-display">{log.downtime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Failure causes */}
      <div className="amg-panel">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
          <AlertTriangle className="w-3 h-3" /> Top Failure Causes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { cause: 'Brake Overheating', pct: 32, color: 'bg-destructive' },
            { cause: 'Tire Degradation', pct: 28, color: 'bg-warning' },
            { cause: 'Cooling Failure', pct: 22, color: 'bg-primary' },
            { cause: 'ERS Malfunction', pct: 18, color: 'bg-success' },
          ].map(c => (
            <div key={c.cause} className="p-3 rounded-md bg-secondary/20 border border-border hover-card-glow">
              <span className="text-xs font-body text-foreground">{c.cause}</span>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground font-display mt-1 block">{c.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
