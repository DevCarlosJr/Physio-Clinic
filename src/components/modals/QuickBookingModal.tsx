import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { useApp } from '../../context/AppContext';
import { ScheduleConflictService, ConflictCheckResult } from '../../services/scheduleConflictService';
import { AppointmentRecord } from '../../types/appointment';
import { AlertCircle, CheckCircle2, ShieldAlert, Clock, User, MapPin } from 'lucide-react';

export const QuickBookingModal: React.FC = () => {
  const { isQuickBookingOpen, setIsQuickBookingOpen, appointments, addAppointment } = useApp();

  const [patientName, setPatientName] = useState('Beatriz Almeida');
  const [patientPhone, setPatientPhone] = useState('(11) 98822-3344');
  const [service, setService] = useState('Reabilitação Traumato-Ortopédica');
  const [durationMinutes, setDurationMinutes] = useState(50);
  const [physioId, setPhysioId] = useState('usr_physio_1');
  const [roomId, setRoomId] = useState('box-02');
  const [date, setDate] = useState('2026-10-01'); // Quinta-feira
  const [time, setTime] = useState('14:00');
  const [insurance, setInsurance] = useState('Particular');
  const [observation, setObservation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [conflictResult, setConflictResult] = useState<ConflictCheckResult>({ hasConflict: false });

  // Map IDs to Names
  const physioNames: Record<string, string> = {
    usr_physio_1: 'Dr. Lucas Silveira',
    usr_physio_2: 'Dra. Camila Ramos',
    usr_physio_3: 'Dr. Thiago Medeiros',
    usr_admin_1: 'Dra. Helena Vasconcelos',
  };

  const roomNames: Record<string, string> = {
    'box-01': 'Box 01 - Cinesioterapia',
    'box-02': 'Box 02 - Traumato-Ortopedia',
    'sala-03': 'Sala 03 - Postura & Coluna',
    'box-04': 'Box 04 - Eletrotermofototerapia',
  };

  // Re-verify conflicts whenever date, time, physio, room, or duration change
  useEffect(() => {
    if (!date || !time) return;

    const validation = ScheduleConflictService.validateAppointment({
      date,
      startTime: time,
      durationMinutes,
      physiotherapistId: physioId,
      roomId,
      existingAppointments: appointments,
    });

    setConflictResult(validation);
  }, [date, time, physioId, roomId, durationMinutes, appointments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conflictResult.hasConflict) return;

    setIsSubmitting(true);

    const endMinutes =
      ScheduleConflictService.timeToMinutes(time) + durationMinutes;
    const endTime = ScheduleConflictService.minutesToTime(endMinutes);

    setTimeout(() => {
      const newAppointment: AppointmentRecord = {
        id: `apt-${Date.now().toString(36)}`,
        patientId: `pat-${Date.now().toString().slice(-4)}`,
        patientName: patientName.trim(),
        patientPhone,
        physiotherapistId: physioId,
        physiotherapistName: physioNames[physioId] || 'Dr. Lucas Silveira',
        roomId,
        roomName: roomNames[roomId] || 'Box 01',
        serviceName: service,
        durationMinutes,
        date,
        startTime: time,
        endTime,
        status: 'confirmed',
        insurance,
        observation: observation.trim() || undefined,
      };

      addAppointment(newAppointment);
      setIsSubmitting(false);
      setIsQuickBookingOpen(false);
    }, 400);
  };

  return (
    <Modal
      isOpen={isQuickBookingOpen}
      onClose={() => setIsQuickBookingOpen(false)}
      title="Agendamento com Motor Anti-Conflito"
      subtitle="Validação em tempo real de disponibilidade de sala, especialista e horário de clínica"
      maxWidth="lg"
      footer={
        <>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setIsQuickBookingOpen(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="button"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={conflictResult.hasConflict}
          >
            Confirmar Agendamento
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Anti-Conflict Live Alert Banner */}
        {conflictResult.hasConflict ? (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Conflito Detectado — Agendamento Bloqueado</span>
              <p className="text-[11px] text-rose-700 mt-0.5">{conflictResult.message}</p>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Horário, especialista e sala disponíveis para atendimento</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-700 font-bold">{time} ({durationMinutes} min)</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Select
            label="Paciente"
            required
            value={patientName}
            onChange={(e) => {
              setPatientName(e.target.value);
              if (e.target.value === 'Beatriz Almeida') setPatientPhone('(11) 98822-3344');
              if (e.target.value === 'Carlos Eduardo Santos') setPatientPhone('(11) 99887-1122');
              if (e.target.value === 'Juliana Mendes Ribeiro') setPatientPhone('(11) 97766-5544');
              if (e.target.value === 'Roberto Fagundes') setPatientPhone('(11) 96655-4433');
            }}
            options={[
              { value: 'Beatriz Almeida', label: 'Beatriz Almeida (CPF: 382.***.***-12)' },
              { value: 'Carlos Eduardo Santos', label: 'Carlos Eduardo Santos (CPF: 455.***.***-01)' },
              { value: 'Juliana Mendes Ribeiro', label: 'Juliana Mendes Ribeiro (CPF: 298.***.***-10)' },
              { value: 'Roberto Fagundes', label: 'Roberto Fagundes (CPF: 123.***.***-78)' },
              { value: 'Fernanda Lima Silva', label: 'Fernanda Lima Silva (CPF: 542.***.***-04)' },
              { value: 'Mariana Couto', label: 'Mariana Couto (CPF: 987.***.***-00)' },
            ]}
          />

          <Select
            label="Serviço / Procedimento"
            required
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              if (e.target.value.includes('RPG')) setDurationMinutes(60);
              else if (e.target.value.includes('Respiratória')) setDurationMinutes(45);
              else setDurationMinutes(50);
            }}
            options={[
              { value: 'Reabilitação Traumato-Ortopédica', label: 'Reabilitação Traumato-Ortopédica (50 min)' },
              { value: 'Avaliação Postural Global (RPG)', label: 'Avaliação Postural Global - RPG (60 min)' },
              { value: 'Fisioterapia Respiratória', label: 'Fisioterapia Respiratória (45 min)' },
              { value: 'Cinesioterapia Motora & Core', label: 'Cinesioterapia Motora (50 min)' },
              { value: 'Eletroterapia & Liberação Miofascial', label: 'Eletroterapia Analgésica (50 min)' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Select
            label="Fisioterapeuta Responsável"
            required
            value={physioId}
            onChange={(e) => setPhysioId(e.target.value)}
            options={[
              { value: 'usr_physio_1', label: 'Dr. Lucas Silveira (Ortopedia/Esporte)' },
              { value: 'usr_physio_2', label: 'Dra. Camila Ramos (RPG/Coluna)' },
              { value: 'usr_physio_3', label: 'Dr. Thiago Medeiros (Respiratória/Eletro)' },
              { value: 'usr_admin_1', label: 'Dra. Helena Vasconcelos (Neuro)' },
            ]}
          />

          <Select
            label="Sala / Box de Atendimento"
            required
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            options={[
              { value: 'box-01', label: 'Box 01 - Cinesioterapia' },
              { value: 'box-02', label: 'Box 02 - Traumato-Ortopedia' },
              { value: 'sala-03', label: 'Sala 03 - Postura & Coluna' },
              { value: 'box-04', label: 'Box 04 - Eletrotermofototerapia' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Input
            type="date"
            label="Data da Consulta"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Select
            label="Horário de Início"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            options={[
              { value: '07:30', label: '07:30' },
              { value: '08:00', label: '08:00' },
              { value: '09:00', label: '09:00' },
              { value: '10:00', label: '10:00' },
              { value: '11:15', label: '11:15' },
              { value: '14:00', label: '14:00' },
              { value: '15:00', label: '15:00' },
              { value: '15:30', label: '15:30' },
              { value: '16:30', label: '16:30' },
              { value: '17:30', label: '17:30' },
              { value: '18:30', label: '18:30' },
            ]}
          />

          <Select
            label="Modalidade / Convênio"
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            options={[
              { value: 'Particular', label: 'Particular' },
              { value: 'Bradesco Saúde', label: 'Bradesco Saúde' },
              { value: 'SulAmérica', label: 'SulAmérica' },
              { value: 'Amil Saúde', label: 'Amil Saúde' },
              { value: 'Unimed Seguros', label: 'Unimed Seguros' },
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Observações do Agendamento (Opcional)
          </label>
          <input
            type="text"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="ex: Paciente comparecerá com exames de imagem da coluna lombar"
            className="block w-full rounded-lg text-xs border border-slate-300 p-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 bg-white"
          />
        </div>
      </form>
    </Modal>
  );
};
