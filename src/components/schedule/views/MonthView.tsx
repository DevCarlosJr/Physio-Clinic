import React from 'react';
import { AppointmentRecord } from '../../../types/appointment';

interface MonthViewProps {
  appointments: AppointmentRecord[];
  onSelectDate: (date: string) => void;
  selectedDate: string;
}

export const MonthView: React.FC<MonthViewProps> = ({
  appointments,
  onSelectDate,
  selectedDate,
}) => {
  // Calendar days for September / October 2026
  // Sept 30 is Wednesday
  const daysInGrid = [
    { day: 28, date: '2026-09-28', currentMonth: false },
    { day: 29, date: '2026-09-29', currentMonth: false },
    { day: 30, date: '2026-09-30', currentMonth: false, isToday: true },
    { day: 1, date: '2026-10-01', currentMonth: true },
    { day: 2, date: '2026-10-02', currentMonth: true },
    { day: 3, date: '2026-10-03', currentMonth: true },
    { day: 4, date: '2026-10-04', currentMonth: true, isSunday: true },
    { day: 5, date: '2026-10-05', currentMonth: true },
    { day: 6, date: '2026-10-06', currentMonth: true },
    { day: 7, date: '2026-10-07', currentMonth: true },
    { day: 8, date: '2026-10-08', currentMonth: true },
    { day: 9, date: '2026-10-09', currentMonth: true },
    { day: 10, date: '2026-10-10', currentMonth: true },
    { day: 11, date: '2026-10-11', currentMonth: true, isSunday: true },
    { day: 12, date: '2026-10-12', currentMonth: true },
    { day: 13, date: '2026-10-13', currentMonth: true },
    { day: 14, date: '2026-10-14', currentMonth: true },
    { day: 15, date: '2026-10-15', currentMonth: true },
    { day: 16, date: '2026-10-16', currentMonth: true },
    { day: 17, date: '2026-10-17', currentMonth: true },
    { day: 18, date: '2026-10-18', currentMonth: true, isSunday: true },
  ];

  const weekHeaders = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70 text-center text-xs font-bold text-slate-600 py-2.5">
        {weekHeaders.map((header) => (
          <div key={header}>{header}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[360px]">
        {daysInGrid.map((item) => {
          const apts = appointments.filter((a) => a.date === item.date);
          const isSelected = selectedDate === item.date;

          return (
            <div
              key={item.date}
              onClick={() => onSelectDate(item.date)}
              className={`p-2.5 min-h-[90px] transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-teal-50/70 border-2 border-teal-500'
                  : 'hover:bg-slate-50/70'
              } ${item.isSunday ? 'bg-slate-50/40 opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                    item.isToday
                      ? 'bg-teal-600 text-white font-mono shadow-xs'
                      : isSelected
                      ? 'text-teal-800'
                      : 'text-slate-700'
                  }`}
                >
                  {item.day}
                </span>

                {apts.length > 0 && (
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-100/80 px-1.5 py-0.5 rounded-full">
                    {apts.length}
                  </span>
                )}
              </div>

              <div className="space-y-1 mt-1">
                {apts.slice(0, 2).map((apt) => (
                  <div
                    key={apt.id}
                    className="text-[10px] font-medium text-slate-700 truncate bg-slate-100 px-1.5 py-0.5 rounded"
                  >
                    {apt.startTime} {apt.patientName.split(' ')[0]}
                  </div>
                ))}
                {apts.length > 2 && (
                  <span className="text-[9px] text-slate-400 block font-medium">
                    +{apts.length - 2} mais
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
