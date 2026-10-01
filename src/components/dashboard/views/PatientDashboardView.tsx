import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Dumbbell,
  FileText,
  Phone,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  Download,
  AlertTriangle,
  Flame,
  UserCheck,
  XCircle,
  Activity,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import {
  initialHomeExercises,
  initialPatientDocuments,
  initialPastSessions,
} from '../../../data/mockPatientPortalData';
import { HomeExerciseDetail, PatientDocumentItem, PastSessionRecord } from '../../../types/patientPortal';
import { Button } from '../../common/Button';
import { HomeExerciseModal } from '../../patientPortal/HomeExerciseModal';
import { CancelRescheduleModal } from '../../patientPortal/CancelRescheduleModal';
import { AppointmentRecord } from '../../../types/appointment';

export const PatientDashboardView: React.FC = () => {
  const {
    currentUser,
    addToast,
    setIsPatientBookingOpen,
    appointments,
    updateAppointmentStatus,
  } = useApp();

  const [exercises, setExercises] = useState<HomeExerciseDetail[]>(initialHomeExercises);
  const [documents] = useState<PatientDocumentItem[]>(initialPatientDocuments);
  const [pastSessions] = useState<PastSessionRecord[]>(initialPastSessions);

  // Modals state
  const [selectedExercise, setSelectedExercise] = useState<HomeExerciseDetail | null>(null);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [selectedAppointmentForCancel, setSelectedAppointmentForCancel] = useState<AppointmentRecord | null>(null);
  const [isCheckInDone, setIsCheckInDone] = useState(false);

  // Find next appointment for current patient (Beatriz Almeida or Carlos Eduardo Santos)
  const nextAppointment = appointments.find(
    (a) =>
      (a.patientName.includes('Carlos') || a.patientName.includes('Beatriz')) &&
      a.status !== 'cancelled' &&
      a.status !== 'completed'
  ) || appointments[1];

  const handleToggleExercise = (id: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === id) {
          const nextState = !ex.isCompletedToday;
          return {
            ...ex,
            isCompletedToday: nextState,
            streakDays: nextState ? ex.streakDays + 1 : Math.max(ex.streakDays - 1, 0),
          };
        }
        return ex;
      })
    );
    addToast('Exercício domiciliar atualizado com sucesso!', 'info');
  };

  const handleOpenExerciseModal = (ex: HomeExerciseDetail) => {
    setSelectedExercise(ex);
    setIsExerciseModalOpen(true);
  };

  const handleCheckInFromPatientApp = () => {
    setIsCheckInDone(true);
    addToast('Check-in realizado! A recepção e seu fisioterapeuta foram notificados da sua presença na clínica.', 'success');
  };

  const handleCancelSuccess = (id: string, reason: string) => {
    updateAppointmentStatus(id, 'cancelled');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Patient Welcome Hero */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-teal-200 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-teal-300" />
            Portal do Paciente • PhysioClinic
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Olá, {currentUser.name}
          </h2>
          <p className="text-teal-100/80 text-xs sm:text-sm mt-1">
            Acompanhe seu tratamento, suas próximas consultas e os exercícios domiciliares.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Calendar className="w-4 h-4" />}
          onClick={() => setIsPatientBookingOpen(true)}
          className="shrink-0"
        >
          Agendar Nova Consulta
        </Button>
      </div>

      {/* Primary Highlight: Next Appointment Card */}
      {nextAppointment && (
        <div className="bg-white rounded-2xl border-2 border-teal-600/30 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Sua Próxima Consulta
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                nextAppointment.status === 'in_progress'
                  ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              {nextAppointment.status === 'in_progress' ? 'Em Atendimento' : 'Confirmada'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                {nextAppointment.date === '2026-09-30' ? 'Hoje, 30 de Setembro' : nextAppointment.date} às {nextAppointment.startTime}
              </h3>
              <p className="text-xs text-slate-600">
                {nextAppointment.physiotherapistName} • {nextAppointment.serviceName}
              </p>
              <p className="text-xs text-teal-700 font-semibold flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {nextAppointment.roomName} • Unidade Paulista (Conj. 1204)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!isCheckInDone ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<UserCheck className="w-3.5 h-3.5" />}
                  onClick={handleCheckInFromPatientApp}
                >
                  Fazer Check-in ao Chegar
                </Button>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Check-in Realizado
                </span>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAppointmentForCancel(nextAppointment)}
              >
                Reagendar / Cancelar
              </Button>
            </div>
          </div>

          {/* Progress Tracker & EVA drop */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Progresso do Plano Terapêutico:</span>
              <span className="font-bold text-teal-800">6 de 12 sessões concluídas (50%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-teal-600 h-full rounded-full w-1/2" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Evolução da dor: Escala EVA reduziu de <strong>8/10</strong> para <strong>5/10</strong></span>
              <span className="text-emerald-700 font-semibold">Alívio de 3 pontos</span>
            </div>
          </div>
        </div>
      )}

      {/* Prescribed Home Exercises with interactive modals */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Programa de Exercícios Domiciliares
              </h3>
              <p className="text-xs text-slate-500">
                Prescritos pelo seu fisioterapeuta com instruções biomecânicas passo a passo
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {exercises.filter((e) => e.isCompletedToday).length} de {exercises.length} feitos hoje
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className={`p-4 rounded-xl border transition-all ${
                ex.isCompletedToday
                  ? 'bg-emerald-50/40 border-emerald-200/80'
                  : 'bg-slate-50/60 border-slate-200/90 hover:border-teal-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div
                  className="space-y-1 cursor-pointer flex-1"
                  onClick={() => handleOpenExerciseModal(ex)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 hover:text-teal-700 transition-colors">
                      {ex.name}
                    </span>
                    <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {ex.group}
                    </span>
                  </div>
                  <p className="text-xs text-teal-800 font-semibold">
                    {ex.sets} séries • {ex.repetitions} • {ex.frequency}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {ex.biomechanicalDescription}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenExerciseModal(ex)}
                  >
                    Ver Instruções
                  </Button>

                  <button
                    onClick={() => handleToggleExercise(ex.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                      ex.isCompletedToday
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {ex.isCompletedToday ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Feito hoje</span>
                      </>
                    ) : (
                      <span>Marcar como feito</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment History Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Histórico de Atendimentos Realizados
              </h3>
              <p className="text-xs text-slate-500">
                Registro cronológico com evoluções e alívio de dor
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {pastSessions.length} sessões registradas
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {pastSessions.map((session) => (
            <div key={session.id} className="py-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  Sessão #{session.sessionNumber.toString().padStart(2, '0')} • {session.procedure}
                </span>
                <span className="font-mono text-slate-400">
                  {session.date} às {session.time}
                </span>
              </div>
              <p className="text-slate-600">
                <strong>Condutas realizadas:</strong> {session.conductSummary}
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-teal-700 italic">
                  "{session.physioFeedback}"
                </span>
                <span className="font-mono font-semibold text-slate-700">
                  EVA: {session.painLevelBefore}/10 → <strong className="text-teal-700">{session.painLevelAfter}/10</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Clinical Documents & Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <h4 className="font-bold text-sm text-slate-800">Declarações e Documentos</h4>
          </div>
          <p className="text-xs text-slate-500">
            Documentos disponibilizados pela recepção ou especialista:
          </p>
          <div className="space-y-2 text-xs">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
              >
                <div>
                  <span className="font-semibold text-slate-800 block">
                    {doc.title}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Emitido em {doc.issuedDate} • {doc.fileSize}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download className="w-3 h-3" />}
                  onClick={() => addToast(`Download de "${doc.title}" iniciado com sucesso!`)}
                >
                  Baixar PDF
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-teal-600" />
            <h4 className="font-bold text-sm text-slate-800">Fale com a Recepção</h4>
          </div>
          <p className="text-xs text-slate-500">
            Dúvidas sobre horários, cancelamentos de última hora ou orientações:
          </p>
          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200/80 text-xs text-teal-900 space-y-2">
            <p className="font-semibold text-sm">Central Telefônica: (11) 91234-5678</p>
            <p className="text-[11px] text-teal-700 leading-relaxed">
              Horário de atendimento telefônico: Segunda a Sexta das 07h às 20h. Sábados das 08h às 13h.
            </p>
            <p className="text-[11px] text-slate-600 font-medium">
              Endereço: Av. Paulista, 1842 - Torre Norte, Conj. 1204 - Bela Vista, São Paulo - SP
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <HomeExerciseModal
        exercise={selectedExercise}
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onToggleComplete={handleToggleExercise}
      />

      <CancelRescheduleModal
        appointment={selectedAppointmentForCancel}
        isOpen={!!selectedAppointmentForCancel}
        onClose={() => setSelectedAppointmentForCancel(null)}
        onCancelSuccess={handleCancelSuccess}
      />
    </div>
  );
};
