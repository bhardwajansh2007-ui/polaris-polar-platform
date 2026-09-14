import React, { useState } from 'react';
import { usePolaris } from '../context/PolarisContext';
import { 
  Flame, 
  Droplet, 
  Cpu, 
  AlertOctagon, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  ThermometerSnowflake
} from 'lucide-react';

export const WinterSimulator: React.FC = () => {
  const { station, lifeSupport, updateLifeSupport } = usePolaris();
  const current = lifeSupport[station];

  // Simulation Parameters
  const [winterDays, setWinterDays] = useState(current.winterDaysRemaining);
  const [ambientTemp, setAmbientTemp] = useState(current.externalTempC);
  const [occupancy, setOccupancy] = useState(24);
  const [blizzardSeverity, setBlizzardSeverity] = useState<'LOW' | 'MODERATE' | 'EXTREME'>('MODERATE');

  // Thermodynamic calculations
  // Fuel burn increases non-linearly with lower temperature and blizzard wind-chill
  const baseLitersPerPerson = 4.2;
  const tempDeltaHeating = Math.max(0, 20 - ambientTemp); // difference between internal (20°C) and external
  const blizzardMultiplier = blizzardSeverity === 'LOW' ? 1.0 : blizzardSeverity === 'MODERATE' ? 1.15 : 1.35;

  const simulatedDailyBurnRate = Math.round(
    (180 + tempDeltaHeating * 4.8 + occupancy * baseLitersPerPerson) * blizzardMultiplier
  );

  const totalFuelNeeded = simulatedDailyBurnRate * winterDays;
  const fuelBufferRatio = (current.ahsdFuelLiters / (totalFuelNeeded || 1));
  const bufferPercentage = Math.round(fuelBufferRatio * 100);
  const daysOfFuelRemaining = Math.round(current.ahsdFuelLiters / (simulatedDailyBurnRate || 1));

  // Over-Wintering Survival Index (OWSI) calculation
  const owsiScore = Math.min(100, Math.max(0, Math.round(
    (fuelBufferRatio >= 1.2 ? 50 : (fuelBufferRatio / 1.2) * 50) +
    (daysOfFuelRemaining > winterDays ? 35 : (daysOfFuelRemaining / winterDays) * 35) +
    (current.activeGenerators.filter(g => g.status === 'ONLINE' || g.status === 'STANDBY').length >= 2 ? 15 : 5)
  )));

  const handleApplySimulatedConditions = () => {
    updateLifeSupport(station, {
      winterDaysRemaining: winterDays,
      externalTempC: ambientTemp,
      dailyFuelBurnRateLiters: simulatedDailyBurnRate,
    });
  };

  return (
    <div className="space-y-4">
      {/* Module Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-ice-card p-4 rounded-xl border border-ice-border shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Station Habitat Digital Twin & Over-Wintering Simulator ({station})
          </h2>
          <p className="text-xs text-slate-400">
            Thermodynamic life-support modeling and 240-day Monte Carlo winter isolation forecasting
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Polar Survival Index (OWSI)</span>
            <span className={`text-xl font-black ${
              owsiScore >= 85 ? 'text-emerald-400' : owsiScore >= 65 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {owsiScore}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 flex items-center justify-center font-bold text-xs"
               style={{
                 borderColor: owsiScore >= 85 ? '#10b981' : owsiScore >= 65 ? '#f59e0b' : '#f43f5e'
               }}>
            {owsiScore >= 85 ? 'OPTIMAL' : owsiScore >= 65 ? 'ALERT' : 'RISK'}
          </div>
        </div>
      </div>

      {/* Real-time Hardware Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* AHSD Heating Fuel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-amber-300">
              <Flame className="w-4 h-4 text-amber-400" /> AHSD Fuel Reserve
            </span>
            <span className="font-mono text-slate-300">
              {Math.round((current.ahsdFuelLiters / current.ahsdCapacityLiters) * 100)}%
            </span>
          </div>
          <div className="text-2xl font-black text-white">
            {current.ahsdFuelLiters.toLocaleString()} <span className="text-xs font-normal text-slate-400">Liters</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{ width: `${(current.ahsdFuelLiters / current.ahsdCapacityLiters) * 100}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>Capacity: {current.ahsdCapacityLiters.toLocaleString()} L</span>
            <span className="text-amber-300">Burn: {simulatedDailyBurnRate} L/day</span>
          </div>
        </div>

        {/* Jet A-1 Aviation Fuel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-sky-300">
              <Zap className="w-4 h-4 text-sky-400" /> Jet A-1 Aviation Fuel
            </span>
            <span className="font-mono text-slate-300">
              {Math.round((current.jetA1FuelLiters / current.jetA1CapacityLiters) * 100)}%
            </span>
          </div>
          <div className="text-2xl font-black text-white">
            {current.jetA1FuelLiters.toLocaleString()} <span className="text-xs font-normal text-slate-400">Liters</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full"
              style={{ width: `${(current.jetA1FuelLiters / current.jetA1CapacityLiters) * 100}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>Capacity: {current.jetA1CapacityLiters.toLocaleString()} L</span>
            <span className="text-sky-300">FSII Inhibitor Added</span>
          </div>
        </div>

        {/* Potable Meltwater Tank */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Droplet className="w-4 h-4 text-cyan-400" /> Snow-Melt Potable Water
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
              Heating Recycled
            </span>
          </div>
          <div className="text-2xl font-black text-white">
            {current.potableWaterLiters.toLocaleString()} <span className="text-xs font-normal text-slate-400">Liters</span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>Melt Rate: {current.dailyWaterMeltRateLiters} L/day</span>
            <span className="text-cyan-300">Priyadarshini Line OK</span>
          </div>
        </div>

        {/* Habitat Climate Core */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-purple-300">
              <ThermometerSnowflake className="w-4 h-4 text-purple-400" /> Habitat Climate Core
            </span>
            <span className="text-emerald-400 font-bold font-mono">HVAC NOMINAL</span>
          </div>
          <div className="text-2xl font-black text-white">
            {current.habitatInternalTempC}°C <span className="text-xs font-normal text-slate-400">Internal</span>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>External: {ambientTemp}°C</span>
            <span className="text-purple-300">Delta-T: {(20 - ambientTemp).toFixed(1)}°C</span>
          </div>
        </div>
      </div>

      {/* Generator Microgrid Hardware Monitor */}
      <div className="bg-ice-card rounded-xl border border-ice-border p-4 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Arctic Diesel Generator Microgrid Status (Maitri/Bharati Power Plant)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {current.activeGenerators.map(gen => (
            <div
              key={gen.id}
              className={`p-3 rounded-lg border text-xs space-y-2 ${
                gen.status === 'ONLINE'
                  ? 'bg-slate-900 border-cyan-500/60 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{gen.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  gen.status === 'ONLINE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {gen.status}
                </span>
              </div>
              <div className="text-slate-400">{gen.model}</div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Load:</span>
                <span className="font-bold font-mono text-cyan-300">{gen.loadPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full"
                  style={{ width: `${gen.loadPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>RPM: {gen.rpm}</span>
                <span>Runtime: {gen.runtimeHours} hrs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monte Carlo Simulator Interactive Control Panel */}
      <div className="bg-ice-card rounded-xl border border-ice-border p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Over-Wintering Isolation Stress-Test Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Adjust winter harshness variables to simulate fuel starvation risks before ship arrival
            </p>
          </div>
          <button
            onClick={handleApplySimulatedConditions}
            className="text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded transition-colors"
          >
            Apply to Active Telemetry
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Isolation Duration */}
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-300 font-medium">
              <span>Winter Days to Resupply:</span>
              <span className="font-bold text-cyan-300 font-mono">{winterDays} Days</span>
            </div>
            <input
              type="range"
              min="90"
              max="280"
              value={winterDays}
              onChange={e => setWinterDays(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>90d (Short)</span>
              <span>240d (Full Polar Winter)</span>
              <span>280d (Delayed)</span>
            </div>
          </div>

          {/* Ambient Temperature */}
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-300 font-medium">
              <span>External Winter Temp:</span>
              <span className="font-bold text-cyan-300 font-mono">{ambientTemp}°C</span>
            </div>
            <input
              type="range"
              min="-65"
              max="-10"
              value={ambientTemp}
              onChange={e => setAmbientTemp(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-65°C (Extreme)</span>
              <span>-35°C (Average)</span>
              <span>-10°C (Mild)</span>
            </div>
          </div>

          {/* Wintering Occupancy */}
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-300 font-medium">
              <span>Station Personnel:</span>
              <span className="font-bold text-cyan-300 font-mono">{occupancy} Scientists</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              value={occupancy}
              onChange={e => setOccupancy(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10 (Skeleton)</span>
              <span>24 (Nominal)</span>
              <span>45 (Full Summer)</span>
            </div>
          </div>

          {/* Blizzard Severity */}
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-300 font-medium">
              <span>Blizzard Category:</span>
              <span className="font-bold text-amber-300 font-mono">{blizzardSeverity}</span>
            </div>
            <select
              value={blizzardSeverity}
              onChange={e => setBlizzardSeverity(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-white text-xs"
            >
              <option value="LOW">Low (Wind &lt;20 kts)</option>
              <option value="MODERATE">Moderate (Cat 2 Warning - 35 kts)</option>
              <option value="EXTREME">Extreme (Cat 1 Whiteout - 60+ kts)</option>
            </select>
            <div className="text-[10px] text-slate-500">Affects structure convective heat loss</div>
          </div>
        </div>

        {/* Prediction Results Banner */}
        <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
          bufferPercentage >= 120
            ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
            : bufferPercentage >= 100
            ? 'bg-amber-950/40 border-amber-600/50 text-amber-200'
            : 'bg-rose-950/50 border-rose-600/70 text-rose-200'
        }`}>
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              {bufferPercentage >= 120 ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Mandatory Polar Buffer Satisfied (120% Safe Rule)</span>
                </>
              ) : (
                <>
                  <AlertOctagon className="w-5 h-5 text-rose-400" />
                  <span>CRITICAL DEFICIT WARNING: Insufficient Fuel for Winter Duration</span>
                </>
              )}
            </div>
            <p className="text-xs opacity-90">
              At current parameters, projected total consumption is <strong>{totalFuelNeeded.toLocaleString()} Liters</strong> against <strong>{current.ahsdFuelLiters.toLocaleString()} Liters</strong> in stock.
            </p>
          </div>

          <div className="flex items-center gap-6 text-right">
            <div>
              <div className="text-[10px] uppercase tracking-wider opacity-75">Days of Fuel Remaining</div>
              <div className="text-2xl font-black">{daysOfFuelRemaining} Days</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider opacity-75">Reserve Buffer Ratio</div>
              <div className="text-2xl font-black">{bufferPercentage}%</div>
            </div>
          </div>
        </div>

        {/* AI Heuristic Optimization Directives */}
        <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 text-xs space-y-2">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Polaris Life-Support Directives for Station Leader:
          </div>
          <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
            <li>
              Thermodynamic setpoint: Maintain habitat living modules at <strong>19.5°C</strong> to conserve approximately <strong>38 L/day</strong> of Arctic diesel.
            </li>
            <li>
              Snow-melter schedule: Run water melting cycle simultaneously with peak generator electrical load to capture <strong>100% of jacket-water exhaust heat</strong>.
            </li>
            <li>
              Spares check: Ensure <strong>Injector Set #44-G01</strong> is staged in heated workshop before blizzard window $T+12$ days.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
