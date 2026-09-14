import type { CargoItem, Sortie, LifeSupportStatus, MadridWasteRecord, CAGEPPermit, EmergencyIncident } from '../types';

// Pre-populated 44th Indian Scientific Expedition to Antarctica (ISEA) Baseline
export const INITIAL_CARGO_ITEMS: CargoItem[] = [
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
  },
  {
    id: 'CRG-44-003',
    trackingNumber: 'ISEA-GOA-2026-E03',
    name: 'Cummins NTA855 Polar GenSet Fuel Injector Assembly',
    category: 'Station Spares & HVAC',
    quantity: 4,
    unit: 'Sealed Wooden Crates',
    weightKg: 380,
    stage: 'STATION_BUNKER',
    storageLocation: 'Maitri Heavy Spares Bunk Bay 1',
    isColdChain: false,
    hazardClass: 'Non-Hazardous Mechanical',
    expedition: '44th Indian Antarctic Expedition',
    qrCode: 'POLARIS:CRG-44-003:GENPART:380KG',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_SORTIES: Sortie[] = [
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

export const INITIAL_LIFE_SUPPORT: Record<string, LifeSupportStatus> = {
  Maitri: {
    station: 'Maitri',
    externalTempC: -34.5,
    windSpeedKnots: 28,
    windChillC: -48.2,
    blizzardCategory: 'Condition 2 (Warning)',
    ahsdFuelLiters: 95000,
    ahsdCapacityLiters: 120000,
    jetA1FuelLiters: 18000,
    jetA1CapacityLiters: 25000,
    potableWaterLiters: 14000,
    dailyFuelBurnRateLiters: 380,
    dailyWaterMeltRateLiters: 1100,
    activeGenerators: [
      { id: 'GEN-01-A', model: 'Cummins NTA855 Polar', loadPercent: 68, rpm: 1500, status: 'ONLINE', runtimeHours: 4120 },
      { id: 'GEN-02-B', model: 'Cummins NTA855 Polar', loadPercent: 0, rpm: 0, status: 'STANDBY', runtimeHours: 3890 },
      { id: 'GEN-03-C', model: 'Kirloskar 125kVA Cold-Pak', loadPercent: 0, rpm: 0, status: 'STANDBY', runtimeHours: 1240 }
    ],
    habitatInternalTempC: 20.0,
    winterDaysRemaining: 240
  },
  Bharati: {
    station: 'Bharati',
    externalTempC: -28.0,
    windSpeedKnots: 32,
    windChillC: -42.0,
    blizzardCategory: 'Condition 3 (Alert)',
    ahsdFuelLiters: 145000,
    ahsdCapacityLiters: 180000,
    jetA1FuelLiters: 22000,
    jetA1CapacityLiters: 30000,
    potableWaterLiters: 21000,
    dailyFuelBurnRateLiters: 420,
    dailyWaterMeltRateLiters: 1400,
    activeGenerators: [
      { id: 'B-GEN-01', model: 'Scania DC13 Polar Dual', loadPercent: 72, rpm: 1500, status: 'ONLINE', runtimeHours: 2950 },
      { id: 'B-GEN-02', model: 'Scania DC13 Polar Dual', loadPercent: 0, rpm: 0, status: 'STANDBY', runtimeHours: 3100 }
    ],
    habitatInternalTempC: 21.0,
    winterDaysRemaining: 240
  },
  Himadri: {
    station: 'Himadri',
    externalTempC: -14.0,
    windSpeedKnots: 15,
    windChillC: -21.0,
    blizzardCategory: 'Clear',
    ahsdFuelLiters: 32000,
    ahsdCapacityLiters: 40000,
    jetA1FuelLiters: 8000,
    jetA1CapacityLiters: 10000,
    potableWaterLiters: 8500,
    dailyFuelBurnRateLiters: 110,
    dailyWaterMeltRateLiters: 450,
    activeGenerators: [
      { id: 'HIM-GEN-01', model: 'Volvo Penta Arctic', loadPercent: 40, rpm: 1500, status: 'ONLINE', runtimeHours: 1420 }
    ],
    habitatInternalTempC: 20.5,
    winterDaysRemaining: 90
  }
};

export const INITIAL_MADRID_WASTE: MadridWasteRecord[] = [
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

export const INITIAL_PERMITS: CAGEPPermit[] = [
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

export const INITIAL_EMERGENCIES: EmergencyIncident[] = [
  {
    id: 'EMG-2026-001',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    station: 'Maitri',
    severity: 'CRITICAL_LEVEL_1',
    type: 'CREVASSE_FALL',
    reportedBy: 'Field Party Charlie via VHF Ch 04',
    coordinates: {
      lat: -70.920,
      lng: 11.850,
      area: 'Schirmacher Shear Zone Glacial Crevasse Line 4'
    },
    personnelInvolved: ['Dr. Vikram Singh', 'R. K. Meena'],
    status: 'ACTIVE_DISPATCH',
    rescuePlanSummary: 'Sno-Cat PB-02 mobilized with winch crane; heading 164° True SE, distance 22.4 km.',
    satelliteBurstSent: true
  }
];
