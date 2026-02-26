import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Award, ChevronLeft, ChevronRight, X, Gauge, ShieldCheck, AlertTriangle, Activity, Fuel, Thermometer, Flag, MapPin, User, Wrench } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// ─── Data ──────────────────────────────────────────────────────────────────────

const drivers = [
  {
    id: 1, name: 'Lewis Hamilton', number: 44, team: 'Mercedes-AMG Petronas',
    nationality: 'British', style: 'Balanced', riskIndex: 22, consistency: 94,
    aggression: 35, rating: 97, reliability: 96,
    photo: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/2024Drivers/hamilton',
    stats: { wins: 103, poles: 104, podiums: 197, championships: 7 },
    telemetry: { topSpeed: 342, avgLapTime: '1:18.3', brakingForce: 5.2, gForce: 6.1 },
    color: 'from-emerald-500/30 to-teal-600/10',
    border: 'border-emerald-500/40',
    glow: 'hover:shadow-[0_0_40px_hsl(145,70%,45%,0.3)]',
    accent: 'text-emerald-400',
    bgAccent: 'bg-emerald-500',
  },
  {
    id: 2, name: 'George Russell', number: 63, team: 'Mercedes-AMG Petronas',
    nationality: 'British', style: 'Aggressive', riskIndex: 38, consistency: 88,
    aggression: 52, rating: 91, reliability: 89,
    photo: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/2024Drivers/russell',
    stats: { wins: 2, poles: 3, podiums: 15, championships: 0 },
    telemetry: { topSpeed: 338, avgLapTime: '1:18.9', brakingForce: 4.8, gForce: 5.8 },
    color: 'from-cyan-500/30 to-blue-600/10',
    border: 'border-cyan-500/40',
    glow: 'hover:shadow-[0_0_40px_hsl(195,80%,50%,0.3)]',
    accent: 'text-cyan-400',
    bgAccent: 'bg-cyan-500',
  },
  {
    id: 3, name: 'Max Verstappen', number: 1, team: 'Red Bull Racing',
    nationality: 'Dutch', style: 'Aggressive', riskIndex: 30, consistency: 96,
    aggression: 60, rating: 98, reliability: 91,
    photo: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/2024Drivers/verstappen',
    stats: { wins: 54, poles: 32, podiums: 98, championships: 3 },
    telemetry: { topSpeed: 345, avgLapTime: '1:17.8', brakingForce: 5.5, gForce: 6.4 },
    color: 'from-blue-500/30 to-indigo-600/10',
    border: 'border-blue-500/40',
    glow: 'hover:shadow-[0_0_40px_hsl(220,80%,55%,0.3)]',
    accent: 'text-blue-400',
    bgAccent: 'bg-blue-500',
  },
  {
    id: 4, name: 'Lando Norris', number: 4, team: 'McLaren F1',
    nationality: 'British', style: 'Balanced', riskIndex: 25, consistency: 90,
    aggression: 42, rating: 92, reliability: 88,
    photo: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/2024Drivers/norris',
    stats: { wins: 1, poles: 5, podiums: 18, championships: 0 },
    telemetry: { topSpeed: 340, avgLapTime: '1:18.5', brakingForce: 4.9, gForce: 5.9 },
    color: 'from-orange-500/30 to-amber-600/10',
    border: 'border-orange-500/40',
    glow: 'hover:shadow-[0_0_40px_hsl(30,90%,50%,0.3)]',
    accent: 'text-orange-400',
    bgAccent: 'bg-orange-500',
  },
  {
    id: 5, name: 'Charles Leclerc', number: 16, team: 'Scuderia Ferrari',
    nationality: 'Monégasque', style: 'Calculated', riskIndex: 28, consistency: 87,
    aggression: 45, rating: 93, reliability: 82,
    photo: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/2024Drivers/leclerc',
    stats: { wins: 5, poles: 23, podiums: 30, championships: 0 },
    telemetry: { topSpeed: 343, avgLapTime: '1:18.1', brakingForce: 5.1, gForce: 6.0 },
    color: 'from-red-500/30 to-rose-600/10',
    border: 'border-red-500/40',
    glow: 'hover:shadow-[0_0_40px_hsl(0,80%,55%,0.3)]',
    accent: 'text-red-400',
    bgAccent: 'bg-red-500',
  },
  {
    id: 6, name: 'Carlos Sainz', number: 55, team: 'Scuderia Ferrari',
    nationality: 'Spanish', style: 'Smooth', riskIndex: 18, consistency: 91,
    aggression: 30, rating: 89, reliability: 85,
    photo: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/2024Drivers/sainz',
    stats: { wins: 3, poles: 5, podiums: 20, championships: 0 },
    telemetry: { topSpeed: 339, avgLapTime: '1:18.7', brakingForce: 4.7, gForce: 5.7 },
    color: 'from-yellow-500/30 to-amber-600/10',
    border: 'border-yellow-500/40',
    glow: 'hover:shadow-[0_0_40px_hsl(45,90%,50%,0.3)]',
    accent: 'text-yellow-400',
    bgAccent: 'bg-yellow-500',
  },
];

