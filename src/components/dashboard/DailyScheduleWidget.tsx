import React from 'react';
import { Calendar, Clock, MapPin, Play, Check, ChevronRight } from 'lucide-react';
import { AppointmentSummary } from '../../types';
import { getStatusDetails } from '../../utils/formatters';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

interface DailyScheduleWidgetProps {
  appointments: AppointmentSummary[];
}

export const DailyScheduleWidget: React.FC<DailyScheduleWidgetProps> = ({ appointments }) => {
  const { setCurrentRoute, addToast, currentRole } = useApp();

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-800">
            Agenda Clínica de Hoje
          </h3>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {appointments.length} atendimentos
          </span>
        </div>
        <button
          onClick={() => setCurrentRoute('agenda')}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
        >
          <span>Ver agenda completa</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 overflow-x-auto">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Nenhum agendamento para hoje.
          </div>
        ) : (
          appointments.map((apt) => {
            const statusInfo = getStatusDetails(apt.status);
            return (
              <div
                key={apt.id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4"
              >
                {/* Time & Room */}
                <div className="flex items-center gap-4 min-w-[120px]">
                  <div className="flex flex-col items-start">
                    <span className="font-mono text-sm font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {apt.time}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {apt.durationMinutes} min
                    </span>
                  </div>

                  <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      {apt.room}
                    </span>
                    {apt.insurance && (
                      <span className="text-[10px] text-slate-400">{apt.insurance}</span>
                    )}
                  </div>
                </div>

                {/* Patient & Service */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {apt.patientName}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${statusInfo.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {apt.service} • <span className="text-slate-600 font-medium">{apt.physiotherapistName}</span>
                  </p>
                </div>

                {/* Actions per role */}
                <div className="flex items-center gap-2 shrink-0">
                  {apt.status === 'scheduled' && currentRole !== 'patient' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToast(`Consulta de ${apt.patientName} confirmada com sucesso!`)}
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                      Confirmar
                    </Button>
                  )}
                  {apt.status === 'confirmed' && currentRole === 'physiotherapist' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        addToast(`Atendimento iniciado para ${apt.patientName}`);
                        setCurrentRoute('prontuarios');
                      }}
                    >
                      <Play className="w-3.5 h-3.5 mr-1" />
                      Chamar
                    </Button>
                  )}
                  {apt.status === 'in_progress' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setCurrentRoute('prontuarios')}
                    >
                      Prontuário
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
