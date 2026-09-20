import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  Cpu,
  Activity,
  Network,
  TreePine,
  BookOpen,
  Radio,
  FileCode2,
} from 'lucide-react';

interface SidebarProps {
  pendingAlertCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pendingAlertCount = 0,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems = [
    {
      to: '/',
      label: 'Overview Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/alerts',
      label: 'Live Alerts',
      icon: Bell,
      badge: pendingAlertCount > 0 ? pendingAlertCount : null,
    },
    {
      to: '/nodes',
      label: 'Sensor Nodes',
      icon: Cpu,
    },
    {
      to: '/sound-analysis',
      label: 'Sound Analysis & Edge-AI',
      icon: Activity,
    },
    {
      to: '/architecture',
      label: 'System Architecture',
      icon: Network,
    },
    {
      to: '/impact',
      label: 'Climate & Biodiversity Impact',
      icon: TreePine,
    },
    {
      to: '/project-info',
      label: 'Project Information',
      icon: BookOpen,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 select-none">
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Forest Monitoring
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-forest-50 text-forest-800 font-semibold shadow-sm border-l-4 border-forest-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className="w-4 h-4 flex-shrink-0 text-slate-500 group-hover:text-slate-900" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-alert-red text-white shadow-sm animate-pulse">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Hardware & Gateway
        </div>

        <div className="p-3 bg-tealbrand-50/60 rounded-xl border border-tealbrand-100 text-xs text-tealbrand-900">
          <div className="flex items-center gap-1.5 font-semibold text-tealbrand-900 mb-1">
            <Radio className="w-3.5 h-3.5 text-tealbrand-700" />
            <span>LoRa IN865 Telemetry</span>
          </div>
          <p className="text-[11px] text-tealbrand-800 leading-relaxed">
            Sub-GHz RF channel 865.0625 MHz configured for low-power edge alerts under Indian WPC rules.
          </p>
          <div className="mt-2 text-[10px] text-tealbrand-700 font-mono flex items-center gap-1">
            <FileCode2 className="w-3 h-3" />
            <span>POST /api/ingest/alert</span>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="p-3 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50/50">
        <p className="font-semibold text-slate-700">VanRakshak Prototype v1.0</p>
        <p className="text-[10px] text-slate-400">AI for Climate Change Hackathon</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-[calc(100vh-4rem)] sticky top-16 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 w-64 max-w-[80%] h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
