import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ScheduleBlockItem, BlockReason } from '../../types/professional';
import { Calendar, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ScheduleBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (block: ScheduleBlockItem) => void;
  professionals: Array<{ id: string; name: string }>;
}

export const ScheduleBlockModal: React.FC<ScheduleBlockModalProps> = ({
  isOpen,
  onClose,
  onAddBlock,
  professionals,
}) => {
  const [profId, setProfId] = useState(professionals[0]?.id || 'usr_physio_1');
  const [reason, setReason] = useState<BlockReason>('congress');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('12:00');
  const [notes, setNotes] = useState('');

  const reasonMap: Record<BlockReason, string> = {
    vacation: 'Férias Programadas',
    congress: 'Congresso / Curso de Aperfeiçoamento',
    medical_leave: 'Atestado Médico / Licença Saúde',
    meeting: 'Reunião Clínica / Administrativa',
    day_off: 'Folga Compensatória de Plantão',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) return;

    const selectedProf = professionals.find((p) => p.id === profId);

    const block: ScheduleBlockItem = {
      id: `blk-${Date.now().toString(36)}`,
      professionalId: profId,
      professionalName: selectedProf ? selectedProf.name : 'Dr. Lucas Silveira',
      reason,
      reasonLabel: reasonMap[reason],
      startDate,
      endDate: endDate || startDate,
      isAllDay,
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      notes: notes.trim() || undefined,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    onAddBlock(block);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastrar Bloqueio de Agenda"
      subtitle="Impeça novos agendamentos durante períodos de férias, licenças ou congressos"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>

          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Confirmar Bloqueio
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Select
          label="Fisioterapeuta"
          value={profId}
          onChange={(e) => setProfId(e.target.value)}
          options={professionals.map((p) => ({ value: p.id, label: p.name }))}
        />

        <Select
          label="Motivo do Bloqueio"
          value={reason}
          onChange={(e) => setReason(e.target.value as BlockReason)}
          options={[
            { value: 'congress', label: 'Congresso / Atualização Científica' },
            { value: 'vacation', label: 'Férias Programadas' },
            { value: 'medical_leave', label: 'Atestado Médico / Licença' },
            { value: 'meeting', label: 'Reunião de Equipe / Caso Clínico' },
            { value: 'day_off', label: 'Folga Compensatória' },
          ]}
        />

        <div className="grid grid-cols-2 gap-3.5">
          <Input
            type="date"
            label="Data de Início"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            type="date"
            label="Data de Término"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="allDayCheck"
            checked={isAllDay}
            onChange={(e) => setIsAllDay(e.target.checked)}
            className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
          />
          <label htmlFor="allDayCheck" className="font-semibold text-slate-700 cursor-pointer">
            Bloquear o dia inteiro
          </label>
        </div>

        {!isAllDay && (
          <div className="grid grid-cols-2 gap-3.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Horário Inicial</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-slate-300 rounded p-1.5 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Horário Final</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-slate-300 rounded p-1.5 font-mono text-xs"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Justificativa / Observações
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Nome do evento, substituto imediato ou detalhes da ausência..."
            className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </form>
    </Modal>
  );
};
