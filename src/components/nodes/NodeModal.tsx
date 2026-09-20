import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { SensorNode, NodeStatus } from '../../types';
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react';

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: SensorNode | null;
  onSave: (data: Partial<SensorNode>) => Promise<void>;
  onDelete?: (nodeId: string) => Promise<void>;
  isDeleteMode?: boolean;
}

export const NodeModal: React.FC<NodeModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  onDelete,
  isDeleteMode = false,
}) => {
  const [nodeId, setNodeId] = useState('');
  const [name, setName] = useState('');
  const [zone, setZone] = useState('Zone A');
  const [status, setStatus] = useState<NodeStatus>('online');
  const [batteryPercentage, setBatteryPercentage] = useState(90);
  const [solarCharging, setSolarCharging] = useState(true);
  const [signalStrength, setSignalStrength] = useState(-78);
  const [firmwareVersion, setFirmwareVersion] = useState('1.2.0-esp32s3');
  const [modelVersion, setModelVersion] = useState('vanrakshak-tinyml-v1.4');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setNodeId(initialData.nodeId);
      setName(initialData.name);
      setZone(initialData.zone);
      setStatus(initialData.status);
      setBatteryPercentage(initialData.batteryPercentage);
      setSolarCharging(initialData.solarCharging);
      setSignalStrength(initialData.signalStrength);
      setFirmwareVersion(initialData.firmwareVersion);
      setModelVersion(initialData.modelVersion);
    } else {
      setNodeId(`VR-0${Math.floor(Math.random() * 90) + 10}`);
      setName('Simulated Forest Node');
      setZone('Zone A');
      setStatus('online');
      setBatteryPercentage(95);
      setSolarCharging(true);
      setSignalStrength(-75);
      setFirmwareVersion('1.2.0-esp32s3');
      setModelVersion('vanrakshak-tinyml-v1.4');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave({
        nodeId,
        name,
        zone,
        status,
        batteryPercentage: Number(batteryPercentage),
        solarCharging,
        signalStrength: Number(signalStrength),
        firmwareVersion,
        modelVersion,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save node');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData || !onDelete) return;
    setLoading(true);
    setError(null);
    try {
      await onDelete(initialData.nodeId);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete node');
    } finally {
      setLoading(false);
    }
  };

  if (isDeleteMode && initialData) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Decommission Node ${initialData.nodeId}`}
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Permanent Node Deletion</p>
              <p className="text-[11px] text-red-800 mt-0.5">
                Are you sure you want to remove <strong>{initialData.nodeId}</strong> ({initialData.name}) from the fleet registry?
              </p>
            </div>
          </div>

          {error && <div className="text-red-600 text-xs">{error}</div>}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <Trash2 className="w-4 h-4" />
              <span>Confirm Delete</span>
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Node ${initialData.nodeId}` : 'Register New Edge Sensor Node'}
      subtitle="Solar-powered acoustic sensing node with ESP32-S3 and LoRa telemetry"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Node Identifier:</label>
            <input
              type="text"
              required
              disabled={Boolean(initialData)}
              value={nodeId}
              onChange={(e) => setNodeId(e.target.value.toUpperCase())}
              placeholder="e.g. VR-07"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 disabled:bg-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-forest-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Assigned Zone:</label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
            >
              <option value="Zone A">Zone A (North Canopy)</option>
              <option value="Zone B">Zone B (Valley Corridor)</option>
              <option value="Zone C">Zone C (Riverine Border)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Descriptive Node Label:</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Simulated Hilltop Edge Node"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Operating Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as NodeStatus)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
            >
              <option value="online">Online (Active Listening)</option>
              <option value="warning">Warning (Recent Acoustic Event)</option>
              <option value="offline">Offline (No Telemetry)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Battery Percentage ({batteryPercentage}%):</label>
            <input
              type="number"
              min="0"
              max="100"
              value={batteryPercentage}
              onChange={(e) => setBatteryPercentage(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="solarCharging"
            checked={solarCharging}
            onChange={(e) => setSolarCharging(e.target.checked)}
            className="w-4 h-4 accent-forest-700 rounded cursor-pointer"
          />
          <label htmlFor="solarCharging" className="text-slate-700 font-medium cursor-pointer">
            Solar charging active (Solar panel providing positive charge current)
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">LoRa Signal RSSI (dBm):</label>
            <input
              type="number"
              value={signalStrength}
              onChange={(e) => setSignalStrength(Number(e.target.value))}
              placeholder="-80"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-forest-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Firmware Version:</label>
            <input
              type="text"
              value={firmwareVersion}
              onChange={(e) => setFirmwareVersion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-forest-600"
            />
          </div>
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{initialData ? 'Update Node' : 'Register Node'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
