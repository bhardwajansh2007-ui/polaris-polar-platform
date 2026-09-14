import React, { useState } from 'react';
import { PolarisProvider, usePolaris } from './context/PolarisContext';
import { Header } from './components/Header';
import { PolarMap } from './components/PolarMap';
import { CargoTracker } from './components/CargoTracker';
import { WinterSimulator } from './components/WinterSimulator';
import { PermitsCompliance } from './components/PermitsCompliance';
import { MadridWasteAudit } from './components/MadridWasteAudit';
import { EmergencySAR } from './components/EmergencySAR';
import { FieldCompanion } from './components/FieldCompanion';
import { 
  Compass, 
  Package, 
  Cpu, 
  Scale, 
  Trash2, 
  AlertOctagon, 
  Tablet,
  ShieldCheck,
  Globe2
} from 'lucide-react';

type TabType = 'GIS_SORTIES' | 'CARGO' | 'WINTER_SIM' | 'PERMITS' | 'MADRID_WASTE' | 'EMERGENCY_SAR' | 'FIELD_HUD';

const MainContent: React.FC = () => {
  const { role, emergencies, sorties, station, networkMode, syncQueue } = usePolaris();
  const [activeTab, setActiveTab] = useState<TabType>('GIS_SORTIES');

  // Auto-switch to Field HUD if user chooses Field Role
  React.useEffect(() => {
    if (role === 'FIELD_EXPEDITION_LEAD') {
      setActiveTab('FIELD_HUD');
    }
  }, [role]);

  const activeEmergenciesCount = emergencies.filter(e => e.status !== 'RESCUED_RESOLVED').length;
  const overdueSortiesCount = sorties.filter(s => s.status === 'OVERDUE').length;

  const TABS: { 
    id: TabType; 
    hindiLabel: string; 
    label: string; 
    icon: any; 
    badge?: number; 
    badgeColor?: string;
  }[] = [
    { 
      id: 'GIS_SORTIES', 
      hindiLabel: 'ध्रुवीय जीआईएस एवं सोर्टी', 
      label: 'Polar GIS & Sorties', 
      icon: Compass, 
      badge: overdueSortiesCount, 
      badgeColor: 'bg-amber-500 text-slate-950 animate-pulse' 
    },
    { 
      id: 'CARGO', 
      hindiLabel: 'रसद एवं शीत-श्रृंखला', 
      label: 'Cargo & Cold-Chain', 
      icon: Package 
    },
    { 
      id: 'WINTER_SIM', 
      hindiLabel: 'शीतकालीन डिजिटल ट्विन', 
      label: 'Winter Digital Twin', 
      icon: Cpu 
    },
    { 
      id: 'PERMITS', 
      hindiLabel: 'अधिनियम परमिट अनुपालन', 
      label: 'Antarctic Act Permits', 
      icon: Scale 
    },
    { 
      id: 'MADRID_WASTE', 
      hindiLabel: 'मैड्रिड पर्यावरण लेखापरीक्षा', 
      label: 'Madrid Waste Audit', 
      icon: Trash2 
    },
    { 
      id: 'EMERGENCY_SAR', 
      hindiLabel: 'आपातकालीन खोज एवं बचाव', 
      label: 'Emergency SAR', 
      icon: AlertOctagon, 
      badge: activeEmergenciesCount, 
      badgeColor: 'bg-rose-500 text-white animate-pulse' 
    },
    { 
      id: 'FIELD_HUD', 
      hindiLabel: 'फील्ड टैबलेट एचयूडी', 
      label: 'Field Tablet HUD', 
      icon: Tablet 
    },
  ];

  return (
    <div className="min-h-screen bg-[#050b18] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Official Government Header */}
      <Header />

      {/* 2. Tactical Mission Operational Ticker */}
      <div className="bg-[#091226] border-b border-slate-800/90 px-4 py-1.5 text-[11px] font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              SEC-POLARIS ACTIVE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">
              Station Sector: <strong className="text-cyan-300 font-semibold">{station.toUpperCase()} BASE</strong>
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline">
              Coords: <span className="text-slate-300 font-mono">{station === 'Maitri' ? '70°46′S 11°44′E' : station === 'Bharati' ? '69°24′S 76°11′E' : '78°55′N 11°56′E'}</span>
            </span>
            <span className="text-slate-600 hidden lg:inline">|</span>
            <span className="text-slate-400 hidden lg:inline">
              DTN Protocol: <span className="text-amber-400 font-semibold">RFC 9171 Bundle Ingest Ready</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              {networkMode === 'ONLINE_HIGH_SPEED' ? 'ONLINE • SATCOM LIVE' : 'DELAY-TOLERANT DTN MODE'}
            </span>
            <span className="text-cyan-400 hidden sm:inline">
              Queue: {syncQueue.filter(q => q.status === 'PENDING_SATELLITE_WINDOW').length} Bundles
            </span>
          </div>
        </div>
      </div>

      {/* 3. National Mission Command Tab Navigation */}
      <nav className="bg-[#080f20] border-b border-cyan-900/40 px-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-slate-700">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-start px-3.5 py-2 rounded-lg transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-gradient-to-b from-cyan-950/80 to-[#0c1a38] text-cyan-200 border-cyan-500/70 shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border-transparent hover:border-slate-800'
                }`}
              >
                {/* Hindi Sub-heading */}
                <span className={`text-[9px] font-sans font-medium leading-none mb-1 ${isActive ? 'text-amber-400' : 'text-slate-500'}`}>
                  {tab.hindiLabel}
                </span>

                {/* English Tab Title & Icon */}
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className={`text-xs font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {tab.label}
                  </span>

                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none ${tab.badgeColor}`}>
                      {tab.badge}
                    </span>
                  )}
                </div>

                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5">
        {activeTab === 'GIS_SORTIES' && <PolarMap />}
        {activeTab === 'CARGO' && <CargoTracker />}
        {activeTab === 'WINTER_SIM' && <WinterSimulator />}
        {activeTab === 'PERMITS' && <PermitsCompliance />}
        {activeTab === 'MADRID_WASTE' && <MadridWasteAudit />}
        {activeTab === 'EMERGENCY_SAR' && <EmergencySAR />}
        {activeTab === 'FIELD_HUD' && <FieldCompanion />}
      </main>

      {/* 5. Official Government Portal Footer (NIC & MoES Compliant) */}
      <footer className="bg-[#030712] border-t border-slate-800/90 py-6 px-4 text-xs text-slate-400 mt-10">
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Top Row: National Seals & Institutional Attributions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/40 flex flex-col items-center justify-center text-amber-400">
                <span className="text-[9px] font-serif font-black">सत्यमेव</span>
                <span className="text-[8px] font-serif font-black">जयते</span>
              </div>
              <div>
                <div className="font-bold text-slate-200 text-xs">
                  POLARIS — राष्ट्रीय ध्रुवीय अभियान रसद एवं परिसंपत्ति प्रबंधन मंच
                </div>
                <div className="text-[11px] text-slate-400">
                  National Centre for Polar and Ocean Research (NCPOR) • Ministry of Earth Sciences, Govt. of India
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/50">
                <Globe2 className="w-3 h-3" /> The Antarctic Treaty System (1959)
              </span>
              <span className="flex items-center gap-1 text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded border border-amber-800/50">
                <ShieldCheck className="w-3 h-3" /> The Indian Antarctic Act, 2022
              </span>
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/50">
                <Scale className="w-3 h-3" /> Madrid Protocol Annex III
              </span>
            </div>
          </div>

          {/* Bottom Row: NIC Standards, Security, Copyright */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              Designed & Engineered for Smart India Hackathon (SIH Problem Statement 26062) | National Informatics Standards Compliant
            </div>
            <div className="flex items-center gap-4">
              <span>Security Audited: Level-4 Isolated Deployment</span>
              <span>•</span>
              <span>Offline DTN RFC 9171 Compliant</span>
              <span>•</span>
              <span className="text-slate-400">© 2026 NCPOR / MoES</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <PolarisProvider>
      <MainContent />
    </PolarisProvider>
  );
}

