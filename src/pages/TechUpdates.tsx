import { Cpu, Download, CheckCircle, AlertTriangle, Zap, Thermometer, Battery, Radio } from 'lucide-react';

const updates = [
  { id: 1, category: 'Software', title: 'ECU Firmware v4.2.1', desc: 'Improved throttle mapping and traction control algorithms.', date: '2024-12-18', status: 'installed', impact: 'Performance +3%' },
  { id: 2, category: 'Hardware', title: 'Upgraded Turbo Actuator', desc: 'Faster spool response, reduced lag by 15ms.', date: '2024-12-12', status: 'installed', impact: 'Response +8%' },
  { id: 3, category: 'Battery', title: 'Cell Module Replacement', desc: 'New generation cells with 12% higher energy density.', date: '2024-12-08', status: 'installed', impact: 'Range +12%' },
  { id: 4, category: 'Cooling', title: 'Radiator Core Upgrade', desc: 'Enhanced thermal dissipation under high load conditions.', date: '2024-12-01', status: 'installed', impact: 'Cooling +18%' },
  { id: 5, category: 'Sensors', title: 'IMU Calibration v2.0', desc: 'Recalibrated inertial measurement unit for improved stability data.', date: '2024-11-25', status: 'installed', impact: 'Accuracy +5%' },
  { id: 6, category: 'Software', title: 'Predictive AI Model v3.1', desc: 'Updated failure prediction model with new training data (50K+ samples).', date: '2024-11-20', status: 'pending', impact: 'Prediction +15%' },
];

const categoryIcons: Record<string, React.ElementType> = {
  Software: Cpu,
  Hardware: Zap,
  Battery: Battery,
  Cooling: Thermometer,
  Sensors: Radio,
};

export default function TechUpdates() {
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-3">
          <Download className="w-5 h-5 text-primary" />
          Tech Updates & Engineering
        </h1>
        <p className="text-xs text-muted-foreground font-body mt-1">Software • Hardware • Calibration • Upgrade History</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Updates', value: '24', sub: 'This season' },
          { label: 'Software', value: '12', sub: 'Firmware & AI' },
          { label: 'Hardware', value: '8', sub: 'Components' },
          { label: 'Pending', value: '1', sub: 'Awaiting install' },
        ].map(s => (
          <div key={s.label} className="amg-panel text-center">
            <span className="text-2xl font-display font-bold text-primary">{s.value}</span>
            <span className="text-[9px] font-display uppercase tracking-wider text-muted-foreground block">{s.label}</span>
            <span className="text-[10px] text-muted-foreground font-body">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="amg-panel">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4">Update Timeline</h3>
        <div className="space-y-4">
          {updates.map(u => {
            const Icon = categoryIcons[u.category] || Cpu;
            return (
              <div key={u.id} className="flex gap-4 p-4 rounded-lg bg-secondary/20 border border-border hover-card-glow">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-display font-bold text-foreground">{u.title}</h4>
                    <div className="flex items-center gap-2">
                      {u.status === 'installed' ? (
                        <span className="flex items-center gap-1 text-[10px] font-display uppercase text-success">
                          <CheckCircle className="w-3 h-3" /> Installed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-display uppercase text-warning">
                          <AlertTriangle className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-body mt-1">{u.desc}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] text-muted-foreground font-body">{u.date}</span>
                    <span className="text-[10px] font-display text-primary bg-primary/10 px-2 py-0.5 rounded">{u.impact}</span>
                    <span className="text-[10px] font-display text-muted-foreground uppercase tracking-wider bg-secondary/40 px-2 py-0.5 rounded">{u.category}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
