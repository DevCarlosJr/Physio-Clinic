import React from 'react';
import { AppointmentRecord } from '../../../types/appointment';
import { getStatusDetails } from '../../../utils/formatters';

interface WeekViewProps {
  appointments: AppointmentRecord[];
  onSelectAppointment: (appointment: AppointmentRecord) => void;
  onSelectDate: (date: string) => void;
  selectedDate: string;
}

export const WeekView: React.FC<WeekViewProps> = ({
  appointments,
  onSelectAppointment,
  onSelectDate,
  selectedDate,
}) => {
  const weekDays = [
    { label: 'Segunda', date: '2026-09-28', short: '28/09' },
    { label: 'Terça', date: '2026-09-29', short: '29/09' },
    { label: 'Quarta (Hoje)', date: '2026-09-30', short: '30/09' },
    { label: 'Quinta', date: '2026-10-01', short: '01/10' },
    { label: 'Sexta', date: '2026-10-02', short: '02/10' },
    { label: 'Sábado', date: '2026-10-03', short: '03/10' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
        {weekDays.map((day) => {
          const dayApts = appointments.filter((a) => a.date === day.date);
          const isSelected = selectedDate === day.date;

          return (
            <div key={day.date} className="min-h-[420px] flex flex-col">
              {/* Day Header */}
              <div
                onClick={() => onSelectDate(day.date)}
                className={`p-3 text-center border-b border-slate-100 cursor-pointer transition-colors ${
                  isSelected ? 'bg-teal-50' : 'bg-slate-50/70 hover:bg-slate-100'
                }`}
              >
                <p className={`text-xs font-bold ${isSelected ? 'text-teal-800' : 'text-slate-800'}`}>
                  {day.label}
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-0.5">{day.short}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-slate-400">
                  {dayApts.length} consultas
                </span>
              </div>

              {/* Day Appointments List */}
              <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[500px]">
                {dayApts.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-400">
                    Sem consultas
                  </div>
                ) : (
                  dayApts.map((apt) => {
                    const statusInfo = getStatusDetails(apt.status);
                    return (
                      <div
                        key={apt.id}
                        onClick={() => onSelectAppointment(apt)}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-teal-500 hover:shadow-2xs transition-all cursor-pointer text-xs space-y-1 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-800 text-[11px]">
                            {apt.startTime}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                        </div>
                        <p className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                          {apt.patientName}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {apt.serviceName}
                        </p>
                        <p className="text-[9px] text-teal-700 font-semibold truncate pt-1 border-t border-slate-100">
                          {apt.roomName.split(' - ')[0]}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
