import { useState } from 'react';
import { Users, Award, Zap, Shield, BarChart3 } from 'lucide-react';

const drivers = [
  { id: 1, name: 'Lewis Hamilton', number: 44, team: 'Mercedes-AMG Petronas', style: 'Balanced', riskIndex: 22, consistency: 94, aggression: 35, rating: 97 },
  { id: 2, name: 'George Russell', number: 63, team: 'Mercedes-AMG Petronas', style: 'Aggressive', riskIndex: 38, consistency: 88, aggression: 52, rating: 91 },
  { id: 3, name: 'Max Verstappen', number: 1, team: 'Red Bull Racing', style: 'Aggressive', riskIndex: 30, consistency: 96, aggression: 60, rating: 98 },
  { id: 4, name: 'Lando Norris', number: 4, team: 'McLaren F1', style: 'Balanced', riskIndex: 25, consistency: 90, aggression: 42, rating: 92 },
  { id: 5, name: 'Charles Leclerc', number: 16, team: 'Scuderia Ferrari', style: 'Calculated', riskIndex: 28, consistency: 87, aggression: 45, rating: 93 },
  { id: 6, name: 'Carlos Sainz', number: 55, team: 'Scuderia Ferrari', style: 'Smooth', riskIndex: 18, consistency: 91, aggression: 30, rating: 89 },
];

const teams = [
  { name: 'Mercedes-AMG Petronas', reliability: 94, pitSpeed: '2.3s', strategy: 92, wins: 8 },
  { name: 'Red Bull Racing', reliability: 91, pitSpeed: '2.1s', strategy: 96, wins: 19 },
  { name: 'Scuderia Ferrari', reliability: 82, pitSpeed: '2.5s', strategy: 85, wins: 4 },
  { name: 'McLaren F1', reliability: 88, pitSpeed: '2.4s', strategy: 89, wins: 2 },
];

function getRiskColor(risk: number) {
  if (risk < 25) return 'text-success';
  if (risk < 40) return 'text-warning';
  return 'text-destructive';
}

function getBarColor(val: number) {
  if (val > 85) return 'bg-success';
  if (val > 60) return 'bg-warning';
  return 'bg-destructive';
}

export default function DriversTeams() {
  const [tab, setTab] = useState<'drivers' | 'teams'>('drivers');

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            Drivers & Teams
          </h1>
          <p className="text-xs text-muted-foreground font-body mt-1">Performance Profiles • Risk Analysis • Team Comparison</p>
        </div>
        <div className="flex gap-1">
          {(['drivers', 'teams'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-[10px] font-display uppercase tracking-wider rounded transition-all ${
                tab === t ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground border border-transparent'
              }`}>{t}</button>
          ))}
        </div>
      </div>

      {tab === 'drivers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map(d => (
            <div key={d.id} className="amg-panel space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-display font-bold text-foreground">#{d.number}</span>
                  <h3 className="text-sm font-body text-foreground">{d.name}</h3>
                  <span className="text-[10px] text-muted-foreground font-body">{d.team}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-display font-bold text-primary">{d.rating}</span>
                  <span className="text-[9px] text-muted-foreground block font-display">RATING</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-secondary/20 border border-border">
                  <span className="text-[9px] text-muted-foreground font-display uppercase block">Style</span>
                  <span className="text-xs font-body text-foreground">{d.style}</span>
                </div>
                <div className="p-2 rounded bg-secondary/20 border border-border">
                  <span className="text-[9px] text-muted-foreground font-display uppercase block">Risk Index</span>
                  <span className={`text-xs font-display font-bold ${getRiskColor(d.riskIndex)}`}>{d.riskIndex}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-muted-foreground font-body">Consistency</span>
                    <span className="text-foreground font-display">{d.consistency}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getBarColor(d.consistency)}`} style={{ width: `${d.consistency}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-muted-foreground font-body">Aggression</span>
                    <span className="text-foreground font-display">{d.aggression}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${d.aggression > 50 ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${d.aggression}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'teams' && (
        <div className="space-y-4">
          {teams.map(t => (
            <div key={t.name} className="amg-panel">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-display font-bold text-foreground">{t.name}</h3>
                  <span className="text-[10px] text-muted-foreground font-body">Season Wins: {t.wins}</span>
                </div>
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-[9px] text-muted-foreground font-display uppercase block mb-1">Reliability</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-display font-bold ${getBarColor(t.reliability) === 'bg-success' ? 'text-success' : 'text-warning'}`}>{t.reliability}%</span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getBarColor(t.reliability)}`} style={{ width: `${t.reliability}%` }} />
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground font-display uppercase block mb-1">Pit Speed</span>
                  <span className="text-lg font-display font-bold text-primary">{t.pitSpeed}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground font-display uppercase block mb-1">Strategy</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-display font-bold ${getBarColor(t.strategy) === 'bg-success' ? 'text-success' : 'text-warning'}`}>{t.strategy}%</span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getBarColor(t.strategy)}`} style={{ width: `${t.strategy}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
