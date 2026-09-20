# Planned Hardware Integration & Embedded Firmware Specification

This document specifies the planned hardware schematics, pinouts, and embedded firmware protocol for connecting physical ESP32-S3 sensor nodes to VanRakshak.

> [!NOTE]
> **Status**: Planned Hardware Integration Interface.
> The backend endpoint `POST /api/ingest/alert` is fully implemented and tested.

---

## 1. Bill of Materials (Per Node Estimate)

| Component | Specification | Purpose |
|---|---|---|
| **MCU** | ESP32-S3-WROOM-1 (N8R8) | Dual-core 240MHz, 8MB Flash, 8MB PSRAM, vector AI acceleration |
| **Microphone** | INMP441 MEMS Microphone | I2S digital output, omnidirectional, 16kHz sampling rate |
| **Radio** | Semtech SX1262 LoRa Transceiver | Sub-GHz RF module (India IN865 band: 865–867 MHz) |
| **Solar Panel** | 6V / 2W Monocrystalline | Canopy solar energy harvesting |
| **Charge Controller** | Solar-compatible Li-ion charge controller | MPPT / solar charge management & Li-ion over-discharge cut-off |
| **Battery** | 18650 Protected Li-ion (3.7V 3000mAh) | Autonomous night-time & rainy-day energy storage |
| **Antenna** | 868MHz 3dBi Omni Fiberglass Antenna | Long-range canopy RF propagation |

---

## 2. Hardware Wiring Pinout (ESP32-S3)

### INMP441 I2S Microphone Pinout:
- `SCK` (Serial Clock) $\rightarrow$ `GPIO 14`
- `WS` (Word Select / LRCLK) $\rightarrow$ `GPIO 15`
- `SD` (Serial Data) $\rightarrow$ `GPIO 32`
- `L/R` $\rightarrow$ `GND` (Left channel audio)
- `VDD` $\rightarrow$ `3.3V`
- `GND` $\rightarrow$ `GND`

### SX1262 LoRa Transceiver Pinout:
- `NSS / CS` $\rightarrow$ `GPIO 5`
- `SCK` $\rightarrow$ `GPIO 18`
- `MOSI` $\rightarrow$ `GPIO 23`
- `MISO` $\rightarrow$ `GPIO 19`
- `RST` $\rightarrow$ `GPIO 27`
- `BUSY` $\rightarrow$ `GPIO 33`
- `DIO1` $\rightarrow$ `GPIO 34`

---

## 3. Compact LoRa Event Packet Specification

To comply with the 1% duty cycle limit under India WPC GSR 564(E), nodes transmit a **Compact Event Packet** (~24 to 30 bytes) rather than streaming raw audio:

```c
// Compact binary payload struct (packed)
typedef struct __attribute__((__packed__)) {
    uint8_t  header;           // 0xAA (VanRakshak Sync Byte)
    char     nodeId[6];        // e.g. "VR-01\0"
    uint8_t  eventType;        // 0x01: Chainsaw, 0x02: Anomaly, 0x03: Background
    uint16_t confidenceScaled; // Confidence * 10000 (e.g. 9200 = 92.00%)
    uint8_t  batteryPct;       // 0 to 100
    uint32_t sequenceNumber;   // Rolling packet counter
    uint32_t epochTimestamp;   // Unix epoch seconds
    uint8_t  zoneId;           // 0x01: Zone A, 0x02: Zone B, 0x03: Zone C
    uint16_t checksum;         // CRC-16-CCITT
} VanRakshakPacket;
```

---

## 4. India WPC Regulatory Rules (IN865 Band)
In India, the Department of Telecommunications (DoT) and Wireless Planning & Coordination (WPC) wing designate the **865.0 MHz to 867.0 MHz** band as license-exempt for low-power devices under Gazette Notification **GSR 564(E)**:
- **Maximum Transmit Power**: 1 Watt Effective Radiated Power (+30 dBm).
- **Default Center Frequency**: `865.0625 MHz`
- **Modulation**: LoRa Spread Spectrum, 125 kHz bandwidth, Spreading Factor 7 (SF7).
- **Airtime**: ~61 milliseconds per transmission burst.

---

## 5. Gateway Forwarder HTTP Bridge
When a physical LoRa gateway (e.g. RAK7268 or Dragino LPS8) receives the sub-GHz packet, its forwarder parses the binary payload into JSON and posts to the VanRakshak ingestion endpoint:

```bash
curl -X POST https://vanrakshak-api.demo/api/ingest/alert \
  -H "Content-Type: application/json" \
  -H "x-api-key: vr_dev_test_device_key_in865" \
  -d '{
    "nodeId": "VR-01",
    "eventType": "possible_chainsaw",
    "confidence": 0.92,
    "timestamp": "2026-10-24T14:32:10+05:30",
    "batteryPercentage": 78,
    "sequenceNumber": 104,
    "zone": "Zone A"
  }'
```
