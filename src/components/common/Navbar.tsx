import React, { useState } from 'react';
import { Shield, Radio, Sparkles, User, ChevronDown, Menu, X, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenSimulation: () => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSimulation,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const { user, role, switchRole } = useAuth();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roleOptions: { role: UserRole; label: string; title: string }[] = [
    { role: 'ranger', label: 'Forest Ranger', title: 'Ranger Vikram Singh' },
    { role: 'admin', label: 'Division Admin', title: 'Admin Anita Roy' },
    { role: 'guest', label: 'Guest Evaluator', title: 'Hackathon Guest' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center shadow-md shadow-forest-900/10 text-white">
              <Shield className="w-5 h-5 text-tealbrand-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-forest-900">VanRakshak</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-forest-100 text-forest-800 font-semibold">वनरक्षक</span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">Acoustic Edge-AI Forest Protection</p>
            </div>
          </div>
        </div>

        {/* Center: LoRa Gateway Status Indicator */}
        <div className="hidden lg:flex items-center gap-4 text-xs bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-700">LoRa Gateway Active</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Radio className="w-3.5 h-3.5 text-tealbrand-500" />
            <span>IN865 (865.06 MHz) • WPC Compliant</span>
          </div>
        </div>

        {/* Right: Simulation Button & Role Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all text-white font-medium text-xs rounded-lg shadow-sm shadow-amber-500/20"
            title="Trigger synthetic acoustic chainsaw alert"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Simulate Chainsaw Alert</span>
            <span className="sm:hidden">Simulate</span>
          </button>

          {/* Role switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-medium text-slate-700 shadow-sm focus:outline-none"
            >
              <div className="w-6 h-6 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-[11px]">
                {user?.name ? user.name.charAt(0) : 'R'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-[11px] font-bold text-forest-900 leading-tight">{user?.name || 'Ranger'}</p>
                <p className="text-[10px] text-slate-500 capitalize">{role} role</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Switch Demo Persona</p>
                </div>
                {roleOptions.map((opt) => (
                  <button
                    key={opt.role}
                    onClick={() => {
                      switchRole(opt.role);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                      role === opt.role ? 'bg-forest-50/70 text-forest-900 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{opt.title}</p>
                      <p className="text-[10px] text-slate-500">{opt.label}</p>
                    </div>
                    {role === opt.role && <Check className="w-4 h-4 text-forest-700" />}
                  </button>
                ))}
                <div className="px-3 pt-2 mt-1 border-t border-slate-100 text-[10px] text-slate-400">
                  <span>Demo Mode: 1-click role authentication</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
