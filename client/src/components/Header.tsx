import React, { useState, useEffect } from 'react';
import { usePolaris } from '../context/PolarisContext';
import { 
  Radio, 
  Wifi, 
  WifiOff, 
  Satellite, 
  ShieldAlert, 
  Flame, 
  Wind, 
  Thermometer, 
  RefreshCw,
  Building2,
  Compass,
  UserCheck,
  Trash2,
  Clock,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import type { PolarStation, UserRole, NetworkMode } from '../types';

export const Header: React.FC = () => {
  const {
    station,
    setStation,
    role,
    setRole,
    networkMode,
    setNetworkMode,
    syncQueue,
    isSyncing,
    manualTriggerSync,
    lifeSupport,
    activeAlert,
    dismissAlert,
    clearAllData,
    loadSampleData
  } = usePolaris();

  const currentStatus = lifeSupport[station];
  const pendingCount = syncQueue.filter(q => q.status === 'PENDING_SATELLITE_WINDOW').length;

  // Live Dual Clocks: UTC (Polar Expedition Time) & IST (Goa HQ Time)
  const [timeUTC, setTimeUTC] = useState('');
  const [timeIST, setTimeIST] = useState('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTimeUTC(now.toUTCString().slice(17, 25) + ' UTC');
      setTimeIST(now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST');
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#070d1e] border-b border-slate-800 shadow-2xl sticky top-0 z-50">
      {/* 1. Sovereign Ministry & National Authority Bar */}
      <div className="bg-[#040814] px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: National Emblem & Bilingual Titles */}
        <div className="flex items-center gap-3">
          {/* Ashoka Stambh / Indian State Emblem Motif */}
          <div className="w-8 h-8 rounded-md bg-gradient-to-b from-amber-500/20 to-amber-700/30 border border-amber-500/50 flex flex-col items-center justify-center text-amber-400 shadow-inner">
            <span className="text-[10px] font-serif font-black leading-none tracking-tighter">सत्यमेव</span>
            <span className="text-[9px] font-serif font-black leading-none tracking-tighter">जयते</span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 tracking-wider text-[11px]">
                भारत सरकार • पृथ्वी विज्ञान मंत्रालय
              </span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="font-bold text-amber-400 tracking-wider text-[11px] hidden sm:inline">
                GOVERNMENT OF INDIA • MINISTRY OF EARTH SCIENCES (MoES)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-2">
              <span>राष्ट्रीय ध्रुवीय एवं महासागर अनुसंधान केंद्र (NCPOR), वास्को-द-गामा, गोवा</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-mono font-medium">भारतीय अंटार्कटिक कार्यक्रम (ISEA)</span>
            </div>
          </div>
        </div>

        {/* Right: Dual Clocks (UTC/IST) & Act 2022 Statutory Stamp */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          {/* Clocks */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-bold">{timeUTC || '00:00:00 UTC'}</span>
            <span className="text-slate-600">/</span>
            <span className="text-amber-300 font-bold">{timeIST || '00:00:00 IST'}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 bg-amber-950/40 text-amber-300 px-2.5 py-1 rounded border border-amber-600/40">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Indian Antarctic Act 2022 (Act 13/2022)</span>
          </div>
        </div>
      </div>

      {/* Tricolor Micro-Ribbon Accent (Saffron, White, Green) */}
      <div className="h-[2px] w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* 2. Mission Operations Command Header */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo with Mission Seal */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-700 to-indigo-900 flex items-center justify-center shadow-lg shadow-cyan-600/30 border border-cyan-400/50">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-[8px] font-bold text-white shadow">
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-wider text-white flex items-center gap-2">
                POLARIS<span className="text-cyan-400 text-xs font-mono font-normal">MISSION OPS</span>
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-widest bg-gradient-to-r from-blue-950 to-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase">
                National Polar Expedition Suite
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Integrated Logistics, Asset Lifecycle & Search-and-Rescue System</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono">ISEA-44/45 Active</span>
            </p>
          </div>
        </div>

        {/* Tactical Selectors Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Base Selector */}
          <div className="flex items-center bg-slate-900/90 rounded-lg border border-slate-800 p-1 shadow-inner">
            <span className="text-[11px] font-bold text-slate-400 px-2 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Base:
            </span>
            {(['Maitri', 'Bharati', 'Himadri'] as PolarStation[]).map(s => (
              <button
                key={s}
                onClick={() => setStation(s)}
                className={`text-xs px-3 py-1 rounded-md font-bold transition-all ${
                  station === s
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Role Selector */}
          <div className="flex items-center bg-slate-900/90 rounded-lg border border-slate-800 p-1 shadow-inner">
            <span className="text-[11px] font-bold text-slate-400 px-2 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Role:
            </span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-xs text-cyan-300 font-bold focus:outline-none pr-2 py-1 cursor-pointer"
            >
              <option value="STATION_COMMANDER" className="bg-slate-900 text-white">Station Commander (Base)</option>
              <option value="NCPOR_HQ_GOA" className="bg-slate-900 text-white">NCPOR Director General / HQ (Goa)</option>
              <option value="FIELD_EXPEDITION_LEAD" className="bg-slate-900 text-white">Field Sortie / Convoy Lead</option>
            </select>
          </div>

          {/* Connectivity / Comms Simulator */}
          <div className="flex items-center bg-slate-900/90 rounded-lg border border-slate-800 p-1 shadow-inner">
            <span className="text-[11px] font-bold text-slate-400 px-2 flex items-center gap-1">
              {networkMode === 'ONLINE_HIGH_SPEED' && <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              {networkMode === 'SATELLITE_IRIDIUM' && <Satellite className="w-3.5 h-3.5 text-amber-400" />}
              {networkMode === 'POLAR_BLACKOUT' && <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
              Comms:
            </span>
            <select
              value={networkMode}
              onChange={(e) => setNetworkMode(e.target.value as NetworkMode)}
              className={`bg-transparent text-xs font-black focus:outline-none pr-1 py-1 cursor-pointer ${
                networkMode === 'ONLINE_HIGH_SPEED' ? 'text-emerald-400' :
                networkMode === 'SATELLITE_IRIDIUM' ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              <option value="ONLINE_HIGH_SPEED" className="bg-slate-900 text-emerald-400">🟢 Fiber/VSAT (Online)</option>
              <option value="SATELLITE_IRIDIUM" className="bg-slate-900 text-amber-400">🟡 Iridium SBD (24 kbps)</option>
              <option value="POLAR_BLACKOUT" className="bg-slate-900 text-rose-400">🔴 Blizzard Blackout (Offline)</option>
            </select>
          </div>

          {/* Demo Data & Reset Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={loadSampleData}
              className="flex items-center gap-1 bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 text-xs px-2.5 py-1.5 rounded-lg border border-cyan-700/60 transition-all font-semibold"
              title="Load standard 44th ISEA expedition manifests, sorties & permits for judge demonstration"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Load Demo Data</span>
            </button>
            <button
              onClick={clearAllData}
              className="flex items-center gap-1 bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-rose-500/50 transition-all"
              title="Reset operational data to clean empty state"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="font-semibold">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Live Planetary Micro-Telemetry HUD Strip */}
      {currentStatus && (
        <div className="bg-[#050916] border-t border-slate-800 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Ambient:</span>
              <span className="font-bold text-cyan-300">{currentStatus.externalTempC}°C</span>
              <span className="text-slate-500 text-[11px]">(Wind Chill: {currentStatus.windChillC}°C)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-400">Surface Wind:</span>
              <span className="font-bold text-sky-300">{currentStatus.windSpeedKnots} kts</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">AHSD Storage:</span>
              <span className="font-bold text-amber-300">{currentStatus.ahsdFuelLiters.toLocaleString()} L</span>
              <span className="text-slate-500 text-[11px]">({Math.round((currentStatus.ahsdFuelLiters / currentStatus.ahsdCapacityLiters) * 100)}%)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-400">Alert Tier:</span>
              <span className={`font-bold px-2 py-0.2 rounded text-[10px] ${
                currentStatus.blizzardCategory.includes('Whiteout') ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                currentStatus.blizzardCategory.includes('Warning') ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {currentStatus.blizzardCategory}
              </span>
            </div>
          </div>

          {/* Queue & Resupply Countdown */}
          <div className="flex items-center gap-4">
            {pendingCount > 0 && (
              <button
                onClick={manualTriggerSync}
                disabled={isSyncing || networkMode === 'POLAR_BLACKOUT'}
                className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] hover:bg-amber-500/30 transition-colors animate-pulse"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{pendingCount} DTN Bundles Queued</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Winter Isolation:</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded text-cyan-300 font-bold border border-slate-700">
                T - {currentStatus.winterDaysRemaining} Days
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Global Mission Alert Banner */}
      {activeAlert && (
        <div className="bg-gradient-to-r from-cyan-950 via-blue-950 to-indigo-950 border-y border-cyan-500/50 px-4 py-2 text-xs flex items-center justify-between text-cyan-100 animate-pulse">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="font-mono">{activeAlert}</span>
          </div>
          <button
            onClick={dismissAlert}
            className="text-cyan-400 hover:text-white font-bold px-2.5 py-0.5 rounded bg-cyan-900/60 border border-cyan-700/50"
          >
            DISMISS
          </button>
        </div>
      )}
    </header>
  );
};
