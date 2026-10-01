import React from 'react';
import { AppointmentRecord } from '../../../types/appointment';
import { getStatusDetails } from '../../../utils/formatters';
import { Clock, Plus, MapPin, User, CheckCircle2 } from 'lucide-react';

interface DayViewProps {
  selectedDate: string;
  appointments: AppointmentRecord[];
  onSelectAppointment: (appointment: AppointmentRecord) => void;
  onSelectEmptySlot: (time: string, roomId?: string) => void;
}

const timeSlots = [
  '08:00', '09:00', '10:00', '11:15', '12:00', '13:00', '14:00', '15:30', '16:30', '17:30'
];

export const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  appointments,
  onSelectAppointment,
  onSelectEmptySlot,
}) => {
  // Filter appointments for the selected day
  const dayAppointments = appointments.filter((a) => a.date === selectedDate);

  return (
    <div>
      {/* MOBILE-FIRST SPECIFIC EXPERIENCE (Item 39 Requirement) */}
      <div className="md:hidden space-y-2.5">
        <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-xl flex items-center justify-between text-xs">
          <span className="font-bold text-teal-900">Agenda Otimizada para Celular</span>
          <span className="font-mono text-teal-700">{dayAppointments.length} horários</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {timeSlots.map((time) => {
            const appointment = dayAppointments.find((a) => a.startTime === time);
            const statusInfo = appointment ? getStatusDetails(appointment.status) : null;

            return (
              <div key={time} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="w-14 shrink-0 font-mono font-bold text-slate-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {time}
                </div>

                <div className="flex-1 min-w-0">
                  {appointment ? (
                    <div
                      onClick={() => onSelectAppointment(appointment)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 truncate">
                          {appointment.patientName}
                        </span>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border shrink-0 ${statusInfo?.badgeClass}`}
                        >
                          {statusInfo?.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {appointment.serviceName} • {appointment.physiotherapistName}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectEmptySlot(time)}
                      className="text-teal-700 font-semibold hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Disponível</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DESKTOP COMPLETE TIMELINE VIEW */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {timeSlots.map((slot) => {
            const slotAppointments = dayAppointments.filter((a) => a.startTime === slot);

            return (
              <div key={slot} className="p-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                {/* Time Indicator */}
                <div className="w-20 shrink-0 pt-1">
                  <span className="font-mono text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    {slot}
                  </span>
                </div>

                {/* Slots Grid */}
                <div className="flex-1">
                  {slotAppointments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {slotAppointments.map((apt) => {
                        const statusInfo = getStatusDetails(apt.status);
                        return (
                          <div
                            key={apt.id}
                            onClick={() => onSelectAppointment(apt)}
                            className="p-3 rounded-xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-xs transition-all cursor-pointer space-y-1.5 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                                {apt.patientName}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${statusInfo.badgeClass}`}
                              >
                                {statusInfo.label}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 font-medium truncate">
                              {apt.serviceName}
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                              <span className="truncate">{apt.physiotherapistName}</span>
                              <span className="font-medium text-teal-700 shrink-0">{apt.roomName.split(' - ')[0]}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectEmptySlot(slot)}
                      className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-200 hover:border-teal-400 text-slate-400 hover:text-teal-700 hover:bg-teal-50/40 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Horário disponível para agendamento — Clique para reservar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
