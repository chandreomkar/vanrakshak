import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { mockStorage } from '../services/mockStorage';
import { Alert } from '../types';
import { AlertTable } from '../components/alerts/AlertTable';
import { VerificationModal } from '../components/alerts/VerificationModal';
import { Bell, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

export const LiveAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterZone, setFilterZone] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Verification modal
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    const filterParams = {
      eventType: filterEvent !== 'all' ? filterEvent : undefined,
      zone: filterZone !== 'all' ? filterZone : undefined,
      status: filterStatus !== 'all' ? filterStatus : undefined,
    };
    try {
      const data = await api.getAlerts(filterParams);
      setAlerts(data && data.length > 0 ? data : mockStorage.getAlerts(filterParams));
    } catch (e) {
      setAlerts(mockStorage.getAlerts(filterParams));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filterEvent, filterZone, filterStatus]);

  const handleVerify = async (id: string, action: string, note: string) => {
    await api.updateAlertStatus(id, action, note);
    await fetchAlerts();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-forest-800" />
            <h1 className="text-xl font-bold text-slate-900">Live Acoustic Alerts Queue</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Incoming Edge-AI threat classifications transmitted via LoRa IN865 gateway
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Mandatory Honesty & Ranger Verification Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-amber-900">
            AI-Generated Alert Requiring Human Verification
          </p>
          <p className="text-amber-800 leading-relaxed text-[11px]">
            VanRakshak uses compact acoustic classification on edge sensor nodes. Audio classifications are decision-support signals designed to prioritize physical patrol units. They do not constitute confirmed criminality until verified by a forest ranger.
          </p>
        </div>
      </div>

      {/* Alert Table with Interactive Filtering */}
      <AlertTable
        alerts={alerts}
        onOpenVerification={(alert) => {
          setSelectedAlert(alert);
          setIsModalOpen(true);
        }}
        filterEvent={filterEvent}
        setFilterEvent={setFilterEvent}
        filterZone={filterZone}
        setFilterZone={setFilterZone}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAlert(null);
        }}
        alert={selectedAlert}
        onVerify={handleVerify}
      />
    </div>
  );
};
