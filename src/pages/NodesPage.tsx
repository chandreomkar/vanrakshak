import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SensorNode } from '../types';
import { NodeCard } from '../components/nodes/NodeCard';
import { NodeModal } from '../components/nodes/NodeModal';
import { Cpu, Plus, Filter, RefreshCw, Sun, Radio, BatteryCharging } from 'lucide-react';

export const NodesPage: React.FC = () => {
  const [nodes, setNodes] = useState<SensorNode[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterZone, setFilterZone] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SensorNode | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const data = await api.getNodes();
      setNodes(data);
    } catch (e) {
      console.error('Failed to load nodes', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  const handleSaveNode = async (data: Partial<SensorNode>) => {
    if (selectedNode) {
      await api.updateNode(selectedNode.nodeId, data);
    } else {
      await api.createNode(data);
    }
    await fetchNodes();
  };

  const handleDeleteNode = async (nodeId: string) => {
    await api.deleteNode(nodeId);
    await fetchNodes();
  };

  const filteredNodes = nodes.filter((node) => {
    if (filterZone !== 'all' && node.zone !== filterZone) return false;
    if (filterStatus !== 'all' && node.status !== filterStatus) return false;
    return true;
  });

  const onlineNodes = nodes.filter((n) => n.status === 'online').length;
  const solarChargingNodes = nodes.filter((n) => n.solarCharging).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-forest-800" />
            <h1 className="text-xl font-bold text-slate-900">Acoustic Edge Node Fleet Registry</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Solar-powered ESP32-S3 sensor nodes with embedded TinyML sound classifiers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchNodes}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Refresh Fleet"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setSelectedNode(null);
              setIsDeleteMode(false);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 active:scale-95 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Node</span>
          </button>
        </div>
      </div>

      {/* Fleet Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500">Fleet Active Rate</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {onlineNodes} / {nodes.length} Online
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500">Solar-Assisted Operation</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {solarChargingNodes} Nodes Charging
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500">Telemetry Standard</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              IN865 LoRa Sub-GHz
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-tealbrand-50 text-tealbrand-700 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2 font-medium text-slate-600">
          <Filter className="w-4 h-4 text-forest-700" />
          <span>Filter Fleet ({filteredNodes.length} Nodes Shown)</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-forest-600"
          >
            <option value="all">All Demonstration Zones</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
            <option value="Zone C">Zone C</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-forest-600"
          >
            <option value="all">All Statuses</option>
            <option value="online">Online</option>
            <option value="warning">Warning</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Nodes Cards Grid */}
      {filteredNodes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
          No sensor nodes match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              onEdit={(n) => {
                setSelectedNode(n);
                setIsDeleteMode(false);
                setIsModalOpen(true);
              }}
              onDelete={(n) => {
                setSelectedNode(n);
                setIsDeleteMode(true);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Node Add/Edit/Delete Modal */}
      <NodeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNode(null);
          setIsDeleteMode(false);
        }}
        initialData={selectedNode}
        onSave={handleSaveNode}
        onDelete={handleDeleteNode}
        isDeleteMode={isDeleteMode}
      />
    </div>
  );
};
