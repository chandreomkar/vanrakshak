import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Alert } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, XCircle, ShieldAlert, UserCheck, AlertTriangle, Loader2 } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert | null;
  onVerify: (id: string, action: string, note: string) => Promise<void>;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  alert,
  onVerify,
}) => {
  const { user, isGuest } = useAuth();
  const [selectedAction, setSelectedAction] = useState<string>('verified');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!alert) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      setError('Guest mode is read-only. Please switch to "Forest Ranger" or "Division Admin" to record verification actions.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onVerify(alert.id, selectedAction, note || `Status updated to ${selectedAction} by ${user?.name || 'Ranger'}`);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update verification status');
    } finally {
      setLoading(false);
    }
  };

  const actionChoices = [
    {
      id: 'verified',
      label: 'Confirm / Verified Activity',
      icon: CheckCircle2,
      color: 'text-forest-800 border-forest-300 bg-forest-50/50',
      description: 'Acoustic audio signature matches suspicious chainsaw harmonics. Ground team alerted.',
    },
    {
      id: 'false_positive',
      label: 'Mark as False Positive',
      icon: XCircle,
      color: 'text-slate-700 border-slate-300 bg-slate-50',
      description: 'Acoustic event was background noise, biological chorus, wind gust, or legal maintenance.',
    },
    {
      id: 'patrol_requested',
      label: 'Request Immediate Ranger Patrol',
      icon: ShieldAlert,
      color: 'text-amber-800 border-amber-300 bg-amber-50/50',
      description: 'Dispatch physical patrol unit to inspect the approximate zone sector.',
    },
    {
      id: 'assigned',
      label: 'Assign for Acoustic Review',
      icon: UserCheck,
      color: 'text-teal-800 border-teal-300 bg-teal-50/50',
      description: 'Escalate to senior acoustics analyst for spectrogram review.',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ranger Decision: Alert ${alert.id}`}
      subtitle={`Node: ${alert.nodeId} (${alert.zone}) • Detected: ${new Date(alert.timestamp).toLocaleTimeString()}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Decision-support disclaimer */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Decision-Support Notice:</strong> This AI alert is a decision-support signal and requires human verification before any enforcement action. All actions are immutably logged in the ranger audit trail.
          </p>
        </div>

        {/* Action radio choices */}
        <div className="space-y-2">
          <label className="block text-slate-700 font-semibold">Select Ranger Action:</label>
          <div className="grid grid-cols-1 gap-2">
            {actionChoices.map((choice) => {
              const Icon = choice.icon;
              const isSelected = selectedAction === choice.id;
              return (
                <div
                  key={choice.id}
                  onClick={() => setSelectedAction(choice.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? `${choice.color} ring-2 ring-forest-600 shadow-xs`
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <Icon className="w-4 h-4" />
                    <span>{choice.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 pl-6">{choice.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Note input */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Verification Notes & Rationale (Mandatory for audit trail):
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Checked waveform harmonics; dispatched Patrol Team 2 to sector B-3 trailhead..."
            className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </div>

        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
            {error}
          </div>
        )}

        {isGuest && (
          <p className="text-[11px] text-amber-700 italic">
            Note: You are currently viewing as "Hackathon Guest" (read-only). Switch to "Forest Ranger" via the top menu to record actions.
          </p>
        )}

        {/* Footer buttons */}
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
            disabled={loading || isGuest}
            className="px-5 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 active:scale-95 text-white font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Commit Decision</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
