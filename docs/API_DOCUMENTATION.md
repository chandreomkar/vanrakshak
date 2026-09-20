# VanRakshak REST API Documentation

Base URL: `http://localhost:5000/api`

All responses are formatted in JSON.

---

## 1. Authentication Endpoints

### `POST /api/auth/login`
Logs in a user or demo persona.
- **Request Body**:
  ```json
  { "role": "ranger" }
  ```
  *(Supported roles: `"ranger"`, `"admin"`, `"guest"`)*
- **Response `200 OK`**:
  ```json
  {
    "token": "demo_token_user-ranger_1729000000000",
    "user": {
      "id": "user-ranger",
      "username": "ranger",
      "name": "Ranger Vikram Singh",
      "role": "ranger",
      "email": "vikram.singh@forest.gov.in"
    }
  }
  ```

### `GET /api/auth/me`
Retrieves currently authenticated session.
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: User profile object and authentication flag.

### `POST /api/auth/logout`
Terminates current session token.

---

## 2. Sensor Node Endpoints

### `GET /api/nodes`
Lists all registered edge sensor nodes with live status and battery levels.

### `GET /api/nodes/:nodeId`
Fetches detailed telemetry for a single node (e.g., `VR-01`).

### `POST /api/nodes`
Registers a new edge sensor node in the fleet.
- **Request Body**:
  ```json
  {
    "nodeId": "VR-07",
    "name": "Hilltop Boundary Node",
    "zone": "Zone A",
    "status": "online",
    "batteryPercentage": 95,
    "solarCharging": true,
    "signalStrength": -76,
    "firmwareVersion": "1.2.0-esp32s3",
    "modelVersion": "vanrakshak-tinyml-v1.4"
  }
  ```

### `PUT /api/nodes/:nodeId`
Updates telemetry, name, zone, or status of an existing node.

### `DELETE /api/nodes/:nodeId`
Decommissions a node from the registry (requires confirmation).

---

## 3. Alerts & Human Verification Endpoints

### `GET /api/alerts`
Lists acoustic threat alerts.
- **Query Parameters**:
  - `eventType`: `possible_chainsaw` | `soundscape_anomaly` | `all`
  - `zone`: `Zone A` | `Zone B` | `Zone C` | `all`
  - `status`: `pending` | `verified` | `false_positive` | `patrol_requested` | `all`

### `GET /api/alerts/:id`
Returns full alert details including on-device feature summary and audit trail history.

### `PATCH /api/alerts/:id/status`
Ranger verification endpoint. Updates alert status and immutably records the action in `verificationActions`.
- **Request Body**:
  ```json
  {
    "status": "verified",
    "note": "Field patrol team dispatched to Sector A-4. Confirmed fallen timber.",
    "userId": "user-ranger",
    "userName": "Ranger Vikram Singh"
  }
  ```

---

## 4. Verification Action Audit Log

### `GET /api/actions`
Retrieves chronological audit trail of all ranger decisions and status changes.

---

## 5. System Metrics

### `GET /api/metrics`
Returns aggregate KPIs: active nodes, pending alerts, packet delivery rate, average latency, and daily historical trend.

---

## 6. Simulation Endpoints

### `POST /api/simulation/chainsaw-alert`
Generates a synthetic chainsaw detection event:
- Executes 3-window voting simulation.
- Decrements node battery by 1% (transmission cost).
- Emits alert into queue with status `pending`.

### `POST /api/simulation/background-event`
Simulates standard forest acoustic telemetry heartbeat.

---

## 7. Planned Hardware Ingestion Endpoint

### `POST /api/ingest/alert`
Interface for future physical ESP32-S3 + LoRa gateway packet forwarder.
- **Headers**:
  - `Content-Type: application/json`
  - `x-api-key: vr_dev_test_device_key_in865`
- **Request Body**:
  ```json
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
- **Response `201 Created`**:
  ```json
  {
    "status": "accepted",
    "integrationStage": "Planned Hardware Integration Interface",
    "message": "Packet validated and processed through VanRakshak pipeline.",
    "wpcCompliance": {
      "frequencyBand": "IN865 (865.0 - 867.0 MHz)",
      "licenseStatus": "License-exempt under DoT / WPC GSR 564(E)"
    }
  }
  ```
