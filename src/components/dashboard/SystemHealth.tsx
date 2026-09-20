import React from 'react';
import { SensorNode, SystemMetrics } from '../../types';
import { BatteryCharging, Sun, Radio, Activity, CheckCircle2 } from 'lucide-react';

interface SystemHealthProps {
  nodes: SensorNode[];
  metrics: SystemMetrics | null;
}

export const SystemHealth: React.FC<SystemHealthProps> = ({ nodes, metrics }) => {
  const onlineCount = nodes.filter((n) => n.status === 'online').length;
  const solarCount = nodes.filter((n) => n.solarCharging).length;
  const avgBattery = nodes.length > 0
    ? Math.round(nodes.reduce((acc, n) => acc + n.batteryPercentage, 0) / nodes.length)
    : 80;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-forest-700" />
            <span>System Telemetry & Edge Fleet Health</span>
          </h3>
          <p className="text-xs text-slate-500">Live summary of connected prototype nodes and gateway</p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Gateway Synchronized
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Fleet Connectivity */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Node Connectivity</span>
            <span className="font-semibold text-forest-800">{onlineCount}/{nodes.length} Active</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-forest-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${(onlineCount / Math.max(1, nodes.length)) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">{nodes.filter(n => n.status === 'offline').length} node currently offline</p>
        </div>

        {/* Metric 2: Average Battery & Solar */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1">
              <BatteryCharging className="w-3.5 h-3.5 text-forest-700" />
              <span>Fleet Avg Battery</span>
            </span>
            <span className="font-bold text-slate-800">{avgBattery}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                avgBattery > 50 ? 'bg-tealbrand-500' : 'bg-amber-500'
              }`}
              style={{ width: `${avgBattery}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
            <span className="flex items-center gap-1 text-amber-700">
              <Sun className="w-3 h-3 text-amber-500" />
              {solarCount} nodes solar charging
            </span>
          </div>
        </div>

        {/* Metric 3: LoRa Packet Delivery */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-tealbrand-500" />
              <span>LoRa IN865 Delivery</span>
            </span>
            <span className="font-bold text-emerald-700">{metrics?.packetDeliveryRate || 98.6}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics?.packetDeliveryRate || 98.6}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">Avg uplink latency: {metrics?.averageAlertLatency || 2.1}s</p>
        </div>

        {/* Metric 4: Edge TinyML Model */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs text-slate-500 mb-0.5">Edge-AI Inference Model</div>
          <div className="font-bold text-xs text-slate-900 font-mono">vanrakshak-tinyml-v1.4</div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1 border-t border-slate-200/60">
            <span>Runtime: TFLite Micro</span>
            <span className="bg-forest-100 text-forest-800 px-1.5 py-0.2 rounded font-medium">ESP32-S3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
