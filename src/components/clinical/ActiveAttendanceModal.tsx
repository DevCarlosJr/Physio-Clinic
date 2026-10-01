import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ClinicalSessionRecord, COMMON_PHYSIO_CONDUCTS } from '../../types/clinicalSession';
import { ClinicalSessionService } from '../../services/clinicalSessionService';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Save,
  Check,
  ShieldAlert,
  Play,
  FileText,
  User,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface ActiveAttendanceModalProps {
  session: ClinicalSessionRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onFinish: (session: ClinicalSessionRecord) => void;
}

export const ActiveAttendanceModal: React.FC<ActiveAttendanceModalProps> = ({
  session,
  isOpen,
  onClose,
  onFinish,
}) => {
  const { addToast } = useApp();

  const [currentSession, setCurrentSession] = useState<ClinicalSessionRecord | null>(session);
  const [elapsed, setElapsed] = useState<number>(session?.elapsedSeconds || 18 * 60);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastAutosave, setLastAutosave] = useState<string>('Agora');

  useEffect(() => {
    if (session) {
      setCurrentSession(session);
      setElapsed(session.elapsedSeconds || 0);
    }
  }, [session]);

  // Live timer interval
  useEffect(() => {
    if (!isOpen || !currentSession || currentSession.status === 'completed') return;

    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, currentSession]);

  if (!isOpen || !currentSession) return null;

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleConductToggle = (conduct: string) => {
    setCurrentSession((prev) => {
      if (!prev) return null;
      const exists = prev.conducts.includes(conduct);
      const updated = exists
        ? prev.conducts.filter((c) => c !== conduct)
        : [...prev.conducts, conduct];
      return { ...prev, conducts: updated };
    });
  };

  const handleSaveDraft = () => {
    if (!currentSession) return;
    setIsSaving(true);
    ClinicalSessionService.saveSession({ ...currentSession, elapsedSeconds: elapsed });
    setTimeout(() => {
      setIsSaving(false);
      setLastAutosave(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      addToast('Rascunho da evolução clínica salvo com sucesso!', 'info');
    }, 300);
  };

  const handleCompleteAttendance = () => {
    if (!currentSession) return;
    const finished: ClinicalSessionRecord = {
      ...currentSession,
      status: 'completed',
      elapsedSeconds: elapsed,
      completedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    ClinicalSessionService.finishSession(finished);
    onFinish(finished);
    addToast(`Atendimento de ${currentSession.patientName} finalizado e registrado no prontuário!`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cockpit Clínico • Atendimento Fisioterapêutico"
      subtitle={`Sessão em andamento • ${currentSession.roomName}`}
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Autosave: {lastAutosave}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Save className="w-3.5 h-3.5" />}
              onClick={handleSaveDraft}
              isLoading={isSaving}
            >
              Salvar Rascunho
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              onClick={handleCompleteAttendance}
            >
              Finalizar Atendimento
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs max-h-[72vh] overflow-y-auto pr-1">
        {/* Patient Clinical Header & Live Timer */}
        <div className="p-4 rounded-xl bg-slate-900 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white">{currentSession.patientName}</span>
              <span className="text-[10px] text-teal-300 font-mono bg-white/10 px-2 py-0.5 rounded">
                {currentSession.patientAge} anos
              </span>
            </div>
            <p className="text-teal-200/90 text-xs">
              Diagnóstico: {currentSession.clinicalDiagnosis}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {currentSession.clinicalAlerts.map((alert, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-rose-500/20 text-rose-200 border border-rose-400/30 px-2 py-0.5 rounded flex items-center gap-1 font-semibold"
                >
                  <AlertTriangle className="w-3 h-3 text-rose-300" />
                  {alert}
                </span>
              ))}
            </div>
          </div>

          {/* Session Timer Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-center shrink-0 min-w-[130px]">
            <span className="text-[10px] uppercase font-bold text-teal-200 block tracking-wider">
              Tempo em Sala
            </span>
            <span className="font-mono text-xl font-bold text-white tracking-wider block">
              {timeFormatted}
            </span>
            <span className="text-[9px] text-slate-300">
              Meta: {currentSession.durationMinutesPlanned} min
            </span>
          </div>
        </div>

        {/* Pain Scale (EVA 0-10) Evolution: Before vs After */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              Escala Visual Analógica de Dor (EVA 0 a 10)
            </h4>
            <span className="text-[11px] text-emerald-700 font-semibold">
              Redução alcançada: {currentSession.painScaleBefore - (currentSession.painScaleAfter ?? currentSession.painScaleBefore)} pontos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* EVA Chegada */}
            <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-900">Dor na Chegada (Início)</span>
                <span className="font-mono font-black text-rose-700 text-sm">
                  {currentSession.painScaleBefore} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={currentSession.painScaleBefore}
                onChange={(e) =>
                  setCurrentSession({ ...currentSession, painScaleBefore: Number(e.target.value) })
                }
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>0 (Sem dor)</span>
                <span>5 (Moderada)</span>
                <span>10 (Insuportável)</span>
              </div>
            </div>

            {/* EVA Término */}
            <div className="p-3 rounded-lg bg-teal-50/50 border border-teal-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-900">Dor ao Término (Pós-Condutas)</span>
                <span className="font-mono font-black text-teal-700 text-sm">
                  {currentSession.painScaleAfter ?? 0} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={currentSession.painScaleAfter ?? 0}
                onChange={(e) =>
                  setCurrentSession({ ...currentSession, painScaleAfter: Number(e.target.value) })
                }
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>0 (Sem dor)</span>
                <span>5 (Moderada)</span>
                <span>10 (Insuportável)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conducts Checklist */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Procedimentos e Condutas Realizadas na Sessão
            </h4>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
              {currentSession.conducts.length} selecionadas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {COMMON_PHYSIO_CONDUCTS.map((conduct) => {
              const checked = currentSession.conducts.includes(conduct);
              return (
                <label
                  key={conduct}
                  className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 cursor-pointer transition-colors ${
                    checked
                      ? 'border-teal-500 bg-teal-50/60 font-semibold text-teal-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleConductToggle(conduct)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>{conduct}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Clinical Evolution Textareas (SOAP) */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              1. Relato Subjetivo do Paciente (SOAP - S)
            </label>
            <textarea
              rows={2}
              value={currentSession.subjectiveReport}
              onChange={(e) =>
                setCurrentSession({ ...currentSession, subjectiveReport: e.target.value })
              }
              placeholder="Queixa, comportamento da dor nas atividades diárias, efeito das sessões anteriores..."
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              2. Achados Físicos & Avaliação Objetiva (SOAP - O)
            </label>
            <textarea
              rows={2}
              value={currentSession.objectiveAssessment}
              onChange={(e) =>
                setCurrentSession({ ...currentSession, objectiveAssessment: e.target.value })
              }
              placeholder="Palpação muscular, goniometria, testes ortopédicos especiais, padrão de marcha..."
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              3. Orientações Domiciliares & Recomendações
            </label>
            <input
              type="text"
              value={currentSession.homeCareGuidance}
              onChange={(e) =>
                setCurrentSession({ ...currentSession, homeCareGuidance: e.target.value })
              }
              placeholder="ex: Crioterapia 20 min pós-exercício, manter postura na cadeira de trabalho..."
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
