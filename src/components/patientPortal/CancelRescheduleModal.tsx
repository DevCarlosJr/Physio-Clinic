import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AppointmentRecord } from '../../types/appointment';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  Clock,
  Phone,
  Calendar,
  XCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface CancelRescheduleModalProps {
  appointment: AppointmentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelSuccess: (id: string, reason: string) => void;
}

export const CancelRescheduleModal: React.FC<CancelRescheduleModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onCancelSuccess,
}) => {
  const { addToast, setIsPatientBookingOpen } = useApp();
  const [selectedReason, setSelectedReason] = useState<string>('Imprevisto de trabalho');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !appointment) return null;

  // Check 4-hour cancellation policy
  // Today's appointment is at 09:00 on 2026-09-30 (which is less than 4h or already active)
  const isLessThan4Hours = appointment.date === '2026-09-30' && appointment.startTime === '09:00';

  const handleConfirmCancellation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onCancelSuccess(appointment.id, selectedReason);
      addToast('Consulta cancelada com sucesso. O horário foi liberado para outros pacientes.', 'info');
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const handleOpenReschedule = () => {
    onClose();
    setIsPatientBookingOpen(true);
    addToast('Selecione uma nova data e horário para reagendar seu atendimento.', 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gerenciar Agendamento"
      subtitle={`Consulta de ${appointment.serviceName} • ${appointment.date} às ${appointment.startTime}`}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Voltar
          </Button>

          {!isLessThan4Hours && (
            <Button
              variant="primary"
              size="sm"
              icon={<XCircle className="w-3.5 h-3.5" />}
              onClick={handleConfirmCancellation}
              isLoading={isSubmitting}
            >
              Confirmar Cancelamento
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Policy Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            Política de Cancelamento da Clínica (Item 48)
          </div>
          <p className="text-slate-600 leading-relaxed">
            Cancelamentos online devem ser realizados com pelo menos <strong>4 horas de antecedência</strong> para permitir o remanejamento de outros pacientes em fila de espera.
          </p>
        </div>

        {isLessThan4Hours ? (
          /* Less than 4 hours lock notice */
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block">
                  Prazo Limite de Cancelamento Online Excedido
                </span>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Esta consulta está agendada para hoje às {appointment.startTime}. Cancelamentos com menos de 4 horas de antecedência não podem ser efetuados pelo aplicativo.
                </p>
                <p className="text-xs text-amber-800 font-semibold mt-2">
                  Por gentileza, entre em contato direto com a recepção para justificar sua ausência:
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-amber-200 flex items-center justify-between font-mono text-xs">
              <span className="flex items-center gap-1.5 text-slate-800 font-bold">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                (11) 91234-5678
              </span>
              <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-sans font-semibold">
                Recepção Ativa
              </span>
            </div>
          </div>
        ) : (
          /* Normal Cancellation Flow with Reason */
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Motivo do Cancelamento:
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="Imprevisto de trabalho">Imprevisto profissional / de trabalho</option>
                <option value="Sintoma de gripe / indisposição">Sintoma gripal ou indisposição de saúde</option>
                <option value="Compromisso familiar ou viagem">Compromisso familiar inadiável ou viagem</option>
                <option value="Dificuldade de transporte">Problemas de transporte / trânsito</option>
                <option value="Outro motivo">Outro motivo particular</option>
              </select>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-teal-900 block">Deseja apenas reagendar?</span>
                <span className="text-[11px] text-teal-700">Mude a data ou horário sem perder o vínculo com o Dr. Lucas Silveira.</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={<RefreshCw className="w-3 h-3" />}
                onClick={handleOpenReschedule}
              >
                Reagendar
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
