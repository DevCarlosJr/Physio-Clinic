import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Play,
  FileText,
  AlertCircle,
  Activity,
  CheckCircle2,
  Users,
  ChevronRight,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { mockClinicalTasks } from '../../../data/dashboardMockData';
import { getStatusDetails } from '../../../utils/formatters';
import { Button } from '../../common/Button';
import { ActiveAttendanceModal } from '../../clinical/ActiveAttendanceModal';
import { ClinicalSessionRecord } from '../../../types/clinicalSession';
import { ClinicalSessionService } from '../../../services/clinicalSessionService';
import { AppointmentRecord } from '../../../types/appointment';

export const PhysiotherapistDashboardView: React.FC = () => {
  const { currentUser, setCurrentRoute, addToast, appointments, updateAppointmentStatus } = useApp();

  // Appointments specifically for Dr. Lucas Silveira (or current logged-in physio)
  const myAppointments = appointments.filter(
    (a) => a.physiotherapistId === 'usr_physio_1'
  );

  const inProgressApt = myAppointments.find((a) => a.status === 'in_progress');

  // Active modal state
  const [activeSession, setActiveSession] = useState<ClinicalSessionRecord | null>(() =>
    ClinicalSessionService.getActiveSession()
  );
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState<boolean>(false);

  const handleStartAttendance = (apt: AppointmentRecord) => {
    updateAppointmentStatus(apt.id, 'in_progress');
    const session = ClinicalSessionService.startSessionFromAppointment(apt);
    setActiveSession(session);
    setIsAttendanceModalOpen(true);
    addToast(`Atendimento de ${apt.patientName} iniciado no ${apt.roomName}!`, 'info');
  };

  const handleOpenAttendanceModal = (apt: AppointmentRecord) => {
    const session = ClinicalSessionService.startSessionFromAppointment(apt);
    setActiveSession(session);
    setIsAttendanceModalOpen(true);
  };

  const handleFinishAttendance = (finishedSession: ClinicalSessionRecord) => {
    updateAppointmentStatus(finishedSession.appointmentId, 'completed');
    setActiveSession(null);
  };

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Bar */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-teal-200 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-teal-300" />
            Posto Clínico de Trabalho • {currentUser.specialty || 'Ortopedia'}
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Bom dia, {currentUser.name}
          </h2>
          <p className="text-teal-100/80 text-xs mt-1">
            Você tem <strong>{myAppointments.length} atendimentos</strong> programados na clínica. Box 02 alocado para sua escala.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentRoute('prontuarios')}
          >
            <FileText className="w-3.5 h-3.5 mr-1" />
            Acessar Prontuários
          </Button>
        </div>
      </div>

      {/* Immediate Attention Callout: Current Patient in Room */}
      {inProgressApt && (
        <div className="bg-amber-50/80 border border-amber-300/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 animate-pulse">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Paciente em Atendimento Agora
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold font-mono">
                  {inProgressApt.roomName.split(' - ')[0]}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {inProgressApt.patientName}
              </h3>
              <p className="text-xs text-amber-800">
                Procedimento: {inProgressApt.serviceName} • Iniciado às {inProgressApt.startTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              icon={<Play className="w-3.5 h-3.5" />}
              onClick={() => handleOpenAttendanceModal(inProgressApt)}
            >
              Abrir Cockpit de Atendimento
            </Button>
          </div>
        </div>
      )}

      {/* Main Grid: My Schedule & Clinical Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: My Schedule Timeline */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-800">
                Meus Pacientes na Escala
              </h3>
              <span className="text-[11px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                {myAppointments.length} sessões
              </span>
            </div>
            <button
              onClick={() => setCurrentRoute('agenda')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver agenda</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {myAppointments.map((apt) => {
              const statusInfo = getStatusDetails(apt.status);
              return (
                <div
                  key={apt.id}
                  className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-slate-800 w-14">
                      {apt.startTime}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">
                          {apt.patientName}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusInfo.badgeClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {apt.serviceName} • <span className="font-medium text-teal-700">{apt.roomName.split(' - ')[0]}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {apt.status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleStartAttendance(apt)}
                      >
                        <Play className="w-3.5 h-3.5 mr-1" />
                        Chamar
                      </Button>
                    )}
                    {apt.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenAttendanceModal(apt)}
                      >
                        Evoluir
                      </Button>
                    )}
                    {apt.status === 'completed' && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Concluído
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Tasks & Pending Clinical Assessments */}
        <div className="space-y-6">
          {/* Clinical Tasks Box */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-800">Tarefas & Reavaliações</h3>
              </div>
              <span className="text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                3 pendentes
              </span>
            </div>

            <div className="space-y-3">
              {mockClinicalTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate">
                      {task.patientName}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                        task.priority === 'high'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {task.dueDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {task.description}
                  </p>
                  <button
                    onClick={() => {
                      setCurrentRoute('prontuarios');
                      addToast(`Abrindo protocolo clínico para ${task.patientName}`);
                    }}
                    className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>Abrir ficha</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Patients Summary */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-800">Meus Pacientes em Tratamento</h3>
            </div>
            <p className="text-xs text-slate-500">
              Você possui <strong>38 pacientes ativos</strong> vinculados ao seu plano terapêutico.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setCurrentRoute('pacientes')}
            >
              Visualizar Todos os Pacientes
            </Button>
          </div>
        </div>
      </div>

      {/* Active Clinical Attendance Cockpit Modal */}
      <ActiveAttendanceModal
        session={activeSession}
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onFinish={handleFinishAttendance}
      />
    </div>
  );
};
