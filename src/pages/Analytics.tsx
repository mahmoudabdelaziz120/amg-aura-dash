import { useState, useMemo } from 'react';
import { BarChart3, Battery, Thermometer, Zap, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import f1Perspective from '@/assets/f1-perspective.png';

const telemetryData = Array.from({ length: 20 }, (_, i) => ({
  lap: i + 1,
  speed: 180 + Math.sin(i * 0.5) * 40 + Math.random() * 20,
  rpm: 6000 + Math.sin(i * 0.3) * 2000 + Math.random() * 500,
  temp: 85 + Math.sin(i * 0.4) * 15 + Math.random() * 5,
  battery: 100 - i * 2.5 + Math.random() * 5,
  tireWear: i * 3 + Math.random() * 5,
  fuel: 100 - i * 4,
}));

const radarData = [
  { metric: 'Speed', value: 85 },
  { metric: 'Braking', value: 72 },
  { metric: 'Cornering', value: 90 },
  { metric: 'Acceleration', value: 88 },
  { metric: 'Consistency', value: 78 },
  { metric: 'Tire Mgmt', value: 65 },
];

const vibrationData = Array.from({ length: 50 }, (_, i) => ({
  time: i * 0.1,
  amplitude: Math.sin(i * 0.8) * 2 + Math.sin(i * 2.1) * 0.5 + (Math.random() - 0.5) * 0.3,
  baseline: Math.sin(i * 0.8) * 1.8,
}));

export default function Analytics() {
  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            Advanced Analytics
          </h1>
          <p className="text-xs text-muted-foreground font-body mt-1">Battery • Thermal • Powertrain • Anomaly Detection</p>
        </div>
        <span className="text-[9px] font-display uppercase tracking-wider text-destructive animate-neon-pulse">● RECORDING</span>
      </div>

      {/* Row 1: Vehicle + Performance Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-3 h-3" /> Speed & RPM Telemetry
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={telemetryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,15%)" />
              <XAxis dataKey="lap" stroke="hsl(220,10%,40%)" fontSize={10} fontFamily="Orbitron" />
              <YAxis stroke="hsl(220,10%,40%)" fontSize={10} fontFamily="Orbitron" />
              <Tooltip contentStyle={{ background: 'hsl(220,18%,7%)', border: '1px solid hsl(220,15%,15%)', borderRadius: 8, fontFamily: 'Rajdhani' }} />
              <Area type="monotone" dataKey="speed" stroke="hsl(205,100%,55%)" fill="hsl(205,100%,55%)" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="rpm" stroke="hsl(0,85%,55%)" fill="hsl(0,85%,55%)" fillOpacity={0.05} strokeWidth={1} yAxisId={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="amg-panel flex flex-col items-center">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-3 w-full">Performance Radar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(220,15%,20%)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(220,10%,50%)', fontSize: 9, fontFamily: 'Orbitron' }} />
              <Radar dataKey="value" stroke="hsl(205,100%,55%)" fill="hsl(205,100%,55%)" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Battery + Thermal + Vibration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <Battery className="w-3 h-3" /> Battery Degradation
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={telemetryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,15%)" />
              <XAxis dataKey="lap" stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" />
              <YAxis stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" domain={[0, 100]} />
              <Tooltip contentStyle={{ background: 'hsl(220,18%,7%)', border: '1px solid hsl(220,15%,15%)', borderRadius: 8 }} />
              <Area type="monotone" dataKey="battery" stroke="hsl(145,70%,45%)" fill="hsl(145,70%,45%)" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center p-2 rounded bg-secondary/30 border border-border">
              <span className="text-[9px] font-display text-muted-foreground block">SoH</span>
              <span className="text-sm font-display font-bold text-success">94%</span>
            </div>
            <div className="text-center p-2 rounded bg-secondary/30 border border-border">
              <span className="text-[9px] font-display text-muted-foreground block">Cycles</span>
              <span className="text-sm font-display font-bold text-primary">347</span>
            </div>
            <div className="text-center p-2 rounded bg-secondary/30 border border-border">
              <span className="text-[9px] font-display text-muted-foreground block">Range</span>
              <span className="text-sm font-display font-bold text-warning">285km</span>
            </div>
          </div>
        </div>

        <div className="amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <Thermometer className="w-3 h-3" /> Thermal Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={telemetryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,15%)" />
              <XAxis dataKey="lap" stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" />
              <YAxis stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" />
              <Tooltip contentStyle={{ background: 'hsl(220,18%,7%)', border: '1px solid hsl(220,15%,15%)', borderRadius: 8 }} />
              <Line type="monotone" dataKey="temp" stroke="hsl(0,85%,55%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {['Engine 92°C', 'Battery 38°C', 'Brakes 420°C', 'Coolant 78°C'].map((label) => (
              <div key={label} className="text-center p-2 rounded bg-secondary/30 border border-border">
                <span className="text-[10px] font-body text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <Activity className="w-3 h-3" /> Vibration Anomaly Detection
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={vibrationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,15%)" />
              <XAxis dataKey="time" stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" />
              <YAxis stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" />
              <Line type="monotone" dataKey="baseline" stroke="hsl(220,10%,30%)" strokeWidth={1} dot={false} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="amplitude" stroke="hsl(45,100%,55%)" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-2 mt-3 p-2 rounded bg-success/5 border border-success/20">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-[10px] font-body text-muted-foreground">No anomalies detected — Pattern normal</span>
          </div>
        </div>
      </div>

      {/* Row 3: Tire wear + Fuel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-3">Tire Wear Progression</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={telemetryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,15%)" />
              <XAxis dataKey="lap" stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" />
              <YAxis stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" />
              <Tooltip contentStyle={{ background: 'hsl(220,18%,7%)', border: '1px solid hsl(220,15%,15%)', borderRadius: 8 }} />
              <Bar dataKey="tireWear" fill="hsl(205,100%,55%)" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="amg-panel">
          <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-3">Energy Consumption</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={telemetryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,15%)" />
              <XAxis dataKey="lap" stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" />
              <YAxis stroke="hsl(220,10%,40%)" fontSize={9} fontFamily="Orbitron" />
              <Tooltip contentStyle={{ background: 'hsl(220,18%,7%)', border: '1px solid hsl(220,15%,15%)', borderRadius: 8 }} />
              <Area type="monotone" dataKey="fuel" stroke="hsl(45,100%,55%)" fill="hsl(45,100%,55%)" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 border-t border-border">
        <span className="text-[10px] font-display uppercase tracking-[0.3em] text-muted-foreground">
          Advanced Analytics Module • Real-Time Data Pipeline
        </span>
      </footer>
    </div>
  );
}
