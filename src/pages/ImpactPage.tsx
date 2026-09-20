import React from 'react';
import {
  TreePine,
  Zap,
  Radio,
  Sun,
  Maximize2,
  Volume2,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Clock,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const ImpactPage: React.FC = () => {
  const latencyComparison = [
    { name: 'Manual Foot Patrol', hours: 14, fill: '#94a3b8' },
    { name: 'Satellite Optical (Re-visit)', hours: 48, fill: '#64748b' },
    { name: 'Cellular Remote Mic', hours: 3, fill: '#546E7A' },
    { name: 'VanRakshak Edge-AI (Demonstrated)', hours: 0.05, fill: '#174A35' }, // 2-3 minutes total
  ];

  const bandwidthComparison = [
    { name: 'Raw Audio Stream (16kHz PCM)', bytesPerDay: 2764800, fill: '#94a3b8' },
    { name: 'Compressed MP3 / Opus Stream', bytesPerDay: 345600, fill: '#64748b' },
    { name: 'VanRakshak Compact Event Packet', bytesPerDay: 720, fill: '#2A9D8F' }, // ~24 alerts/heartbeats
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <TreePine className="w-6 h-6 text-forest-800" />
          <h1 className="text-xl font-bold text-slate-900">Climate & Biodiversity Conservation Impact</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Quantifying the ecological advantages of autonomous acoustic edge computing
        </p>
      </div>

      {/* Mandatory Labeling Note */}
      <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-xs flex items-center gap-2">
        <Info className="w-4 h-4 text-forest-700 flex-shrink-0" />
        <span>
          <strong>Prototype Notice:</strong> All metrics, time comparisons, and conservation calculations are theoretical prototype estimates designed to illustrate system feasibility for the hackathon.
        </span>
      </div>

      {/* 5-Stage Impact Pathway */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Ecological Impact Pathway</h2>
          <p className="text-xs text-slate-500">From micro-acoustic vibration to regional forest canopy preservation</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-forest-50/50 rounded-xl border border-forest-100 relative">
            <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wide">Step 1</span>
            <h3 className="font-bold text-slate-900 text-xs mt-1">Local Edge Detection</h3>
            <p className="text-[11px] text-slate-600 mt-1">
              Chainsaw acoustic frequencies detected within 1.5s across 3 consecutive windows.
            </p>
          </div>

          <div className="p-3 bg-forest-50/50 rounded-xl border border-forest-100">
            <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wide">Step 2</span>
            <h3 className="font-bold text-slate-900 text-xs mt-1">Compact Alert Packet</h3>
            <p className="text-[11px] text-slate-600 mt-1">
              LoRa IN865 packet reaches forest gateway in &lt; 2.5 seconds without cellular dependence.
            </p>
          </div>

          <div className="p-3 bg-forest-50/50 rounded-xl border border-forest-100">
            <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wide">Step 3</span>
            <h3 className="font-bold text-slate-900 text-xs mt-1">Ranger Verification</h3>
            <p className="text-[11px] text-slate-600 mt-1">
              Rangers audit waveform spectrogram and triage alert to eliminate false alarms.
            </p>
          </div>

          <div className="p-3 bg-forest-50/50 rounded-xl border border-forest-100">
            <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wide">Step 4</span>
            <h3 className="font-bold text-slate-900 text-xs mt-1">Targeted Patrol</h3>
            <p className="text-[11px] text-slate-600 mt-1">
              Ground patrol units dispatched immediately to the precise approximate sector.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Step 5</span>
            <h3 className="font-bold text-emerald-950 text-xs mt-1">Canopy Preserved</h3>
            <p className="text-[11px] text-emerald-900 mt-1">
              Illegal felling halted before large-scale timber extraction or habitat fragmentation occurs.
            </p>
          </div>
        </div>
      </div>

      {/* Comparative Charts: Latency & Bandwidth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-forest-700" />
                <span>Detection to Alert Latency (Hours)</span>
              </h3>
              <p className="text-xs text-slate-500">Comparing surveillance response times</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-forest-100 text-forest-800 font-semibold">
              99% Faster
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyComparison} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" unit=" hrs" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value: any) => [`${value} hours`, 'Response Latency']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="hours" radius={[0, 6, 6, 0]}>
                  {latencyComparison.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500">
            *VanRakshak achieves alert delivery in seconds compared to manual forest foot patrols that take 8–24 hours to cover remote boundary corridors.
          </p>
        </div>

        {/* Bandwidth Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-tealbrand-600" />
                <span>Daily RF Data Transmitted (KB/Day)</span>
              </h3>
              <p className="text-xs text-slate-500">Edge computation vs continuous streaming</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-tealbrand-100 text-tealbrand-800 font-semibold">
              99.9% Less Bandwidth
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bandwidthComparison} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" unit=" B" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value: any) => [`${value} bytes/day`, 'Transmission Volume']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="bytesPerDay" radius={[0, 6, 6, 0]}>
                  {bandwidthComparison.map((entry, index) => (
                    <Cell key={`cell-bw-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500">
            *Transmitting compact event metadata allows tiny solar-assisted batteries to operate autonomously for seasons without bulky battery banks.
          </p>
        </div>
      </div>

      {/* 5 Core Pillars of Climate Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Faster Threat Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Immediate acoustic confirmation enables rapid response before trees are transported off-site, dramatically reducing loss of mature carbon-sink trees.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-tealbrand-50 text-tealbrand-700 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Low Connectivity Dependence</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Forest reserves often have zero cellular coverage. Long-range sub-GHz LoRa bridges tens of kilometers of canopy without expensive telecom tower infrastructure.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Solar-Assisted Operation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            By combining deep sleep cycles with an intelligent charge controller and 2W monocrystalline panel, each node operates continuously on renewable energy.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center">
            <Maximize2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Scalable Monitoring Mesh</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Low per-node bill of materials allows deploying dense perimeter lines along national park boundaries and vulnerable logging trail bottlenecks.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2 md:col-span-2">
          <div className="w-9 h-9 rounded-xl bg-tealbrand-50 text-tealbrand-700 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Future Biodiversity Soundscape Scope</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Beyond chainsaw defense, the edge model architecture can be extended via firmware updates to index avian vocalizations, bat echolocation, and herd movements—monitoring ecosystem vitality over seasons.
          </p>
        </div>
      </div>
    </div>
  );
};
