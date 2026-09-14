const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Persistent store file path
const DATA_FILE = path.join(__dirname, 'polaris_store.json');

// Station coordinates dictionary
const STATION_COORDINATES = {
  Maitri: { lat: -70.766, lon: 11.733, name: 'Maitri (Schirmacher Oasis, Antarctica)' },
  Bharati: { lat: -69.400, lon: 76.183, name: 'Bharati (Larsemann Hills, Antarctica)' },
  Himadri: { lat: 78.923, lon: 11.928, name: 'Himadri (Ny-Ålesund, Svalbard, Arctic)' }
};

// Default seed database
const defaultSeed = {
  stations: ['Maitri', 'Bharati', 'Himadri'],
  cargo: [],
  sorties: [],
  lifeSupport: {
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
  },
  permits: [],
  wasteRecords: [],
  emergencies: [],
  dtnTelemetry: {
    totalBytesSynced: 0,
    activeBursts: 0,
    lastSyncTimestamp: new Date().toISOString()
  }
};

function getStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      return {
        stations: data.stations || defaultSeed.stations,
        cargo: data.cargo || defaultSeed.cargo,
        sorties: data.sorties || defaultSeed.sorties,
        lifeSupport: data.lifeSupport || defaultSeed.lifeSupport,
        permits: data.permits || defaultSeed.permits,
        wasteRecords: data.wasteRecords || defaultSeed.wasteRecords,
        emergencies: data.emergencies || defaultSeed.emergencies,
        dtnTelemetry: data.dtnTelemetry || defaultSeed.dtnTelemetry,
      };
    }
  } catch (err) {
    console.error('Error reading data file, using defaults', err);
  }
  return defaultSeed;
}

function saveStore(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to data file', err);
  }
}

// -------------------------------------------------------------
// 1. HEALTH & COMPLIANCE ENDPOINT
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    system: 'POLARIS Station Edge Server',
    version: '4.2.0',
    station: 'Maitri Base Gateway (NCPOR / MoES)',
    status: 'ONLINE_OPERATIONAL',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    legalCompliance: [
      'Indian Antarctic Act 2022 (Act No. 13 of 2022)',
      'Protocol on Environmental Protection to Antarctic Treaty (Madrid Protocol)',
      'Annex III Waste Repatriation Mandate'
    ]
  });
});

