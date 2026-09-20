import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Alert, VerificationAction, SensorNode } from '../types';
import { WaveformViewer } from '../components/audio/WaveformViewer';
import { SpectrogramViewer } from '../components/audio/SpectrogramViewer';
import { VerificationModal } from '../components/alerts/VerificationModal';
import {
  ArrowLeft,
  AlertTriangle,
  Battery,
  Radio,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  UserCheck,
  Camera,
  FileText,
  Activity,
  MapPin,
} from 'lucide-react';

export const AlertDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [alert, setAlert] = useState<(Alert & { actions: VerificationAction[] }) | null>(null);
  const [node, setNode] = useState<SensorNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAlertDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const alertData = await api.getAlert(id);
      setAlert(alertData);
      try {
        const nodeData = await api.getNode(alertData.nodeId);
        setNode(nodeData);
      } catch (e) {
        console.warn('Node lookup failed', e);
      }
    } catch (e) {
      console.error('Failed to load alert detail', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlertDetail();
  }, [id]);

  const handleVerify = async (alertId: string, action: string, note: string) => {
    await api.updateAlertStatus(alertId, action, note);
    await loadAlertDetail();
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-xs">
        Loading acoustic alert telemetry...
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">Alert Not Found</h2>
        <p className="text-xs text-slate-500">The requested alert ID {id} does not exist in the database.</p>
        <Link
          to="/alerts"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Alerts</span>
        </Link>
      </div>
    );
  }

  const isChainsaw = alert.eventType === 'possible_chainsaw';

  return (
    <div className="space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          onClick={() => navigate('/alerts')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-forest-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Alerts</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-500">Alert Ref: {alert.id}</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            Update Ranger Status
          </button>
        </div>
      </div>

      {/* Mandatory Decision Support Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-amber-900">
            AI-Generated Alert Requiring Human Verification
          </p>
          <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
            This AI alert is a decision-support signal and requires human verification. Ground patrols should be coordinated based on physical verification of the approximate zone sector.
          </p>
        </div>
      </div>

      {/* Main Content Grid: Left Details & Right Acoustic Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Metadata & Timeline) - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Metadata Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
                  {alert.zone}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  {isChainsaw ? 'Possible Chainsaw Activity' : 'Soundscape Anomaly'}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 block">{alert.nodeId}</span>
                <span className="text-[10px] text-slate-400 font-mono">Seq #{alert.sequenceNumber}</span>
              </div>
            </div>

            {/* Confidence Gauge */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-600">Model Inference Confidence:</span>
                <span className="font-bold text-amber-600 font-mono text-sm">
                  {Math.round(alert.confidence * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${Math.round(alert.confidence * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                Consensus reached over 3 consecutive 1.5s audio windows on ESP32-S3.
              </p>
            </div>

            {/* Node Telemetry Snapshot */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase">Node Battery</span>
                <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
                  <Battery className="w-3.5 h-3.5 text-forest-700" />
                  <span>{alert.batteryPercentage}%</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase">Approximate Zone</span>
                <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-tealbrand-600" />
                  <span>{alert.zone}</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase">Telemetry Uplink</span>
                <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
                  <Radio className="w-3.5 h-3.5 text-tealbrand-600" />
                  <span>IN865 LoRa</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase">Timestamp</span>
                <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Optional Evidence Image Placeholder */}
            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
              <Camera className="w-5 h-5 text-slate-400 mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-slate-700">Event-Triggered Visual Evidence (Planned)</p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Low-power OV2640 camera snapshot module disabled to preserve battery. Only acoustic metadata was transmitted.
              </p>
            </div>
          </div>

          {/* Verification Timeline & Ranger Audit Log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-forest-800" />
              <span>Ranger Verification Audit Trail</span>
            </h3>

            {alert.actions && alert.actions.length > 0 ? (
              <div className="space-y-3">
                {alert.actions.map((act) => (
                  <div key={act.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                      <span className="capitalize text-forest-900">{act.action.replace('_', ' ')}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed italic">"{act.note}"</p>
                    <p className="text-[10px] text-slate-400 mt-1">Logged by: {act.userName || act.userId}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-2">
                No verification actions recorded yet. Alert is awaiting ranger review.
              </p>
            )}
          </div>
        </div>

        {/* Right Column (Acoustic Waveform & Spectrogram Analysis) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-forest-700" />
                <span>On-Device Acoustic Feature Extraction</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Processed locally by INMP441 MEMS microphone & ESP32-S3 DSP pipeline
              </p>
            </div>

            {/* Waveform visualizer */}
            <WaveformViewer eventType={alert.eventType} confidence={alert.confidence} />

            {/* Spectrogram visualizer */}
            <SpectrogramViewer confidence={alert.confidence} isChainsaw={isChainsaw} />
          </div>
        </div>
      </div>

      {/* Action modal */}
      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alert={alert}
        onVerify={handleVerify}
      />
    </div>
  );
};
