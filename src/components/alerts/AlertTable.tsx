import React from 'react';
import { Alert, AlertEventType, AlertStatus } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Clock,
  Battery,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface AlertTableProps {
  alerts: Alert[];
  onOpenVerification: (alert: Alert) => void;
  filterEvent: string;
  setFilterEvent: (val: string) => void;
  filterZone: string;
  setFilterZone: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
}

export const AlertTable: React.FC<AlertTableProps> = ({
  alerts,
  onOpenVerification,
  filterEvent,
  setFilterEvent,
  filterZone,
  setFilterZone,
  filterStatus,
  setFilterStatus,
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending Review
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        );
      case 'false_positive':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <XCircle className="w-3 h-3 text-slate-500" />
            False Positive
          </span>
        );
      case 'patrol_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-900 border border-red-300">
            <ShieldAlert className="w-3 h-3 text-red-600" />
            Patrol Dispatched
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-100 text-teal-900 border border-teal-300">
            Assigned
          </span>
        );
    }
  };

  const formatEventType = (type: AlertEventType) => {
    switch (type) {
      case 'possible_chainsaw':
        return (
          <span className="font-semibold text-amber-950 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Possible chainsaw activity
          </span>
        );
      case 'soundscape_anomaly':
        return <span className="font-semibold text-teal-900">Soundscape anomaly</span>;
      case 'background':
        return <span className="text-slate-600">Background soundscape</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Filter Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Filter className="w-4 h-4 text-forest-700" />
          <span>Filter Alert Queue ({alerts.length} Records)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Filter: Event */}
          <select
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-forest-600 text-xs"
          >
            <option value="all">All Event Types</option>
            <option value="possible_chainsaw">Possible Chainsaw</option>
            <option value="soundscape_anomaly">Soundscape Anomaly</option>
          </select>

          {/* Filter: Zone */}
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-forest-600 text-xs"
          >
            <option value="all">All Zones</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
            <option value="Zone C">Zone C</option>
          </select>

          {/* Filter: Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-forest-600 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="verified">Verified</option>
            <option value="false_positive">False Positive</option>
            <option value="patrol_requested">Patrol Dispatched</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-4">Alert ID</th>
              <th className="py-3.5 px-4">Node / Zone</th>
              <th className="py-3.5 px-4">Classified Event</th>
              <th className="py-3.5 px-4">Confidence</th>
              <th className="py-3.5 px-4">Detected At</th>
              <th className="py-3.5 px-4">Battery</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Ranger Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No alerts match the selected criteria.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/alerts/${alert.id}`)}
                >
                  <td className="py-3 px-4 font-mono font-bold text-forest-900">
                    {alert.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{alert.nodeId}</div>
                    <div className="text-[11px] text-slate-400">{alert.zone}</div>
                  </td>
                  <td className="py-3 px-4">{formatEventType(alert.eventType)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            alert.confidence >= 0.85 ? 'bg-amber-500' : 'bg-tealbrand-500'
                          }`}
                          style={{ width: `${Math.round(alert.confidence * 100)}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800">
                        {Math.round(alert.confidence * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(alert.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Battery className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.batteryPercentage}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(alert.status)}</td>
                  <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onOpenVerification(alert)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-forest-50 hover:text-forest-800 hover:border-forest-300 font-semibold text-slate-700 transition-all shadow-2xs"
                    >
                      Verify / Action
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
