import React, { useState } from 'react';
import { usePolaris } from '../context/PolarisContext';
import { 
  AlertOctagon, 
  LifeBuoy, 
  Radio, 
  Compass, 
  HeartPulse, 
  CheckCircle2, 
  MapPin, 
  Send, 
  User
} from 'lucide-react';
import type { EmergencyIncident } from '../types';

export const EmergencySAR: React.FC = () => {
  const { emergencies, createEmergency, resolveEmergency, station } = usePolaris();

  const [showNewEmergencyModal, setShowNewEmergencyModal] = useState(false);
  const [selectedIncidentForVector, setSelectedIncidentForVector] = useState<EmergencyIncident | null>(null);

  // Form State
  const [incidentType, setIncidentType] = useState<EmergencyIncident['type']>('CREVASSE_FALL');
  const [severity, setSeverity] = useState<EmergencyIncident['severity']>('CRITICAL_LEVEL_1');
  const [area, setArea] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [personnelInvolved, setPersonnelInvolved] = useState('');
  const [summary, setSummary] = useState('');

  const handleLaunchEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    createEmergency({
      station,
      severity,
      type: incidentType,
      reportedBy,
      coordinates: {
        lat: station === 'Maitri' ? -70.92 : station === 'Bharati' ? -69.45 : 78.95,
        lng: station === 'Maitri' ? 11.85 : station === 'Bharati' ? 76.35 : 12.10,
        area
      },
      personnelInvolved: personnelInvolved.split(',').map(s => s.trim()),
      status: 'ACTIVE_DISPATCH',
      rescuePlanSummary: summary
    });
    setShowNewEmergencyModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-ice-card p-4 rounded-xl border border-ice-border shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertOctagon className="w-5 h-5 text-rose-500 animate-pulse" />
            <h2 className="text-base font-bold text-white">
              Emergency Search & Rescue (SAR) & Polar Medevac Command
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Autonomous rescue vector computation, crevasse hazard bypass, and 32-byte Iridium SBD satellite bursts
          </p>
        </div>

        <button
          onClick={() => setShowNewEmergencyModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white text-xs font-black px-4 py-2.5 rounded-lg shadow-xl shadow-rose-900/50 border border-rose-400/40 uppercase tracking-wider transition-all"
        >
          <LifeBuoy className="w-4 h-4 animate-spin-slow" />
          Broadcast Emergency SOS
        </button>
      </div>

      {/* Active Incidents List */}
      <div className="space-y-3">
        {emergencies.length === 0 ? (
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-6 text-center space-y-4">
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950/60 border border-emerald-700/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-wide uppercase">
                National Polar SAR Command: All Sectors Clear
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero active distress incidents or medevac alerts in the Indian Antarctic Area of Responsibility. COSPAS-SARSAT (406 MHz) and Iridium 32-Byte SBD emergency receivers are active 24/7.
              </p>
            </div>

            {/* Quick SAR Readiness Units Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-2xl mx-auto text-left text-xs">
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Maitri Station SAR Unit</div>
                <div className="font-bold text-white">Sno-Cat & Trauma Sledge #B2</div>
                <div className="text-emerald-400 text-[10px] font-mono">STANDBY • 15-min wheels up</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Bharati Station SAR Unit</div>
                <div className="font-bold text-white">Hagglunds BV-206 & Zodiac</div>
                <div className="text-emerald-400 text-[10px] font-mono">STANDBY • 20-min wheels up</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Satellite SBD Telemetry</div>
                <div className="font-bold text-white">Iridium 9602 Transceiver</div>
                <div className="text-cyan-400 text-[10px] font-mono">LISTENING • 1621.25 MHz</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowNewEmergencyModal(true)}
                className="bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-rose-900/40 transition-all flex items-center gap-1.5"
              >
                <LifeBuoy className="w-4 h-4" /> Broadcast Emergency SOS
              </button>
              <button
                onClick={() => {
                  createEmergency({
                    station,
                    severity: 'CRITICAL_LEVEL_1',
                    type: 'CREVASSE_FALL',
                    reportedBy: 'Field Convoy Lead (VHF Ch 04)',
                    coordinates: {
                      lat: station === 'Maitri' ? -70.920 : station === 'Bharati' ? -69.450 : 78.950,
                      lng: station === 'Maitri' ? 11.850 : station === 'Bharati' ? 76.350 : 12.100,
                      area: station === 'Maitri' ? 'Wohlthat Ridge Blue-Ice Shear Zone' : 'Larsemann Nunatak Ice Fracture'
                    },
                    personnelInvolved: ['Dr. R. Verma (WIHG Glaciologist)', 'Technician S. Joshi'],
                    status: 'ACTIVE_DISPATCH',
                    rescuePlanSummary: 'Field scientist slipped into a 12-meter snow-bridged crevasse during GPS stake survey. Conscious with suspected hypothermia and clavicle injury. Autonomous rescue vector dispatched.'
                  });
                }}
                className="bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold px-4 py-2 rounded-lg border border-rose-500/40 transition-all flex items-center gap-1.5"
              >
                <AlertOctagon className="w-4 h-4" /> 1-Click Simulate Crevasse Fall Rescue SOS
              </button>
            </div>
          </div>
        ) : (
          emergencies.map(incident => {
            const isResolved = incident.status === 'RESCUED_RESOLVED';

            return (
              <div
                key={incident.id}
                className={`p-4 rounded-xl border transition-all ${
                  isResolved
                    ? 'bg-slate-900/50 border-slate-800 opacity-60'
                    : 'bg-rose-950/30 border-rose-600/70 shadow-xl shadow-rose-950/40'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-mono font-black uppercase ${
                      isResolved ? 'bg-slate-800 text-slate-400' : 'bg-rose-600 text-white animate-pulse'
                    }`}>
                      {incident.id}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{incident.type.replace(/_/g, ' ')}</span>
                        <span className="text-xs font-normal text-slate-400">at {incident.station} Base</span>
                      </h3>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>Logged: {new Date(incident.timestamp).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span>Reporter: {incident.reportedBy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedIncidentForVector(incident)}
                      className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition-colors"
                    >
                      <Compass className="w-4 h-4" /> Compute Vector & Route
                    </button>

                    {!isResolved && (
                      <button
                        onClick={() => resolveEmergency(incident.id)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark Rescued
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                  <p className="text-slate-200">
                    <strong className="text-rose-300">Incident Dispatch Summary:</strong> {incident.rescuePlanSummary}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 gap-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>Coordinates: <strong>{incident.coordinates.lat.toFixed(3)}° S, {incident.coordinates.lng.toFixed(3)}° E</strong> ({incident.coordinates.area})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      <span>Personnel At Risk: <strong className="text-slate-200">{incident.personnelInvolved.join(', ')}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Radio className="w-3.5 h-3.5" />
                      <span>Iridium SBD 32-Byte Distress Burst Dispatched to MRCC Cape Town & MoES Goa</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Autonomous SAR Vector Calculation Modal */}
      {selectedIncidentForVector && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e172e] border border-rose-500/50 rounded-xl max-w-xl w-full p-5 shadow-2xl space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-rose-400" />
                Autonomous Polar SAR Vector & Extraction Dossier ({selectedIncidentForVector.id})
              </h3>
              <button onClick={() => setSelectedIncidentForVector(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            {/* Calculated Navigation Vector */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono">
              <div className="flex justify-between items-center text-cyan-300 border-b border-slate-800 pb-2">
                <span>RESCUE VECTOR AZIMUTH:</span>
                <span className="text-lg font-black text-white">164° True South-East</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>ESTIMATED STRAIGHT DISTANCE:</span>
                <span className="font-bold text-white">22.4 km across ice sheet</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>CREVASSE DETOUR SAFE ROUTE:</span>
                <span className="font-bold text-amber-300">28.1 km via Blue-Ice Pass 3</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>ESTIMATED FLIGHT / DRIVE TIME:</span>
                <span className="font-bold text-white">1 hr 14 min (PistenBully 300)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>FUEL DRAW REQUIREMENT:</span>
                <span className="font-bold text-emerald-300">62 Liters AHSD (Round Trip)</span>
              </div>
            </div>

            {/* Medical Trauma Guidance */}
            <div className="bg-rose-950/30 border border-rose-600/40 p-3.5 rounded-lg space-y-2">
              <div className="font-bold text-rose-200 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                Polar Hypothermia & Trauma Protocol (Stage 3 Deep Cold):
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                <li>Load <strong>Trauma Sledge Kit #B2</strong> (Electric heated thermal blankets, portable oxygen concentrator).</li>
                <li>Prepare warm IV isotonic saline at <strong>41°C</strong> in mobile medical unit prior to departure.</li>
                <li>Avoid active peripheral limb rewarming in field; keep torso insulated to prevent afterdrop ventricular fibrillation.</li>
              </ul>
            </div>

            {/* 32-Byte SBD Burst Display */}
            <div className="bg-slate-950 p-3 rounded border border-slate-800 text-[10px] font-mono">
              <span className="text-slate-400 block mb-1">RAW IRIDIUM 32-BYTE EMERGENCY PACKET (RFC 9171 DTN BUNDLE):</span>
              <span className="text-cyan-400 break-all">
                0x706F6C617269733A534F533A2D37302E3932303A3031312E3835303A4352455641535345
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
              <button
                onClick={() => setSelectedIncidentForVector(null)}
                className="px-4 py-2 rounded bg-slate-800 text-slate-300 font-bold"
              >
                Close Vector View
              </button>
              <button
                onClick={() => {
                  alert('Emergency SAR Vector dispatched to Station Vehicle Radio & Rescue Sno-Cat!');
                  setSelectedIncidentForVector(null);
                }}
                className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
              >
                <Send className="w-4 h-4" /> Dispatch Rescue Sledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Emergency Modal */}
      {showNewEmergencyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e172e] border border-rose-500/50 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-500" />
                Initiate Emergency Distress Protocol ({station})
              </h3>
              <button onClick={() => setShowNewEmergencyModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleLaunchEmergency} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Incident Classification</label>
                  <select
                    value={incidentType}
                    onChange={e => setIncidentType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-rose-400 focus:outline-none"
                  >
                    <option value="CREVASSE_FALL">Crevasse Fall / Vehicle Trap</option>
                    <option value="BLIZZARD_TRAPPED">Blizzard Whiteout Trapped</option>
                    <option value="GENERATOR_TRIP_FREEZING">Power Plant Freeze Hazard</option>
                    <option value="FROSTBITE_HYPOTHERMIA">Severe Hypothermia / Frostbite</option>
                    <option value="FUEL_LEAK">Environmental Fuel Spill</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Severity Tier</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-rose-400 focus:outline-none font-bold text-rose-400"
                  >
                    <option value="CRITICAL_LEVEL_1">Level 1: Immediate Life Threat</option>
                    <option value="HIGH_LEVEL_2">Level 2: Urgent Field Support</option>
                    <option value="MODERATE_LEVEL_3">Level 3: Precautionary Standby</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Last Known Geographic Area</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Reporting Officer / Unit</label>
                  <input
                    type="text"
                    required
                    value={reportedBy}
                    onChange={e => setReportedBy(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Personnel Involved</label>
                  <input
                    type="text"
                    required
                    value={personnelInvolved}
                    onChange={e => setPersonnelInvolved(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Situation Description</label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowNewEmergencyModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-wider"
                >
                  Broadcast SOS & Mobilize SAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
