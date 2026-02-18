import { ShieldAlert, AlertTriangle, TrendingDown, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const riskTimeline = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  brakeRisk: Math.min(100, 5 + i * 1.8 + Math.sin(i * 0.3) * 8),
  stabilityRisk: 10 + Math.sin(i * 0.2) * 15 + Math.random() * 5,
  tractionRisk: 8 + i * 0.5 + Math.random() * 10,
}));

const costData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  maintenance: 2000 + Math.random() * 3000,
  downtime: 500 + Math.random() * 1500,
  predicted: 1800 + Math.sin(i * 0.5) * 800,
}));

const riskCards = [
  { title: 'Brake Failure Risk', value: '18%', trend: '+2.1%', status: 'warning', icon: AlertTriangle },
  { title: 'Stability Loss', value: '6%', trend: '-0.5%', status: 'good', icon: ShieldAlert },
  { title: 'Traction Loss', value: '12%', trend: '+1.3%', status: 'warning', icon: TrendingDown },
  { title: 'Safety Score', value: '87', trend: '+3', status: 'good', icon: CheckCircle },
];

export default function Safety() {
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-warning" />
          Safety & Risk Prediction
        </h1>
        <p className="text-xs text-muted-foreground font-body mt-1">Brake Failure • Stability • Traction • Cost Optimization</p>
      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {riskCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="amg-panel text-center">
              <Icon className={`w-5 h-5 mx-auto mb-2 ${card.status === 'good' ? 'text-success' : 'text-warning'}`} />
              <span className="text-2xl font-display font-bold text-foreground block">{card.value}</span>
              <span className="text-[10px] font-display text-muted-foreground block mt-1">{card.title}</span>
              <span className={`text-[10px] font-display ${card.trend.startsWith('+') ? 'text-destructive' : 'text-success'}`}>{card.trend}</span>
            </div>
          );
        })}
      </div>

      {/* Risk Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-3">Risk Timeline (30 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={riskTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,15%)" />
              <XAxis dataKey="day" stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" />
              <YAxis stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" domain={[0, 100]} />
              <Tooltip contentStyle={{ background: 'hsl(220,18%,7%)', border: '1px solid hsl(220,15%,15%)', borderRadius: 8 }} />
              <Line type="monotone" dataKey="brakeRisk" stroke="hsl(0,85%,55%)" strokeWidth={2} dot={false} name="Brake" />
              <Line type="monotone" dataKey="stabilityRisk" stroke="hsl(45,100%,55%)" strokeWidth={2} dot={false} name="Stability" />
              <Line type="monotone" dataKey="tractionRisk" stroke="hsl(205,100%,55%)" strokeWidth={2} dot={false} name="Traction" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <DollarSign className="w-3 h-3" /> Cost Optimization
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,15%)" />
              <XAxis dataKey="month" stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" />
              <YAxis stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" />
              <Tooltip contentStyle={{ background: 'hsl(220,18%,7%)', border: '1px solid hsl(220,15%,15%)', borderRadius: 8 }} />
              <Area type="monotone" dataKey="maintenance" stroke="hsl(0,85%,55%)" fill="hsl(0,85%,55%)" fillOpacity={0.1} strokeWidth={2} name="Actual" />
              <Area type="monotone" dataKey="predicted" stroke="hsl(145,70%,45%)" fill="hsl(145,70%,45%)" fillOpacity={0.1} strokeWidth={2} name="AI Predicted" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lifecycle */}
      <div className="amg-panel">
        <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
          <Clock className="w-3 h-3" /> Component Lifecycle & Warranty
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: 'Power Unit', rul: '2,400 km', warranty: '85%', status: 'good' },
            { name: 'Gearbox', rul: '1,800 km', warranty: '72%', status: 'good' },
            { name: 'Brake Pads', rul: '450 km', warranty: '45%', status: 'warning' },
            { name: 'Turbo', rul: '3,100 km', warranty: '91%', status: 'good' },
            { name: 'Battery Pack', rul: '5,200 km', warranty: '88%', status: 'good' },
            { name: 'Suspension', rul: '1,200 km', warranty: '67%', status: 'warning' },
            { name: 'Radiator', rul: '2,800 km', warranty: '79%', status: 'good' },
            { name: 'ERS Module', rul: '4,600 km', warranty: '93%', status: 'good' },
          ].map(item => (
            <div key={item.name} className="p-3 rounded bg-secondary/30 border border-border">
              <span className="text-sm font-body text-foreground block">{item.name}</span>
              <span className="text-lg font-display font-bold text-primary block">{item.rul}</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] text-muted-foreground">RUL</span>
                <span className={`text-[9px] font-display ${item.status === 'good' ? 'text-success' : 'text-warning'}`}>● {item.warranty} warranty</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center py-3 border-t border-border">
        <span className="text-[10px] font-display uppercase tracking-[0.3em] text-muted-foreground">
          Safety & Risk Module • Predictive AI Analysis
        </span>
      </footer>
    </div>
  );
}
