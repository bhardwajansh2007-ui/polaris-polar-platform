import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  PolarStation,
  UserRole,
  NetworkMode,
  CargoItem,
  Sortie,
  LifeSupportStatus,
  MadridWasteRecord,
  CAGEPPermit,
  EmergencyIncident,
  SyncQueueItem
} from '../types';
import {
  INITIAL_CARGO_ITEMS,
  INITIAL_SORTIES,
  INITIAL_LIFE_SUPPORT,
  INITIAL_MADRID_WASTE,
  INITIAL_PERMITS,
  INITIAL_EMERGENCIES
} from '../data/mockData';

interface PolarisContextType {
  station: PolarStation;
  setStation: (station: PolarStation) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  syncQueue: SyncQueueItem[];
  bytesTransferred: number;
  isSyncing: boolean;
  manualTriggerSync: () => void;

  // Cargo state
  cargo: CargoItem[];
  addCargo: (item: Omit<CargoItem, 'id' | 'qrCode' | 'updatedAt'>) => void;
  updateCargoStage: (id: string, stage: CargoItem['stage']) => void;
  updateCargoTemp: (id: string, tempC: number) => void;

  // Sortie state
  sorties: Sortie[];
  createSortie: (sortie: Omit<Sortie, 'id' | 'status' | 'lastCheckinTime'>) => void;
  checkinSortie: (id: string, notes?: string) => void;
  triggerSortieEmergency: (id: string, reason: string) => void;
  completeSortie: (id: string) => void;

  // Life support state
  lifeSupport: Record<string, LifeSupportStatus>;
  updateLifeSupport: (station: PolarStation, partial: Partial<LifeSupportStatus>) => void;

  // Madrid Protocol Waste state
  wasteRecords: MadridWasteRecord[];
  addWasteRecord: (record: Omit<MadridWasteRecord, 'id' | 'manifestId' | 'dateLogged'>) => void;
  updateWasteStatus: (id: string, status: MadridWasteRecord['status']) => void;

  // CAG-EP Permits
  permits: CAGEPPermit[];
  addPermit: (permit: CAGEPPermit) => void;
  approvePermit: (permitId: string) => void;
  flagPermitRisk: (permitId: string) => void;

  // Emergencies
  emergencies: EmergencyIncident[];
  createEmergency: (incident: Omit<EmergencyIncident, 'id' | 'timestamp' | 'satelliteBurstSent'>) => void;
  resolveEmergency: (id: string) => void;

  // Sound/Alert notification
  activeAlert: string | null;
  dismissAlert: () => void;

  // Data management
  clearAllData: () => void;
  loadSampleData: () => void;
}

const PolarisContext = createContext<PolarisContextType | undefined>(undefined);

