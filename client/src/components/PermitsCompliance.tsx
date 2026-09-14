import React, { useState } from 'react';
import { usePolaris } from '../context/PolarisContext';
import { 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Lock, 
  Printer
} from 'lucide-react';
import type { CAGEPPermit } from '../types';

export const PermitsCompliance: React.FC = () => {
  const { permits, approvePermit, flagPermitRisk, addPermit } = usePolaris();
  const [selectedPermitForDossier, setSelectedPermitForDossier] = useState<CAGEPPermit | null>(null);

  return (
    <div className="space-y-4">
      {/* Title & Legal Reference Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-ice-card p-4 rounded-xl border border-ice-border shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Indian Antarctic Act, 2022 & CAG-EP Governance Portal
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Official statutory clearances by the Committee on Antarctic Governance and Environmental Protection (MoES)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-amber-950/60 border border-amber-600/50 text-amber-300 px-3 py-1.5 rounded-lg font-mono">
            Act No. 13 of 2022 (Parliament of India)
          </span>
        </div>
      </div>

      {/* Statutory Rules Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
          <div className="font-bold text-cyan-300 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-cyan-400" /> Section 6 & 7: Mandatory Permits
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            No Indian citizen, vessel, or research expedition can enter Antarctica without explicit authorization issued by the CAG-EP under the Ministry of Earth Sciences.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
          <div className="font-bold text-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Section 10 & 13: Strict Prohibitions
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Mining, nuclear waste disposal, open burning, non-sterile soil introduction, and unauthorized specimen sampling carry severe penalties and imprisonment under Indian law.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
          <div className="font-bold text-purple-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> Section 16: ASPA / ASMA Protection
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Entry into Antarctic Specially Protected Areas (e.g., Schirmacher Oasis fossil sites, nunatak moss beds) requires specialized scientific permit endorsement.
          </p>
        </div>
      </div>

      {/* CAG-EP Permits Table */}
      <div className="bg-ice-card rounded-xl border border-ice-border p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Active Expeditions & Scientific Projects Register
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            CAG-EP Review Cycle: 2025–2027
          </span>
        </div>

        {permits.length === 0 ? (
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-6 text-center space-y-4">
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-950/60 border border-amber-700/40 flex items-center justify-center text-amber-400">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-wide uppercase">
                CAG-EP Statutory Clearing House: Standby
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No active permit applications in this cycle. Under Section 6 & 7 of the Indian Antarctic Act, 2022 (Act 13 of 2022), all scientific expeditions, geological sampling, and ASPA entry require statutory registration.
              </p>
            </div>

            {/* Statutory Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-2xl mx-auto text-left text-xs">
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="text-amber-400 font-bold">Section 6(1)</div>
                <div className="text-slate-300 text-[11px]">Expedition Clearance</div>
                <div className="text-slate-500 text-[10px]">Ministry Approval Mandatory</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="text-cyan-400 font-bold">Section 16</div>
                <div className="text-slate-300 text-[11px]">ASPA Specially Protected Area</div>
                <div className="text-slate-500 text-[10px]">Schirmacher / Larsemann Sites</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg space-y-1">
                <div className="text-emerald-400 font-bold">Annex III</div>
                <div className="text-slate-300 text-[11px]">Madrid Protocol Compliance</div>
                <div className="text-slate-500 text-[10px]">Zero Environmental Discharge</div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  addPermit({
                    permitId: 'CAG-EP-2026-IND-01',
                    applicantName: 'Dr. P. K. Srivastava (Chief Geologist)',
                    institution: 'Geological Survey of India (GSI)',
                    projectTitle: 'Petrological & Isotopic Dating of Schirmacher Oasis Nunatak Gneisses',
                    actSection: 'Section 6(1)(a) & 7(2) — Scientific Research Expedition',
                    aspaPermitRequired: true,
                    specimenCollectionAllowed: true,
                    status: 'CAG-EP_APPROVED',
                    validFrom: '2026-01-01',
                    validTo: '2027-03-31',
                    clearanceOfficer: 'Dr. M. Ravichandran (Secy MoES)'
                  });
                  addPermit({
                    permitId: 'CAG-EP-2026-IND-02',
                    applicantName: 'Dr. Ananya Mukherjee (Scientist E)',
                    institution: 'National Centre for Polar and Ocean Research (NCPOR)',
                    projectTitle: 'Sub-Glacial Lake Sediment Coring & Extremophilic Microbiome Bioprospecting',
                    actSection: 'Section 7(1) — Specimen Extraction & Mineral Assessment Prohibition',
                    aspaPermitRequired: false,
                    specimenCollectionAllowed: true,
                    status: 'CAG-EP_APPROVED',
                    validFrom: '2026-02-01',
                    validTo: '2026-12-31',
                    clearanceOfficer: 'Director NCPOR'
                  });
                }}
                className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg shadow-lg shadow-amber-600/30 transition-all flex items-center gap-1.5"
              >
                <Scale className="w-4 h-4" /> 1-Click Load Official CAG-EP Statutory Permits
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="py-2.5 px-3">Permit Identifier</th>
                  <th className="py-2.5 px-3">Legal Basis</th>
                  <th className="py-2.5 px-3">Applicant & Institution</th>
                  <th className="py-2.5 px-3">Project Scope</th>
                  <th className="py-2.5 px-3">Validity</th>
                  <th className="py-2.5 px-3">Statutory Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {permits.map(permit => {
                  const isApproved = permit.status === 'CAG-EP_APPROVED';
                  const isFlagged = permit.status === 'FLAGGED_ENVIRONMENTAL_RISK';

                  return (
                    <tr key={permit.permitId} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-cyan-300">
                        {permit.permitId}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {permit.actSection}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{permit.applicantName}</div>
                        <div className="text-[11px] text-slate-400">{permit.institution}</div>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <div className="text-slate-200 truncate">{permit.projectTitle}</div>
                        {permit.aspaPermitRequired && (
                          <span className="inline-block mt-0.5 text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded">
                            ASPA Entry Endorsed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                        {permit.validFrom} to {permit.validTo}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase ${
                          isApproved
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : isFlagged
                            ? 'bg-rose-950 text-rose-300 border border-rose-700'
                            : 'bg-amber-950 text-amber-300 border border-amber-700'
                        }`}>
                          {permit.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedPermitForDossier(permit)}
                          className="text-slate-300 hover:text-white p-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                          title="View Official Ministry Dossier"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {!isApproved && (
                          <button
                            onClick={() => approvePermit(permit.permitId)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-1 rounded text-[11px] transition-colors"
                          >
                            Approve
                          </button>
                        )}

                        {!isFlagged && (
                          <button
                            onClick={() => flagPermitRisk(permit.permitId)}
                            className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50 font-medium px-2 py-1 rounded text-[11px] transition-colors"
                          >
                            Flag Risk
                          </button>
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

      {/* Official Printable Ministry Dossier Modal */}
      {selectedPermitForDossier && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-xs font-sans text-slate-200">
            {/* Ministry Header Style */}
            <div className="text-center border-b border-slate-700 pb-4 space-y-1">
              <div className="text-amber-400 font-bold tracking-widest text-[11px] uppercase">
                Government of India • Ministry of Earth Sciences
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Committee on Antarctic Governance and Environmental Protection (CAG-EP)
              </h3>
              <div className="text-slate-400 text-[11px]">
                Statutory Permit Issued under the Indian Antarctic Act, 2022 (Act No. 13 of 2022)
              </div>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-[11px]">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">PERMIT NUMBER:</span>
                <span className="text-cyan-300 font-bold">{selectedPermitForDossier.permitId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">LEGAL AUTHORITY:</span>
                <span className="text-white">{selectedPermitForDossier.actSection}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">AUTHORIZED INSTITUTION:</span>
                <span className="text-white font-bold">{selectedPermitForDossier.institution}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">PRINCIPAL INVESTIGATOR:</span>
                <span className="text-white">{selectedPermitForDossier.applicantName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">PROJECT TITLE:</span>
                <span className="text-amber-200">{selectedPermitForDossier.projectTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">EXPEDITION VALIDITY:</span>
                <span className="text-emerald-300">{selectedPermitForDossier.validFrom} to {selectedPermitForDossier.validTo}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">ASPA ENTRY CLEARANCE:</span>
                <span className={selectedPermitForDossier.aspaPermitRequired ? 'text-purple-300' : 'text-slate-500'}>
                  {selectedPermitForDossier.aspaPermitRequired ? 'AUTHORIZED (Annex V Madrid Protocol)' : 'NOT APPLICABLE'}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">ISSUING AUTHORITY:</span>
                <span className="text-slate-200">{selectedPermitForDossier.clearanceOfficer}</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 italic">
              * Notice: This permit is subject to periodic environmental audits by NCPOR and the Committee for Environmental Protection (CEP) under the Antarctic Treaty System.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
              <button
                onClick={() => setSelectedPermitForDossier(null)}
                className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Close Dossier
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Ministry Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
