import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AppointmentRecord, AppointmentStatusType } from '../../types/appointment';
import { getStatusDetails, formatPhone } from '../../utils/formatters';
import {
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  Play,
  XCircle,
  AlertTriangle,
  FileText,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AppointmentDetailModalProps {
  appointment: AppointmentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: AppointmentStatusType) => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const { currentRole, setCurrentRoute, addToast } = useApp();

  if (!isOpen || !appointment) return null;

  const statusInfo = getStatusDetails(appointment.status);
  const isClinicalAllowed = currentRole === 'admin' || currentRole === 'physiotherapist';

  const handleUpdateStatus = (newStatus: AppointmentStatusType, feedback: string) => {
    onStatusChange(appointment.id, newStatus);
    addToast(feedback, 'info');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do Agendamento Clínico"
      subtitle={`Código #${appointment.id.toUpperCase()} • ${appointment.date}`}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>

          {isClinicalAllowed && (
            <Button
              variant="primary"
              size="sm"
              icon={<FileText className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                setCurrentRoute('prontuarios');
                addToast(`Prontuário de ${appointment.patientName} carregado.`);
              }}
            >
              Abrir Prontuário
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Status Header Badge */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Status Atual:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${statusInfo.badgeClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
              {statusInfo.label}
            </span>
          </div>

          <span className="font-mono text-slate-700 font-bold">
            {appointment.startTime} às {appointment.endTime} ({appointment.durationMinutes} min)
          </span>
        </div>

        {/* Patient Details */}
        <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white space-y-2">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-teal-600" />
            Dados do Paciente
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-slate-900">{appointment.patientName}</p>
              <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-slate-400" />
                {formatPhone(appointment.patientPhone)}
              </p>
            </div>
            <span className="text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {appointment.insurance}
            </span>
          </div>
        </div>

        {/* Clinical Info: Doctor, Room, Service */}
        <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block text-[10px]">Procedimento</span>
              <span className="font-semibold text-slate-800">{appointment.serviceName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Especialista</span>
              <span className="font-semibold text-teal-700">{appointment.physiotherapistName}</span>
            </div>
            <div className="col-span-2 flex items-center gap-1.5 text-slate-700 font-medium pt-1 border-t border-slate-100">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>{appointment.roomName}</span>
            </div>
          </div>
          {appointment.observation && (
            <p className="text-slate-500 italic pt-1 border-t border-slate-100">
              "{appointment.observation}"
            </p>
          )}
        </div>

        {/* Status Change Fast Actions */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Atualizar Situação do Atendimento:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {appointment.status !== 'confirmed' && (
              <button
                onClick={() =>
                  handleUpdateStatus('confirmed', `Consulta de ${appointment.patientName} confirmada!`)
                }
                className="p-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Confirmar</span>
              </button>
            )}

            {appointment.status !== 'in_progress' && (
              <button
                onClick={() =>
                  handleUpdateStatus(
                    'in_progress',
                    `Atendimento iniciado para ${appointment.patientName} no ${appointment.roomName}`
                  )
                }
                className="p-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-amber-600" />
                <span>Iniciar</span>
              </button>
            )}

            {appointment.status !== 'completed' && (
              <button
                onClick={() =>
                  handleUpdateStatus(
                    'completed',
                    `Consulta de ${appointment.patientName} marcada como concluída!`
                  )
                }
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Concluir</span>
              </button>
            )}

            {appointment.status !== 'no_show' && (
              <button
                onClick={() =>
                  handleUpdateStatus('no_show', `Falta registrada para ${appointment.patientName}`)
                }
                className="p-2 rounded-lg border border-red-200 bg-red-50 text-red-800 hover:bg-red-100 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Registrar Falta</span>
              </button>
            )}

            {appointment.status !== 'cancelled' && (
              <button
                onClick={() =>
                  handleUpdateStatus('cancelled', `Agendamento de ${appointment.patientName} cancelado`)
                }
                className="p-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Cancelar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
