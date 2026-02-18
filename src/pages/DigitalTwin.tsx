import { useState } from 'react';
import { Car, Eye, Cpu, Layers, ChevronRight } from 'lucide-react';
import f1TopFront from '@/assets/f1-top-front.png';
import f1TopRear from '@/assets/f1-top-rear.png';
import f1TopAction from '@/assets/f1-top-action.png';

const components = [
  { id: 'engine', name: 'Power Unit', status: 'nominal', health: 97, temp: '92°C', detail: 'V6 1.6L Turbo Hybrid — 1000+ BHP' },
  { id: 'battery', name: 'ERS Battery', status: 'nominal', health: 94, temp: '38°C', detail: 'Energy Recovery System — 161 BHP boost' },
  { id: 'brakes', name: 'Brake System', status: 'warning', health: 68, temp: '420°C', detail: 'Carbon-ceramic — High thermal load' },
  { id: 'tires', name: 'Tire System', status: 'nominal', health: 82, temp: '105°C', detail: 'Pirelli P Zero — Medium compound' },
  { id: 'suspension', name: 'Suspension', status: 'nominal', health: 91, temp: '45°C', detail: 'Push-rod front, Pull-rod rear' },
  { id: 'aero', name: 'Aerodynamics', status: 'nominal', health: 99, temp: 'N/A', detail: 'Active DRS — Low drag config' },
  { id: 'cooling', name: 'Cooling System', status: 'warning', health: 75, temp: '78°C', detail: 'Radiator efficiency at 75%' },
  { id: 'gearbox', name: 'Gearbox', status: 'nominal', health: 88, temp: '62°C', detail: '8-speed seamless shift — 50ms shift time' },
];

const views = [
  { id: 'front', label: 'Top Front', image: f1TopFront },
  { id: 'rear', label: 'Top Rear', image: f1TopRear },
  { id: 'action', label: 'Action', image: f1TopAction },
];

function getStatusColor(status: string) {
  if (status === 'nominal') return 'text-success';
  if (status === 'warning') return 'text-warning';
  return 'text-destructive';
}

function getHealthBar(health: number) {
  if (health > 80) return 'bg-success';
  if (health > 50) return 'bg-warning';
  return 'bg-destructive';
}

export default function DigitalTwin() {
  const [activeView, setActiveView] = useState('front');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const currentView = views.find(v => v.id === activeView)!;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-3">
            <Car className="w-5 h-5 text-primary" />
            Digital Twin
          </h1>
          <p className="text-xs text-muted-foreground font-body mt-1">Interactive Vehicle Model • Component-Level Insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3 text-primary" />
          <span className="text-[9px] font-display uppercase tracking-wider text-primary">AI Simulation Active</span>
        </div>
      </div>

      {/* Main: Vehicle view + Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Vehicle View */}
        <div className="lg:col-span-2 amg-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Eye className="w-3 h-3" /> Vehicle Inspection
            </h3>
            <div className="flex gap-1">
              {views.map(v => (
                <button
                  key={v.id}
                  onClick={() => setActiveView(v.id)}
                  className={`px-3 py-1 text-[10px] font-display uppercase tracking-wider rounded transition-all ${
                    activeView === v.id
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full min-h-[400px] flex items-center justify-center rounded-lg bg-gradient-to-b from-secondary/20 to-background border border-border overflow-hidden">
            <img
              src={currentView.image}
              alt={`F1 ${currentView.label} view`}
              className="w-full h-full object-contain max-h-[500px] p-4 drop-shadow-[0_0_40px_rgba(0,229,255,0.15)] transition-all duration-500"
            />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>

        {/* Component List */}
        <div className="amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
            <Layers className="w-3 h-3" /> Component Status
          </h3>
          <div className="space-y-2">
            {components.map(comp => (
              <button
                key={comp.id}
                onClick={() => setSelectedComponent(selectedComponent === comp.id ? null : comp.id)}
                className={`w-full text-left p-3 rounded-md border transition-all ${
                  selectedComponent === comp.id
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-secondary/20 border-border hover:border-primary/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-body text-foreground">{comp.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-display font-bold ${getStatusColor(comp.status)}`}>
                      {comp.health}%
                    </span>
                    <ChevronRight className={`w-3 h-3 text-muted-foreground transition-transform ${selectedComponent === comp.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>
                {/* Health bar */}
                <div className="mt-2 h-1 w-full bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getHealthBar(comp.health)} transition-all`} style={{ width: `${comp.health}%` }} />
                </div>
                {/* Expanded detail */}
                {selectedComponent === comp.id && (
                  <div className="mt-3 pt-3 border-t border-border space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground font-body">Temperature</span>
                      <span className="font-display text-foreground">{comp.temp}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-body">{comp.detail}</p>
                    <span className={`text-[9px] font-display uppercase tracking-wider ${getStatusColor(comp.status)}`}>
                      ● {comp.status}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 border-t border-border">
        <span className="text-[10px] font-display uppercase tracking-[0.3em] text-muted-foreground">
          Digital Twin Module • Real-Time Vehicle Simulation
        </span>
      </footer>
    </div>
  );
}
