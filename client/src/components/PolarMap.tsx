import React, { useEffect, useRef, useState } from 'react';
import { usePolaris } from '../context/PolarisContext';
import L from 'leaflet';
import { 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Radio, 
  Truck, 
  ShieldAlert, 
  Plus, 
  MapPin, 
  Activity,
  Layers
} from 'lucide-react';
import type { Sortie } from '../types';

export const PolarMap: React.FC = () => {
  const { station, sorties, createSortie, checkinSortie, triggerSortieEmergency, completeSortie } = usePolaris();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const [showNewSortieModal, setShowNewSortieModal] = useState(false);
  const [activeSortieDetail, setActiveSortieDetail] = useState<Sortie | null>(null);

  // New Sortie Form State
  const [missionName, setMissionName] = useState('');
  const [teamLeader, setTeamLeader] = useState('');
  const [scientists, setScientists] = useState('');
  const [vehicle, setVehicle] = useState<Sortie['vehicle']>('PistenBully 300 Polar');
  const [purpose, setPurpose] = useState<Sortie['purpose']>('Glaciological Coring');
  const [durationHours, setDurationHours] = useState(6);
  const [vhfFrequency, setVhfFrequency] = useState('143.850 MHz (Ch 04)');
  const [targetZone, setTargetZone] = useState('');
  const [rationsDays, setRationsDays] = useState(7);

  // Initialize Map
  const [activeMapLayer, setActiveMapLayer] = useState<'dark' | 'satellite' | 'osm'>('dark');
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [liveWeather, setLiveWeather] = useState<{
    temperatureC: number;
    windSpeedKnots: number;
    apparentTemperatureC: number;
    blizzardCategory: string;
    source: string;
  } | null>(null);

  // Fetch live weather from backend endpoint
  useEffect(() => {
    fetch(`/api/weather/${station}`)
      .then(res => res.json())
      .then(data => setLiveWeather(data))
      .catch(() => {
        // graceful offline fallback
      });
  }, [station]);

  // Map Tile URLs (All 100% Free, No API Key Required)
  // Map Tile URLs (All 100% Free, Zero API Key Required)
  const TILE_CONFIGS: Record<'dark' | 'satellite' | 'osm', { url: string; subdomains?: string; attrib: string }> = {
    dark: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      subdomains: '',
      attrib: '&copy; Esri World Dark Gray &copy; SCAR Antarctic Digital Database'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      subdomains: '',
      attrib: '&copy; Esri World Imagery &copy; Polar Reconnaissance'
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: 'abc',
      attrib: '&copy; OpenStreetMap contributors'
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-70.766, 11.733],
        zoom: 7,
        minZoom: 3,
        maxZoom: 14,
        zoomControl: true,
      });

      const initialTile = L.tileLayer(TILE_CONFIGS.dark.url, {
        attribution: TILE_CONFIGS.dark.attrib,
        subdomains: TILE_CONFIGS.dark.subdomains || 'abc',
        maxZoom: 18,
      }).addTo(map);

      tileLayerRef.current = initialTile;
      const markers = L.layerGroup().addTo(map);
      markersRef.current = markers;
      mapInstanceRef.current = map;
    }
  }, []);

  // Switch Tile Layer when activeMapLayer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const cfg = TILE_CONFIGS[activeMapLayer];
    const newTile = L.tileLayer(cfg.url, {
      attribution: cfg.attrib,
      subdomains: cfg.subdomains || 'abc',
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = newTile;
  }, [activeMapLayer]);

  // Update map center and markers when station or sorties change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markers = markersRef.current;
    if (!map || !markers) return;

    markers.clearLayers();

    // Determine center based on selected station
    let centerLat = -70.766;
    let centerLng = 11.733;

    if (station === 'Bharati') {
      centerLat = -69.400;
      centerLng = 76.183;
    } else if (station === 'Himadri') {
      centerLat = 78.923;
      centerLng = 11.928;
    }

    map.setView([centerLat, centerLng], station === 'Himadri' ? 8 : 7, { animate: true });

    // Station Base Icon
    const stationIcon = L.divIcon({
      className: 'custom-station-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-cyan-600/30 border-2 border-cyan-400 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-cyan-500/50">
            ★
          </div>
          <div class="absolute -bottom-5 text-[11px] font-bold text-cyan-300 whitespace-nowrap bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-500/40">
            ${station} Station
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([centerLat, centerLng], { icon: stationIcon })
      .bindPopup(`<div class="text-slate-900 font-sans p-1"><b>${station} Main Base</b><br/>Operational Command Centre</div>`)
      .addTo(markers);

    // If Antarctica, draw Ice Shelf Depot and Supply Route
    if (station === 'Maitri') {
      const shelfLat = -70.00;
      const shelfLng = 11.90;

      const shelfIcon = L.divIcon({
        className: 'custom-shelf-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-6 h-6 rounded bg-amber-600/40 border border-amber-400 flex items-center justify-center text-white text-[10px] font-bold">
              ⚓
            </div>
            <div class="absolute -bottom-5 text-[10px] font-semibold text-amber-300 whitespace-nowrap bg-slate-900/90 px-1.5 py-0.5 rounded border border-amber-500/40">
              India Bay Shelf Depot
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([shelfLat, shelfLng], { icon: shelfIcon })
        .bindPopup(`<div class="text-slate-900 font-sans"><b>India Bay Ice Shelf</b><br/>Primary Sea-Ice Mooring Point</div>`)
        .addTo(markers);

      // Safe Route Corridor Polyline
      const routePoints: [number, number][] = [
        [shelfLat, shelfLng],
        [-70.35, 11.82],
        [-70.58, 11.78],
        [centerLat, centerLng]
      ];

      L.polyline(routePoints, {
        color: '#06b6d4',
        weight: 3,
        dashArray: '6, 8',
        opacity: 0.8
      }).bindTooltip('Safe PistenBully Convoy Route Bravo (Verified Blue-Ice Corridor)').addTo(markers);

      // Hazard: Crevasse Field Polygon
      const crevasseCoords: [number, number][] = [
        [-70.40, 11.30],
        [-70.45, 11.60],
        [-70.52, 11.45],
        [-70.48, 11.20],
      ];

      L.polygon(crevasseCoords, {
        color: '#f43f5e',
        fillColor: '#e11d48',
        fillOpacity: 0.25,
        weight: 1.5,
      }).bindTooltip('CRITICAL HAZARD: Active Shear Zone & Hidden Crevasse Field').addTo(markers);

      // ASPA Protected Area Circle
      L.circle([-70.78, 11.60], {
        radius: 4000,
        color: '#a855f7',
        fillColor: '#9333ea',
        fillOpacity: 0.15,
        weight: 1,
      }).bindTooltip('ASPA No. 163 (Schirmacher Oasis Specimen Protection Zone - Permit Mandatory)').addTo(markers);
    }

    // Render Active Sorties for this station
    sorties
      .filter(s => s.station === station && (s.status === 'IN_FIELD' || s.status === 'OVERDUE' || s.status === 'EMERGENCY_SOS'))
      .forEach(sortie => {
        const isEmergency = sortie.status === 'EMERGENCY_SOS';
        const isOverdue = sortie.status === 'OVERDUE';

        const sortieIcon = L.divIcon({
          className: 'sortie-pin',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer">
              <div class="w-7 h-7 rounded-full ${
                isEmergency ? 'bg-rose-600 animate-ping' :
                isOverdue ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600'
              } flex items-center justify-center text-white text-xs shadow-lg border-2 border-white">
                ${isEmergency ? 'SOS' : '🚜'}
              </div>
              <div class="absolute -bottom-5 text-[10px] font-bold ${
                isEmergency ? 'text-rose-300' : isOverdue ? 'text-amber-300' : 'text-emerald-300'
              } whitespace-nowrap bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                ${sortie.missionName.slice(0, 18)}...
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([sortie.targetCoordinates.lat, sortie.targetCoordinates.lng], { icon: sortieIcon });
        marker.on('click', () => setActiveSortieDetail(sortie));
        marker.addTo(markers);
      });

  }, [station, sorties]);

  const handleLaunchSortie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionName || !teamLeader) return;

    const dep = new Date();
    const exp = new Date(Date.now() + durationHours * 3600000);

    // Coordinates slight offset from station for demonstration
    let baseLat = -70.766;
    let baseLng = 11.733;
    if (station === 'Bharati') {
      baseLat = -69.400;
      baseLng = 76.183;
    } else if (station === 'Himadri') {
      baseLat = 78.923;
      baseLng = 11.928;
    }

    createSortie({
      missionName,
      station,
      teamLeader,
      scientists: scientists.split(',').map(s => s.trim()).filter(Boolean),
      vehicle,
      purpose,
      departureTime: dep.toISOString(),
      expectedReturnTime: exp.toISOString(),
      vhfFrequency,
      targetCoordinates: {
        lat: baseLat + (Math.random() - 0.5) * 0.4,
        lng: baseLng + (Math.random() - 0.5) * 0.6,
        elevationM: Math.floor(Math.random() * 800) + 100,
        zoneName: targetZone || 'Polar Research Sector',
      },
      survivalRationsDays: rationsDays,
      emergencyBeaconId: `EPIRB-${station.toUpperCase()}-${Math.floor(Math.random() * 900) + 100}`,
      notes: `Registered under CAG-EP permit guidelines. VHF checked on ${vhfFrequency}.`,
    });

    setShowNewSortieModal(false);
    setMissionName('');
    setTeamLeader('');
    setScientists('');
  };

  return (
    <div className="space-y-4">
      {/* Map Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-ice-card p-3 rounded-xl border border-ice-border">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            Polar GIS & Field Sortie Command Center ({station})
          </h2>
          <p className="text-xs text-slate-400">
            Real-time convoy tracking, crevasse hazard layers, and automated overdue radio alarms
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Live Open-Meteo Atmospheric Weather Badge */}
          {liveWeather && (
            <div className="bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-400">Live Polar Met:</span>
              <span className="text-cyan-300 font-bold font-mono">{liveWeather.temperatureC}°C</span>
              <span className="text-sky-300 font-mono">({liveWeather.windSpeedKnots} kts)</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">
                Open-Meteo ECMWF
              </span>
            </div>
          )}

          {/* Free Map Tile Layer Selector */}
          <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 p-1 text-xs">
            <span className="text-slate-400 px-2 font-medium">Layer:</span>
            <button
              onClick={() => setActiveMapLayer('dark')}
              className={`px-2 py-1 rounded font-semibold transition-all ${
                activeMapLayer === 'dark' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tactical Dark
            </button>
            <button
              onClick={() => setActiveMapLayer('satellite')}
              className={`px-2 py-1 rounded font-semibold transition-all ${
                activeMapLayer === 'satellite' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setActiveMapLayer('osm')}
              className={`px-2 py-1 rounded font-semibold transition-all ${
                activeMapLayer === 'osm' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              OSM
            </button>
          </div>

          <button
            onClick={() => setShowNewSortieModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg shadow-cyan-600/20 border border-cyan-400/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Check-out New Sortie
          </button>
        </div>
      </div>

      {/* Main Map Box */}
      <div className="relative rounded-xl overflow-hidden border border-cyan-900/60 shadow-2xl bg-[#060c1c]">
        {/* Tactical Coordinates & Sensor HUD (Top-Left) */}
        <div className="absolute top-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/80 text-[11px] font-mono shadow-xl space-y-1 pointer-events-none">
          <div className="text-cyan-400 font-bold flex items-center gap-1.5 border-b border-slate-700 pb-1">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>GEO-RADAR TRACKING HUD</span>
          </div>
          <div className="text-slate-300">
            BASE: <span className="text-white font-bold">{station.toUpperCase()}</span> ({station === 'Maitri' ? '70.766°S 11.733°E' : station === 'Bharati' ? '69.400°S 76.183°E' : '78.923°N 11.928°E'})
          </div>
          <div className="text-slate-400">
            MAG-VAR: <span className="text-amber-300">{station === 'Maitri' ? '-22.4°W' : station === 'Bharati' ? '-64.1°W' : '+8.2°E'}</span> • ELEV: <span className="text-white">{station === 'Maitri' ? '117m' : station === 'Bharati' ? '35m' : '15m'}</span>
          </div>
          <div className="text-slate-400 flex items-center gap-1.5">
            STATUS: <span className="text-emerald-400 font-bold">VHF CH-04 GUARD ACTIVE</span>
          </div>
        </div>

        {/* Leaflet Container */}
        <div ref={mapContainerRef} className="h-[480px] w-full z-10" />

        {/* Floating Map Legend */}
        <div className="absolute top-3 right-3 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-700/80 text-xs space-y-1.5 shadow-xl">
          <div className="font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-700 pb-1 text-[11px]">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Operational Overlays
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Station Base
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Active Sortie (Normal)
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span> Radio Overdue Alert
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span> Critical SOS Beacon
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="w-3.5 h-1.5 bg-rose-500/40 border border-rose-400"></span> Crevasse Hazard Field
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="w-3.5 h-1.5 bg-purple-500/30 border border-purple-400"></span> ASPA Protected Zone
          </div>
        </div>
      </div>

      {/* Active Sorties Safety Board */}
      <div className="bg-ice-card rounded-xl border border-ice-border p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Active Field Sortie Roster ({station} Sector)
            </h3>
            <p className="text-[11px] text-slate-400">
              Autonomous 120-minute radio check-in watchdog & deadman alert tracking
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800">
              {sorties.filter(s => s.station === station).length} Active Missions
            </span>
          </div>
        </div>

        {sorties.filter(s => s.station === station).length === 0 ? (
          /* Standby Convoy Readiness Panel */
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-6 text-center space-y-4">
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-cyan-950/60 border border-cyan-700/40 flex items-center justify-center text-cyan-400">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-wide uppercase">
                All Field Convoys In Station Hangar Standby
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No sorties currently deployed into the {station} polar sector. Station vehicles are moored in the heated vehicular bunker with VHF Guard (143.850 MHz) listening continuously.
              </p>
            </div>

            {/* Readiness Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-2xl mx-auto text-left text-xs">
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Heavy Traverse Unit</div>
                <div className="font-semibold text-white mt-0.5">PistenBully 300 Polar</div>
                <div className="text-emerald-400 text-[10px] font-mono mt-1">✓ Pre-Heated & Fueled</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Scout / Science Unit</div>
                <div className="font-semibold text-white mt-0.5">Snowmobile Lynx 800</div>
                <div className="text-emerald-400 text-[10px] font-mono mt-1">✓ Survival Kit Loaded</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Radio Deadman Watch</div>
                <div className="font-semibold text-white mt-0.5">143.850 MHz (Ch 04)</div>
                <div className="text-cyan-400 text-[10px] font-mono mt-1">✓ 120-min Auto-Timer</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowNewSortieModal(true)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Check-out New Sortie Manifest
              </button>
              <button
                onClick={() => {
                  const baseLat = station === 'Maitri' ? -70.766 : station === 'Bharati' ? -69.400 : 78.923;
                  const baseLng = station === 'Maitri' ? 11.733 : station === 'Bharati' ? 76.183 : 11.928;
                  createSortie({
                    missionName: station === 'Maitri' 
                      ? 'Wohlthat Mountains Ice-Core Coring Traverse' 
                      : station === 'Bharati' 
                      ? 'Larsemann Hills Coastal Limnology Reconnaissance' 
                      : 'Kongsfjorden Glacier Aerosol Monitoring',
                    station,
                    teamLeader: station === 'Maitri' ? 'Dr. A. Sharma (GSI)' : station === 'Bharati' ? 'Dr. P. Sen (NCPOR)' : 'Dr. S. Nair (MoES)',
                    scientists: ['Dr. V. Singh (WIHG)', 'R. Ghosh (NCPOR)'],
                    vehicle: 'PistenBully 300 Polar',
                    purpose: 'Glaciological Coring',
                    departureTime: new Date().toISOString(),
                    expectedReturnTime: new Date(Date.now() + 6 * 3600000).toISOString(),
                    vhfFrequency: '143.850 MHz (Ch 04)',
                    targetCoordinates: {
                      lat: baseLat + 0.15,
                      lng: baseLng + 0.22,
                      elevationM: 320,
                      zoneName: station === 'Maitri' ? 'Wohlthat Nunatak Sector B' : 'Larsemann Ridge Core-Site',
                    },
                    survivalRationsDays: 7,
                    emergencyBeaconId: `EPIRB-${station.toUpperCase()}-702`,
                    notes: 'Authorized under CAG-EP Permit. VHF safety check verified.',
                  });
                }}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold px-4 py-2 rounded-lg border border-cyan-500/40 transition-all flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" /> 1-Click Launch Standard Expedition Traverse
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sorties
              .filter(s => s.station === station)
            .map(sortie => {
              const isOverdue = sortie.status === 'OVERDUE';
              const isSOS = sortie.status === 'EMERGENCY_SOS';
              const isReturned = sortie.status === 'RETURNED';

              return (
                <div
                  key={sortie.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isSOS
                      ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-950/50'
                      : isOverdue
                      ? 'bg-amber-950/30 border-amber-500/60'
                      : isReturned
                      ? 'bg-slate-900/40 border-slate-800 opacity-60'
                      : 'bg-slate-900/80 border-slate-700/80 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{sortie.id}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isSOS
                          ? 'bg-rose-500 text-white animate-pulse'
                          : isOverdue
                          ? 'bg-amber-500 text-slate-900'
                          : isReturned
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {sortie.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{sortie.missionName}</h4>
                  
                  <div className="text-xs space-y-1 text-slate-300 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{sortie.vehicle}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>{sortie.targetCoordinates.zoneName} ({sortie.targetCoordinates.elevationM}m)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-amber-400" />
                      <span>VHF: {sortie.vhfFrequency}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>Rations: {sortie.survivalRationsDays} days | Lead: {sortie.teamLeader}</span>
                    </div>
                  </div>

                  {/* Actions according to status */}
                  {!isReturned && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
                      <button
                        onClick={() => checkinSortie(sortie.id, 'Routine radio checkin. Field crew secure.')}
                        className="flex-1 bg-cyan-900/50 hover:bg-cyan-800 text-cyan-200 py-1.5 px-2 rounded border border-cyan-700/50 text-center font-medium transition-colors"
                      >
                        Radio Check-In
                      </button>

                      <button
                        onClick={() => completeSortie(sortie.id)}
                        className="bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 py-1.5 px-2 rounded border border-emerald-700/50 font-medium transition-colors"
                        title="Returned to Station Airlock"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      {!isSOS && (
                        <button
                          onClick={() => triggerSortieEmergency(sortie.id, 'Convoy vehicle stranded in whiteout / crevassed terrain')}
                          className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 py-1.5 px-2 rounded border border-rose-700/50 font-medium transition-colors"
                          title="Trigger Emergency SOS"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Sortie Checkout Modal */}
      {showNewSortieModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e172e] border border-cyan-500/40 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                Sortie Check-Out Procedure ({station})
              </h3>
              <button
                onClick={() => setShowNewSortieModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLaunchSortie} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Mission / Sortie Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Wohlthat Mountains Blue-Ice Survey"
                  value={missionName}
                  onChange={e => setMissionName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Team Leader</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dr. A. Sharma (GSI)"
                    value={teamLeader}
                    onChange={e => setTeamLeader(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Vehicle Assignment</label>
                  <select
                    value={vehicle}
                    onChange={e => setVehicle(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="PistenBully 300 Polar">PistenBully 300 Polar</option>
                    <option value="Snowmobile Lynx">Snowmobile Lynx</option>
                    <option value="Heli Bell-412">Heli Bell-412</option>
                    <option value="Ski-Doo Alpine">Ski-Doo Alpine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Accompanying Scientists (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Dr. V. Singh, R. Ghosh, K. Patel"
                  value={scientists}
                  onChange={e => setScientists(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Purpose / Scientific Field</label>
                  <select
                    value={purpose}
                    onChange={e => setPurpose(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Glaciological Coring">Glaciological Coring</option>
                    <option value="Atmospheric Radiosonde">Atmospheric Radiosonde</option>
                    <option value="Crevasse Survey">Crevasse Survey</option>
                    <option value="Fuel Depot Cache Check">Fuel Depot Cache Check</option>
                    <option value="Emergency SAR">Emergency SAR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Expected Duration (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="72"
                    value={durationHours}
                    onChange={e => setDurationHours(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assigned VHF Channel</label>
                  <input
                    type="text"
                    value={vhfFrequency}
                    onChange={e => setVhfFrequency(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Survival Rations (Days)</label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={rationsDays}
                    onChange={e => setRationsDays(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Sector / Waypoint Name</label>
                <input
                  type="text"
                  value={targetZone}
                  onChange={e => setTargetZone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="bg-amber-950/40 border border-amber-600/40 p-2.5 rounded text-amber-300 text-[11px] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>
                  Safety Confirmation: Crew has completed cold-weather survival drill, registered EPIRB beacon, and verified crevasse hazard corridors.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowNewSortieModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-600/30"
                >
                  Confirm & Dispatch Sortie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Sortie Map Click Detail Modal */}
      {activeSortieDetail && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e172e] border border-cyan-500/40 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="font-mono font-bold text-cyan-400">{activeSortieDetail.id}</span>
              <button onClick={() => setActiveSortieDetail(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <h3 className="text-sm font-bold text-white">{activeSortieDetail.missionName}</h3>
            <div className="space-y-1 text-slate-300">
              <div>Team Leader: <strong>{activeSortieDetail.teamLeader}</strong></div>
              <div>Assigned Vehicle: <strong>{activeSortieDetail.vehicle}</strong></div>
              <div>VHF Radio: <strong className="text-cyan-300 font-mono">{activeSortieDetail.vhfFrequency}</strong></div>
              <div>Coordinates: <strong>{activeSortieDetail.targetCoordinates.lat.toFixed(3)}° S, {activeSortieDetail.targetCoordinates.lng.toFixed(3)}° E</strong></div>
              <div>Sector: <strong>{activeSortieDetail.targetCoordinates.zoneName}</strong></div>
              <div>Survival Rations: <strong>{activeSortieDetail.survivalRationsDays} Days</strong></div>
              {activeSortieDetail.notes && (
                <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px] text-slate-400 mt-2">
                  {activeSortieDetail.notes}
                </div>
              )}
            </div>
            <button
              onClick={() => setActiveSortieDetail(null)}
              className="w-full mt-2 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded"
            >
              Close Sector Telemetry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
