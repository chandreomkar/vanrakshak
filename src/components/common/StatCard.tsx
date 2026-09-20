import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badgeText?: string;
  variant?: 'default' | 'forest' | 'warning' | 'danger' | 'teal';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  variant = 'default',
  onClick,
}) => {
  const variantStyles = {
    default: {
      bg: 'bg-white',
      border: 'border-slate-200',
      iconBg: 'bg-slate-100 text-slate-700',
      valueColor: 'text-slate-900',
    },
    forest: {
      bg: 'bg-white',
      border: 'border-forest-100',
      iconBg: 'bg-forest-50 text-forest-700',
      valueColor: 'text-forest-900',
    },
    warning: {
      bg: 'bg-white',
      border: 'border-amber-200',
      iconBg: 'bg-amber-50 text-amber-600',
      valueColor: 'text-amber-900',
    },
    danger: {
      bg: 'bg-white',
      border: 'border-red-200',
      iconBg: 'bg-red-50 text-red-600',
      valueColor: 'text-red-700',
    },
    teal: {
      bg: 'bg-white',
      border: 'border-tealbrand-100',
      iconBg: 'bg-tealbrand-50 text-tealbrand-700',
      valueColor: 'text-tealbrand-900',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`${style.bg} border ${style.border} rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{title}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-2xl font-bold tracking-tight ${style.valueColor}`}>{value}</span>
        {badgeText && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
};
