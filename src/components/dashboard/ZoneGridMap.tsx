import React from 'react';
import { SensorNode, Alert } from '../../types';
import { TreePine, AlertTriangle, CheckCircle2, XCircle, Battery, Sun, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ZoneGridMapProps {
  nodes: SensorNode[];
  alerts: Alert[];
  onSelectNode?: (nodeId: string) => void;
}

export const ZoneGridMap: React.FC<ZoneGridMapProps> = ({ nodes, alerts, onSelectNode }) => {
  const navigate = useNavigate();

  const zones = [
    {
      id: 'Zone A',
      title: 'Zone A: North Canopy Reserve',
      description: 'Fictional dense subtropical canopy demonstration zone',
      status: 'Normal',
      color: 'border-emerald-200 bg-emerald-50/30',
      tagColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'Zone B',
      title: 'Zone B: Ridge & Valley Corridor',
      description: 'Fictional high-risk buffer valley with recent acoustic alerts',
      status: 'Warning',
      color: 'border-amber-200 bg-amber-50/40',
      tagColor: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'Zone C',
      title: 'Zone C: Riverine Border Zone',
      description: 'Fictional boundary sector with solar-powered boundary nodes',
      status: 'Normal',
      color: 'border-teal-200 bg-teal-50/30',
      tagColor: 'bg-teal-100 text-teal-800',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-forest-700" />
            <h3 className="font-bold text-slate-900 text-base">Forest Demonstration Zones & Edge Nodes</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Fictional demonstration layout. Real coordinates are not exposed for ranger and biodiversity security.
          </p>
        </div>
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          LoRa IN865 Coverage: 3 Fictional Sectors
        </span>
      </div>

      {/* Grid of 3 Zones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {zones.map((zone) => {
          const zoneNodes = nodes.filter((n) => n.zone === zone.id);
          const zoneAlerts = alerts.filter((a) => a.zone === zone.id && a.status === 'pending');
          const hasWarning = zoneAlerts.length > 0;

          return (
            <div
              key={zone.id}
              className={`rounded-xl border p-4 transition-all duration-200 ${
                hasWarning ? 'border-amber-300 bg-amber-50/60 shadow-sm' : zone.color
              }`}
            >
              {/* Zone Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${zone.tagColor}`}>
                    {zone.id}
                  </span>
                  <h4 className="font-semibold text-slate-800 text-xs mt-1.5">{zone.title}</h4>
                </div>
                {hasWarning ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Alert
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Quiet
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 mb-3">{zone.description}</p>

              {/* Node Chips inside Zone */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Edge Nodes in {zone.id} ({zoneNodes.length})
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {zoneNodes.map((node) => {
                    const isAlerting = node.status === 'warning' || node.lastEventType === 'possible_chainsaw';
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode ? onSelectNode(node.nodeId) : navigate(`/nodes`)}
                        className={`p-2.5 rounded-lg border bg-white cursor-pointer transition-all hover:shadow-sm ${
                          isAlerting
                            ? 'border-amber-400 ring-1 ring-amber-300'
                            : node.status === 'offline'
                            ? 'border-slate-200 opacity-70'
                            : 'border-slate-200 hover:border-forest-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                node.status === 'online'
                                  ? 'bg-emerald-500'
                                  : node.status === 'warning'
                                  ? 'bg-amber-500 animate-ping'
                                  : 'bg-slate-400'
                              }`}
                            />
                            <span className="font-bold text-xs text-slate-900">{node.nodeId}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{node.firmwareVersion}</span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-600">
                          <div className="flex items-center gap-1">
                            <Battery className={`w-3.5 h-3.5 ${node.batteryPercentage < 25 ? 'text-red-500' : 'text-slate-500'}`} />
                            <span className="font-medium">{node.batteryPercentage}%</span>
                            {node.solarCharging && (
                              <span title="Solar charging active">
                                <Sun className="w-3 h-3 text-amber-500" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Radio className="w-3 h-3 text-tealbrand-500" />
                            <span>{node.signalStrength} dBm</span>
                          </div>
                        </div>

                        {node.lastEventType === 'possible_chainsaw' && (
                          <div className="mt-1.5 pt-1.5 border-t border-amber-100 flex items-center justify-between text-[10px] text-amber-900 font-semibold">
                            <span>Acoustic alert flagged</span>
                            <span className="bg-amber-100 px-1.5 py-0.2 rounded text-amber-800">Review</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
