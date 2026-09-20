import React from 'react';
import {
  Network,
  Sun,
  Battery,
  Cpu,
  Radio,
  Server,
  Database,
  Monitor,
  Camera,
  Shield,
  FileCode,
  Zap,
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Network className="w-6 h-6 text-forest-800" />
          <h1 className="text-xl font-bold text-slate-900">System Architecture & Energy Topology</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          End-to-end signal flow from canopy acoustic MEMS to human ranger verification
        </p>
      </div>

      {/* Visual Flow Representation with Legend */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Interactive Architecture Topology</h2>
            <p className="text-xs text-slate-500">Hardware, energy, RF propagation, and software subsystems</p>
          </div>

          {/* Flow Legend */}
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <div className="w-6 h-0.5 bg-forest-800" />
              <span>Solid: Acoustic & Telemetry Data Flow</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-amber-700">
              <div className="w-6 border-t-2 border-dashed border-amber-500" />
              <span>Dashed: Solar Energy & Power Flow</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-tealbrand-700">
              <div className="w-6 border-t-2 border-dotted border-tealbrand-500" />
              <span>Dotted: Optional Camera Verification</span>
            </div>
          </div>
        </div>

        {/* Visual Architecture Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subsystem 1: Edge Sensor Node */}
          <div className="p-4 rounded-2xl bg-forest-50/40 border-2 border-forest-200 space-y-4">
            <div className="flex items-center justify-between border-b border-forest-200/80 pb-2">
              <span className="text-xs font-bold text-forest-900 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-forest-700" />
                <span>1. Autonomous Solar Node</span>
              </span>
              <span className="text-[10px] font-mono bg-forest-200/60 text-forest-800 px-2 py-0.5 rounded">
                Canopy Mount
              </span>
            </div>

            {/* Power block */}
            <div className="p-3 bg-amber-50 rounded-xl border border-dashed border-amber-300 space-y-1.5">
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>Energy Subsystem</span>
              </span>
              <p className="text-[11px] text-amber-950 font-medium">6V Solar Panel (Monocrystalline)</p>
              <div className="text-[10px] text-amber-800 border-t border-amber-200/60 pt-1 space-y-0.5">
                <p>↳ Solar-compatible Li-ion charge controller</p>
                <p>↳ 18650 Protected Li-ion Cell (3.7V ~3000mAh)</p>
                <p>↳ 3.3V Low-Dropout Regulator (LDO)</p>
              </div>
            </div>

            {/* Compute block */}
            <div className="p-3 bg-white rounded-xl border border-forest-200 space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wide">
                Acoustic Edge Compute
              </span>
              <p className="text-[11px] font-bold text-slate-800">INMP441 I2S Microphone → ESP32-S3</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Sliding 1.5s windows → Log-Mel DSP → TFLite Micro int8 inference. Consumes &lt; 85mA during active classification.
              </p>
            </div>

            {/* Optional Camera block */}
            <div className="p-3 bg-tealbrand-50/50 rounded-xl border border-dotted border-tealbrand-400 space-y-1">
              <span className="text-[10px] font-bold text-tealbrand-900 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-tealbrand-600" />
                <span>Optional Visual Extension</span>
              </span>
              <p className="text-[10px] text-tealbrand-800">
                Low-power OV2640 snapshot triggered strictly after multi-window acoustic confirmation.
              </p>
            </div>
          </div>

          {/* Subsystem 2: LoRa Gateway */}
          <div className="p-4 rounded-2xl bg-tealbrand-50/40 border-2 border-tealbrand-200 space-y-4">
            <div className="flex items-center justify-between border-b border-tealbrand-200/80 pb-2">
              <span className="text-xs font-bold text-tealbrand-900 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-tealbrand-700" />
                <span>2. Gateway & Sub-GHz LoRa</span>
              </span>
              <span className="text-[10px] font-mono bg-tealbrand-200/60 text-tealbrand-800 px-2 py-0.5 rounded">
                Watchtower / Station
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-tealbrand-200 space-y-2 shadow-2xs text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-tealbrand-600" />
                <span>Sub-GHz Wireless Telemetry</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Node transmits a <strong>Compact event packet</strong> containing Node ID, event type, confidence, battery percentage, and sequence number.
              </p>
              <div className="p-2 bg-slate-50 rounded-lg text-[10px] font-mono text-slate-700 border border-slate-200">
                <span>Band: IN865 (865.0625 MHz)</span><br />
                <span>Modulation: SF7 / BW 125 kHz</span><br />
                <span>Airtime: ~61 ms per burst</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-tealbrand-200 space-y-1.5 shadow-2xs text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Packet Forwarder Interface
              </span>
              <p className="text-[11px] text-slate-700">
                Gateway receives Sub-GHz RF packets and forwards JSON payloads over HTTPS to the cloud backend.
              </p>
            </div>
          </div>

          {/* Subsystem 3: Cloud Backend & Human Verification */}
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-slate-700" />
                <span>3. Backend & Ranger UI</span>
              </span>
              <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                Monitoring Center
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-forest-700" />
                <span>Express REST & SQLite Store</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Validates payloads, tracks battery depletion, logs verification audit trails, and triggers ranger alerts.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-forest-800" />
                <span>Ranger Verification Station</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Human-in-the-loop dashboard: inspects audio waveform, spectrogram energy, and dispatches ground patrols.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* India WPC Regulatory & Wireless Specs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-forest-700" />
          <span>India WPC Spectrum Compliance (IN865 Band)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">Frequency Band</span>
            <p className="text-[11px] text-slate-600 mt-1">
              865.0 MHz to 867.0 MHz license-exempt sub-GHz band designated for low-power wireless transmitters under DoT GSR 564(E).
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">Max Transmit ERP</span>
            <p className="text-[11px] text-slate-600 mt-1">
              Effective Radiated Power strictly capped at 1 Watt (+30 dBm) with 200 kHz channel spacing and carrier sense.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block">Duty Cycle Compliance</span>
            <p className="text-[11px] text-slate-600 mt-1">
              Less than 1% transmit duty cycle. Compact alert packets transmit in &lt; 65ms bursts only upon confirmed detection.
            </p>
          </div>
        </div>
      </div>

      {/* Planned Hardware Ingestion Specification */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-forest-700" />
            <h2 className="text-sm font-bold text-slate-900">Planned Hardware Ingestion Interface</h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
            Planned Hardware Integration
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Physical ESP32-S3 nodes or LoRa gateway forwarders authenticate via HTTP header <code className="bg-slate-100 px-1.5 py-0.5 rounded text-forest-900">x-api-key</code> and POST compact JSON telemetry directly to the backend.
        </p>

        <div className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-slate-200 overflow-x-auto space-y-1">
          <p className="text-tealbrand-400 font-bold">POST /api/ingest/alert</p>
          <p className="text-slate-400">Host: https://vanrakshak-api.demo</p>
          <p className="text-slate-400">x-api-key: [SECURED_DEVICE_TOKEN]</p>
          <p className="text-slate-400">Content-Type: application/json</p>
          <pre className="text-emerald-400 pt-2 text-[11px]">{`{
  "nodeId": "VR-01",
  "eventType": "possible_chainsaw",
  "confidence": 0.92,
  "timestamp": "2026-10-24T14:32:10+05:30",
  "batteryPercentage": 78,
  "sequenceNumber": 104,
  "zone": "Zone A"
}`}</pre>
        </div>
      </div>
    </div>
  );
};
