import type { CargoItem, Sortie, LifeSupportStatus, MadridWasteRecord, CAGEPPermit, EmergencyIncident } from '../types';

// Clean baseline - Demo items removed for clean production state
export const INITIAL_CARGO_ITEMS: CargoItem[] = [];

export const INITIAL_SORTIES: Sortie[] = [];

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

export const INITIAL_MADRID_WASTE: MadridWasteRecord[] = [];

export const INITIAL_PERMITS: CAGEPPermit[] = [];

export const INITIAL_EMERGENCIES: EmergencyIncident[] = [];
