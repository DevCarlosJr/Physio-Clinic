import React from 'react';
import {
  Users,
  CalendarCheck2,
  TrendingUp,
  FileCheck,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { ClinicMetric } from '../../types';

interface StatCardProps {
  metric: ClinicMetric;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  CalendarCheck2,
  TrendingUp,
  FileCheck,
};

export const StatCard: React.FC<StatCardProps> = ({ metric }) => {
  const IconComponent = iconMap[metric.iconName] || TrendingUp;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {metric.label}
        </span>
        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
          {metric.value}
        </span>
        <div
          className={`flex items-center text-xs font-medium ${
            metric.trend === 'up'
              ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200'
              : metric.trend === 'down'
              ? 'text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200'
              : 'text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200'
          }`}
        >
          {metric.trend === 'up' ? (
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
          ) : metric.trend === 'down' ? (
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
          ) : (
            <Minus className="w-3.5 h-3.5 mr-0.5" />
          )}
          <span>{Math.abs(metric.changePercentage)}%</span>
        </div>
      </div>

      <p className="mt-2 text-[11px] text-slate-400 font-medium">
        {metric.timeframe}
      </p>
    </div>
  );
};
