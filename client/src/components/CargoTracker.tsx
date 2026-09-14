import React, { useState } from 'react';
import { usePolaris } from '../context/PolarisContext';
import { 
  Package, 
  Thermometer, 
  AlertTriangle, 
  ArrowRight, 
  QrCode, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle,
  Truck,
  Ship,
  Building,
  Anchor,
  ShieldCheck,
  Camera
} from 'lucide-react';
import type { CargoItem } from '../types';

export const CargoTracker: React.FC = () => {
  const { cargo, addCargo, updateCargoStage, updateCargoTemp } = usePolaris();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeQRModal, setActiveQRModal] = useState<CargoItem | null>(null);
  const [simulatedScannerActive, setSimulatedScannerActive] = useState(false);
  const [scannedCodeInput, setScannedCodeInput] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CargoItem['category']>('Fuel & Hydrocarbons');
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState('Drums');
  const [weightKg, setWeightKg] = useState(2000);
  const [storageLocation, setStorageLocation] = useState('');
  const [isColdChain, setIsColdChain] = useState(false);
  const [minTempC, setMinTempC] = useState(2);
  const [maxTempC, setMaxTempC] = useState(8);
  const [hazardClass, setHazardClass] = useState('');

  const STAGES: { id: CargoItem['stage']; label: string; icon: any }[] = [
    { id: 'STAGED_GOA', label: '1. Goa Depot', icon: Building },
    { id: 'TRANSIT_CAPE_TOWN', label: '2. Cape Town Gateway', icon: Truck },
    { id: 'ABOARD_VESSEL', label: '3. Icebreaker Ship', icon: Ship },
    { id: 'ICE_SHELF_DEPOT', label: '4. Ice Shelf Depot', icon: Anchor },
    { id: 'STATION_BUNKER', label: '5. Station Bunker', icon: ShieldCheck },
  ];

  const filteredCargo = cargo.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateCargo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addCargo({
      trackingNumber: `ISEA-GOA-2026-${category[0]}${Math.floor(Math.random() * 90 + 10)}`,
      name,
      category,
      quantity,
      unit,
      weightKg,
      stage: 'STAGED_GOA',
      storageLocation,
      isColdChain,
      minTempC: isColdChain ? minTempC : undefined,
      maxTempC: isColdChain ? maxTempC : undefined,
      currentTempC: isColdChain ? (minTempC + maxTempC) / 2 : undefined,
      thermalViolationCount: 0,
      hazardClass,
      expedition: '44th Indian Antarctic Expedition',
    });

    setShowAddModal(false);
    setName('');
  };

  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault();
    const item = cargo.find(c => c.id.toLowerCase() === scannedCodeInput.trim().toLowerCase() || c.trackingNumber.toLowerCase() === scannedCodeInput.trim().toLowerCase());
    if (item) {
      setActiveQRModal(item);
      setSimulatedScannerActive(false);
      setScannedCodeInput('');
    } else {
      alert('Tracking Barcode not recognized in POLARIS database.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-ice-card p-4 rounded-xl border border-ice-border shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            Multi-Modal Polar Cargo & Cold-Chain Tracking
          </h2>
          <p className="text-xs text-slate-400">
            5-Stage intermodal movement from Goa through Cape Town to Antarctic ice-shelf depots
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimulatedScannerActive(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold px-3 py-2 rounded-lg border border-cyan-500/40 transition-colors"
          >
            <Camera className="w-4 h-4" />
            Scan Cargo Barcode
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg shadow-cyan-600/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Log New Manifest
          </button>
        </div>
      </div>

      {/* 5-Leg Pipeline Visual Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {STAGES.map((stg) => {
          const count = cargo.filter(c => c.stage === stg.id).length;
          const totalWeight = cargo
            .filter(c => c.stage === stg.id)
            .reduce((acc, curr) => acc + curr.weightKg, 0);
          const Icon = stg.icon;

          return (
            <div
              key={stg.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold flex items-center gap-1.5 text-slate-300">
                  <Icon className="w-4 h-4 text-cyan-400" /> {stg.label}
                </span>
                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-cyan-300">
                  {count} items
                </span>
              </div>
              <div>
                <div className="text-lg font-black text-white">{(totalWeight / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">Tons</span></div>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (count / (cargo.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search cargo by name, tracking number, or UN hazard code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Fuel & Hydrocarbons">Fuel & Hydrocarbons</option>
            <option value="Station Spares & HVAC">Station Spares & HVAC</option>
            <option value="Food & Rations">Food & Rations</option>
            <option value="Medical & Pharmaceuticals">Medical & Pharmaceuticals</option>
            <option value="Scientific Reagents">Scientific Reagents</option>
          </select>
        </div>
      </div>

      {/* Cargo Manifest Cards */}
      <div className="space-y-3">
        {filteredCargo.length === 0 ? (
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-6 text-center space-y-4">
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-cyan-950/60 border border-cyan-700/40 flex items-center justify-center text-cyan-400">
                <Package className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-wide uppercase">
                Polar Supply Pipeline: Standby for Consignment Manifest
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No cargo consignments currently matching the active filter. The multi-modal pipeline tracks supply movement across 5 key legs from Mormugao Naval Port (Goa) to Antarctic station bunkers.
              </p>
            </div>

            {/* Standby Route Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-2xl mx-auto text-left text-[11px]">
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-cyan-400 font-bold">1. Goa Base</div>
                <div className="text-slate-400 text-[10px] mt-0.5">Mormugao Staging</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-cyan-400 font-bold">2. Cape Town</div>
                <div className="text-slate-400 text-[10px] mt-0.5">Gateway Transshipment</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-cyan-400 font-bold">3. Icebreaker</div>
                <div className="text-slate-400 text-[10px] mt-0.5">Southern Ocean Transit</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-cyan-400 font-bold">4. Ice Shelf</div>
                <div className="text-slate-400 text-[10px] mt-0.5">Offloading Depot</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-cyan-400 font-bold">5. Bunker</div>
                <div className="text-slate-400 text-[10px] mt-0.5">Station Habitat</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Log New Cargo Consignment
              </button>
              <button
                onClick={() => {
                  addCargo({
                    trackingNumber: 'ISEA-44-AHSD-01',
                    name: 'Arctic High-Speed Diesel (AHSD Low Pour Point -50°C)',
                    category: 'Fuel & Hydrocarbons',
                    quantity: 80,
                    unit: 'Steel Barrels (200L)',
                    weightKg: 16000,
                    stage: 'STAGED_GOA',
                    storageLocation: 'Mormugao Berth #9 Fuel Depot',
                    isColdChain: false,
                    hazardClass: 'UN 1202 Class 3 (Flammable Liquid)',
                    expedition: '44th Indian Antarctic Expedition',
                  });
                  addCargo({
                    trackingNumber: 'ISEA-44-BIO-MED-04',
                    name: 'Antarctic Microbial Enzymes & Cryo-Specimens',
                    category: 'Scientific Reagents',
                    quantity: 4,
                    unit: 'Cryo Dewars',
                    weightKg: 180,
                    stage: 'TRANSIT_CAPE_TOWN',
                    storageLocation: 'Cape Town Port Cold-Storage Unit 3',
                    isColdChain: true,
                    minTempC: -25,
                    maxTempC: -15,
                    currentTempC: -20,
                    thermalViolationCount: 0,
                    hazardClass: 'UN 3373 Biological Substance Category B',
                    expedition: '44th Indian Antarctic Expedition',
                  });
                  addCargo({
                    trackingNumber: 'ISEA-44-HVAC-99',
                    name: 'Maitri Habitat Emergency HVAC Heating Elements & Microgrid Inverters',
                    category: 'Station Spares & HVAC',
                    quantity: 12,
                    unit: 'Crates',
                    weightKg: 2400,
                    stage: 'ABOARD_VESSEL',
                    storageLocation: 'Icebreaker Hold #2 Forward',
                    isColdChain: false,
                    hazardClass: 'Non-Hazardous Industrial Electrical',
                    expedition: '44th Indian Antarctic Expedition',
                  });
                }}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold px-4 py-2 rounded-lg border border-cyan-500/40 transition-all flex items-center gap-1.5"
              >
                <Package className="w-4 h-4" /> 1-Click Ingest Standard MoES Polar Manifests
              </button>
            </div>
          </div>
        ) : (
          filteredCargo.map(item => {
            const currentStageIndex = STAGES.findIndex(s => s.id === item.stage);

            return (
              <div
                key={item.id}
                className="bg-ice-card rounded-xl border border-ice-border p-4 shadow-lg hover:border-cyan-500/40 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-800 px-2.5 py-1 rounded">
                      {item.id}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{item.name}</h3>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>Ref: {item.trackingNumber}</span>
                        <span>•</span>
                        <span>Category: <b className="text-slate-300">{item.category}</b></span>
                        <span>•</span>
                        <span>Mass: <b className="text-slate-300">{item.weightKg.toLocaleString()} kg</b> ({item.quantity} {item.unit})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveQRModal(item)}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold px-2.5 py-1.5 rounded border border-slate-700 transition-colors"
                      title="View Barcode / QR Dossier"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Barcode
                    </button>
                  </div>
                </div>

                {/* 5-Stage Intermodal Movement Visual Progress */}
                <div className="relative pt-2 pb-1">
                  <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                    {STAGES.map((stg, idx) => {
                      const isPast = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;

                      return (
                        <div
                          key={stg.id}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            isCurrent
                              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold shadow-md shadow-cyan-950/50'
                              : isPast
                              ? 'bg-slate-900/70 border-emerald-500/40 text-emerald-400'
                              : 'bg-slate-900/40 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="text-[10px] font-mono leading-none mb-1">
                            {isPast ? '✓ CLEARED' : isCurrent ? '● IN TRANSIT' : '○ PENDING'}
                          </div>
                          <div className="truncate text-[11px]">{stg.label.split('. ')[1]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stage Controls & Thermal Monitoring */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Advance Stage:</span>
                    {currentStageIndex < STAGES.length - 1 ? (
                      <button
                        onClick={() => updateCargoStage(item.id, STAGES[currentStageIndex + 1].id)}
                        className="flex items-center gap-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 px-2.5 py-1 rounded font-semibold transition-colors"
                      >
                        Move to {STAGES[currentStageIndex + 1].label.split('. ')[1]}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Consignment Stored in Station Bunker
                      </span>
                    )}
                  </div>

                  {/* Cold-Chain Telemetry */}
                  {item.isColdChain ? (
                    <div className="flex items-center gap-3 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-slate-400 text-[11px]">Sensor Temp:</span>
                        <span className={`font-mono font-bold ${
                          (item.currentTempC ?? 0) > (item.maxTempC ?? 8) || (item.currentTempC ?? 0) < (item.minTempC ?? 2)
                            ? 'text-rose-400 animate-pulse'
                            : 'text-emerald-400'
                        }`}>
                          {item.currentTempC !== undefined ? `${item.currentTempC.toFixed(1)}°C` : 'N/A'}
                        </span>
                        <span className="text-slate-500 text-[10px]">
                          (Safe: {item.minTempC}°C to {item.maxTempC}°C)
                        </span>
                      </div>

                      {/* Simulation Controls for Demo */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateCargoTemp(item.id, (item.currentTempC ?? 4) - 1.5)}
                          className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-xs font-bold"
                          title="Simulate Cooling"
                        >
                          -
                        </button>
                        <button
                          onClick={() => updateCargoTemp(item.id, (item.currentTempC ?? 4) + 2.5)}
                          className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded text-xs font-bold"
                          title="Simulate Cold-Chain Warming"
                        >
                          +
                        </button>
                      </div>

                      {item.thermalViolationCount && item.thermalViolationCount > 0 ? (
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {item.thermalViolationCount} Thermal Breaches
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-400">Thermal Integrity 100%</span>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-[11px]">Ambient Polar Storage (Non-refrigerated)</div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add New Cargo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e172e] border border-cyan-500/40 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-400" />
                Register Cargo into Polar Supply Pipeline
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateCargo} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Item Description / Cargo Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Arctic High-Speed Diesel Low Pour Point"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Fuel & Hydrocarbons">Fuel & Hydrocarbons</option>
                    <option value="Station Spares & HVAC">Station Spares & HVAC</option>
                    <option value="Food & Rations">Food & Rations</option>
                    <option value="Medical & Pharmaceuticals">Medical & Pharmaceuticals</option>
                    <option value="Scientific Reagents">Scientific Reagents</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">UN Hazard Class</label>
                  <input
                    type="text"
                    value={hazardClass}
                    onChange={e => setHazardClass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Weight (Kg)</label>
                  <input
                    type="number"
                    min="1"
                    value={weightKg}
                    onChange={e => setWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Initial Storage Location</label>
                <input
                  type="text"
                  value={storageLocation}
                  onChange={e => setStorageLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Cold Chain Checkbox */}
              <div className="bg-slate-900/80 p-3 rounded border border-slate-700 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isColdChain}
                    onChange={e => setIsColdChain(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-400" /> Temperature-Sensitive Cold Chain Material
                  </span>
                </label>

                {isColdChain && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Min Safe Temp (°C)</label>
                      <input
                        type="number"
                        value={minTempC}
                        onChange={e => setMinTempC(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Max Safe Temp (°C)</label>
                      <input
                        type="number"
                        value={maxTempC}
                        onChange={e => setMaxTempC(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Save Manifest & Generate Barcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code / Barcode Viewer Modal */}
      {activeQRModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e172e] border border-cyan-500/40 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-300">{activeQRModal.id}</span>
              <button onClick={() => setActiveQRModal(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            {/* Generated Polar High-Contrast QR Code Artwork */}
            <div className="bg-white p-4 rounded-xl mx-auto inline-block shadow-inner">
              <div className="w-48 h-48 border-4 border-slate-900 flex flex-col justify-between p-2 font-mono text-[9px] text-slate-900 select-none">
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-slate-900 border-2 border-white flex items-center justify-center text-white font-bold">■</div>
                  <div className="text-right">NCPOR<br/>ISEA-44</div>
                  <div className="w-10 h-10 bg-slate-900 border-2 border-white flex items-center justify-center text-white font-bold">■</div>
                </div>
                <div className="text-center font-bold break-all text-[8px] py-1 border-y border-slate-300">
                  {activeQRModal.qrCode}
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-10 h-10 bg-slate-900 border-2 border-white flex items-center justify-center text-white font-bold">■</div>
                  <div className="text-center text-[7px]">MADRID ANNEX III<br/>COMPLIANT</div>
                  <div className="w-8 h-8 bg-slate-900"></div>
                </div>
              </div>
            </div>

            <div className="text-left text-xs space-y-1.5 bg-slate-900/80 p-3 rounded border border-slate-700">
              <div className="font-bold text-white">{activeQRModal.name}</div>
              <div className="text-slate-400">Tracking: <span className="text-cyan-300 font-mono">{activeQRModal.trackingNumber}</span></div>
              <div className="text-slate-400">Weight: <span className="text-slate-200">{activeQRModal.weightKg} kg</span></div>
              <div className="text-slate-400">Hazard: <span className="text-amber-300">{activeQRModal.hazardClass}</span></div>
            </div>

            <button
              onClick={() => setActiveQRModal(null)}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded transition-all"
            >
              Close Barcode View
            </button>
          </div>
        </div>
      )}

      {/* Simulated Scanner Modal */}
      {simulatedScannerActive && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e172e] border border-cyan-500/40 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                Polar Optical Barcode Scanner
              </h3>
              <button onClick={() => setSimulatedScannerActive(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="relative h-44 bg-slate-950 rounded-lg border-2 border-dashed border-cyan-500/50 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-x-0 h-0.5 bg-cyan-400 shadow-lg shadow-cyan-400 animate-bounce" />
              <Camera className="w-10 h-10 text-cyan-500/30 mb-2" />
              <span className="text-[11px] text-cyan-300 font-mono">Align Cargo QR / Barcode within frame</span>
            </div>

            <form onSubmit={handleSimulateScan} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Scan or Type Barcode Tracking Number:</label>
                <input
                  type="text"
                  placeholder="e.g. CRG-44-001 or ISEA-GOA-2026-F01"
                  value={scannedCodeInput}
                  onChange={e => setScannedCodeInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSimulatedScannerActive(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                >
                  Locate & Open Manifest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
