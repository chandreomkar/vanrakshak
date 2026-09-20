# VanRakshak (वनरक्षक) 🌲
### Solar-Powered Acoustic Edge-AI for Forest Protection

> **Hackathon Theme**: AI for Climate Change  
> **Track**: Biodiversity Monitoring / Climate Awareness  
> **Status**: Full-Stack Prototype Demonstration

---

> [!IMPORTANT]
> **PROTOTYPE HONESTY NOTICE**:  
> VanRakshak is a prototype demonstration platform. All current sensor telemetry, audio classifications, and alerts are simulated for demonstration purposes. No live forest sensor nodes are connected unless physical hardware is explicitly configured.  
> 
> The platform strictly uses decision-support terminology:
> - *“Possible chainsaw activity”*
> - *“AI-generated alert requiring human verification”*
> - *“Simulated prototype data”*
> - *“Approximate zone”*
> - *“Planned hardware integration”*

---

## 1. What is VanRakshak?

VanRakshak is an open-source, climate-tech prototype demonstrating how autonomous, solar-powered acoustic Edge-AI sensor nodes mounted in remote forest canopies can detect illegal chainsaw activity in real-time.

By running quantized **TensorFlow Lite Micro** models directly on low-power **ESP32-S3** microcontrollers, the sensor nodes classify acoustic windows locally. When suspicious activity is confirmed across multiple windows, the node transmits a **Compact Event Packet** over sub-GHz **LoRa (India WPC IN865 Band)** to a base gateway. 

**Key Philosophy**: Raw audio is never streamed or uploaded, preserving wildlife acoustic privacy, preventing cellular bandwidth dependence, and operating indefinitely on small solar-assisted rechargeable batteries.

---

## 2. System Architecture

```
+-------------------+      Sliding 1.5s Audio      +-----------------------+
|  INMP441 I2S Mic  | ---------------------------> |  ESP-DSP 64 Log-Mel   |
+-------------------+                              +-----------------------+
                                                               |
                                                               v
+-------------------+     Compact Event Packet     +-----------------------+
| SX1262 LoRa (IN865)| <-------------------------- | TFLite Micro on ESP32 |
+-------------------+    (Consensus Conf >= 0.85)  +-----------------------+
          |
          | Sub-GHz RF Burst (865.0625 MHz)
          v
+-------------------+      HTTPS JSON Uplink       +-----------------------+
| LoRa Gateway Base | ---------------------------> |  Express REST Backend |
+-------------------+                              +-----------------------+
                                                               |
                                                               v
                                                   +-----------------------+
                                                   | SQLite Database Store |
                                                   +-----------------------+
                                                               |
                                                               v
                                                   +-----------------------+
                                                   | Ranger Dashboard (UI) |
                                                   +-----------------------+
```

---

## 3. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, React Router v6.
- **Backend**: Node.js, Express.js REST API with TypeScript (`tsx`).
- **Database**: SQLite (via `better-sqlite3` in WAL mode) with persistent storage and Firestore collection parity.
- **Edge Microcontroller Spec**: Espressif ESP32-S3 Dual-Core Xtensa LX7 (240MHz) with vector AI instructions.
- **Embedded DSP & ML**: 16kHz I2S audio, 64-band Log-Mel Spectrograms, int8 1D-CNN (~64 KB).
- **Wireless Telemetry**: Semtech SX1262 LoRa, India IN865 (865–867 MHz, DoT GSR 564(E) license-exempt).

---

## 4. Folder Structure

