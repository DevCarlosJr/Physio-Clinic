import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Users,
  Award,
  Printer,
  Download,
  ShieldCheck,
  DoorOpen,
  PieChart,
} from 'lucide-react';
import {
  mockMonthlyAttendance,
  mockBoxesOccupancy,
  mockPhysioPerformance,
  mockClinicalOutcomes,
  mockServicesDistribution,
  mockInsuranceDistribution,
} from '../data/mockReportsData';
import { ReportTimeframe } from '../types/reports';
import { Button } from '../components/common/Button';
import { OccupancyChart } from '../components/reports/OccupancyChart';
import { AttendanceDonutChart } from '../components/reports/AttendanceDonutChart';
import { ClinicalOutcomeCard } from '../components/reports/ClinicalOutcomeCard';
import { useApp } from '../context/AppContext';

export const ReportsPage: React.FC = () => {
  const { addToast } = useApp();
  const [timeframe, setTimeframe] = useState<ReportTimeframe>('this_month');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Relatórios & Métricas Clínicas</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Indicadores de ocupação de boxes, assiduidade, eficácia terapêutica e produtividade
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs text-xs">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                timeframe === 'today' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setTimeframe('this_week')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                timeframe === 'this_week' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600'
              }`}
            >
              Esta Semana
            </button>
            <button
              onClick={() => setTimeframe('this_month')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                timeframe === 'this_month' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600'
              }`}
            >
              Este Mês
            </button>
            <button
              onClick={() => setTimeframe('this_quarter')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                timeframe === 'this_quarter' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600'
              }`}
            >
              Trimestre
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<Printer className="w-3.5 h-3.5" />}
            onClick={handlePrint}
          >
            Imprimir Relatório
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Consultas Realizadas
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {mockMonthlyAttendance.completedCount}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Volume acumulado</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Ocupação da Clínica
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-teal-800">83.6%</span>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded">
              Meta: 80%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">4 boxes monitorados</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Taxa de Comparecimento
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {mockMonthlyAttendance.attendanceRate}%
            </span>
            <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">
              Faltas: 3.8%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Baixo índice de no-show</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Espera na Recepção
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-800">6.8 min</span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              Excelente
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Check-in até entrada em sala</span>
        </div>
      </div>

      {/* Grid: Occupancy Chart + Attendance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OccupancyChart occupancyData={mockBoxesOccupancy} />
        <AttendanceDonutChart distribution={mockMonthlyAttendance} />
      </div>

      {/* Clinical Outcome: EVA Pain Reduction */}
      <ClinicalOutcomeCard outcomes={mockClinicalOutcomes} />

      {/* Physiotherapist Productivity Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Produtividade e Eficácia Clínica da Equipe
            </h3>
            <p className="text-slate-400 text-xs">
              Atendimentos realizados, ocupação individual e índice de alívio de dor
            </p>
          </div>
          <span className="font-mono text-xs text-slate-500 font-semibold">
            {mockPhysioPerformance.length} especialistas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Fisioterapeuta</th>
                <th className="py-3 px-4">Especialidade</th>
                <th className="py-3 px-4 text-center">Consultas Feitas</th>
                <th className="py-3 px-4 text-center">Pacientes Ativos</th>
                <th className="py-3 px-4 text-center">Alívio Médio EVA</th>
                <th className="py-3 px-5 text-right">Taxa de Ocupação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockPhysioPerformance.map((item) => (
                <tr key={item.physioId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900">
                    {item.physioName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {item.specialty}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                    {item.completedAppointments}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                    {item.activePatientsCount}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      -{item.avgPainReductionEVA} pts
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-teal-800">
                    {item.occupancyPercentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution: Procedures & Insurances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Procedures */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-2">
            Demanda por Procedimento / Serviço
          </h4>
          <div className="space-y-2.5">
            {mockServicesDistribution.map((srv) => (
              <div key={srv.serviceName} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{srv.serviceName}</span>
                  <span className="font-mono font-bold text-slate-700">
                    {srv.percentage}% ({srv.appointmentsCount})
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${srv.percentage}%` }}
                    className="bg-teal-600 h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insurances */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-2">
            Distribuição por Modalidade / Convênio
          </h4>
          <div className="space-y-2.5">
            {mockInsuranceDistribution.map((ins) => (
              <div key={ins.modalityName} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{ins.modalityName}</span>
                  <span className="font-mono font-bold text-slate-700">
                    {ins.percentage}% ({ins.appointmentsCount})
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${ins.percentage}%` }}
                    className="bg-emerald-500 h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
