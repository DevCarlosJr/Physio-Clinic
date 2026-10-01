import React from 'react';
import { AppointmentRecord } from '../../../types/appointment';
import { getStatusDetails, formatPhone } from '../../../utils/formatters';
import { Clock, MapPin, User, Phone, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '../../common/Button';

interface ListViewProps {
  appointments: AppointmentRecord[];
  onSelectAppointment: (appointment: AppointmentRecord) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  appointments,
  onSelectAppointment,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-5">Data / Horário</th>
              <th className="py-3 px-4">Paciente</th>
              <th className="py-3 px-4">Procedimento / Fisioterapeuta</th>
              <th className="py-3 px-4">Sala / Box</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Nenhum agendamento encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              appointments.map((apt) => {
                const statusInfo = getStatusDetails(apt.status);
                return (
                  <tr
                    key={apt.id}
                    onClick={() => onSelectAppointment(apt)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{apt.date}</div>
                      <div className="font-mono text-teal-700 flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {apt.startTime} - {apt.endTime}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{apt.patientName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {formatPhone(apt.patientPhone)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{apt.serviceName}</div>
                      <div className="text-[11px] text-teal-700">{apt.physiotherapistName}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {apt.roomName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${statusInfo.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                        {statusInfo.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectAppointment(apt)}
                      >
                        Detalhes
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
