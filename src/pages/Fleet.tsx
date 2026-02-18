import { Radio, MapPin, Wifi, AlertTriangle, CheckCircle, Car } from 'lucide-react';

const vehicles = [
  { id: 'W15-44', driver: 'L. Hamilton', status: 'active', health: 94, speed: 285, lap: 42, position: 1, alerts: 0 },
  { id: 'W15-63', driver: 'G. Russell', status: 'active', health: 87, speed: 278, lap: 42, position: 3, alerts: 1 },
  { id: 'W15-T1', driver: 'Test Driver 1', status: 'pit', health: 72, speed: 0, lap: 38, position: '-', alerts: 2 },
  { id: 'W15-T2', driver: 'Test Driver 2', status: 'inactive', health: 95, speed: 0, lap: 0, position: '-', alerts: 0 },
  { id: 'W15-SIM', driver: 'Simulator', status: 'active', health: 100, speed: 310, lap: 67, position: '-', alerts: 0 },
];

function getStatusBadge(status: string) {
  switch (status) {
    case 'active': return 'bg-success/10 text-success border-success/30';
    case 'pit': return 'bg-warning/10 text-warning border-warning/30';
    default: return 'bg-muted/10 text-muted-foreground border-border';
  }
}

export default function Fleet() {
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-3">
            <Radio className="w-5 h-5 text-primary" />
            Fleet Monitoring
          </h1>
          <p className="text-xs text-muted-foreground font-body mt-1">Cloud-Connected Vehicles • Real-Time Tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="w-3 h-3 text-success" />
          <span className="text-[9px] font-display uppercase tracking-wider text-success">All Systems Connected</span>
        </div>
      </div>

      {/* Fleet Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Vehicles', value: '5', icon: Car },
          { label: 'Active', value: '3', icon: CheckCircle },
          { label: 'In Pit', value: '1', icon: MapPin },
          { label: 'Alerts', value: '3', icon: AlertTriangle },
          { label: 'Avg Health', value: '89%', icon: Radio },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="amg-panel text-center">
              <Icon className="w-4 h-4 mx-auto mb-1 text-primary" />
              <span className="text-xl font-display font-bold text-foreground block">{item.value}</span>
              <span className="text-[9px] font-display text-muted-foreground uppercase tracking-wider">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Vehicle Table */}
      <div className="amg-panel overflow-x-auto">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">Vehicle Registry</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Vehicle ID', 'Driver', 'Status', 'Health', 'Speed', 'Lap', 'Position', 'Alerts'].map(h => (
                <th key={h} className="text-left py-2 px-3 text-[9px] font-display uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                <td className="py-3 px-3 font-display text-primary">{v.id}</td>
                <td className="py-3 px-3 font-body text-foreground">{v.driver}</td>
                <td className="py-3 px-3">
                  <span className={`text-[10px] font-display uppercase px-2 py-0.5 rounded border ${getStatusBadge(v.status)}`}>{v.status}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${v.health > 80 ? 'bg-success' : v.health > 50 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${v.health}%` }} />
                    </div>
                    <span className="text-xs font-display">{v.health}%</span>
                  </div>
                </td>
                <td className="py-3 px-3 font-display text-foreground">{v.speed} <span className="text-[9px] text-muted-foreground">km/h</span></td>
                <td className="py-3 px-3 font-display text-foreground">{v.lap}</td>
                <td className="py-3 px-3 font-display font-bold text-primary">{v.position}</td>
                <td className="py-3 px-3">
                  {v.alerts > 0 ? (
                    <span className="text-xs font-display text-warning flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {v.alerts}
                    </span>
                  ) : (
                    <CheckCircle className="w-3 h-3 text-success" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="text-center py-3 border-t border-border">
        <span className="text-[10px] font-display uppercase tracking-[0.3em] text-muted-foreground">
          Fleet Monitoring Module • Cloud Infrastructure
        </span>
      </footer>
    </div>
  );
}
