import React, { useState } from 'react';
import { usePolaris } from '../context/PolarisContext';
import { 
  Trash2, 
  CheckCircle, 
  Plus, 
  FileCheck, 
  FileSpreadsheet, 
  QrCode
} from 'lucide-react';
import type { MadridWasteRecord } from '../types';

export const MadridWasteAudit: React.FC = () => {
  const { wasteRecords, addWasteRecord, updateWasteStatus, station } = usePolaris();

  const [showAddWasteModal, setShowAddWasteModal] = useState(false);
  const [category, setCategory] = useState<MadridWasteRecord['category']>('Category 3: Hazardous/Fuel Sludge/Batteries');
  const [drumCount, setDrumCount] = useState(6);
  const [weightKg, setWeightKg] = useState(1200);
  const [storageBunker, setStorageBunker] = useState('');
  const [certifiedOfficer, setCertifiedOfficer] = useState('');

  const totalWasteKg = wasteRecords.reduce((acc, curr) => acc + curr.weightKg, 0);
  const hazmatCount = wasteRecords.filter(w => w.category.includes('Hazardous') || w.category.includes('Medical')).length;
  const repatriatedKg = wasteRecords
    .filter(w => w.status === 'LOADED_ON_ICEBREAKER' || w.status === 'CLEARED_CUSTOMS_MAINLAND')
    .reduce((acc, curr) => acc + curr.weightKg, 0);

  const handleCreateWasteRecord = (e: React.FormEvent) => {
    e.preventDefault();
    addWasteRecord({
      station,
      category,
      drumCount,
      weightKg,
      storageBunker,
      sealNumber: `IND-ANT-SEAL-${Math.floor(10000 + Math.random() * 90000)}`,
      disposalPlan: 'MANDATORY_REPATRIATION_INDIA',
      status: 'BUNKERED_STATION',
      certifiedOfficer
    });
    setShowAddWasteModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Title & International Treaty Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-ice-card p-4 rounded-xl border border-ice-border shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trash2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Madrid Protocol Annex III Environmental Audit & Waste Repatriation
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Zero-discharge tracking: 100% of hazardous waste, fuel sludge, and non-biodegradable drums logged for repatriation to India
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddWasteModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Log Sealed Waste Drums
          </button>
        </div>
      </div>

      {/* Environmental Compliance Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Total Bunkered Waste Mass</div>
          <div className="text-2xl font-black text-white">
            {(totalWasteKg / 1000).toFixed(2)} <span className="text-xs font-normal text-slate-400">Metric Tons</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
            <CheckCircle className="w-3.5 h-3.5" /> 100% Tamper-Evident Seals Verified
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Annex III Repatriation Quota</div>
          <div className="text-2xl font-black text-cyan-300">
            {totalWasteKg > 0 ? Math.round((repatriatedKg / totalWasteKg) * 100) : 100}%
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Repatriated to India: {(repatriatedKg / 1000).toFixed(2)} Tons
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Hazardous & Bio-Waste Manifests</div>
          <div className="text-2xl font-black text-amber-300">
            {hazmatCount} <span className="text-xs font-normal text-slate-400">Consignments</span>
          </div>
          <div className="text-[11px] text-amber-400/90 pt-1">
            Zero Open Burning • In Accordance with Madrid Protocol
          </div>
        </div>
      </div>

      {/* Waste Consignment Manifests Table */}
      <div className="bg-ice-card rounded-xl border border-ice-border p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            Station Waste Bunker Inventory ({station})
          </h3>
          <button
            onClick={() => alert('Official Annex III Environmental Compliance Dossier compiled and exported to CEP / MoES.')}
            className="flex items-center gap-1 text-xs text-cyan-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" /> Export Treaty Audit Dossier
          </button>
        </div>

        {wasteRecords.length === 0 ? (
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-6 text-center space-y-4">
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950/60 border border-emerald-700/40 flex items-center justify-center text-emerald-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-wide uppercase">
                Station Waste Bunker Inventory: Standby
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero active waste barrels logged in the {station} bunker. Under Madrid Protocol Annex III & Indian Antarctic Act 2022, 100% of non-biodegradable waste, battery acids, and generator sludge must be sealed in tamper-evident drums for maritime repatriation to Goa.
              </p>
            </div>

            {/* Madrid Protocol Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-2xl mx-auto text-left text-xs">
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="text-emerald-400 font-bold">Zero Open Burning</div>
                <div className="text-slate-300 text-[11px]">Strict International Ban</div>
                <div className="text-slate-500 text-[10px]">Incinerators decommissioned</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="text-cyan-400 font-bold">Tamper-Evident Seals</div>
                <div className="text-slate-300 text-[11px]">Barcode & RFID Tracked</div>
                <div className="text-slate-500 text-[10px]">Ministry custody audit</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="text-amber-400 font-bold">100% Repatriation</div>
                <div className="text-slate-300 text-[11px]">Return to Indian Mainland</div>
                <div className="text-slate-500 text-[10px]">Mormugao Port Customs Gate</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowAddWasteModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Log Sealed Waste Drums
              </button>
              <button
                onClick={() => {
                  addWasteRecord({
                    station,
                    category: 'Category 3: Hazardous/Fuel Sludge/Batteries',
                    drumCount: 14,
                    weightKg: 2800,
                    storageBunker: `${station} Hazardous Waste Bunker Bay 2`,
                    sealNumber: 'IND-ANT-SEAL-88412',
                    disposalPlan: 'MANDATORY_REPATRIATION_INDIA',
                    status: 'BUNKERED_STATION',
                    certifiedOfficer: 'Environmental Officer Dr. S. K. Roy'
                  });
                  addWasteRecord({
                    station,
                    category: 'Category 2: Solid Waste/Metals/Plastics',
                    drumCount: 22,
                    weightKg: 1950,
                    storageBunker: `${station} Compacted Bale Staging Hangar`,
                    sealNumber: 'IND-ANT-SEAL-91044',
                    disposalPlan: 'MANDATORY_REPATRIATION_INDIA',
                    status: 'LOADED_ON_ICEBREAKER',
                    certifiedOfficer: 'Logistics Lead K. V. Sharma'
                  });
                }}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold px-4 py-2 rounded-lg border border-emerald-500/40 transition-all flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" /> 1-Click Ingest Standard Station Waste Manifest
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="py-2.5 px-3">Manifest & Seal</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Drums & Mass</th>
                  <th className="py-2.5 px-3">Storage Bunker</th>
                  <th className="py-2.5 px-3">Certified Officer</th>
                  <th className="py-2.5 px-3">Repatriation Stage</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {wasteRecords.map(rec => {
                  return (
                    <tr key={rec.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-cyan-300">{rec.manifestId}</div>
                        <div className="font-mono text-[10px] text-amber-300 flex items-center gap-1 mt-0.5">
                          <QrCode className="w-3 h-3" /> {rec.sealNumber}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-200">
                        {rec.category}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-white">{rec.weightKg.toLocaleString()} kg</span>
                        <span className="text-slate-400 text-[11px]"> ({rec.drumCount} drums)</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {rec.storageBunker}
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-400">
                        {rec.certifiedOfficer}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          rec.status === 'CLEARED_CUSTOMS_MAINLAND'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : rec.status === 'LOADED_ON_ICEBREAKER'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {rec.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        {rec.status === 'BUNKERED_STATION' && (
                          <button
                            onClick={() => updateWasteStatus(rec.id, 'LOADED_ON_ICEBREAKER')}
                            className="bg-cyan-900/50 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/50 px-2 py-1 rounded text-[11px] transition-colors"
                          >
                            Load on Icebreaker
                          </button>
                        )}
                        {rec.status === 'LOADED_ON_ICEBREAKER' && (
                          <button
                            onClick={() => updateWasteStatus(rec.id, 'CLEARED_CUSTOMS_MAINLAND')}
                            className="bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 px-2 py-1 rounded text-[11px] transition-colors"
                          >
                            Confirm Goa Arrival
                          </button>
                        )}
                        {rec.status === 'CLEARED_CUSTOMS_MAINLAND' && (
                          <span className="text-[10px] text-emerald-400 font-bold">Repatriated ✓</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Waste Modal */}
      {showAddWasteModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e172e] border border-cyan-500/40 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-emerald-400" />
                Register Hazardous Waste Drums under Madrid Protocol Annex III
              </h3>
              <button onClick={() => setShowAddWasteModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateWasteRecord} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Waste Classification (Annex III Category)</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Category 3: Hazardous/Fuel Sludge/Batteries">Category 3: Hazardous/Fuel Sludge/Batteries</option>
                  <option value="Category 2: Solid Waste/Metals/Plastics">Category 2: Solid Waste/Metals/Plastics</option>
                  <option value="Category 4: Medical/Biohazard">Category 4: Medical/Biohazard</option>
                  <option value="Category 1: Sewage/Liquid">Category 1: Sewage/Liquid Concentrates</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Number of Sealed Drums</label>
                  <input
                    type="number"
                    min="1"
                    value={drumCount}
                    onChange={e => setDrumCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Mass (Kg)</label>
                  <input
                    type="number"
                    min="10"
                    value={weightKg}
                    onChange={e => setWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Station Bunker Location</label>
                <input
                  type="text"
                  value={storageBunker}
                  onChange={e => setStorageBunker(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Certifying Environmental Officer</label>
                <input
                  type="text"
                  value={certifiedOfficer}
                  onChange={e => setCertifiedOfficer(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="bg-emerald-950/40 border border-emerald-600/40 p-2.5 rounded text-emerald-300 text-[11px]">
                Treaty Guarantee: These drums will be sealed with Indian Antarctic Program tamper-evident seals and repatriated to Goa at voyage completion.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddWasteModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Confirm & Generate Sealed Seal #
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
