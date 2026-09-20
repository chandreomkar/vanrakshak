import React from 'react';
import { SensorNode } from '../../types';
import {
  Battery,
  Sun,
  Radio,
  Cpu,
  Clock,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface NodeCardProps {
  node: SensorNode;
  onEdit: (node: SensorNode) => void;
  onDelete: (node: SensorNode) => void;
  onSelect?: (node: SensorNode) => void;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  node,
  onEdit,
  onDelete,
  onSelect,
}) => {
  const getStatusBadge = () => {
    switch (node.status) {
      case 'online':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Online
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Acoustic Warning
          </span>
        );
      case 'offline':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            Offline
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(node)}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">{node.nodeId}</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-forest-50 text-forest-800">
                {node.zone}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{node.name}</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Battery & Solar */}
        <div className="p-3 bg-slate-50 rounded-xl mb-3 space-y-1.5 border border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Battery className={`w-4 h-4 ${node.batteryPercentage < 25 ? 'text-red-500' : 'text-slate-700'}`} />
              <span className="font-semibold">{node.batteryPercentage}% Battery</span>
            </div>
            {node.solarCharging ? (
              <span className="flex items-center gap-1 text-[11px] text-amber-700 font-medium bg-amber-100/60 px-2 py-0.5 rounded-md">
                <Sun className="w-3 h-3 text-amber-500" />
                Solar Charging
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">Battery Power</span>
            )}
          </div>

          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                node.batteryPercentage > 50
                  ? 'bg-tealbrand-500'
                  : node.batteryPercentage > 20
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${node.batteryPercentage}%` }}
            />
          </div>
        </div>

        {/* Metadata Details */}
        <div className="space-y-1.5 text-[11px] text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-400">
              <Radio className="w-3 h-3 text-tealbrand-500" />
              <span>LoRa IN865 Signal</span>
            </span>
            <span className="font-mono text-slate-700 font-medium">{node.signalStrength} dBm</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-400">
              <Cpu className="w-3 h-3 text-forest-700" />
              <span>TinyML Model</span>
            </span>
            <span className="font-mono text-slate-700 truncate max-w-[140px]" title={node.modelVersion}>
              {node.modelVersion}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Last Uplink</span>
            </span>
            <span className="text-slate-600">
              {new Date(node.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Card Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[10px] text-slate-400 font-mono">FW: {node.firmwareVersion}</span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-forest-800 hover:bg-slate-100 transition-colors"
            title="Edit Node Parameters"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Decommission Node"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
