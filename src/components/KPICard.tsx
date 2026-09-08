import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  id?: string;
  title: string;
  value: string | number;
  unit?: string;
  changePct?: number;
  changeLabel?: string;
  comparisonText?: string;
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
  changeLabel,
  comparisonText,
  icon,
  status = 'normal',
  secondaryInfo,
}) => {
  const isPositive = changePct !== undefined && changePct > 0;
  const isNegative = changePct !== undefined && changePct < 0;
  const isNeutral = changePct !== undefined && changePct === 0;

  return (
    <div
      id={id}
      className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
          <div className="text-slate-400">
            {icon}
          </div>
        </div>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </span>
          {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
        {comparisonText ? (
          <span
            className={`font-semibold flex items-center gap-1 ${
              status === 'danger'
                ? 'text-rose-600'
                : status === 'warning'
                ? 'text-amber-600'
                : status === 'success'
                ? 'text-emerald-600'
                : 'text-blue-600'
            }`}
          >
            {comparisonText}
          </span>
        ) : changePct !== undefined ? (
          <span
            className={`font-semibold flex items-center gap-0.5 ${
              isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-slate-500'
            }`}
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {isNeutral && <Minus className="h-3 w-3" />}
            {isPositive ? `+${changePct}%` : `${changePct}%`}
            {changeLabel && <span className="text-slate-400 font-normal ml-0.5">{changeLabel}</span>}
          </span>
        ) : (
          <span className="text-slate-400">{changeLabel || '—'}</span>
        )}

        {secondaryInfo && (
          <span className="font-medium text-slate-500 truncate max-w-[120px]">{secondaryInfo}</span>
        )}
      </div>
    </div>
  );
};