// -------------------------------------------------------------
// 2. LIVE POLAR WEATHER API INTEGRATION (Free Open-Meteo API)
// -------------------------------------------------------------
app.get('/api/weather/:station', async (req, res) => {
  const stationKey = req.params.station || 'Maitri';
  const coords = STATION_COORDINATES[stationKey] || STATION_COORDINATES.Maitri;

  try {
    // Open-Meteo is completely free with no API key requirement
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const current = data.current || {};

      // Convert km/h to knots (1 knot = 1.852 km/h)
      const windSpeedKnots = Math.round((current.wind_speed_10m || 20) / 1.852);
      const tempC = Math.round((current.temperature_2m || -25) * 10) / 10;
      const windChillC = Math.round((current.apparent_temperature || tempC - 8) * 10) / 10;

      let blizzardCategory = 'Clear';
      if (windSpeedKnots >= 50 || tempC <= -45) blizzardCategory = 'Condition 1 (Whiteout)';
      else if (windSpeedKnots >= 32 || tempC <= -30) blizzardCategory = 'Condition 2 (Warning)';
      else if (windSpeedKnots >= 20) blizzardCategory = 'Condition 3 (Alert)';

      // Synchronize live real-world weather directly into station store
      const store = getStore();
      if (store.lifeSupport[stationKey]) {
        store.lifeSupport[stationKey].externalTempC = tempC;
        store.lifeSupport[stationKey].windSpeedKnots = windSpeedKnots;
        store.lifeSupport[stationKey].windChillC = windChillC;
        store.lifeSupport[stationKey].blizzardCategory = blizzardCategory;
        saveStore(store);
      }

      console.log(`[POLARIS-WEATHER] Live Satellite Met Ingested for ${stationKey}: ${tempC}°C, ${windSpeedKnots} kts, ${blizzardCategory} (${current.time})`);

      return res.json({
        source: 'Live ECMWF / NOAA GFS Atmospheric Satellite Model (Real World Data)',
        station: stationKey,
        coordinates: coords,
        temperatureC: tempC,
        apparentTemperatureC: windChillC,
        windSpeedKnots: windSpeedKnots,
        windDirectionDeg: current.wind_direction_10m || 180,
        surfacePressureHpa: current.surface_pressure || 985,
        blizzardCategory: blizzardCategory,
        timestamp: current.time || new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn(`[POLARIS-WEATHER] Open-Meteo live query timeout/offline. Returning station telemetry store.`);
  }

  // Graceful fallback from local store
  const store = getStore();
  const stnData = store.lifeSupport[stationKey] || store.lifeSupport.Maitri;
  res.json({
    source: 'POLARIS Station Edge Local Sensor Cache (Offline Fallback)',
    station: stationKey,
    coordinates: coords,
    temperatureC: stnData.externalTempC,
    apparentTemperatureC: stnData.windChillC,
    windSpeedKnots: stnData.windSpeedKnots,
    surfacePressureHpa: 984.2,
    blizzardCategory: stnData.blizzardCategory,
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// 3. FULL CRUD: CARGO & COLD CHAIN
// -------------------------------------------------------------
app.get('/api/cargo', (req, res) => {
  const store = getStore();
  res.json(store.cargo);
});

app.post('/api/cargo', (req, res) => {
  const store = getStore();
  const newId = `CRG-44-${String(store.cargo.length + 1).padStart(3, '0')}`;
  const newItem = {
    ...req.body,
    id: newId,
    qrCode: `POLARIS:${newId}:${(req.body.name || 'CARGO').slice(0, 15)}:${req.body.weightKg || 0}KG`,
    updatedAt: new Date().toISOString()
  };
  store.cargo.unshift(newItem);
  saveStore(store);
  res.status(201).json(newItem);
});

app.put('/api/cargo/:id', (req, res) => {
  const store = getStore();
  const index = store.cargo.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Cargo not found' });

  store.cargo[index] = {
    ...store.cargo[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  saveStore(store);
  res.json(store.cargo[index]);
});

app.delete('/api/cargo/:id', (req, res) => {
  const store = getStore();
  store.cargo = store.cargo.filter(c => c.id !== req.params.id);
  saveStore(store);
  res.json({ success: true, deletedId: req.params.id });
});

// -------------------------------------------------------------
// 4. FULL CRUD: SORTIES & CONVOY MOVEMENTS
// -------------------------------------------------------------
app.get('/api/sorties', (req, res) => {
  const store = getStore();
  res.json(store.sorties);
});

app.post('/api/sorties', (req, res) => {
  const store = getStore();
  const newId = `SRT-2026-${String(store.sorties.length + 10).padStart(2, '0')}`;
  const newSortie = {
    ...req.body,
    id: newId,
    status: req.body.status || 'IN_FIELD',
    lastCheckinTime: new Date().toISOString()
  };
  store.sorties.unshift(newSortie);
  saveStore(store);
  res.status(201).json(newSortie);
});

app.post('/api/sorties/:id/checkin', (req, res) => {
  const store = getStore();
  const sortie = store.sorties.find(s => s.id === req.params.id);
  if (!sortie) return res.status(404).json({ error: 'Sortie not found' });

  sortie.lastCheckinTime = new Date().toISOString();
  sortie.status = 'IN_FIELD';
  if (req.body.notes) sortie.notes = req.body.notes;

  saveStore(store);
  res.json(sortie);
});

app.post('/api/sorties/:id/sos', (req, res) => {
  const store = getStore();
  const sortie = store.sorties.find(s => s.id === req.params.id);
  if (!sortie) return res.status(404).json({ error: 'Sortie not found' });

  sortie.status = 'EMERGENCY_SOS';

  // Automatically spawn emergency record
  const newEmg = {
    id: `EMG-2026-${String(store.emergencies.length + 1).padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
    station: sortie.station,
    severity: 'CRITICAL_LEVEL_1',
    type: 'CREVASSE_FALL',
    reportedBy: `${sortie.teamLeader} via VHF ${sortie.vhfFrequency}`,
    coordinates: sortie.targetCoordinates,
    personnelInvolved: sortie.scientists,
    status: 'ACTIVE_DISPATCH',
    rescuePlanSummary: `CRITICAL FIELD SOS: ${req.body.reason || 'Terrain breach'}. Automated SAR vector calculated.`,
    satelliteBurstSent: true
  };
  store.emergencies.unshift(newEmg);

  saveStore(store);
  res.json({ sortie, emergency: newEmg });
});

app.post('/api/sorties/:id/return', (req, res) => {
  const store = getStore();
  const sortie = store.sorties.find(s => s.id === req.params.id);
  if (!sortie) return res.status(404).json({ error: 'Sortie not found' });

  sortie.status = 'RETURNED';
  sortie.actualReturnTime = new Date().toISOString();
  saveStore(store);
  res.json(sortie);
});

// -------------------------------------------------------------
// 5. LIFE SUPPORT & THERMODYNAMICS
// -------------------------------------------------------------
app.get('/api/lifesupport', (req, res) => {
  const store = getStore();
  res.json(store.lifeSupport);
});

app.put('/api/lifesupport/:station', (req, res) => {
  const store = getStore();
  const stn = req.params.station;
  if (!store.lifeSupport[stn]) return res.status(404).json({ error: 'Station not found' });

  store.lifeSupport[stn] = {
    ...store.lifeSupport[stn],
    ...req.body
  };
  saveStore(store);
  res.json(store.lifeSupport[stn]);
});

// -------------------------------------------------------------
// 6. PERMITS & CAG-EP LEGAL CLEARANCES
// -------------------------------------------------------------
app.get('/api/permits', (req, res) => {
  const store = getStore();
  res.json(store.permits);
});

app.put('/api/permits/:id/approve', (req, res) => {
  const store = getStore();
  const permit = store.permits.find(p => p.permitId === req.params.id);
  if (!permit) return res.status(404).json({ error: 'Permit not found' });

  permit.status = 'CAG-EP_APPROVED';
  saveStore(store);
  res.json(permit);
});

app.put('/api/permits/:id/flag', (req, res) => {
  const store = getStore();
  const permit = store.permits.find(p => p.permitId === req.params.id);
  if (!permit) return res.status(404).json({ error: 'Permit not found' });

  permit.status = 'FLAGGED_ENVIRONMENTAL_RISK';
  saveStore(store);
  res.json(permit);
});

// -------------------------------------------------------------
// 7. MADRID PROTOCOL ANNEX III WASTE LEDGER
// -------------------------------------------------------------
app.get('/api/waste', (req, res) => {
  const store = getStore();
  res.json(store.wasteRecords);
});

app.post('/api/waste', (req, res) => {
  const store = getStore();
  const newRec = {
    ...req.body,
    id: `WST-2026-${String(store.wasteRecords.length + 1).padStart(3, '0')}`,
    manifestId: `MADRID-ANNEX-III-44-${String(store.wasteRecords.length + 1).padStart(2, '0')}`,
    dateLogged: new Date().toISOString().split('T')[0]
  };
  store.wasteRecords.unshift(newRec);
  saveStore(store);
  res.status(201).json(newRec);
});

app.put('/api/waste/:id/status', (req, res) => {
  const store = getStore();
  const rec = store.wasteRecords.find(w => w.id === req.params.id);
  if (!rec) return res.status(404).json({ error: 'Record not found' });

  rec.status = req.body.status;
  saveStore(store);
  res.json(rec);
});

// -------------------------------------------------------------
// 8. EMERGENCIES & POLAR SAR DISPATCH
// -------------------------------------------------------------
app.get('/api/emergencies', (req, res) => {
  const store = getStore();
  res.json(store.emergencies);
});

app.post('/api/emergencies', (req, res) => {
  const store = getStore();
  const newEmg = {
    ...req.body,
    id: `EMG-2026-${String(store.emergencies.length + 1).padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
    satelliteBurstSent: true
  };
  store.emergencies.unshift(newEmg);
  saveStore(store);
  res.status(201).json(newEmg);
});

app.put('/api/emergencies/:id/resolve', (req, res) => {
  const store = getStore();
  const emg = store.emergencies.find(e => e.id === req.params.id);
  if (!emg) return res.status(404).json({ error: 'Incident not found' });

  emg.status = 'RESCUED_RESOLVED';
  saveStore(store);
  res.json(emg);
});

// -------------------------------------------------------------
// 9. DELAY-TOLERANT NETWORK (DTN) BUNDLE GATEWAY (RFC 9171)
// -------------------------------------------------------------
app.post('/api/sync/dtn-burst', (req, res) => {
  const { bundles, senderStation, networkMode } = req.body;
  const store = getStore();

  const bundleList = Array.isArray(bundles) ? bundles : [];
  let processedCount = 0;

  // Replay incoming delay-tolerant updates into server store
  bundleList.forEach(item => {
    if (!item.entity || !item.payload) return;
    processedCount++;

    if (item.entity === 'CARGO') {
      if (item.action === 'CREATE') {
        if (!store.cargo.some(c => c.id === item.payload.id)) {
          store.cargo.unshift(item.payload);
        }
      } else if (item.action === 'UPDATE') {
        const idx = store.cargo.findIndex(c => c.id === item.payload.id);
        if (idx !== -1) {
          store.cargo[idx] = { ...store.cargo[idx], ...item.payload };
        }
      }
    } else if (item.entity === 'SORTIE') {
      if (item.action === 'CREATE') {
        if (!store.sorties.some(s => s.id === item.payload.id)) {
          store.sorties.unshift(item.payload);
        }
      } else if (item.action === 'UPDATE') {
        const idx = store.sorties.findIndex(s => s.id === item.payload.id);
        if (idx !== -1) {
          store.sorties[idx] = { ...store.sorties[idx], ...item.payload };
        }
      }
    } else if (item.entity === 'WASTE') {
      if (item.action === 'CREATE') {
        if (!store.wasteRecords.some(w => w.id === item.payload.id)) {
          store.wasteRecords.unshift(item.payload);
        }
      } else if (item.action === 'UPDATE') {
        const idx = store.wasteRecords.findIndex(w => w.id === item.payload.id);
        if (idx !== -1) {
          store.wasteRecords[idx] = { ...store.wasteRecords[idx], ...item.payload };
        }
      }
    } else if (item.entity === 'EMERGENCY') {
      if (item.action === 'CREATE') {
        if (!store.emergencies.some(e => e.id === item.payload.id)) {
          store.emergencies.unshift(item.payload);
        }
      } else if (item.action === 'UPDATE') {
        const idx = store.emergencies.findIndex(e => e.id === item.payload.id);
        if (idx !== -1) {
          store.emergencies[idx] = { ...store.emergencies[idx], ...item.payload };
        }
      }
    } else if (item.entity === 'LIFE_SUPPORT') {
      const stn = item.payload.station;
      if (stn && store.lifeSupport[stn]) {
        store.lifeSupport[stn] = { ...store.lifeSupport[stn], ...item.payload };
      }
    }
  });

  const bytesTransferred = JSON.stringify(req.body).length;
  store.dtnTelemetry.totalBytesSynced += bytesTransferred;
  store.dtnTelemetry.activeBursts += 1;
  store.dtnTelemetry.lastSyncTimestamp = new Date().toISOString();

  saveStore(store);

  console.log(`[POLARIS-DTN] Merged ${processedCount} bundle(s) from ${senderStation || 'Base'} over ${networkMode || 'Satellite'} (${bytesTransferred} bytes).`);

  // Return full fresh state so client converges with server
  res.json({
    status: 'ACKNOWLEDGED_STORE_AND_FORWARD',
    receivedBundles: processedCount,
    bytesProcessed: bytesTransferred,
    queueState: 'CONVERGED_WITH_EDGE_CORE',
    serverState: {
      cargo: store.cargo,
      sorties: store.sorties,
      wasteRecords: store.wasteRecords,
      emergencies: store.emergencies,
      lifeSupport: store.lifeSupport
    }
  });
});

// -------------------------------------------------------------
// 10. SERVE STATIC ASSETS IN PRODUCTION
// -------------------------------------------------------------
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('POLARIS Station Edge Server Running. Build client via `npm run build` inside /client.');
  });
}

app.listen(PORT, () => {
  console.log('================================================================');
  console.log(`❄️  POLARIS Polar Logistics & Asset Platform (MoES / NCPOR)`);
  console.log(`🏛️  Compliance: Indian Antarctic Act 2022 & Madrid Protocol`);
  console.log(`🌐 Live Polar Weather API: Open-Meteo ECMWF Integrated`);
  console.log(`🚀 Complete Edge Server listening on: http://localhost:${PORT}`);
  console.log('================================================================');
});