```
vanrakshak/
├── package.json                 # Project orchestration & scripts
├── tsconfig.json                # TypeScript compiler config
├── tailwind.config.js           # Environmental palette (#174A35, #2A9D8F, etc.)
├── vite.config.ts               # Vite bundler config with API proxy
├── .env.example                 # Environment variables template
├── public/                      # Static assets & SVG icons
├── src/                         # React Frontend Application
│   ├── App.tsx                  # App routing, layout & persistent demo badge
│   ├── types/                   # TypeScript interfaces (SensorNode, Alert, etc.)
│   ├── context/                 # AuthContext (1-click demo role switching)
│   ├── services/api.ts          # Client API service
│   ├── components/
│   │   ├── common/              # Navbar, Sidebar, DemoBadge, StatCard, Modal
│   │   ├── dashboard/           # ZoneGridMap, SystemHealth, SimulationModal
│   │   ├── alerts/              # AlertTable, VerificationModal
│   │   ├── nodes/               # NodeCard, NodeModal
│   │   └── audio/               # WaveformViewer, SpectrogramViewer
│   └── pages/                   # 8 Complete Dashboard Pages
├── server/                      # Express REST Backend API
│   ├── index.ts                 # Server entrypoint & middleware
│   ├── db.ts                    # SQLite database schema initialization & seeding
│   └── routes/                  # Modular REST routers (nodes, alerts, simulation, ingest)
├── tests/                       # Automated QA test suites
│   ├── runAllTests.ts           # Core assertion suite (payloads, DB, WPC rules)
│   └── testApiEndpoints.ts      # HTTP REST integration tests
└── docs/                        # Complete technical documentation suite
    ├── ARCHITECTURE.md          # Hardware, energy & RF topology
    ├── DATABASE_SCHEMA.md       # Tables, field types & constraints
    ├── API_DOCUMENTATION.md     # REST endpoint specs & sample JSON
    ├── LOCAL_SETUP.md           # Step-by-step developer guide
    ├── FIREBASE_SETUP.md        # Optional Firestore / Auth migration
    ├── DEPLOYMENT.md            # Production deployment (Render, Vercel, Docker)
    ├── DEMO_MODE.md             # Simulation workflow & honesty protocol
    ├── HARDWARE_INTEGRATION.md  # ESP32-S3 pinouts, LoRa packet struct & WPC rules
    ├── TESTING_REPORT.md        # 15/15 automated test logs & coverage
    ├── KNOWN_LIMITATIONS.md     # Environmental, battery & acoustic boundaries
    └── TROUBLESHOOTING.md       # Common setup resolutions
```

---

## 5. Quick Start (Run Locally)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Start Both Frontend & Backend
```bash
npm start
```
- **Frontend Dashboard**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000/api`

### 4. Run Automated QA Tests
```bash
npm test
```
*Executes all 15 automated test assertions.*

---

## 6. Demo Personas & Evaluator Walkthrough

Use the role switcher in the top-right corner to test different personas:
- **Forest Ranger (Vikram Singh)**: Triage incoming alerts, review acoustic spectrograms, and commit human verification decisions.
- **Division Admin (Anita Roy)**: Register new edge nodes, adjust detection thresholds, and decommission nodes.
- **Hackathon Guest Evaluator**: Safe read-only exploratory mode.

To trigger an alert: Click **“Simulate Chainsaw Alert”** in the header.

---

## 7. Connecting Future Hardware (Planned Ingestion)

When physical ESP32-S3 / LoRa gateway forwarders are ready, they POST compact JSON telemetry to:

```http
POST /api/ingest/alert
x-api-key: vr_dev_test_device_key_in865
Content-Type: application/json

{
  "nodeId": "VR-01",
  "eventType": "possible_chainsaw",
  "confidence": 0.92,
  "timestamp": "2026-10-24T14:32:10+05:30",
  "batteryPercentage": 78,
  "sequenceNumber": 104,
  "zone": "Zone A"
}
```

See [docs/HARDWARE_INTEGRATION.md](file:///c:/Users/Omkar/.vscode/vanrakshak/docs/HARDWARE_INTEGRATION.md) for full C++ firmware struct and wiring schematics.

---

## 8. License
VanRakshak is released under the **MIT License**. Created for climate and biodiversity awareness.
