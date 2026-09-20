import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface DemoBadgeProps {
  compact?: boolean;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-300">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span>Prototype Demo Mode — Using Simulated Sensor Data</span>
      </span>
    );
  }

  return (
    <aside aria-label="Prototype demo mode notification" className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <strong className="font-semibold tracking-wide uppercase text-[11px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-900">
          Prototype Demo Mode
        </strong>
        <span className="font-medium text-amber-900">
          Using Simulated Sensor Data — Fictional Demonstration Zones
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-amber-800 text-[11px]">
        <Info className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
        <span>AI alerts represent decision-support signals requiring human verification. No live forest sensors are connected.</span>
      </div>
    </aside>
  );
};
