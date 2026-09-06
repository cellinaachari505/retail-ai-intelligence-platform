import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  id?: string;
  title: string;
  value: string | number;
  unit?: string;
  changePct?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  status?: 'normal' | 'warning' | 'danger' | 'success';
  secondaryInfo?: string;
  progressPct?: number;
}

export const KPICard: React.FC<KPICardProps> = ({
  id,
  title,
  value,
  unit,
  changePct,
  changeLabel = 'vs prev. period',
  icon,
  status = 'normal',
  secondaryInfo,
  progressPct,
}) => {
  const isPositive = changePct !== undefined && changePct > 0;
  const isNegative = changePct !== undefined && changePct < 0;
  const isNeutral = changePct !== undefined && changePct === 0;

  // Modern SaaS color map for micro-progress bar & accents
  const barColors = {
    normal: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
  };

  const trendColors = {
    normal: 'text-blue-600',
    success: 'text-emerald-500',
    warning: 'text-amber-600',
    danger: 'text-rose-500',
  };

  // Determine bar width
  const calcWidth = progressPct !== undefined 
    ? Math.min(100, Math.max(10, progressPct))
    : status === 'danger' ? 90 : status === 'warning' ? 75 : status === 'success' ? 85 : 65;

  return (
    <div
      id={id}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">{title}</p>
          <div className="text-slate-400">
            {icon}
          </div>
        </div>

        <div className="flex items-end justify-between mt-1.5">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            {value} {unit && <span className="text-sm font-normal text-slate-500">{unit}</span>}
          </h3>

          {changePct !== undefined ? (
            <span
              className={`text-xs font-bold flex items-center gap-0.5 ${
                isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-slate-500'
              }`}
            >
              {isPositive && <TrendingUp className="h-3 w-3" />}
              {isNegative && <TrendingDown className="h-3 w-3" />}
              {isNeutral && <Minus className="h-3 w-3" />}
              {isPositive ? `+${changePct}%` : `${changePct}%`}
            </span>
          ) : secondaryInfo ? (
            <span className="text-[11px] font-medium text-slate-400">{secondaryInfo}</span>
          ) : null}
        </div>
      </div>

      {/* Modern SaaS micro progress bar */}
      <div className="mt-3">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`${barColors[status]} h-full rounded-full transition-all duration-500`}
            style={{ width: `${calcWidth}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
          <span>{changeLabel}</span>
          {secondaryInfo && changePct !== undefined && (
            <span className="font-medium text-slate-600 truncate max-w-[130px]">{secondaryInfo}</span>
          )}
        </div>
      </div>
    </div>
  );
};
