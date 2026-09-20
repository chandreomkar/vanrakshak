# VanRakshak System Architecture

## 1. Overview
VanRakshak (वनरक्षक) is an autonomous, solar-powered acoustic Edge-AI platform engineered to protect remote forest reserves from unauthorized logging. By running machine learning directly on low-power microcontrollers at the canopy edge, it circumvents the primary bottlenecks of existing forest monitoring: absence of high-bandwidth cellular networks and delays in manual ranger foot patrols.

---

## 2. End-to-End System Topology

```
+-------------------------------------------------------------------------------+
|                      REMOTE SENSOR NODE (CANOPY MOUNT)                        |
|                                                                               |
|  [6V 2W Solar Panel] ----> [Solar-Compatible Li-ion Charger] ---> [18650 Li]  |
|                                                                       |       |
|                                                                       v       |
|  [INMP441 I2S Mic] ---> [ESP-DSP 64 Log-Mel] ---> [TinyML int8 CNN on ESP32] |
|                                                              |                |
|                                               (Confidence >= 0.85 x 3)        |
|                                                              v                |
|                                            [SX1262 LoRa Transmitter (IN865)]  |
+-------------------------------------------------------------------------------+
                                       |
                                       | Compact Event Packet (~24-30 Bytes)
                                       | 865.0625 MHz Sub-GHz RF Burst
                                       v
+-------------------------------------------------------------------------------+
|                        BASE STATION / LORA GATEWAY                            |
|                                                                               |
|   [LoRa Concentrator / Receiver] ---> [Packet Forwarder (Cellular / WiFi)]    |
+-------------------------------------------------------------------------------+
                                       |
                                       | HTTPS JSON Uplink
                                       v
+-------------------------------------------------------------------------------+
|                        VANRAKSHAK BACKEND & STORE                             |
|                                                                               |
|   [/api/ingest/alert] ----> [Express REST Engine] ----> [SQLite DB]           |
|                                                                               |
|                     [Synthetic Event Simulation Engine]                       |
+-------------------------------------------------------------------------------+
                                       |
                                       | REST & Telemetry Sync
                                       v
+-------------------------------------------------------------------------------+
|                     FOREST RANGER MONITORING DASHBOARD                        |
|                                                                               |
|  - Live Fictional Zone Grid         - Spectrogram & Waveform Inspection       |
|  - Ranger Verification Audit Trail  - Targeted Ground Patrol Dispatch         |
+-------------------------------------------------------------------------------+
```

---

## 3. Subsystem Breakdown

### 3.1 Edge Node Computing Subsystem
- **Microcontroller**: Espressif ESP32-S3 Dual-Core Xtensa LX7 running at 240 MHz with custom vector instructions for neural network arithmetic acceleration.
- **Microphone**: INMP441 omnidirectional I2S MEMS microphone, 16 kHz sampling rate, 16-bit PCM resolution.
- **Preprocessing Pipeline**: Continuous sliding 1.5-second audio windows processed through a 128-point FFT to yield a 64-band Log-Mel Spectrogram matrix.
- **Inference Runtime**: TensorFlow Lite for Microcontrollers (TFLite Micro) executing an int8-quantized 1D Convolutional Neural Network (~64 KB model weights).
- **Consensus Rule**: Multi-window confirmation requires $\ge 3$ consecutive sliding windows exceeding 0.85 confidence before dispatching a LoRa radio packet.

### 3.2 Power Subsystem
- **Solar Harvesting**: 6V / 2W monocrystalline solar panel angled for canopy gap penetration.
- **Power Management**: Solar-compatible Li-ion charge controller with reverse current protection.
- **Storage**: Single 18650 cylindrical Lithium-ion cell (3.7V nominal, 3000 mAh capacity).
- **Power Budget**:
  - Active audio sampling & inference: ~80 mA for 42 ms.
  - Deep sleep cycle: ~15 $\mu$A between listening windows.
  - LoRa RF transmission burst: ~110 mA for 65 ms.

### 3.3 Wireless Subsystem (India WPC IN865 Band)
- **Carrier Frequency**: 865.0625 MHz (Channel 0).
- **Bandwidth**: 125 kHz.
- **Spreading Factor**: SF7 (maximizes battery life while maintaining multi-kilometer canopy penetration).
- **Regulatory Compliance**: Operates in compliance with Government of India Department of Telecommunications (DoT) Gazette Notification GSR 564(E) for license-exempt sub-GHz wireless equipment (&lt; 1W ERP, &lt; 1% duty cycle).

### 3.4 Data Ingestion & Storage Subsystem
- **Backend Architecture**: Express.js with TypeScript and modular architecture.
- **Primary Database**: SQLite (via `better-sqlite3`) utilizing Write-Ahead Logging (WAL) for persistent, local storage.
- **Planned Hardware Ingestion**: Endpoint `/api/ingest/alert` accepts standard device packets authenticated via token headers.

### 3.5 Monitoring & Decision Support Subsystem
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, and Lucide React.
- **Human-in-the-Loop Verification**: Every AI alert is explicitly treated as a decision-support indicator. Ground action requires human ranger sign-off, which is immutably logged to `verificationActions`.
