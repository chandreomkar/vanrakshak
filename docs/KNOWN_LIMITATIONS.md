# VanRakshak Known Limitations & Engineering Boundaries

In accordance with our hackathon honesty charter, this document candidly details current prototype boundaries and physical constraints.

---

## 1. Environmental & Acoustic Boundaries
1. **Canopy Multipath & Foliage Attenuation**:
   - High acoustic frequencies (1.5 kHz – 4 kHz) attenuate faster in wet, dense jungle foliage compared to open air. In heavy rain or dense canopy, the effective listening radius per node decreases from ~500m to ~200m.
2. **Ambient Noise Anomaly Confusion**:
   - Severe monsoon thunderclaps, sudden treefalls, and heavy trail vehicles produce high transient energy. While multi-window consensus filters out isolated spikes, steady motorized trail bikes can occasionally trigger borderline anomalies requiring ranger triage.
3. **Wind Induced Microphone Turbulence**:
   - Strong gale-force winds across canopy leaves produce high-amplitude low-frequency noise. Standard high-pass filtering (cutoff at 300 Hz) eliminates rumble, but windbreaks (acoustic foam or blimps) are required in physical deployments.

---

## 2. Power & Solar Boundaries
1. **Prolonged Monsoon Shading**:
   - Deep forest canopies receive diffuse light during 4-to-6-day monsoon cloudbursts. Although nodes sleep 96% of the time, continuous heavy logging in an area could increase transmission frequency and drain batteries if solar recharge is obstructed.
2. **Li-ion Temperature Degradation**:
   - Tropical summer temperatures above 45°C degrade standard lithium chemistry. Physical deployments require high-temperature LiFePO4 cells rather than generic 18650 Li-ion cells.

---

## 3. Wireless & RF Propagation
1. **Fresnel Zone Obstruction**:
   - Sub-GHz LoRa (IN865) penetrates tree trunks far better than 2.4GHz Wi-Fi, but heavy ridges and deep ravines create RF shadow zones. Multi-hop mesh or hilltop relay nodes are required for complex mountainous terrains.
2. **Duty Cycle Limits**:
   - Under India WPC GSR 564(E), nodes are restricted to &lt; 1% duty cycle. While compact event packets consume &lt; 65ms airtime, continuous telemetry reporting is prohibited.

---

## 4. Software & Prototype Boundaries
1. **Simulated Default State**:
   - The current web platform uses seeded and simulated demonstration telemetry. Real hardware data only ingests when a physical device connects to `/api/ingest/alert`.
2. **Fictional Demonstration Zones**:
   - All displayed sectors (`Zone A`, `Zone B`, `Zone C`) are fictional demonstration zones to prevent publishing sensitive coordinates of vulnerable old-growth timber stands.
