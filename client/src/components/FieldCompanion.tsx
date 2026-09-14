import React, { useState } from 'react';
import { usePolaris } from '../context/PolarisContext';
import { 
  Compass, 
  Radio, 
  CheckCircle, 
  Battery, 
  Thermometer, 
  Wind, 
  ShieldAlert,
  Fuel
} from 'lucide-react';

export const FieldCompanion: React.FC = () => {
  const { station, sorties, checkinSortie, triggerSortieEmergency, lifeSupport } = usePolaris();
  const currentLS = lifeSupport[station];

  const activeFieldSortie = sorties.find(s => s.station === station && s.status === 'IN_FIELD') || sorties[0];
  const [radioPingSuccess, setRadioPingSuccess] = useState(false);
  const [fuelReportedLiters, setFuelReportedLiters] = useState(25);

  const handleQuickRadioPing = () => {
    if (activeFieldSortie) {
      checkinSortie(activeFieldSortie.id, 'Routine field radio ping from rugged convoy tablet. All instruments nominal.');
      setRadioPingSuccess(true);
      setTimeout(() => setRadioPingSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* High-Contrast Polar Mode Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-blue-500/20 p-4 rounded-xl border-2 border-cyan-400 text-white shadow-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 font-black text-lg">
            🚜
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
              POLAR FIELD HUD • RUGGED TABLET MODE
            </span>
            <h2 className="text-lg font-black text-white">
              {activeFieldSortie ? activeFieldSortie.missionName : 'No Active Field Mission'}
            </h2>
            <div className="text-xs text-slate-300">
              Assigned Base: <strong>{station} Station</strong> | Convoy: <strong>{activeFieldSortie?.vehicle}</strong>
            </div>
          </div>
        </div>

        {/* Local Hardware Health */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-700 text-xs font-mono">
          <div className="flex items-center gap-1 text-emerald-400">
            <Battery className="w-4 h-4" /> 88% (Heated Casing)
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-cyan-300">
            <Radio className="w-4 h-4" /> VHF {activeFieldSortie?.vhfFrequency}
          </div>
        </div>
      </div>

      {/* Dead-Reckoning & Heading Compass Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Navigation Heading */}
        <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5 text-center flex flex-col items-center justify-center space-y-2 shadow-lg">
          <div className="w-24 h-24 rounded-full border-4 border-cyan-400 flex flex-col items-center justify-center bg-slate-950 shadow-inner">
            <Compass className="w-8 h-8 text-cyan-400 animate-spin-slow" />
            <span className="text-lg font-black text-white">184° S</span>
          </div>
          <div className="text-xs font-bold text-slate-200">Azimuth to {station} Base</div>
          <div className="text-[11px] text-cyan-300 font-mono">Direct Distance: 14.8 km</div>
        </div>

        {/* Local Micro-Climate */}
        <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5 flex flex-col justify-between shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Field Environment Sensors</div>
          <div className="space-y-3 my-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 flex items-center gap-1.5 text-xs">
                <Thermometer className="w-4 h-4 text-cyan-400" /> Sensor Temp:
              </span>
              <span className="text-xl font-black text-white">{currentLS.externalTempC}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 flex items-center gap-1.5 text-xs">
                <Wind className="w-4 h-4 text-sky-400" /> Blizzard Wind:
              </span>
              <span className="text-xl font-black text-sky-300">{currentLS.windSpeedKnots} kts</span>
            </div>
          </div>
          <div className="text-[10px] bg-slate-950 p-2 rounded text-slate-400 font-mono">
            Windchill Equivalent: {currentLS.windChillC}°C
          </div>
        </div>

        {/* Survival Ration Countdown */}
        <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5 flex flex-col justify-between shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Survival Buffer Onboard</div>
          <div className="my-2">
            <div className="text-3xl font-black text-amber-400">{activeFieldSortie?.survivalRationsDays || 7} <span className="text-xs text-slate-400 font-normal">Days</span></div>
            <p className="text-xs text-slate-300 mt-1">High-calorie freeze-dried polar rations verified.</p>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" /> Survival Tent & Stove Stowed
          </div>
        </div>
      </div>

      {/* Large Touch-Target Actions (Designed for Gloved Hands) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Large Check-in Button */}
        <button
          onClick={handleQuickRadioPing}
          className="bg-gradient-to-br from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white p-6 rounded-2xl border-2 border-cyan-400 shadow-2xl flex flex-col items-center justify-center space-y-2 active:scale-95 transition-all text-center"
        >
          <Radio className="w-10 h-10 text-cyan-200" />
          <span className="text-xl font-black uppercase tracking-wider">
            {radioPingSuccess ? '✓ PING RECORDED' : 'SEND RADIO CHECK-IN'}
          </span>
          <span className="text-xs text-cyan-100 opacity-90">
            Resets station overdue countdown timer via local delay-tolerant mesh
          </span>
        </button>

        {/* Large Emergency SOS Button */}
        <button
          onClick={() => {
            if (activeFieldSortie) {
              triggerSortieEmergency(activeFieldSortie.id, 'Triggered from rugged field tablet. Whiteout conditions / terrain hazard.');
            }
          }}
          className="bg-gradient-to-br from-rose-700 to-red-800 hover:from-rose-600 hover:to-red-700 text-white p-6 rounded-2xl border-2 border-rose-400 shadow-2xl flex flex-col items-center justify-center space-y-2 active:scale-95 transition-all text-center"
        >
          <ShieldAlert className="w-10 h-10 text-rose-200 animate-pulse" />
          <span className="text-xl font-black uppercase tracking-wider">
            TRIGGER EMERGENCY SOS
          </span>
          <span className="text-xs text-rose-100 opacity-90">
            Broadcasts automated distress beacon with GPS coordinates to Base & MoES
          </span>
        </button>
      </div>

      {/* Field Fuel Consumption Quick Logger */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
          <Fuel className="w-4 h-4 text-amber-400" />
          Log Vehicle Fuel Burn (AHSD)
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={fuelReportedLiters}
            onChange={e => setFuelReportedLiters(Number(e.target.value))}
            className="bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-sm w-32 focus:outline-none focus:border-cyan-400"
          />
          <span className="text-xs text-slate-400">Liters consumed in current traverse</span>
          <button
            onClick={() => alert(`Logged ${fuelReportedLiters}L fuel consumption into convoy local cache.`)}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold px-4 py-2 rounded border border-slate-600"
          >
            Save Log
          </button>
        </div>
      </div>
    </div>
  );
};
