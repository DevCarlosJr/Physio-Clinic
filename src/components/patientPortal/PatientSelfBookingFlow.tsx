import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { ScheduleConflictService } from '../../services/scheduleConflictService';
import { AppointmentRecord } from '../../types/appointment';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Activity,
  FileCheck,
  Download,
  Phone,
  Sparkles,
} from 'lucide-react';

interface PatientSelfBookingFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientSelfBookingFlow: React.FC<PatientSelfBookingFlowProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, appointments, addAppointment } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState('Reabilitação Traumato-Ortopédica');
  const [selectedDuration, setSelectedDuration] = useState(50);
  const [selectedPhysioId, setSelectedPhysioId] = useState('usr_physio_1');
  const [selectedDate, setSelectedDate] = useState('2026-10-01');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [protocolNumber, setProtocolNumber] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const services = [
    {
      id: 's1',
      name: 'Reabilitação Traumato-Ortopédica',
      desc: 'Pós-operatórios, lesões musculares, entorses e tendinopatias.',
      duration: 50,
      room: 'box-02',
    },
    {
      id: 's2',
      name: 'Avaliação Postural Global (RPG)',
      desc: 'Alinhamento postural biomecânico, cifose, lordose e escoliose.',
      duration: 60,
      room: 'sala-03',
    },
    {
      id: 's3',
      name: 'Cinesioterapia Motora & Core',
      desc: 'Fortalecimento estabilizador para coluna lombar e cervical.',
      duration: 50,
      room: 'box-01',
    },
    {
      id: 's4',
      name: 'Fisioterapia Respiratória',
      desc: 'Higiene brônquica, reexpansão pulmonar e DPOC.',
      duration: 45,
      room: 'box-01',
    },
  ];

  const professionals = [
    {
      id: 'usr_physio_1',
      name: 'Dr. Lucas Silveira',
      crefito: 'CREFITO-3 / 245910-F',
      specialty: 'Traumato-Ortopedia & Fisioterapia Esportiva',
      room: 'box-02',
    },
    {
      id: 'usr_physio_2',
      name: 'Dra. Camila Ramos',
      crefito: 'CREFITO-3 / 198421-F',
      specialty: 'Reeducação Postural Global (RPG) & Coluna',
      room: 'sala-03',
    },
    {
      id: 'usr_physio_3',
      name: 'Dr. Thiago Medeiros',
      crefito: 'CREFITO-3 / 301298-F',
      specialty: 'Eletroterapia & Fisioterapia Respiratória',
      room: 'box-04',
    },
  ];

  const currentServiceObj = services.find((s) => s.name === selectedService) || services[0];
  const currentPhysioObj = professionals.find((p) => p.id === selectedPhysioId) || professionals[0];

  // Dynamically compute strictly available slots for the chosen date, physio, and room
  const availableSlots = useMemo(() => {
    return ScheduleConflictService.getAvailableSlots(
      selectedDate,
      selectedPhysioId,
      currentServiceObj.room,
      selectedDuration,
      appointments
    );
  }, [selectedDate, selectedPhysioId, selectedDuration, currentServiceObj.room, appointments]);

  const handleConfirmBooking = () => {
    const endMinutes =
      ScheduleConflictService.timeToMinutes(selectedTime) + selectedDuration;
    const endTime = ScheduleConflictService.minutesToTime(endMinutes);
    const protocol = `PHY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setProtocolNumber(protocol);

    const newAppointment: AppointmentRecord = {
      id: `apt-${Date.now().toString(36)}`,
      patientId: currentUser.id,
      patientName: currentUser.name,
      patientPhone: currentUser.phone || '(11) 99887-1122',
      patientEmail: currentUser.email,
      physiotherapistId: selectedPhysioId,
      physiotherapistName: currentPhysioObj.name,
      roomId: currentServiceObj.room,
      roomName: currentServiceObj.room === 'box-01' ? 'Box 01 - Cinesioterapia' : 'Box 02 - Traumato',
      serviceName: selectedService,
      durationMinutes: selectedDuration,
      date: selectedDate,
      startTime: selectedTime,
      endTime,
      status: 'confirmed',
      insurance: 'Particular',
      observation: `Agendado pelo Portal do Paciente. Protocolo: ${protocol}`,
    };

    addAppointment(newAppointment);
    setIsConfirmed(true);
  };

  const handleClose = () => {
    setStep(1);
    setIsConfirmed(false);
    setSelectedTime('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isConfirmed ? 'Consulta Confirmada com Sucesso!' : 'Portal de Agendamento do Paciente'}
      subtitle={
        isConfirmed
          ? `Protocolo de Atendimento #${protocolNumber}`
          : `Etapa ${step} de 4: Escolha seu horário com confirmação instantânea`
      }
      maxWidth="lg"
      footer={
        isConfirmed ? (
          <Button variant="primary" size="sm" onClick={handleClose}>
            Concluir & Visualizar Minha Agenda
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full">
            {step > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
                icon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Voltar
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleClose}>
                Cancelar
              </Button>
            )}

            {step < 4 ? (
              <Button
                variant="primary"
                size="sm"
                disabled={step === 3 && !selectedTime}
                onClick={() => setStep(step + 1)}
                icon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Continuar
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmBooking}
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Confirmar Agendamento
              </Button>
            )}
          </div>
        )
      }
    >
      {/* SUCCESS CONFIRMATION SCREEN */}
      {isConfirmed ? (
        <div className="py-4 space-y-4 text-xs">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Agendamento Confirmado!
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Seu horário foi reservado em tempo real sem conflito de agenda. Enviamos a confirmação para seu e-mail.
            </p>
          </div>

          {/* Appointment Ticket Card */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-3">
            <div className="flex items-center justify-between border-b border-teal-200/60 pb-2">
              <span className="font-semibold text-teal-800">Protocolo</span>
              <span className="font-mono font-bold text-teal-900">{protocolNumber}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 block">Data & Horário</span>
                <span className="font-bold text-slate-900">{selectedDate} às {selectedTime}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Especialista</span>
                <span className="font-bold text-slate-900">{currentPhysioObj.name}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 block">Procedimento</span>
                <span className="font-medium text-slate-800">{selectedService} ({selectedDuration} min)</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-teal-200/60 flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>PhysioClinic Paulista • Av. Paulista, 1842 - Torre Norte, Conj. 1204</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5 text-slate-500" />}
              onClick={() => alert('Arquivo .ics para Google Calendar/Apple Calendar gerado!')}
            >
              Adicionar ao Google Calendar / Apple
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {/* STEP 1: ESCOLHER SERVIÇO */}
          {step === 1 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Selecione o serviço ou modalidade de atendimento:
              </span>
              <div className="space-y-2">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => {
                      setSelectedService(srv.name);
                      setSelectedDuration(srv.duration);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedService === srv.name
                        ? 'border-teal-500 bg-teal-50/70 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{srv.name}</span>
                      <span className="font-mono text-[11px] font-semibold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                        {srv.duration} min
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">{srv.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: ESCOLHER PROFISSIONAL */}
          {step === 2 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Escolha o especialista de sua preferência:
              </span>
              <div className="space-y-2">
                {professionals.map((prof) => (
                  <div
                    key={prof.id}
                    onClick={() => setSelectedPhysioId(prof.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedPhysioId === prof.id
                        ? 'border-teal-500 bg-teal-50/70 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{prof.name}</span>
                      <span className="text-[10px] text-teal-700 font-mono bg-teal-100/60 px-2 py-0.5 rounded">
                        {prof.crefito}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{prof.specialty}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: ESCOLHER DATA E HORÁRIO */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Selecione a Data da Consulta:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min="2026-10-01"
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime('');
                  }}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Horários Disponíveis em Tempo Real:
                </label>

                {availableSlots.length === 0 ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center text-amber-800">
                    <p className="font-semibold">Sem horários livres para esta data com {currentPhysioObj.name}.</p>
                    <p className="text-[11px] mt-1 text-amber-700">Por favor, escolha outro dia ou especialista.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2 rounded-lg font-mono font-bold text-xs border cursor-pointer transition-all ${
                          selectedTime === slot
                            ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-teal-50/50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMAÇÃO DOS DADOS */}
          {step === 4 && (
            <div className="space-y-3.5">
              <span className="text-xs font-bold text-slate-700 block">
                Revise os detalhes antes de confirmar:
              </span>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Paciente</span>
                  <span className="font-bold text-slate-900">{currentUser.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Procedimento</span>
                  <span className="font-semibold text-slate-800">{selectedService}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Fisioterapeuta</span>
                  <span className="font-semibold text-teal-700">{currentPhysioObj.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Data e Horário</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedDate} às {selectedTime} ({selectedDuration} min)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-xl text-teal-800 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Sem conflitos de agenda. O horário será reservado imediatamente no sistema da clínica.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
