import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Check, User, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { switchRole, role } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>(role || 'ranger');
  const [loading, setLoading] = useState(false);

  const personas: { role: UserRole; title: string; subtitle: string; desc: string }[] = [
    {
      role: 'ranger',
      title: 'Forest Ranger Persona',
      subtitle: 'Ranger Vikram Singh (Field Operations)',
      desc: 'Full operational access: triage live acoustic alerts, verify chainsaw events, and request field patrols.',
    },
    {
      role: 'admin',
      title: 'Division Officer Persona',
      subtitle: 'Officer Anita Roy (Forest Division Admin)',
      desc: 'Administrative access: configure edge nodes, update detection thresholds, and manage fleet registrations.',
    },
    {
      role: 'guest',
      title: 'Hackathon Guest Persona',
      subtitle: 'Evaluation Guest Mode',
      desc: 'Read-only exploratory access: view dashboard, explore sound analysis, and inspect architecture diagrams.',
    },
  ];

  const handleLogin = async () => {
    setLoading(true);
    try {
      await switchRole(selectedRole);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 text-tealbrand-300 flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">VanRakshak Authentication</h1>
          <p className="text-xs text-slate-500">
            Prototype Demo Access — 1-Click Role Selection for Evaluators
          </p>
        </div>

        {/* Demo Persona Cards */}
        <div className="space-y-2.5">
          <label className="block text-xs font-semibold text-slate-700">
            Choose Evaluation Persona:
          </label>
          {personas.map((p) => {
            const isSelected = selectedRole === p.role;
            return (
              <div
                key={p.role}
                onClick={() => setSelectedRole(p.role)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-forest-800 bg-forest-50/50 ring-2 ring-forest-700/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-slate-900">{p.title}</p>
                    <p className="text-[11px] text-forest-800 font-medium">{p.subtitle}</p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-forest-800 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 active:scale-98 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <span>Enter VanRakshak Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center text-[11px] text-slate-400">
          <span>Prototype Demo Mode • Zero external cloud credentials required</span>
        </div>
      </div>
    </div>
  );
};
