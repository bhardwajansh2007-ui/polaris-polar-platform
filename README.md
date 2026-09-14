# POLARIS ❄️
### Integrated Polar Expedition Logistics, Asset Management & Safety Suite
**Problem Statement ID:** 26062  
**Organization:** Ministry of Earth Sciences (MoES), Government of India  
**Department:** National Centre for Polar and Ocean Research (NCPOR), Vasco da Gama, Goa  
**Category:** Software | **Theme:** Smart Automation  

---

## 🏛️ Official Legal & Treaty Compliance Framework

POLARIS is strictly architected under the sovereign statutory guidelines of the Government of India and the Antarctic Treaty System:

1. **The Indian Antarctic Act, 2022 (Act No. 13 of 2022 by Parliament of India):**
   * **Mandatory Permit Enforcement:** In compliance with Sections 6, 7, and 8, all expedition personnel, vessels, and scientific activities require validated permits issued by the **Committee on Antarctic Governance and Environmental Protection (CAG-EP)** under MoES before departure.
   * **Prohibited Activities Flagging:** In compliance with Section 13, automated cargo auditing flags prohibited items (non-sterile soil, PCBs, ozone-depleting substances, non-indigenous flora/fauna).
   * **Protected Areas Protection (ASPA):** Enforces Section 16 special endorsements for research in Antarctic Specially Protected Areas (e.g. Schirmacher Oasis fossil beds).

2. **Protocol on Environmental Protection to the Antarctic Treaty (Madrid Protocol 1991):**
   * **Annex III (Waste Disposal & Waste Management):** Implements a tamper-evident digital seal ledger for Categories 1–4 waste drums. 100% of hazardous waste, fuel sludge, plastic, and metal drums are logged for mandatory repatriation back to mainland India aboard chartered icebreakers (*MV Vasiliy Golovnin*).
   * **Zero Open Burning Mandate:** Full audit trail for the Committee for Environmental Protection (CEP).

3. **National Geospatial Guidelines (DST 2021) & NDSAP:**
   * Utilizes compliant polar datasets and coordinate frames for scientific sorties.

---

## 🚀 Key Modules Built

```
POLARIS Platform
 ├── 🗺️ Polar GIS & Sorties (Leaflet Cartography, Crevasse Hazards, VHF Radio Overdue Alarms)
 ├── 📦 Multi-Modal Cargo & Cold-Chain (5-Stage Supply Chain, Thermal Loggers, Optical Barcodes)
 ├── ⚡ Habitat Digital Twin & Winter Simulator (Thermodynamics, GenSets, 240-day Monte Carlo Engine)
 ├── 🛡️ Indian Antarctic Act 2022 Permits (CAG-EP Ministry Approval Portal, Official Dossier Export)
 ├── ♻️ Madrid Protocol Annex III Waste Audit (Zero-Discharge Drum Ledger, Repatriation Stages)
 ├── 🚨 Emergency SAR & Medical Dispatch (Autonomous Rescue Vectors, 32-byte Iridium SBD Bursts)
 └── 🚜 Field Companion & Rugged Tablet HUD (Gloved-hand touch UI, Dead-Reckoning Gyro Compass)
```

---

## 💻 How to Run the Application

### Prerequisites
* Node.js (v18 or higher)
* npm

### Quick Start (Production Server)
From the root project directory `d:\sihhhhh`:

```bash
# 1. Start the Station Edge Server (Serves frontend and API on Port 5000)
npm start
```

Open your browser and navigate to:
👉 **`http://localhost:5000`**

---

### Development Mode (Vite Hot-Reload)
To run frontend with active hot module reloading:

```bash
# Terminal 1: Run Station Edge Backend
npm run dev:server

# Terminal 2: Run Vite Client
npm run dev:client
```
Client will open on `http://localhost:5173` and communicate with edge server on `http://localhost:5000`.

---

## 🏆 How to Present This Solution in SIH (Winning Demo Script)

1. **The Hook:**
   > *"In Antarctica, if logistics software crashes, people don't lose money—scientists freeze in whiteouts. We built POLARIS: a space-grade, offline-first operating system designed under the Indian Antarctic Act 2022 and Madrid Protocol."*

2. **The "Cut-The-Cable" Live Demo:**
   * In the top connectivity bar, toggle from **🟢 Fiber (Goa HQ)** to **🔴 Blizzard Blackout (Offline)**.
   * Add a new cargo crate or check out a scientific field sortie into sector Bravo.
   * Point out the **"DTN Bundles Queued"** badge: records are safely cached in the browser's persistent store.
   * Switch connectivity to **🟡 Iridium SBD** or click **"Flush DTN Queue"**: watch the delayed bundles instantly transmit over simulated satellite channels.

3. **The Monte Carlo Wintering Simulation:**
   * Navigate to the **Winter Digital Twin** tab.
   * Drag the **Winter Days** slider to 260 days and ambient temp to $-55^\circ\text{C}$.
   * Watch the **Over-Wintering Survival Index (OWSI)** dynamically recalculate diesel burn rates and fire life-support conservation directives.

4. **The Crevasse Hazard Bypass & Autonomous SAR:**
   * Go to **Polar GIS & Sorties**; show the active convoy markers on the ice sheet.
   * Click **"Broadcast Emergency SOS"** in the Emergency tab.
   * Click **"Calculate SAR Rescue Vector"**: show the computed azimuth ($164^\circ\text{ SE}$), crevasse bypass route ($28.1\text{ km}$), and raw 32-byte Iridium packet.

---

## 🛠️ Technology Stack
* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Leaflet GIS.
* **Edge Backend:** Node.js, Express, Delay-Tolerant Network Bundle Gateway (RFC 9171).
* **Storage:** Embedded JSON / IndexedDB Local-First Persistence.
