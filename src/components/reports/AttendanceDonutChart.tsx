import React from 'react';
import { UserCheck, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import { AttendanceStatusDistribution } from '../../types/reports';

interface AttendanceDonutChartProps {
  distribution: AttendanceStatusDistribution;
}

export const AttendanceDonutChart: React.FC<AttendanceDonutChartProps> = ({ distribution }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-teal-600" />
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Taxa de Comparecimento vs No-Show
            </h3>
            <p className="text-xs text-slate-500">
              Assiduidade e retenção de pacientes nas consultas
            </p>
          </div>
        </div>

        <span className="font-mono text-xs font-bold text-slate-500">
          {distribution.totalAppointments} agendamentos
        </span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex shadow-2xs">
          <div
            style={{ width: `${distribution.attendanceRate}%` }}
            className="bg-emerald-500 h-full transition-all"
            title={`Compareceram: ${distribution.attendanceRate}%`}
          />
          <div
            style={{ width: `${distribution.cancellationRate}%` }}
            className="bg-amber-400 h-full transition-all"
            title={`Cancelamentos: ${distribution.cancellationRate}%`}
          />
          <div
            style={{ width: `${distribution.noShowRate}%` }}
            className="bg-rose-500 h-full transition-all"
            title={`No-show (Faltas): ${distribution.noShowRate}%`}
          />
        </div>

        {/* Legend Cards */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] text-emerald-700 block font-semibold">Compareceram</span>
            <span className="text-lg font-black text-emerald-900 font-mono">
              {distribution.attendanceRate}%
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5 font-mono">
              {distribution.completedCount} consultas
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[10px] text-amber-700 block font-semibold">Cancelamentos</span>
            <span className="text-lg font-black text-amber-900 font-mono">
              {distribution.cancellationRate}%
            </span>
            <span className="text-[10px] text-amber-600 block mt-0.5 font-mono">
              {distribution.cancelledCount} consultas
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-[10px] text-rose-700 block font-semibold">Faltas (No-Show)</span>
            <span className="text-lg font-black text-rose-900 font-mono">
              {distribution.noShowRate}%
            </span>
            <span className="text-[10px] text-rose-600 block mt-0.5 font-mono">
              {distribution.noShowCount} ausências
            </span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 text-center italic pt-1">
        Índice de no-show mantido abaixo da média nacional de clínicas fisioterapêuticas (5.0%).
      </p>
    </div>
  );
};
