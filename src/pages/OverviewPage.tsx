import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { mockStorage } from '../services/mockStorage';
import { SensorNode, Alert, SystemMetrics } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ZoneGridMap } from '../components/dashboard/ZoneGridMap';
import { SystemHealth } from '../components/dashboard/SystemHealth';
import { AlertTable } from '../components/alerts/AlertTable';
import { VerificationModal } from '../components/alerts/VerificationModal';
import { SimulationModal } from '../components/dashboard/SimulationModal';
import {
  Cpu,
  Bell,
  Clock,
  Radio,
  Sparkles,
  TreePine,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OverviewPage: React.FC = () => {
  const [nodes, setNodes] = useState<SensorNode[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Verification modal state
  const [selectedAlertForVerify, setSelectedAlertForVerify] = useState<Alert | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Simulation modal state
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  // Filters for the embedded table
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterZone, setFilterZone] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadData = async () => {
    try {
      const [nodesData, alertsData, metricsData] = await Promise.all([
        api.getNodes(),
        api.getAlerts(),
        api.getMetrics(),
      ]);
      setNodes(nodesData && nodesData.length > 0 ? nodesData : mockStorage.getNodes());
      setAlerts(alertsData && alertsData.length > 0 ? alertsData : mockStorage.getAlerts());
      setMetrics(metricsData || mockStorage.getMetrics());
    } catch (e) {
      setNodes(mockStorage.getNodes());
      setAlerts(mockStorage.getAlerts());
      setMetrics(mockStorage.getMetrics());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyAction = async (alertId: string, action: string, note: string) => {
    await api.updateAlertStatus(alertId, action, note);
    await loadData();
  };

  const activeNodesCount = nodes.filter((n) => n.status === 'online').length;
  const pendingCount = alerts.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Simulation Call to Action */}
      <div className="bg-gradient-to-r from-forest-800 via-forest-700 to-tealbrand-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold text-[11px] backdrop-blur-xs">
              AI for Climate Change Hackathon
            </span>
            <span className="px-2 py-0.5 rounded-full bg-tealbrand-400/20 text-tealbrand-200 text-[11px] border border-tealbrand-400/30">
              India WPC IN865 Telemetry
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
            Solar-Powered Acoustic Edge-AI for Forest Protection
          </h1>
          <p className="text-xs md:text-sm text-forest-100 max-w-2xl mt-1 leading-relaxed">
            Autonomous ESP32-S3 sensor nodes classify soundscapes locally. Compact LoRa alert packets notify rangers within seconds without streaming continuous audio.
          </p>
        </div>

        <button
          onClick={() => setIsSimulationOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Simulate Chainsaw Alert</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Edge Nodes"
          value={`${activeNodesCount} / ${nodes.length}`}
          subtitle={`${nodes.filter(n => n.solarCharging).length} nodes currently solar-assisted`}
          icon={Cpu}
          variant="forest"
          badgeText="IN865 Band"
        />
        <StatCard
          title="Alerts Detected Today"
          value={alerts.length}
          subtitle="Acoustic anomalies and possible chainsaw events"
          icon={Bell}
          variant="warning"
          badgeText="Simulated"
        />
        <StatCard
          title="Pending Ranger Review"
          value={pendingCount}
          subtitle={pendingCount > 0 ? "Requires human verification decision" : "All alerts verified"}
          icon={Clock}
          variant={pendingCount > 0 ? 'danger' : 'forest'}
          badgeText={pendingCount > 0 ? 'Action Required' : 'All Clear'}
        />
        <StatCard
          title="LoRa Gateway Status"
          value="Synchronized"
          subtitle="Packet Delivery: 98.6% • Latency: 2.1s"
          icon={Radio}
          variant="teal"
          badgeText="865.06 MHz"
        />
      </div>

      {/* Forest Zones Interactive Grid Map */}
      <ZoneGridMap nodes={nodes} alerts={alerts} />

      {/* System Health Widget */}
      <SystemHealth nodes={nodes} metrics={metrics} />

      {/* Recent Alerts Queue Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-forest-800" />
              <span>Incoming Acoustic Alerts Queue</span>
            </h3>
            <p className="text-xs text-slate-500">
              AI alerts represent decision-support signals requiring human verification before field dispatch.
            </p>
          </div>
          <Link
            to="/alerts"
            className="text-xs font-semibold text-forest-800 hover:text-forest-900 flex items-center gap-1 hover:underline"
          >
            <span>View Full Alert Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AlertTable
          alerts={alerts.slice(0, 5)}
          onOpenVerification={(alert) => {
            setSelectedAlertForVerify(alert);
            setIsVerificationModalOpen(true);
          }}
          filterEvent={filterEvent}
          setFilterEvent={setFilterEvent}
          filterZone={filterZone}
          setFilterZone={setFilterZone}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      </div>

      {/* Climate & Biodiversity Impact Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TreePine className="w-5 h-5 text-forest-700" />
            <h3 className="font-bold text-slate-900 text-sm">Prototype Impact Pathway & Ecological Benefits</h3>
          </div>
          <Link
            to="/impact"
            className="text-xs font-semibold text-tealbrand-700 hover:text-tealbrand-800 flex items-center gap-1"
          >
            <span>Detailed Analysis</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-forest-50/60 border border-forest-100">
            <div className="font-bold text-forest-900 flex items-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 text-forest-700" />
              <span>Faster Threat Response</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Edge classification detects chainsaw acoustics in under 2 seconds and transmits compact alert packets over LoRa, cutting alert latency by hours compared to manual trail patrols.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-tealbrand-50/60 border border-tealbrand-100">
            <div className="font-bold text-tealbrand-900 flex items-center gap-1.5 mb-1">
              <Radio className="w-4 h-4 text-tealbrand-700" />
              <span>Zero High-Bandwidth Reliance</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Does not require 4G/5G cellular coverage or satellite data plans in dense deep forests. Only compact 20-30 byte event telemetry packets are transmitted over license-exempt sub-GHz RF.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="font-bold text-amber-950 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Acoustic Privacy & Integrity</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Microphones process sound locally inside the ESP32-S3 SRAM. Raw audio streams are never stored or uploaded, strictly protecting forest visitor privacy and ranger communications.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => {
          setIsVerificationModalOpen(false);
          setSelectedAlertForVerify(null);
        }}
        alert={selectedAlertForVerify}
        onVerify={handleVerifyAction}
      />

      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        nodes={nodes}
        onSimulationComplete={loadData}
      />
    </div>
  );
};
