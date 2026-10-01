import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PhysiotherapistProfessional, WeeklyWorkShift } from '../../types/professional';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface WeeklyScheduleModalProps {
  professional: PhysiotherapistProfessional | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSchedule: (profId: string, schedule: WeeklyWorkShift[]) => void;
}

export const WeeklyScheduleModal: React.FC<WeeklyScheduleModalProps> = ({
  professional,
  isOpen,
  onClose,
  onSaveSchedule,
}) => {
  const [schedule, setSchedule] = useState<WeeklyWorkShift[]>([]);

  useEffect(() => {
    if (professional) {
      setSchedule(professional.weeklySchedule);
    }
  }, [professional, isOpen]);

  const handleToggleDay = (dayOfWeek: number) => {
    setSchedule((prev) =>
      prev.map((s) => (s.dayOfWeek === dayOfWeek ? { ...s, isWorking: !s.isWorking } : s))
    );
  };

  const handleTimeChange = (
    dayOfWeek: number,
    field: 'startTime' | 'endTime' | 'breakStartTime' | 'breakEndTime',
    val: string
  ) => {
    setSchedule((prev) =>
      prev.map((s) => (s.dayOfWeek === dayOfWeek ? { ...s, [field]: val } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!professional) return;
    onSaveSchedule(professional.id, schedule);
    onClose();
  };

  if (!isOpen || !professional) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Escala de Trabalho • ${professional.name}`}
      subtitle={`Defina os turnos semanais e horários válidos para a agenda de ${professional.crefito}`}
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            onClick={handleSubmit}
          >
            Salvar Escala Semanal
          </Button>
        </div>
      }
    >
      <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
        <div className="p-3 rounded-lg bg-teal-50 border border-teal-200/80 text-teal-900">
          <p className="font-semibold">Motor Anti-Conflito de Escalas:</p>
          <p className="text-[11px] text-teal-700 mt-0.5">
            O sistema apenas disponibiliza horários de agendamento nos dias e turnos em que o fisioterapeuta estiver marcado como ativo.
          </p>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white p-3">
          {schedule.map((shift) => (
            <div
              key={shift.dayOfWeek}
              className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="w-32 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={shift.isWorking}
                  onChange={() => handleToggleDay(shift.dayOfWeek)}
                  className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <span className={`font-semibold ${shift.isWorking ? 'text-slate-900' : 'text-slate-400'}`}>
                  {shift.dayName}
                </span>
              </div>

              {shift.isWorking ? (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[10px]">Turno:</span>
                    <input
                      type="time"
                      value={shift.startTime}
                      onChange={(e) => handleTimeChange(shift.dayOfWeek, 'startTime', e.target.value)}
                      className="border border-slate-300 rounded px-1.5 py-0.5 font-mono text-xs text-slate-800"
                    />
                    <span className="text-slate-400">às</span>
                    <input
                      type="time"
                      value={shift.endTime}
                      onChange={(e) => handleTimeChange(shift.dayOfWeek, 'endTime', e.target.value)}
                      className="border border-slate-300 rounded px-1.5 py-0.5 font-mono text-xs text-slate-800"
                    />
                  </div>

                  <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                    <span className="text-slate-400 text-[10px]">Almoço:</span>
                    <input
                      type="time"
                      value={shift.breakStartTime || '12:00'}
                      onChange={(e) => handleTimeChange(shift.dayOfWeek, 'breakStartTime', e.target.value)}
                      className="border border-slate-300 rounded px-1.5 py-0.5 font-mono text-xs text-slate-800"
                    />
                    <span className="text-slate-400">às</span>
                    <input
                      type="time"
                      value={shift.breakEndTime || '13:00'}
                      onChange={(e) => handleTimeChange(shift.dayOfWeek, 'breakEndTime', e.target.value)}
                      className="border border-slate-300 rounded px-1.5 py-0.5 font-mono text-xs text-slate-800"
                    />
                  </div>
                </div>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 italic">
                  Folga programada
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
