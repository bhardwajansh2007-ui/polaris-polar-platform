export type PolarStation = 'Maitri' | 'Bharati' | 'Himadri' | 'India Bay Base' | 'IndARC';

export type UserRole = 'NCPOR_HQ_GOA' | 'STATION_COMMANDER' | 'FIELD_EXPEDITION_LEAD';

export type NetworkMode = 'ONLINE_HIGH_SPEED' | 'SATELLITE_IRIDIUM' | 'POLAR_BLACKOUT';

export interface CargoItem {
  id: string;
  trackingNumber: string;
  name: string;
  category: 'Fuel & Hydrocarbons' | 'Station Spares & HVAC' | 'Food & Rations' | 'Medical & Pharmaceuticals' | 'Scientific Reagents' | 'Survival & Cold Gear';
  quantity: number;
  unit: string;
  weightKg: number;
  stage: 'STAGED_GOA' | 'TRANSIT_CAPE_TOWN' | 'ABOARD_VESSEL' | 'ICE_SHELF_DEPOT' | 'STATION_BUNKER';
  storageLocation: string;
  isColdChain: boolean;
  minTempC?: number;
  maxTempC?: number;
  currentTempC?: number;
  thermalViolationCount?: number;
  hazardClass?: string; // UN Hazmat
  madridProtocolCode?: string;
  expedition: string;
  qrCode: string;
  updatedAt: string;
}

export interface Sortie {
  id: string;
  missionName: string;
  station: PolarStation;
  teamLeader: string;
  scientists: string[];
  vehicle: 'PistenBully 300 Polar' | 'Snowmobile Lynx' | 'Heli Bell-412' | 'Ski-Doo Alpine';
  purpose: 'Glaciological Coring' | 'Atmospheric Radiosonde' | 'Crevasse Survey' | 'Fuel Depot Cache Check' | 'Emergency SAR';
  departureTime: string;
  expectedReturnTime: string;
  actualReturnTime?: string;
  status: 'SCHEDULED' | 'IN_FIELD' | 'OVERDUE' | 'RETURNED' | 'EMERGENCY_SOS';
  vhfFrequency: string;
  targetCoordinates: {
    lat: number;
    lng: number;
    elevationM: number;
    zoneName: string;
  };
  survivalRationsDays: number;
  emergencyBeaconId: string;
  lastCheckinTime: string;
  notes?: string;
}

export interface LifeSupportStatus {
  station: PolarStation;
  externalTempC: number;
  windSpeedKnots: number;
  windChillC: number;
  blizzardCategory: 'Clear' | 'Condition 3 (Alert)' | 'Condition 2 (Warning)' | 'Condition 1 (Whiteout)';
  ahsdFuelLiters: number; // Arctic High Speed Diesel
  ahsdCapacityLiters: number;
  jetA1FuelLiters: number;
  jetA1CapacityLiters: number;
  potableWaterLiters: number;
  dailyFuelBurnRateLiters: number;
  dailyWaterMeltRateLiters: number;
  activeGenerators: {
    id: string;
    model: string;
    loadPercent: number;
    rpm: number;
    status: 'ONLINE' | 'STANDBY' | 'MAINTENANCE_REQUIRED' | 'FAULT';
    runtimeHours: number;
  }[];
  habitatInternalTempC: number;
  winterDaysRemaining: number;
}

export interface MadridWasteRecord {
  id: string;
  manifestId: string;
  station: PolarStation;
  category: 'Category 1: Sewage/Liquid' | 'Category 2: Solid Waste/Metals/Plastics' | 'Category 3: Hazardous/Fuel Sludge/Batteries' | 'Category 4: Medical/Biohazard';
  drumCount: number;
  weightKg: number;
  storageBunker: string;
  sealNumber: string;
  disposalPlan: 'MANDATORY_REPATRIATION_INDIA' | 'AUTHORIZED_INCINERATION_ARCTIC' | 'GRAYWATER_TREATED_DISCHARGE';
  status: 'BUNKERED_STATION' | 'LOADED_ON_ICEBREAKER' | 'CLEARED_CUSTOMS_MAINLAND';
  certifiedOfficer: string;
  dateLogged: string;
}

export interface CAGEPPermit {
  permitId: string;
  actSection: string; // Indian Antarctic Act, 2022
  applicantName: string;
  institution: string; // e.g. "Geological Survey of India", "NCPOR", "IIT Bombay"
  projectTitle: string;
  validFrom: string;
  validTo: string;
  status: 'CAG-EP_APPROVED' | 'PENDING_COMMITTEE_REVIEW' | 'FLAGGED_ENVIRONMENTAL_RISK';
  aspaPermitRequired: boolean; // Antarctic Specially Protected Area
  specimenCollectionAllowed: boolean;
  clearanceOfficer: string;
}

export interface EmergencyIncident {
  id: string;
  timestamp: string;
  station: PolarStation;
  severity: 'CRITICAL_LEVEL_1' | 'HIGH_LEVEL_2' | 'MODERATE_LEVEL_3';
  type: 'CREVASSE_FALL' | 'BLIZZARD_TRAPPED' | 'GENERATOR_TRIP_FREEZING' | 'FROSTBITE_HYPOTHERMIA' | 'FUEL_LEAK';
  reportedBy: string;
  coordinates: {
    lat: number;
    lng: number;
    area: string;
  };
  personnelInvolved: string[];
  status: 'ACTIVE_DISPATCH' | 'MEDEVAC_IN_PROGRESS' | 'RESCUED_RESOLVED';
  rescuePlanSummary: string;
  satelliteBurstSent: boolean;
}

export interface SyncQueueItem {
  id: string;
  timestamp: string;
  entity: 'CARGO' | 'SORTIE' | 'WASTE' | 'EMERGENCY' | 'LIFE_SUPPORT' | 'PERMITS';
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  status: 'PENDING_SATELLITE_WINDOW' | 'TRANSMITTED' | 'FAILED';
  packetSizeBytes: number;
}
