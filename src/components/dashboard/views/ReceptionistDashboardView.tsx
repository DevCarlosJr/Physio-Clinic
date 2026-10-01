import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle,
  Plus,
  AlertTriangle,
  PhoneCall,
  UserPlus,
  ChevronRight,
  Sparkles,
  Users,
  Search,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import {
  initialWaitingRoomList,
  initialWaitlist,
  initialConfirmationsList,
} from '../../../data/mockReceptionData';
import { WaitingRoomCheckIn, WaitlistEntry, PendingConfirmationItem } from '../../../types/reception';
import { AppointmentRecord } from '../../../types/appointment';
import { getStatusDetails, formatPhone } from '../../../utils/formatters';
import { Button } from '../../common/Button';
import { WaitlistFitInModal } from '../../reception/WaitlistFitInModal';

export const ReceptionistDashboardView: React.FC = () => {
  const {
    setCurrentRoute,
    setIsQuickBookingOpen,
    addToast,
    appointments,
    addAppointment,
    updateAppointmentStatus,
  } = useApp();

  const [waitingList, setWaitingList] = useState<WaitingRoomCheckIn[]>(initialWaitingRoomList);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(initialWaitlist);
  const [confirmations, setConfirmations] = useState<PendingConfirmationItem[]>(initialConfirmationsList);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [checkInSearch, setCheckInSearch] = useState('');

  // Today's appointments (2026-09-30)
  const todayAppointments = appointments.filter((a) => a.date === '2026-09-30');

  // Perform Check-in on a scheduled patient
  const handlePerformCheckIn = (apt: AppointmentRecord) => {
    const existing = waitingList.find((w) => w.appointmentId === apt.id);
    if (existing) {
      addToast(`${apt.patientName} já realizou o check-in na sala de espera.`, 'warning');
      return;
    }

    const nowTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newCheckIn: WaitingRoomCheckIn = {
      id: `chk-${Date.now().toString(36)}`,
      appointmentId: apt.id,
      patientName: apt.patientName,
      patientPhone: apt.patientPhone,
      checkInTime: nowTime,
      arrivalTimestamp: Date.now(),
      physiotherapistId: apt.physiotherapistId,
      physiotherapistName: apt.physiotherapistName,
      roomId: apt.roomId,
      roomName: apt.roomName,
      serviceName: apt.serviceName,
      status: 'waiting',
    };

    setWaitingList((prev) => [newCheckIn, ...prev]);
    updateAppointmentStatus(apt.id, 'confirmed');
    addToast(`Check-in realizado para ${apt.patientName}! Notificação enviada ao posto de ${apt.physiotherapistName}.`, 'success');
  };

  const handleNotifyPhysio = (item: WaitingRoomCheckIn) => {
    setWaitingList((prev) =>
      prev.map((w) => (w.id === item.id ? { ...w, status: 'called' } : w))
    );
    addToast(`Especialista ${item.physiotherapistName} alertado: ${item.patientName} está aguardando no balcão/recepção.`, 'info');
  };

  const handleConfirmAppointment = (conf: PendingConfirmationItem) => {
    setConfirmations((prev) =>
      prev.map((c) => (c.id === conf.id ? { ...c, status: 'confirmed' } : c))
    );
    updateAppointmentStatus(conf.appointmentId, 'confirmed');
    addToast(`Consulta de ${conf.patientName} confirmada com sucesso!`, 'success');
  };

  const handleFitInSuccess = (entry: WaitlistEntry, slotTime: string) => {
    const endMinutes =
      (parseInt(slotTime.split(':')[0], 10) * 60 + parseInt(slotTime.split(':')[1], 10)) + 50;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

    const newApt: AppointmentRecord = {
      id: `apt-${Date.now().toString(36)}`,
      patientId: `pat-${Date.now().toString().slice(-4)}`,
      patientName: entry.patientName,
      patientPhone: entry.patientPhone,
      physiotherapistId: entry.preferredPhysioId,
      physiotherapistName: entry.preferredPhysioName,
      roomId: 'box-01',
      roomName: 'Box 01 - Cinesioterapia',
      serviceName: entry.serviceName,
      durationMinutes: 50,
      date: '2026-09-30',
      startTime: slotTime,
      endTime,
      status: 'confirmed',
      insurance: 'Particular',
      observation: `Encaixe realizado a partir da Lista de Espera (${entry.notes || 'Sem observações'})`,
    };

    addAppointment(newApt);
    setWaitlist((prev) => prev.filter((w) => w.id !== entry.id));
  };

  return (
    <div className="space-y-6">
      {/* Reception Action Header */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-teal-200 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-teal-300" />
            Central de Recepção & Triagem Operacional
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Painel da Recepção da Clínica
          </h2>
          <p className="text-teal-100/80 text-xs mt-1">
            {todayAppointments.length} agendamentos hoje • {waitingList.length} na sala de espera • {waitlist.length} na fila de encaixes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Users className="w-3.5 h-3.5 text-teal-700" />}
            onClick={() => setIsWaitlistModalOpen(true)}
          >
            Fila de Encaixes ({waitlist.length})
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<UserPlus className="w-3.5 h-3.5 text-teal-700" />}
            onClick={() => setCurrentRoute('pacientes')}
          >
            Cadastrar Paciente
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsQuickBookingOpen(true)}
          >
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* KPI Stats for Reception */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Na Sala de Espera
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-800">{waitingList.length}</span>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
              Tempo Médio: 6 min
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Pacientes com check-in</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Confirmações Pendentes
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-800">
              {confirmations.filter((c) => c.status === 'pending').length}
            </span>
            <span className="text-[10px] text-sky-700 font-semibold bg-sky-50 px-1.5 py-0.5 rounded">
              Hoje / Amanhã
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Checagem de presença</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Consultas Confirmadas
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-800">
              {todayAppointments.filter((a) => a.status === 'confirmed').length}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              Hoje
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Presença assegurada</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Fila de Espera (Encaixes)
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-teal-800">{waitlist.length}</span>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded">
              Aguardando
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Prontos para encaixe</span>
        </div>
      </div>

      {/* Main Grid: Waiting Room + Confirmations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waiting Room Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-800">
                Fila da Sala de Espera (Pacientes Presentes na Clínica)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {waitingList.length} no balcão
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {waitingList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Nenhum paciente aguardando na recepção no momento.
              </div>
            ) : (
              waitingList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.patientName}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          item.status === 'in_attendance'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : item.status === 'called'
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {item.status === 'in_attendance' && 'Em Atendimento no Box'}
                        {item.status === 'called' && 'Chamado pelo Especialista'}
                        {item.status === 'waiting' && 'Aguardando na Recepção'}
                      </span>
                    </div>
                    <p className="text-slate-500">
                      Check-in às <span className="font-mono font-bold text-slate-800">{item.checkInTime}</span> • Destino: <span className="font-semibold text-teal-700">{item.roomName}</span> com {item.physiotherapistName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Contato: {formatPhone(item.patientPhone)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === 'waiting' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleNotifyPhysio(item)}
                      >
                        Avisar Especialista
                      </Button>
                    )}
                    {item.status === 'called' && (
                      <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                        Especialista Notificado
                      </span>
                    )}
                    {item.status === 'in_attendance' && (
                      <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                        Em Sala
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Confirmations Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-800">Confirmação Ativa</h3>
              </div>
              <span className="text-[11px] font-semibold bg-sky-50 text-sky-800 px-2 py-0.5 rounded-full border border-sky-200">
                {confirmations.filter((c) => c.status === 'pending').length} pendentes
              </span>
            </div>

            <div className="space-y-3">
              {confirmations.map((conf) => (
                <div
                  key={conf.id}
                  className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{conf.patientName}</span>
                    <span className="font-mono text-teal-700 font-semibold">{conf.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {conf.serviceName} • {conf.physiotherapistName}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-[11px] text-slate-700 font-medium">
                      {formatPhone(conf.patientPhone)}
                    </span>
                    {conf.status === 'pending' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConfirmAppointment(conf)}
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                        Confirmar
                      </Button>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Confirmado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Master Today Schedule with Instant Check-in Action */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Agenda do Dia Inteiro da Clínica (Realizar Check-in na Chegada)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {todayAppointments.length} consultas programadas
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {todayAppointments.map((apt) => {
            const statusInfo = getStatusDetails(apt.status);
            const isAlreadyCheckedIn = waitingList.some((w) => w.appointmentId === apt.id);

            return (
              <div
                key={apt.id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 font-mono font-bold text-slate-800 text-sm">
                    {apt.startTime}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{apt.patientName}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {apt.serviceName} • {apt.physiotherapistName} • <span className="font-semibold text-teal-700">{apt.roomName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isAlreadyCheckedIn && (apt.status === 'scheduled' || apt.status === 'confirmed') && (
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<UserCheck className="w-3.5 h-3.5" />}
                      onClick={() => handlePerformCheckIn(apt)}
                    >
                      Fazer Check-in
                    </Button>
                  )}
                  {isAlreadyCheckedIn && (
                    <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
                      Check-in Feito
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Waitlist and Fit-In Modal */}
      <WaitlistFitInModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
        waitlist={waitlist}
        onAddWaitlist={(entry) => setWaitlist((prev) => [entry, ...prev])}
        onFitInSuccess={handleFitInSuccess}
      />
    </div>
  );
};