export const PolarisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [station, setStation] = useState<PolarStation>('Maitri');
  const [role, setRole] = useState<UserRole>('STATION_COMMANDER');
  const [networkMode, setNetworkMode] = useState<NetworkMode>('ONLINE_HIGH_SPEED');

  // Stored state with local storage fallback
  const [cargo, setCargo] = useState<CargoItem[]>(() => {
    const saved = localStorage.getItem('polaris_cargo');
    return saved ? JSON.parse(saved) : INITIAL_CARGO_ITEMS;
  });

  const [sorties, setSorties] = useState<Sortie[]>(() => {
    const saved = localStorage.getItem('polaris_sorties');
    return saved ? JSON.parse(saved) : INITIAL_SORTIES;
  });

  const [lifeSupport, setLifeSupport] = useState<Record<string, LifeSupportStatus>>(() => {
    const saved = localStorage.getItem('polaris_lifesupport');
    return saved ? JSON.parse(saved) : INITIAL_LIFE_SUPPORT;
  });

  const [wasteRecords, setWasteRecords] = useState<MadridWasteRecord[]>(() => {
    const saved = localStorage.getItem('polaris_waste');
    return saved ? JSON.parse(saved) : INITIAL_MADRID_WASTE;
  });

  const [permits, setPermits] = useState<CAGEPPermit[]>(() => {
    const saved = localStorage.getItem('polaris_permits');
    return saved ? JSON.parse(saved) : INITIAL_PERMITS;
  });

  const [emergencies, setEmergencies] = useState<EmergencyIncident[]>(() => {
    const saved = localStorage.getItem('polaris_emergencies');
    return saved ? JSON.parse(saved) : INITIAL_EMERGENCIES;
  });

  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => {
    const saved = localStorage.getItem('polaris_sync_queue');
    return saved ? JSON.parse(saved) : [];
  });

  const [bytesTransferred, setBytesTransferred] = useState<number>(14820);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('polaris_cargo', JSON.stringify(cargo));
  }, [cargo]);

  useEffect(() => {
    localStorage.setItem('polaris_sorties', JSON.stringify(sorties));
  }, [sorties]);

  useEffect(() => {
    localStorage.setItem('polaris_lifesupport', JSON.stringify(lifeSupport));
  }, [lifeSupport]);

  useEffect(() => {
    localStorage.setItem('polaris_waste', JSON.stringify(wasteRecords));
  }, [wasteRecords]);

  useEffect(() => {
    localStorage.setItem('polaris_permits', JSON.stringify(permits));
  }, [permits]);

  useEffect(() => {
    localStorage.setItem('polaris_emergencies', JSON.stringify(emergencies));
  }, [emergencies]);

  useEffect(() => {
    localStorage.setItem('polaris_sync_queue', JSON.stringify(syncQueue));
  }, [syncQueue]);

  // Queue an offline event if not online
  const enqueueAction = (entity: SyncQueueItem['entity'], action: SyncQueueItem['action'], payload: any) => {
    const packetSize = Math.floor(JSON.stringify(payload).length * 1.2);
    const item: SyncQueueItem = {
      id: `DTN-PKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      entity,
      action,
      payload,
      status: networkMode === 'ONLINE_HIGH_SPEED' ? 'TRANSMITTED' : 'PENDING_SATELLITE_WINDOW',
      packetSizeBytes: packetSize,
    };

    if (networkMode === 'ONLINE_HIGH_SPEED') {
      setBytesTransferred(prev => prev + packetSize);
    } else {
      setSyncQueue(prev => [item, ...prev]);
    }
  };

  // Automated sync drainage when returning to online or triggering manual satellite burst
  const manualTriggerSync = () => {
    if (syncQueue.length === 0) return;
    setIsSyncing(true);

    const pendingBytes = syncQueue
      .filter(q => q.status === 'PENDING_SATELLITE_WINDOW')
      .reduce((acc, curr) => acc + curr.packetSizeBytes, 0);

    setTimeout(() => {
      setSyncQueue(prev =>
        prev.map(item => ({ ...item, status: 'TRANSMITTED' }))
      );
      setBytesTransferred(prev => prev + pendingBytes);
      setIsSyncing(false);
      setActiveAlert(`Delay-Tolerant Bundle Sync Complete: ${pendingBytes} bytes flushed over satellite link.`);
    }, 1200);
  };

  useEffect(() => {
    if (networkMode === 'ONLINE_HIGH_SPEED' && syncQueue.some(q => q.status === 'PENDING_SATELLITE_WINDOW')) {
      manualTriggerSync();
    }
  }, [networkMode]);

  // Cargo operations
  const addCargo = (item: Omit<CargoItem, 'id' | 'qrCode' | 'updatedAt'>) => {
    const id = `CRG-44-${String(cargo.length + 1).padStart(3, '0')}`;
    const newItem: CargoItem = {
      ...item,
      id,
      qrCode: `POLARIS:${id}:${item.name.slice(0, 15)}:${item.weightKg}KG`,
      updatedAt: new Date().toISOString(),
    };
    setCargo(prev => [newItem, ...prev]);
    enqueueAction('CARGO', 'CREATE', newItem);
    setActiveAlert(`Cargo Item ${newItem.id} logged into Polar Supply Chain.`);
  };

  const updateCargoStage = (id: string, stage: CargoItem['stage']) => {
    setCargo(prev =>
      prev.map(c => (c.id === id ? { ...c, stage, updatedAt: new Date().toISOString() } : c))
    );
    enqueueAction('CARGO', 'UPDATE', { id, stage });
  };

  const updateCargoTemp = (id: string, tempC: number) => {
    setCargo(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        let violation = c.thermalViolationCount || 0;
        if (c.isColdChain && ((c.maxTempC !== undefined && tempC > c.maxTempC) || (c.minTempC !== undefined && tempC < c.minTempC))) {
          violation += 1;
        }
        return {
          ...c,
          currentTempC: tempC,
          thermalViolationCount: violation,
          updatedAt: new Date().toISOString()
        };
      })
    );
    enqueueAction('CARGO', 'UPDATE', { id, tempC });
  };

  // Sortie operations
  const createSortie = (sortieData: Omit<Sortie, 'id' | 'status' | 'lastCheckinTime'>) => {
    const id = `SRT-2026-${String(sorties.length + 10).padStart(2, '0')}`;
    const newSortie: Sortie = {
      ...sortieData,
      id,
      status: 'IN_FIELD',
      lastCheckinTime: new Date().toISOString(),
    };
    setSorties(prev => [newSortie, ...prev]);
    enqueueAction('SORTIE', 'CREATE', newSortie);
    setActiveAlert(`Sortie ${newSortie.missionName} approved. Field team checked out into sector.`);
  };

  const checkinSortie = (id: string, notes?: string) => {
    setSorties(prev =>
      prev.map(s => (s.id === id ? { ...s, lastCheckinTime: new Date().toISOString(), notes: notes || s.notes, status: 'IN_FIELD' } : s))
    );
    enqueueAction('SORTIE', 'UPDATE', { id, action: 'CHECKIN', notes });
    setActiveAlert(`Radio Check-in recorded for Sortie ${id}.`);
  };

  const triggerSortieEmergency = (id: string, reason: string) => {
    const sortie = sorties.find(s => s.id === id);
    if (!sortie) return;

    setSorties(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'EMERGENCY_SOS' } : s))
    );

    const incident: EmergencyIncident = {
      id: `EMG-2026-${String(emergencies.length + 2).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      station: sortie.station,
      severity: 'CRITICAL_LEVEL_1',
      type: 'CREVASSE_FALL',
      reportedBy: `${sortie.teamLeader} via VHF ${sortie.vhfFrequency}`,
      coordinates: {
        lat: sortie.targetCoordinates.lat,
        lng: sortie.targetCoordinates.lng,
        area: sortie.targetCoordinates.zoneName
      },
      personnelInvolved: sortie.scientists,
      status: 'ACTIVE_DISPATCH',
      rescuePlanSummary: `CRITICAL SOS: ${reason}. Automated SAR vector triggered for ${sortie.vehicle}.`,
      satelliteBurstSent: true
    };

    setEmergencies(prev => [incident, ...prev]);
    enqueueAction('EMERGENCY', 'CREATE', incident);
    setActiveAlert(`CRITICAL DISTRESS BEACON: ${sortie.missionName} triggered emergency distress!`);
  };

  const completeSortie = (id: string) => {
    setSorties(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'RETURNED', actualReturnTime: new Date().toISOString() } : s))
    );
    enqueueAction('SORTIE', 'UPDATE', { id, status: 'RETURNED' });
    setActiveAlert(`Sortie ${id} safely checked back into station airlock.`);
  };

  // Life Support operations
  const updateLifeSupport = (stn: PolarStation, partial: Partial<LifeSupportStatus>) => {
    setLifeSupport(prev => ({
      ...prev,
      [stn]: {
        ...prev[stn],
        ...partial
      }
    }));
    enqueueAction('LIFE_SUPPORT', 'UPDATE', { station: stn, ...partial });
  };

  // Madrid Waste operations
  const addWasteRecord = (record: Omit<MadridWasteRecord, 'id' | 'manifestId' | 'dateLogged'>) => {
    const id = `WST-2026-${String(wasteRecords.length + 1).padStart(3, '0')}`;
    const manifestId = `MADRID-ANNEX-III-44-${String(wasteRecords.length + 1).padStart(2, '0')}`;
    const newRecord: MadridWasteRecord = {
      ...record,
      id,
      manifestId,
      dateLogged: new Date().toISOString().split('T')[0]
    };
    setWasteRecords(prev => [newRecord, ...prev]);
    enqueueAction('WASTE', 'CREATE', newRecord);
    setActiveAlert(`Madrid Protocol Waste Seal logged: ${newRecord.sealNumber} (${newRecord.category})`);
  };

  const updateWasteStatus = (id: string, status: MadridWasteRecord['status']) => {
    setWasteRecords(prev =>
      prev.map(w => (w.id === id ? { ...w, status } : w))
    );
    enqueueAction('WASTE', 'UPDATE', { id, status });
  };

  // Permits
  const addPermit = (permit: CAGEPPermit) => {
    setPermits(prev => [permit, ...prev]);
    enqueueAction('PERMITS', 'CREATE', permit);
    setActiveAlert(`CAG-EP Statutory Permit Registered: ${permit.permitId}`);
  };

  const approvePermit = (permitId: string) => {
    setPermits(prev =>
      prev.map(p => (p.permitId === permitId ? { ...p, status: 'CAG-EP_APPROVED' } : p))
    );
    setActiveAlert(`CAG-EP Permit ${permitId} officially validated under Indian Antarctic Act 2022.`);
  };

  const flagPermitRisk = (permitId: string) => {
    setPermits(prev =>
      prev.map(p => (p.permitId === permitId ? { ...p, status: 'FLAGGED_ENVIRONMENTAL_RISK' } : p))
    );
    setActiveAlert(`Permit ${permitId} flagged for environmental liability under Section 13.`);
  };

  // Emergencies
  const createEmergency = (incidentData: Omit<EmergencyIncident, 'id' | 'timestamp' | 'satelliteBurstSent'>) => {
    const id = `EMG-2026-${String(emergencies.length + 10).padStart(3, '0')}`;
    const incident: EmergencyIncident = {
      ...incidentData,
      id,
      timestamp: new Date().toISOString(),
      satelliteBurstSent: true
    };
    setEmergencies(prev => [incident, ...prev]);
    enqueueAction('EMERGENCY', 'CREATE', incident);
    setActiveAlert(`EMERGENCY SAR ACTIVATED: ${incident.type} at ${incident.coordinates.area}`);
  };

  const resolveEmergency = (id: string) => {
    setEmergencies(prev =>
      prev.map(e => (e.id === id ? { ...e, status: 'RESCUED_RESOLVED' } : e))
    );
    enqueueAction('EMERGENCY', 'UPDATE', { id, status: 'RESCUED_RESOLVED' });
    setActiveAlert(`Incident ${id} marked as RESCUED & SECURED.`);
  };

  const clearAllData = () => {
    setCargo([]);
    setSorties([]);
    setWasteRecords([]);
    setPermits([]);
    setEmergencies([]);
    setSyncQueue([]);
    setBytesTransferred(0);
    localStorage.removeItem('polaris_cargo');
    localStorage.removeItem('polaris_sorties');
    localStorage.removeItem('polaris_waste');
    localStorage.removeItem('polaris_permits');
    localStorage.removeItem('polaris_emergencies');
    localStorage.removeItem('polaris_sync_queue');
    setActiveAlert('DATABASE PURGED: All operational demo data wiped to pristine zero.');
  };

  const loadSampleData = () => {
    const sampleCargo: CargoItem[] = [
      {
        id: 'CRG-44-001',
        trackingNumber: 'ISEA-GOA-2026-F01',
        name: 'Arctic High-Speed Diesel (AHSD Low Pour Point -50°C)',
        category: 'Fuel & Hydrocarbons',
        quantity: 120,
        unit: 'Drums (200L each)',
        weightKg: 20400,
        stage: 'ICE_SHELF_DEPOT',
        storageLocation: 'India Bay Shelf Fuel Dump Bravo',
        isColdChain: false,
        hazardClass: 'UN 1202 Flammable Liquid',
        madridProtocolCode: 'ANNEX-III-PETRO-2',
        expedition: '44th Indian Antarctic Expedition',
        qrCode: 'POLARIS:CRG-44-001:AHSD:20400KG',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'CRG-44-002',
        trackingNumber: 'ISEA-GOA-2026-M01',
        name: 'Trauma Blood Plasma & Cryo-Sera',
        category: 'Medical & Pharmaceuticals',
        quantity: 12,
        unit: 'Cryo Shippers',
        weightKg: 140,
        stage: 'STATION_BUNKER',
        storageLocation: 'Bharati Medical Ward Cryo-Safe',
        isColdChain: true,
        minTempC: 2,
        maxTempC: 8,
        currentTempC: 4.2,
        thermalViolationCount: 0,
        hazardClass: 'Non-Hazardous Biological',
        expedition: '44th Indian Antarctic Expedition',
        qrCode: 'POLARIS:CRG-44-002:MED:140KG',
        updatedAt: new Date().toISOString()
      }
    ];

    const sampleSortie: Sortie[] = [
      {
        id: 'SRT-2026-08',
        missionName: 'Wohlthat Mountain Paleoclimate Coring',
        station: 'Maitri',
        teamLeader: 'Dr. Rajesh Nair (Geologist, GSI)',
        scientists: ['Dr. Rajesh Nair', 'Sanjay Kumar (IMD)', 'Vikram Singh (Survey of India)'],
        vehicle: 'PistenBully 300 Polar',
        purpose: 'Glaciological Coring',
        departureTime: new Date(Date.now() - 3600000 * 4).toISOString(),
        expectedReturnTime: new Date(Date.now() + 3600000 * 4).toISOString(),
        status: 'IN_FIELD',
        vhfFrequency: '143.850 MHz (Ch 04)',
        targetCoordinates: {
          lat: -71.350,
          lng: 12.300,
          elevationM: 1650,
          zoneName: 'Wohlthat Mountains Camp Delta'
        },
        survivalRationsDays: 14,
        emergencyBeaconId: 'EPIRB-MAITRI-PB02',
        lastCheckinTime: new Date().toISOString(),
        notes: 'En route to drilling site; route following safe blue-ice corridor Bravo.'
      }
    ];

    const samplePermits: CAGEPPermit[] = [
      {
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
      },
      {
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
      }
    ];

    const sampleWaste: MadridWasteRecord[] = [
      {
        id: 'WST-2026-001',
        manifestId: 'MADRID-ANNEX-III-44-01',
        station: 'Maitri',
        category: 'Category 3: Hazardous/Fuel Sludge/Batteries',
        drumCount: 14,
        weightKg: 2800,
        storageBunker: 'Maitri Hazardous Waste Bunker Bay 2',
        sealNumber: 'IND-ANT-SEAL-88412',
        disposalPlan: 'MANDATORY_REPATRIATION_INDIA',
        status: 'BUNKERED_STATION',
        certifiedOfficer: 'Environmental Officer Dr. S. K. Roy',
        dateLogged: '2026-02-14'
      },
      {
        id: 'WST-2026-002',
        manifestId: 'MADRID-ANNEX-III-44-02',
        station: 'Bharati',
        category: 'Category 2: Solid Waste/Metals/Plastics',
        drumCount: 22,
        weightKg: 1950,
        storageBunker: 'Bharati Compacted Bale Staging Hangar',
        sealNumber: 'IND-ANT-SEAL-91044',
        disposalPlan: 'MANDATORY_REPATRIATION_INDIA',
        status: 'LOADED_ON_ICEBREAKER',
        certifiedOfficer: 'Logistics Lead K. V. Sharma',
        dateLogged: '2026-02-18'
      }
    ];

    setCargo(sampleCargo);
    setSorties(sampleSortie);
    setPermits(samplePermits);
    setWasteRecords(sampleWaste);
    setActiveAlert('OFFICIAL ISEA DATA LOADED: Standard MoES 44th Expedition manifests & permits populated.');
  };

  const dismissAlert = () => setActiveAlert(null);

  return (
    <PolarisContext.Provider
      value={{
        station,
        setStation,
        role,
        setRole,
        networkMode,
        setNetworkMode,
        syncQueue,
        bytesTransferred,
        isSyncing,
        manualTriggerSync,

        cargo,
        addCargo,
        updateCargoStage,
        updateCargoTemp,

        sorties,
        createSortie,
        checkinSortie,
        triggerSortieEmergency,
        completeSortie,

        lifeSupport,
        updateLifeSupport,

        wasteRecords,
        addWasteRecord,
        updateWasteStatus,

        permits,
        addPermit,
        approvePermit,
        flagPermitRisk,

        emergencies,
        createEmergency,
        resolveEmergency,

        clearAllData,
        loadSampleData,

        activeAlert,
        dismissAlert
      }}
    >
      {children}
    </PolarisContext.Provider>
  );
};

export const usePolaris = () => {
  const context = useContext(PolarisContext);
  if (!context) {
    throw new Error('usePolaris must be used within a PolarisProvider');
  }
  return context;
};
