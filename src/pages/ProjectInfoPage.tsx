import React from 'react';
import {
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Shield,
  Layers,
  Users,
  Compass,
  FileText,
  AlertTriangle,
  Flame,
} from 'lucide-react';

export const ProjectInfoPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-forest-800" />
          <h1 className="text-xl font-bold text-slate-900">Project VanRakshak Information & Roadmap</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive project background, technology rationale, and future conservation vision
        </p>
      </div>

      {/* Problem & Motivation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">The Problem & Urgent Context</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Illegal logging accounts for 15% to 30% of global timber harvesting, accelerating biodiversity loss and releasing billions of tons of sequestered CO₂. In dense tropical and subtropical forests, illegal felling operations can cut and haul old-growth canopy trees within a single morning before detection occurs.
          </p>
          <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-[11px] text-red-900">
            <strong>Critical Gap:</strong> Optical satellites suffer from 1–5 day orbital revisit times and cannot penetrate thick cloud or monsoon cover. Ground acoustic alerts are critical.
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">The VanRakshak Solution</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            VanRakshak introduces ultra-low-power, solar-assisted acoustic Edge-AI sentinels mounted high in the forest canopy. By running quantized TinyML models directly on the ESP32-S3 microcontroller, the node detects chainsaw acoustic signatures locally and transmits compact alert telemetry via long-range sub-GHz LoRa (IN865 band).
          </p>
          <div className="p-3 bg-forest-50/60 rounded-xl border border-forest-100 text-[11px] text-forest-900">
            <strong>Key Innovation:</strong> Zero cellular requirement. Zero audio streaming. Real-time alert dispatch to forest rangers within seconds.
          </div>
        </div>
      </div>

      {/* Technology Stack Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-forest-700" />
          <span>Complete Technology Architecture Matrix</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Edge Hardware</span>
            <p className="font-bold text-slate-800">ESP32-S3 + INMP441</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Xtensa dual-core with vector DSP extensions, I2S MEMS mic, SX1262 LoRa transceiver.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Edge-AI TinyML</span>
            <p className="font-bold text-slate-800">TFLite Micro int8</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              1D-CNN classifier operating on 64-band Log-Mel spectrograms. Memory footprint &lt; 64 KB.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Wireless Telemetry</span>
            <p className="font-bold text-slate-800">LoRa IN865 Band</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              865–867 MHz frequency, compliant with India WPC GSR 564(E) license-exempt rules.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Full-Stack Platform</span>
            <p className="font-bold text-slate-800">React 18 + Vite + Express</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tailwind CSS, TypeScript, SQLite persistent store, accessible responsive dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Deliverables & Beneficiaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-tealbrand-50 text-tealbrand-700 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Prototype Deliverables</h2>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
              <span><strong>Interactive Monitoring Station:</strong> Filterable live alerts, zone status grid, and telemetry health.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
              <span><strong>Acoustic Edge Visualizer:</strong> Log-Mel spectrogram and time-domain waveform inspection.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
              <span><strong>Simulation Engine:</strong> Interactive generation of synthetic chainsaw events and background heartbeats.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
              <span><strong>Planned Ingestion API:</strong> Fully documented and validated <code className="bg-slate-100 px-1 rounded text-forest-900">POST /api/ingest/alert</code> interface.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Primary Beneficiaries</h2>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-tealbrand-600 flex-shrink-0 mt-0.5" />
              <span><strong>State Forest Departments:</strong> Enhanced situational awareness and efficient patrol dispatching.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-tealbrand-600 flex-shrink-0 mt-0.5" />
              <span><strong>Indigenous & Community Forest Dwellers:</strong> Safeguarding community forest rights and sacred groves.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-tealbrand-600 flex-shrink-0 mt-0.5" />
              <span><strong>Wildlife & Biodiversity Reserves:</strong> Protecting endangered species habitats from human disturbance.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-tealbrand-600 flex-shrink-0 mt-0.5" />
              <span><strong>Climate Conservation Researchers:</strong> Collecting long-term acoustic soundscape index data.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Honest Limitations & Future Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Honest Engineering Limitations</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            As a hackathon prototype demonstration, the following real-world challenges remain areas of ongoing research:
          </p>
          <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4">
            <li><strong>Acoustic Canopy Attenuation:</strong> Dense foliage absorbs high frequencies, reducing microphone effective detection radius during heavy monsoon rain.</li>
            <li><strong>Solar Shading in Dense Jungle:</strong> Thick multi-layer canopies receive intermittent direct sunlight, requiring conservative deep sleep power budgeting.</li>
            <li><strong>Soundscape Ambiguity:</strong> High-energy thunderclaps or mechanical trail-maintenance vehicles can occasionally trigger false positives without multi-window confirmation.</li>
          </ul>
        </div>

        <div className="bg-white border border-forest-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-forest-900 font-bold text-sm">
            <Compass className="w-4 h-4 text-forest-700" />
            <span>Future Development Roadmap</span>
          </div>
          <ul className="text-[11px] text-slate-600 space-y-2">
            <li className="flex items-start gap-1.5">
              <span className="font-bold text-forest-800">Q1 2027:</span>
              <span>Multi-node Time Difference of Arrival (TDoA) acoustic trilateration for precise coordinate triangulation.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-bold text-forest-800">Q2 2027:</span>
              <span>Wildfire acoustic crackle and thermal infrared sensor fusion for early forest fire alert triggers.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-bold text-forest-800">Q3 2027:</span>
              <span>Direct-to-Satellite LoRa (LR-FHSS) fallback for ultra-remote tiger reserves without terrestrial gateways.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-bold text-forest-800">Q4 2027:</span>
              <span>Automated biodiversity soundscape health scoring (NDSI / Bioacoustic index tracking).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
