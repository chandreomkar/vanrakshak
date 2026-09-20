import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { SensorNode } from '../../types';
import { api } from '../../services/api';
import { mockStorage } from '../../services/mockStorage';
import { Sparkles, AlertTriangle, Radio, CheckCircle2, Loader2, Volume2 } from 'lucide-react';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: SensorNode[];
  onSimulationComplete: () => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  nodes,
  onSimulationComplete,
}) => {
  const effectiveNodes = nodes && nodes.length > 0 ? nodes : mockStorage.getNodes();
  const [targetNodeId, setTargetNodeId] = useState<string>(effectiveNodes[0]?.nodeId || 'VR-03');
  const [confidence, setConfidence] = useState<number>(0.92);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (effectiveNodes.length > 0 && !targetNodeId) {
      setTargetNodeId(effectiveNodes[0].nodeId);
    }
  }, [effectiveNodes, targetNodeId]);

  const handleSimulateChainsaw = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.simulateChainsawAlert(targetNodeId, confidence);
      setResult(res);
      onSimulationComplete();
    } catch (err: any) {
      setError(err.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateBackground = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.simulateBackgroundEvent(targetNodeId);
      setResult({
        success: true,
        simulated: true,
        message: `Heartbeat telemetry recorded for ${res.nodeId}. Status: Online, Battery: ${res.batteryPercentage}%.`,
      });
      onSimulationComplete();
    } catch (err: any) {
      setError(err.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setResult(null);
        setError(null);
        onClose();
      }}
      title="Acoustic Edge-AI Alert Simulator"
      subtitle="Prototype simulation engine for testing Ranger response workflows"
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs">
        {/* Mandatory Honesty Warning */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-950">Prototype Simulation Notice</p>
            <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
              This creates synthetic prototype data and does not represent a real forest event.
              It exercises the exact edge-to-cloud pipeline, multi-window confirmation logic, and LoRa packet formatting.
            </p>
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Target Edge Node:</label>
            <select
              value={targetNodeId}
              onChange={(e) => setTargetNodeId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              {effectiveNodes.map((node) => (
                <option key={node.id} value={node.nodeId}>
                  {node.nodeId} — {node.name} ({node.zone}, Battery: {node.batteryPercentage}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-700 font-semibold">Simulated Model Confidence:</label>
              <span className="font-mono font-bold text-forest-800">{Math.round(confidence * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.70"
              max="0.99"
              step="0.01"
              value={confidence}
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
              className="w-full accent-forest-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>70% (Borderline)</span>
              <span>85% (Detection Threshold)</span>
              <span>99% (High Confidence)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 space-y-1 text-[11px]">
            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-tealbrand-600" />
              <span>Simulated Transmission Packet:</span>
            </p>
            <p>• Payload format: Compact event packet (Node ID, eventType, confidence, battery, seqNum)</p>
            <p>• Frequency: IN865 (865.0625 MHz), India WPC GSR 564(E) license-exempt</p>
            <p>• Multi-window voting: 3 consecutive 1.5s audio analysis windows above threshold</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={handleSimulateChainsaw}
            disabled={loading}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Simulate Chainsaw Alert</span>
          </button>

          <button
            onClick={handleSimulateBackground}
            disabled={loading}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Volume2 className="w-4 h-4 text-slate-500" />
            <span>Send Background Heartbeat</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
            {error}
          </div>
        )}

        {/* Simulation Output Card */}
        {result && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Synthetic Event Emitted & Recorded</span>
            </div>
            <p className="text-[11px] text-emerald-900 leading-relaxed">
              {result.disclaimer || result.message}
            </p>
            {result.alert && (
              <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-200 font-mono text-[11px] text-slate-700 space-y-0.5">
                <div>Alert ID: <strong className="text-forest-900">{result.alert.id}</strong></div>
                <div>Node ID: <strong>{result.alert.nodeId}</strong> ({result.alert.zone})</div>
                <div>Confidence: <strong>{Math.round(result.alert.confidence * 100)}%</strong></div>
                <div>Battery: <strong>{result.alert.batteryPercentage}%</strong> (-1% RF burst)</div>
                <div>Status: <span className="text-amber-700 font-bold">Pending Human Verification</span></div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
