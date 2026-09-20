# VanRakshak Prototype Demo Mode & Honesty Protocol

## 1. Prototype Demonstration Charter
VanRakshak is an open-source prototype created for the **AI for Climate Change Hackathon** (Biodiversity Monitoring / Climate Awareness Track).

To ensure complete scientific and engineering integrity:
- **No Live Sensor Claims**: The platform never claims that real forest nodes are deployed in a physical jungle unless real hardware telemetry is explicitly configured.
- **Simulated Data Badge**: A prominent banner **`Prototype Demo Mode — Using Simulated Sensor Data`** is displayed on all dashboard views.
- **Decision-Support Wording**: Acoustic detection triggers are clearly worded as:
  - *“Possible chainsaw activity”*
  - *“AI-generated alert requiring human verification”*
  - *“Simulated prototype data”*
  - *“Approximate zone”*
  - *“Planned hardware integration”*
- **No Absolute Guarantees**: We do not claim 100% accuracy, guaranteed LoRa range across mountains, guaranteed infinite battery life, or confirmed criminal convictions without ranger ground verification.

---

## 2. Using the Simulation Engine

The built-in simulation engine exercises the entire software stack, database persistence layer, and ranger triage interface without requiring physical hardware:

1. Click the **“Simulate Chainsaw Alert”** button in the header navbar or Overview page.
2. Review the simulation notice:
   > *“This creates synthetic prototype data and does not represent a real forest event.”*
3. Select a target edge node (e.g. `VR-03` in Zone B) and target confidence (e.g., 92%).
4. Click **“Simulate Chainsaw Alert”**:
   - Executes multi-window consensus logic (3 sliding 1.5s windows).
   - Decrements node battery by 1% due to simulated LoRa RF transmission energy.
   - Pushes an alert record to the live queue with status `pending`.
   - The alert appears immediately in the **Live Alerts** table.

---

## 3. Demo Personas & Role Switching
The platform includes a 1-click persona switcher in the top-right navbar:
- **Forest Ranger (Vikram Singh)**: Can triage alerts, commit verification notes, dispatch patrols, or mark false positives.
- **Division Admin (Anita Roy)**: Can add/edit/delete sensor nodes and adjust system thresholds.
- **Hackathon Evaluator (Guest)**: Read-only access to explore all views safely.
