import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  XCircle,
  AlertTriangle,
  UserCheck,
  Building,
  Filter,
  BarChart3,
  CalendarDays,
  Sparkles,
  Download,
} from 'lucide-react';
import { PeriodFilter, DashboardFilterState } from '../../../types/dashboard';
import {
  mockPeriodAppointmentsData,
  mockProfessionalOccupancy,
  mockTimeSlotsHeatmap,
} from '../../../data/dashboardMockData';
import { mockMetrics, mockTodayAppointments, mockRecentPatients } from '../../../data/mockInitialData';
import { DailyScheduleWidget } from '../DailyScheduleWidget';
import { RecentPatientsWidget } from '../RecentPatientsWidget';
import { ClinicOccupancyWidget } from '../ClinicOccupancyWidget';
import { QuickActionsGrid } from '../QuickActionsGrid';
import { Button } from '../../common/Button';
import { useApp } from '../../../context/AppContext';

export const AdminDashboardView: React.FC = () => {
  const { addToast } = useApp();
  const [filters, setFilters] = useState<DashboardFilterState>({
    period: '7days',
    professionalId: 'all',
    serviceType: 'all',
  });

  const chartPoints = mockPeriodAppointmentsData[filters.period] || mockPeriodAppointmentsData['7days'];
  const maxVal = Math.max(...chartPoints.map((p) => p.value), 1);

  return (
    <div className="space-y-6">
      {/* Filter and Period Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold text-slate-800">Filtros Executivos:</span>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
            {(['today', '7days', '30days', 'month'] as PeriodFilter[]).map((p) => (
              <button
                key={p}
                onClick={() => setFilters({ ...filters, period: p })}
                className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  filters.period === p
                    ? 'bg-white text-teal-800 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p === 'today' && 'Hoje'}
                {p === '7days' && '7 Dias'}
                {p === '30days' && '30 Dias'}
                {p === 'month' && 'Este Mês'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <select
            value={filters.professionalId}
            onChange={(e) => setFilters({ ...filters, professionalId: e.target.value })}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
          >
            <option value="all">Todos os Especialistas</option>
            <option value="p1">Dr. Lucas Silveira (Ortopedia)</option>
            <option value="p2">Dra. Camila Ramos (RPG/Coluna)</option>
            <option value="p3">Dr. Thiago Medeiros (Respiratória)</option>
            <option value="p4">Dra. Helena Vasconcelos (Neuro)</option>
          </select>

          <Button
            size="sm"
            variant="outline"
            icon={<Download className="w-3.5 h-3.5 text-slate-500" />}
            onClick={() => addToast('Relatório consolidado exportado (Fase 13)')}
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Grid (8 Cards according to item 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Pacientes Ativos
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">148</span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              +12.5%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">34 novos este mês</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Consultas Hoje
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-teal-800">26</span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              88% cap.
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">4 especialistas em sala</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Taxa de Ocupação
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">84.2%</span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              +5.1%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Média de 4 boxes ativos</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Cancelamentos & Faltas
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-800">3.8%</span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              -1.4%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Baixa taxa de no-show</span>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <QuickActionsGrid />

      {/* Charts Section: Appointments trend + Professional Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Volume Chart (Custom SVG Responsive Bar Chart) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-800">
                Volume de Consultas ({filters.period === 'today' ? 'Hoje por Faixa' : 'Por Período'})
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Total:{' '}
              <strong className="text-slate-800">
                {chartPoints.reduce((acc, curr) => acc + curr.value, 0)} atendimentos
              </strong>
            </span>
          </div>

          {/* Clean Interactive SVG Bar Graphic */}
          <div className="h-52 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2 border-b border-slate-100">
            {chartPoints.map((point) => {
              const heightPercent = Math.max((point.value / maxVal) * 100, 10);
              return (
                <div key={point.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {point.value}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[48px] rounded-t-md bg-teal-600 group-hover:bg-teal-500 transition-all shadow-2xs relative"
                  />
                  <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Legenda: Consultas realizadas e confirmadas</span>
            <span className="text-emerald-700 font-semibold">Meta Semanal: 90% Atingida</span>
          </div>
        </div>

        {/* Professional Occupancy Gauge list */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-800">Ocupação por Fisioterapeuta</h3>
            </div>
          </div>

          <div className="space-y-3.5">
            {mockProfessionalOccupancy.map((prof) => (
              <div key={prof.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                    {prof.label}
                  </span>
                  <span className="font-mono font-bold text-teal-800">{prof.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${prof.percentage}%` }}
                    className={`h-full rounded-full ${
                      (prof.percentage || 0) >= 90
                        ? 'bg-emerald-600'
                        : (prof.percentage || 0) >= 80
                        ? 'bg-teal-600'
                        : 'bg-amber-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Busiest Peak Hours */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Horários de Maior Demanda
            </span>
            <div className="space-y-1.5 text-xs">
              {mockTimeSlotsHeatmap.slice(0, 3).map((slot) => (
                <div key={slot.label} className="flex items-center justify-between text-slate-600">
                  <span>{slot.label}</span>
                  <span className="font-mono text-teal-700 font-semibold">{slot.value}% lotado</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Schedule & Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DailyScheduleWidget appointments={mockTodayAppointments} />
          <RecentPatientsWidget patients={mockRecentPatients} />
        </div>
        <div className="space-y-6">
          <ClinicOccupancyWidget />
        </div>
      </div>
    </div>
  );
};