const teams = [
  {
    id: 1, name: 'Mercedes-AMG Petronas', base: 'Brackley, UK',
    principal: 'Toto Wolff', car: 'W15', reliability: 94, pitSpeed: '2.3s',
    strategy: 92, wins: 8, championships: 8,
    logo: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/teams/2024/mercedes-logo',
    metrics: { aeroEff: 94, powerUnit: 96, tireManagement: 91 },
    maintenance: { nextService: '320 km', riskLevel: 'Low', prediction: 'No faults expected' },
    color: 'from-teal-500/30 to-emerald-600/10',
    border: 'border-teal-500/40',
    glow: 'hover:shadow-[0_0_40px_hsl(170,60%,45%,0.3)]',
    accent: 'text-teal-400',
    bgAccent: 'bg-teal-500',
  },
  {
    id: 2, name: 'Red Bull Racing', base: 'Milton Keynes, UK',
    principal: 'Christian Horner', car: 'RB20', reliability: 91, pitSpeed: '2.1s',
    strategy: 96, wins: 19, championships: 6,
    logo: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/teams/2024/red-bull-racing-logo',
    metrics: { aeroEff: 97, powerUnit: 94, tireManagement: 95 },
    maintenance: { nextService: '180 km', riskLevel: 'Medium', prediction: 'Gearbox check recommended' },
    color: 'from-blue-500/30 to-indigo-600/10',
    border: 'border-blue-500/40',
    glow: 'hover:shadow-[0_0_40px_hsl(220,80%,55%,0.3)]',
    accent: 'text-blue-400',
    bgAccent: 'bg-blue-500',
  },
  {
    id: 3, name: 'Scuderia Ferrari', base: 'Maranello, Italy',
    principal: 'Frédéric Vasseur', car: 'SF-24', reliability: 82, pitSpeed: '2.5s',
    strategy: 85, wins: 4, championships: 16,
    logo: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/teams/2024/ferrari-logo',
    metrics: { aeroEff: 90, powerUnit: 93, tireManagement: 84 },
    maintenance: { nextService: '90 km', riskLevel: 'High', prediction: 'Cooling system alert' },
    color: 'from-red-500/30 to-rose-600/10',
    border: 'border-red-500/40',
    glow: 'hover:shadow-[0_0_40px_hsl(0,80%,55%,0.3)]',
    accent: 'text-red-400',
    bgAccent: 'bg-red-500',
  },
  {
    id: 4, name: 'McLaren F1 Team', base: 'Woking, UK',
    principal: 'Andrea Stella', car: 'MCL38', reliability: 88, pitSpeed: '2.4s',
    strategy: 89, wins: 2, championships: 8,
    logo: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/teams/2024/mclaren-logo',
    metrics: { aeroEff: 92, powerUnit: 89, tireManagement: 90 },
    maintenance: { nextService: '250 km', riskLevel: 'Low', prediction: 'All systems nominal' },
    color: 'from-orange-500/30 to-amber-600/10',
    border: 'border-orange-500/40',
    glow: 'hover:shadow-[0_0_40px_hsl(30,90%,50%,0.3)]',
    accent: 'text-orange-400',
    bgAccent: 'bg-orange-500',
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function StatBar({ label, value, max = 100, accent }: { label: string; value: number; max?: number; accent: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-muted-foreground font-body">{label}</span>
        <span className="font-display text-foreground">{value}{max === 100 ? '%' : ''}</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${accent}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: number }) {
  const config = risk < 25
    ? { label: 'LOW RISK', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
    : risk < 40
      ? { label: 'MEDIUM', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' }
      : { label: 'HIGH RISK', cls: 'bg-red-500/20 text-red-400 border-red-500/30' };
  return (
    <span className={`text-[9px] font-display tracking-wider px-2 py-0.5 rounded border ${config.cls}`}>
      {config.label}
    </span>
  );
}

// ─── Card Components ───────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function DriverCard({ driver, index, onClick }: { driver: typeof drivers[0]; index: number; onClick: () => void }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.04, y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl border ${driver.border} bg-gradient-to-br ${driver.color} backdrop-blur-xl overflow-hidden transition-shadow duration-500 ${driver.glow} group`}
    >
      {/* Top glow line */}
      <div className={`absolute top-0 inset-x-0 h-[2px] ${driver.bgAccent} opacity-60`} />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className={`text-3xl font-display font-black ${driver.accent}`}>#{driver.number}</span>
            <h3 className="text-base font-display font-bold text-foreground mt-1">{driver.name}</h3>
            <p className="text-[11px] text-muted-foreground font-body flex items-center gap-1">
              <Flag className="w-3 h-3" /> {driver.nationality}
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className={`text-3xl font-display font-black ${driver.accent}`}>{driver.rating}</div>
            <span className="text-[8px] font-display tracking-[0.2em] text-muted-foreground block">OVERALL</span>
          </div>
        </div>

        {/* Team badge */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${driver.bgAccent}`} />
          <span className="text-[10px] font-body text-muted-foreground">{driver.team}</span>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <StatBar label="Consistency" value={driver.consistency} accent={driver.bgAccent} />
          <StatBar label="Aggression" value={driver.aggression} accent={driver.aggression > 50 ? 'bg-red-500' : driver.bgAccent} />
          <StatBar label="Reliability" value={driver.reliability} accent={driver.bgAccent} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <RiskBadge risk={driver.riskIndex} />
          <span className={`text-[10px] font-display ${driver.accent} opacity-0 group-hover:opacity-100 transition-opacity`}>
            VIEW DETAILS →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function TeamCard({ team, index, onClick }: { team: typeof teams[0]; index: number; onClick: () => void }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl border ${team.border} bg-gradient-to-br ${team.color} backdrop-blur-xl overflow-hidden transition-shadow duration-500 ${team.glow} group`}
    >
      <div className={`absolute top-0 inset-x-0 h-[2px] ${team.bgAccent} opacity-60`} />

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-display font-bold text-foreground">{team.name}</h3>
            <p className="text-[11px] text-muted-foreground font-body flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" /> {team.base}
            </p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-display font-black ${team.accent}`}>{team.wins}</span>
            <span className="text-[8px] font-display tracking-[0.2em] text-muted-foreground block">WINS</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Reliability', val: team.reliability },
            { label: 'Strategy', val: team.strategy },
            { label: 'Pit Speed', val: team.pitSpeed },
          ].map(s => (
            <div key={s.label} className="text-center p-2 rounded-lg bg-background/30 border border-border/30">
              <span className="text-[8px] font-display text-muted-foreground uppercase tracking-wider block">{s.label}</span>
              <span className={`text-sm font-display font-bold ${team.accent}`}>{typeof s.val === 'number' ? `${s.val}%` : s.val}</span>
            </div>
          ))}
        </div>

        <StatBar label="Aerodynamic Efficiency" value={team.metrics.aeroEff} accent={team.bgAccent} />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Award className={`w-4 h-4 ${team.accent}`} />
            <span className="text-[10px] font-body text-muted-foreground">{team.championships} Championships</span>
          </div>
          <span className={`text-[10px] font-display ${team.accent} opacity-0 group-hover:opacity-100 transition-opacity`}>
            VIEW DETAILS →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Modal Components ──────────────────────────────────────────────────────────

function DriverModal({ driver, onPrev, onNext, onClose }: {
  driver: typeof drivers[0]; onPrev: () => void; onNext: () => void; onClose: () => void;
}) {
  return (
    <motion.div
      key={driver.id}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.35 }}
      className="space-y-5 max-h-[80vh] overflow-y-auto pr-1 custom-scrollbar"
    >
      {/* Hero */}
      <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${driver.color} border ${driver.border} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <span className={`text-5xl font-display font-black ${driver.accent}`}>#{driver.number}</span>
            <h2 className="text-2xl font-display font-bold text-foreground mt-2">{driver.name}</h2>
            <p className="text-sm text-muted-foreground font-body mt-1">{driver.team}</p>
            <div className="flex items-center gap-2 mt-2">
              <Flag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-body text-muted-foreground">{driver.nationality}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-6xl font-display font-black ${driver.accent}`}>{driver.rating}</div>
            <span className="text-[10px] font-display tracking-[0.2em] text-muted-foreground">RATING</span>
          </div>
        </div>
      </div>

      {/* Career Stats */}
      <div>
        <h4 className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
          <Award className="w-3 h-3" /> CAREER STATISTICS
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(driver.stats).map(([k, v]) => (
            <div key={k} className={`text-center p-3 rounded-lg bg-gradient-to-b ${driver.color} border ${driver.border}`}>
              <span className={`text-xl font-display font-black ${driver.accent}`}>{v}</span>
              <span className="text-[8px] font-display text-muted-foreground uppercase tracking-wider block mt-1">{k}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Bars */}
      <div>
        <h4 className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
          <Gauge className="w-3 h-3" /> PERFORMANCE PROFILE
        </h4>
        <div className="space-y-2.5 p-4 rounded-lg bg-background/40 border border-border/30">
          <StatBar label="Consistency" value={driver.consistency} accent={driver.bgAccent} />
          <StatBar label="Aggression" value={driver.aggression} accent={driver.aggression > 50 ? 'bg-red-500' : driver.bgAccent} />
          <StatBar label="Reliability" value={driver.reliability} accent={driver.bgAccent} />
        </div>
      </div>

      {/* Telemetry */}
      <div>
        <h4 className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
          <Activity className="w-3 h-3" /> LIVE TELEMETRY SUMMARY
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Top Speed', value: `${driver.telemetry.topSpeed} km/h`, icon: Gauge },
            { label: 'Avg Lap', value: driver.telemetry.avgLapTime, icon: Activity },
            { label: 'Braking Force', value: `${driver.telemetry.brakingForce}G`, icon: ShieldCheck },
            { label: 'G-Force', value: `${driver.telemetry.gForce}G`, icon: AlertTriangle },
          ].map(t => (
            <div key={t.label} className={`p-3 rounded-lg bg-gradient-to-b ${driver.color} border ${driver.border} flex items-center gap-3`}>
              <t.icon className={`w-4 h-4 ${driver.accent}`} />
              <div>
                <span className="text-[8px] font-display text-muted-foreground uppercase tracking-wider block">{t.label}</span>
                <span className="text-sm font-display font-bold text-foreground">{t.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-background/40 border border-border/30">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          <div>
            <span className="text-[10px] font-display text-muted-foreground tracking-wider">FAILURE RISK PREDICTION</span>
            <p className="text-sm font-body text-foreground">{driver.riskIndex}% probability in next 500km</p>
          </div>
        </div>
        <RiskBadge risk={driver.riskIndex} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onPrev} className="flex items-center gap-2 text-xs font-display text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" /> PREV DRIVER
        </button>
        <button onClick={onNext} className="flex items-center gap-2 text-xs font-display text-muted-foreground hover:text-foreground transition-colors">
          NEXT DRIVER <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function TeamModal({ team, onPrev, onNext, onClose }: {
  team: typeof teams[0]; onPrev: () => void; onNext: () => void; onClose: () => void;
}) {
  return (
    <motion.div
      key={team.id}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.35 }}
      className="space-y-5 max-h-[80vh] overflow-y-auto pr-1 custom-scrollbar"
    >
      {/* Hero */}
      <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${team.color} border ${team.border} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">{team.name}</h2>
            <p className="text-sm text-muted-foreground font-body mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {team.base}
            </p>
            <div className="flex items-center gap-4 mt-3 text-[11px] font-body text-muted-foreground">
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {team.principal}</span>
              <span className="flex items-center gap-1"><Wrench className="w-3 h-3" /> {team.car}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-display font-black ${team.accent}`}>{team.championships}</div>
            <span className="text-[10px] font-display tracking-[0.2em] text-muted-foreground">TITLES</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h4 className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
          <Gauge className="w-3 h-3" /> PERFORMANCE METRICS
        </h4>
        <div className="space-y-2.5 p-4 rounded-lg bg-background/40 border border-border/30">
          <StatBar label="Aerodynamic Efficiency" value={team.metrics.aeroEff} accent={team.bgAccent} />
          <StatBar label="Power Unit Performance" value={team.metrics.powerUnit} accent={team.bgAccent} />
          <StatBar label="Tire Management" value={team.metrics.tireManagement} accent={team.bgAccent} />
          <StatBar label="Reliability" value={team.reliability} accent={team.bgAccent} />
          <StatBar label="Strategy" value={team.strategy} accent={team.bgAccent} />
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Season Wins', val: team.wins },
          { label: 'Pit Speed', val: team.pitSpeed },
          { label: 'Reliability', val: `${team.reliability}%` },
        ].map(s => (
          <div key={s.label} className={`text-center p-3 rounded-lg bg-gradient-to-b ${team.color} border ${team.border}`}>
            <span className={`text-lg font-display font-black ${team.accent}`}>{s.val}</span>
            <span className="text-[8px] font-display text-muted-foreground uppercase tracking-wider block mt-1">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Predictive Maintenance */}
      <div>
        <h4 className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
          <Wrench className="w-3 h-3" /> PREDICTIVE MAINTENANCE
        </h4>
        <div className="p-4 rounded-lg bg-background/40 border border-border/30 space-y-3">
          {[
            { label: 'Next Service', value: team.maintenance.nextService, icon: Fuel },
            { label: 'Risk Level', value: team.maintenance.riskLevel, icon: AlertTriangle },
            { label: 'AI Prediction', value: team.maintenance.prediction, icon: Thermometer },
          ].map(m => (
            <div key={m.label} className="flex items-center gap-3">
              <m.icon className={`w-4 h-4 ${team.accent}`} />
              <div>
                <span className="text-[9px] font-display text-muted-foreground uppercase tracking-wider">{m.label}</span>
                <p className="text-sm font-body text-foreground">{m.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onPrev} className="flex items-center gap-2 text-xs font-display text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" /> PREV TEAM
        </button>
        <button onClick={onNext} className="flex items-center gap-2 text-xs font-display text-muted-foreground hover:text-foreground transition-colors">
          NEXT TEAM <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function DriversTeams() {
  const [tab, setTab] = useState<'drivers' | 'teams'>('drivers');
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const navigateDriver = useCallback((dir: 1 | -1) => {
    setSelectedDriver(prev => {
      if (prev === null) return null;
      const idx = drivers.findIndex(d => d.id === prev);
      const next = (idx + dir + drivers.length) % drivers.length;
      return drivers[next].id;
    });
  }, []);

  const navigateTeam = useCallback((dir: 1 | -1) => {
    setSelectedTeam(prev => {
      if (prev === null) return null;
      const idx = teams.findIndex(t => t.id === prev);
      const next = (idx + dir + teams.length) % teams.length;
      return teams[next].id;
    });
  }, []);

  const activeDriver = drivers.find(d => d.id === selectedDriver);
  const activeTeam = teams.find(t => t.id === selectedTeam);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            Drivers & Teams
          </h1>
          <p className="text-xs text-muted-foreground font-body mt-1">Performance Profiles • Risk Analysis • Team Comparison</p>
        </div>
        <div className="flex gap-1 bg-secondary/30 rounded-lg p-1 border border-border/50">
          {(['drivers', 'teams'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`relative px-5 py-1.5 text-[10px] font-display uppercase tracking-wider rounded-md transition-all ${
                tab === t ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}>
              {tab === t && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-md"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {tab === 'drivers' && (
          <motion.div
            key="drivers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {drivers.map((d, i) => (
              <DriverCard key={d.id} driver={d} index={i} onClick={() => setSelectedDriver(d.id)} />
            ))}
          </motion.div>
        )}

        {tab === 'teams' && (
          <motion.div
            key="teams"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {teams.map((t, i) => (
              <TeamCard key={t.id} team={t} index={i} onClick={() => setSelectedTeam(t.id)} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Driver Modal */}
      <Dialog open={!!activeDriver} onOpenChange={() => setSelectedDriver(null)}>
        <DialogContent className="max-w-lg bg-background/95 backdrop-blur-2xl border-border/50 p-5">
          <AnimatePresence mode="wait">
            {activeDriver && (
              <DriverModal
                driver={activeDriver}
                onPrev={() => navigateDriver(-1)}
                onNext={() => navigateDriver(1)}
                onClose={() => setSelectedDriver(null)}
              />
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Team Modal */}
      <Dialog open={!!activeTeam} onOpenChange={() => setSelectedTeam(null)}>
        <DialogContent className="max-w-lg bg-background/95 backdrop-blur-2xl border-border/50 p-5">
          <AnimatePresence mode="wait">
            {activeTeam && (
              <TeamModal
                team={activeTeam}
                onPrev={() => navigateTeam(-1)}
                onNext={() => navigateTeam(1)}
                onClose={() => setSelectedTeam(null)}
              />
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
