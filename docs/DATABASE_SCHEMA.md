# VanRakshak Database Schema Documentation

VanRakshak uses SQLite as its primary local persistent store, structured to match Firebase Firestore collection semantics 1:1.

---

## 1. Table Specifications

### 1.1 `sensorNodes`
Stores edge node telemetry, hardware attributes, and live battery status.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Unique UUID identifier |
| `nodeId` | TEXT | UNIQUE, NOT NULL | Human-readable node code (e.g., `VR-01`) |
| `name` | TEXT | NOT NULL | Descriptive name (e.g., `Canopy Sentinel Alpha`) |
| `zone` | TEXT | NOT NULL | Fictional demonstration zone (`Zone A`, `Zone B`, `Zone C`) |
| `status` | TEXT | CHECK IN ('online','offline','warning') | Current operational state |
| `batteryPercentage` | INTEGER | CHECK (0 to 100) | Current battery state of charge (%) |
| `solarCharging` | INTEGER | CHECK (0 or 1) | 1 if solar panel is actively delivering charge current |
| `signalStrength` | INTEGER | NOT NULL | LoRa Received Signal Strength Indicator in dBm (RSSI) |
| `firmwareVersion` | TEXT | NOT NULL | Firmware release string (e.g., `1.2.0-esp32s3`) |
| `modelVersion` | TEXT | NOT NULL | Edge TinyML model ID (e.g., `vanrakshak-tinyml-v1.4`) |
| `lastSeenAt` | TEXT | NOT NULL | ISO 8601 timestamp of last telemetry uplink |
| `lastEventType` | TEXT | NULLABLE | Last acoustic event type received from node |
| `createdAt` | TEXT | NOT NULL | Node provisioning timestamp |
| `updatedAt` | TEXT | NOT NULL | Telemetry update timestamp |

---

### 1.2 `alerts`
Stores acoustic anomaly alerts emitted by edge nodes or simulated during demonstrations.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Unique alert ID (e.g., `alert-101`) |
| `nodeId` | TEXT | NOT NULL | Originating edge node ID |
| `eventType` | TEXT | NOT NULL | Classification label (`possible_chainsaw`, `soundscape_anomaly`, `background`) |
| `confidence` | REAL | CHECK (0.0 to 1.0) | Softmax inference probability (displayed as percentage in UI) |
| `timestamp` | TEXT | NOT NULL | Event detection timestamp |
| `zone` | TEXT | NOT NULL | Approximate fictional zone |
| `batteryPercentage` | INTEGER | CHECK (0 to 100) | Node battery percentage at time of alert transmission |
| `sequenceNumber` | INTEGER | NOT NULL | Node LoRa transmission counter |
| `status` | TEXT | CHECK IN ('pending','verified','false_positive','patrol_requested','assigned') | Current human triage status |
| `verificationNote` | TEXT | NULLABLE | Notes recorded by forest ranger during triage |
| `evidenceImageUrl` | TEXT | NULLABLE | URL of optional event-triggered snapshot |
| `createdAt` | TEXT | NOT NULL | Record creation timestamp |
| `updatedAt` | TEXT | NOT NULL | Last status update timestamp |

---

### 1.3 `verificationActions` (Audit Trail)
Immutable ledger recording all human ranger decisions and status changes.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Unique action ID (e.g., `act-1729000`) |
| `alertId` | TEXT | NOT NULL | Associated alert ID |
| `userId` | TEXT | NOT NULL | User ID of the acting ranger or admin |
| `userName` | TEXT | NULLABLE | Human-readable name of the ranger |
| `action` | TEXT | NOT NULL | Action committed (`verified`, `false_positive`, `assign_review`, `request_patrol`) |
| `note` | TEXT | NULLABLE | Mandatory or voluntary explanation for the action |
| `createdAt` | TEXT | NOT NULL | Timestamp of action commitment |

---

### 1.4 `events` (Raw Edge Ingestion Logs)
Stores historical raw telemetry packets received from edge nodes.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Unique event ID |
| `nodeId` | TEXT | NOT NULL | Originating node ID |
| `eventType` | TEXT | NOT NULL | Event classification string |
| `confidence` | REAL | NOT NULL | Inference confidence score |
| `timestamp` | TEXT | NOT NULL | Event timestamp |
| `sequenceNumber` | INTEGER | NOT NULL | LoRa packet sequence number |
| `rawFeatures` | TEXT | NULLABLE | JSON string of DSP features (sub-windows, peak frequency) |
| `createdAt` | TEXT | NOT NULL | Log ingestion timestamp |

---

### 1.5 `systemMetrics`
Aggregate telemetry records for KPI visualization and historical reporting.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Metric date key (e.g., `metric-2026-09-20`) |
| `metricDate` | TEXT | NOT NULL | Date representation |
| `activeNodes` | INTEGER | NOT NULL | Count of online nodes |
| `totalAlerts` | INTEGER | NOT NULL | Total alerts logged on that date |
| `verifiedAlerts` | INTEGER | NOT NULL | Count of alerts verified by rangers |
| `falsePositives` | INTEGER | NOT NULL | Count of alerts marked as false alarms |
| `pendingVerification` | INTEGER | NOT NULL | Count of alerts awaiting decision |
| `packetDeliveryRate` | REAL | NOT NULL | Packet delivery percentage (e.g., 98.6%) |
| `averageAlertLatency` | REAL | NOT NULL | Average uplink latency in seconds |
| `averageBattery` | REAL | NOT NULL | Mean battery percentage across all nodes |

---

### 1.6 `projectSettings`
Key-value configuration store for system parameters and demo modes.

| Field | Type | Description |
|---|---|---|
| `key` | TEXT (PRIMARY KEY) | Setting name (e.g., `demo_mode`, `chainsaw_threshold`, `lora_frequency_mhz`) |
| `value` | TEXT | Stringified value |
| `updatedAt` | TEXT | Timestamp of last modification |

---

### 1.7 `users`
Demo persona directory for role-based authentication.

| Field | Type | Description |
|---|---|---|
| `id` | TEXT (PRIMARY KEY) | User ID (e.g., `user-ranger`) |
| `username` | TEXT (UNIQUE) | Login handle (`ranger`, `admin`, `guest`) |
| `name` | TEXT | Full name (`Ranger Vikram Singh`) |
| `role` | TEXT | Access level (`ranger`, `admin`, `guest`) |
| `email` | TEXT | Official contact email |
| `createdAt` | TEXT | Provisioning date |
