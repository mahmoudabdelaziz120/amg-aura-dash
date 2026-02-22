import { Cpu, Brain, Activity, Target, Zap, TrendingUp, Database, AlertTriangle } from 'lucide-react';
import CircularGauge from '@/components/CircularGauge';

const models = [
  { name: 'Failure Prediction', accuracy: 94.2, status: 'active', dataset: '128K', lastTrained: '2h ago', predictions: 1247 },
  { name: 'Anomaly Detection', accuracy: 91.8, status: 'active', dataset: '96K', lastTrained: '4h ago', predictions: 892 },
  { name: 'Battery Degradation', accuracy: 96.1, status: 'active', dataset: '64K', lastTrained: '1h ago', predictions: 2103 },
  { name: 'Driving Behavior', accuracy: 89.5, status: 'training', dataset: '52K', lastTrained: 'Training...', predictions: 634 },
];

const livePredictions = [
  { component: 'Front Left Brake Pad', prediction: 'Replace in 450 km', confidence: 92, urgency: 'medium' },
  { component: 'Coolant Pump', prediction: 'Replace in 150 km', confidence: 87, urgency: 'high' },
  { component: 'ERS Battery Cell #4', prediction: 'Degradation in 2000 km', confidence: 78, urgency: 'low' },
  { component: 'Rear Suspension Bearing', prediction: 'Inspect in 800 km', confidence: 85, urgency: 'medium' },
  { component: 'Turbo Wastegate', prediction: 'Nominal — No action', confidence: 95, urgency: 'none' },
];

export default function AIIntelligence() {
  const overallHealth = 93;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            AI Intelligence Center
          </h1>
          <p className="text-xs text-muted-foreground font-body mt-1">Model Health • Live Predictions • Anomaly Detection</p>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3 text-success animate-neon-pulse" />
          <span className="text-[9px] font-display uppercase tracking-wider text-success">All Models Active</span>
        </div>
      </div>

      {/* Model Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {models.map(m => (
          <div key={m.name} className="amg-panel space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-display font-bold text-foreground">{m.name}</h3>
              <span className={`text-[9px] font-display uppercase px-2 py-0.5 rounded ${
                m.status === 'active' ? 'bg-success/10 text-success border border-success/30' : 'bg-warning/10 text-warning border border-warning/30'
              }`}>{m.status}</span>
            </div>
            <div className="flex items-center justify-center">
              <CircularGauge value={m.accuracy} max={100} label="Accuracy" unit="%" color={m.accuracy > 90 ? 'success' : 'warning'} size={100} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-muted-foreground font-body block">Dataset</span>
                <span className="font-display text-foreground">{m.dataset} samples</span>
              </div>
              <div>
                <span className="text-muted-foreground font-body block">Predictions</span>
                <span className="font-display text-primary">{m.predictions}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground font-body block">Last Trained</span>
                <span className="font-display text-foreground">{m.lastTrained}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Health + Live Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="amg-panel flex flex-col items-center justify-center gap-4">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground">AI System Health</h3>
          <CircularGauge value={overallHealth} max={100} label="System" unit="%" color="success" size={160} />
          <div className="grid grid-cols-2 gap-3 w-full text-[10px]">
            <div className="p-2 rounded bg-secondary/20 border border-border text-center">
              <Database className="w-3 h-3 mx-auto mb-1 text-muted-foreground" />
              <span className="font-display text-foreground block">340K</span>
              <span className="text-muted-foreground">Total Samples</span>
            </div>
            <div className="p-2 rounded bg-secondary/20 border border-border text-center">
              <Activity className="w-3 h-3 mx-auto mb-1 text-muted-foreground" />
              <span className="font-display text-foreground block">4,876</span>
              <span className="text-muted-foreground">Predictions/day</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
            <Target className="w-3 h-3" /> Live Predictions
          </h3>
          <div className="space-y-2">
            {livePredictions.map((p, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-md border hover-card-glow ${
                p.urgency === 'high' ? 'border-destructive/30 bg-destructive/5' :
                p.urgency === 'medium' ? 'border-warning/30 bg-warning/5' :
                p.urgency === 'low' ? 'border-primary/30 bg-primary/5' : 'border-success/30 bg-success/5'
              }`}>
                <div>
                  <span className="text-sm font-body text-foreground">{p.component}</span>
                  <span className="text-[10px] text-muted-foreground block font-body">{p.prediction}</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-display font-bold ${
                    p.confidence > 90 ? 'text-success' : p.confidence > 80 ? 'text-primary' : 'text-warning'
                  }`}>{p.confidence}%</span>
                  <span className="text-[9px] text-muted-foreground block font-display">confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="amg-panel">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
          <Zap className="w-3 h-3" /> AI Maintenance Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: AlertTriangle, text: 'Replace coolant pump within 150 km — 87% failure probability detected.', type: 'critical' },
            { icon: TrendingUp, text: 'Battery degradation trending 12% faster than baseline. Schedule cell inspection.', type: 'warning' },
            { icon: Target, text: 'Driving style optimization could reduce brake wear by 18%. Recommend coaching session.', type: 'info' },
          ].map((r, i) => (
            <div key={i} className={`p-4 rounded-md border hover-card-glow ${
              r.type === 'critical' ? 'border-destructive/30 bg-destructive/5' :
              r.type === 'warning' ? 'border-warning/30 bg-warning/5' : 'border-primary/30 bg-primary/5'
            }`}>
              <r.icon className="w-4 h-4 mb-2 text-muted-foreground" />
              <p className="text-xs font-body text-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
