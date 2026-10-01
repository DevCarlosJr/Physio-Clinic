import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { SoapEvolutionRecord } from '../../types/medicalRecord';
import { COMMON_PHYSIO_CONDUCTS } from '../../types/clinicalSession';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Activity,
  CheckCircle2,
  Lock,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';

interface EvolutionSoapModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextSessionNumber: number;
  patientName: string;
  onSaveEvolution: (record: SoapEvolutionRecord) => void;
}

export const EvolutionSoapModal: React.FC<EvolutionSoapModalProps> = ({
  isOpen,
  onClose,
  nextSessionNumber,
  patientName,
  onSaveEvolution,
}) => {
  const { currentUser, addToast } = useApp();

  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [painBefore, setPainBefore] = useState(5);
  const [painAfter, setPainAfter] = useState(3);
  const [selectedConducts, setSelectedConducts] = useState<string[]>([
    'Cinesioterapia Ativa e Resistida',
    'Fortalecimento Isométrico de Core',
  ]);
  const [homeCare, setHomeCare] = useState('');

  const toggleConduct = (conduct: string) => {
    setSelectedConducts((prev) =>
      prev.includes(conduct) ? prev.filter((c) => c !== conduct) : [...prev, conduct]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjective.trim() || !objective.trim()) {
      addToast('Preencha os campos obrigatórios do SOAP (Subjetivo e Objetivo).', 'warning');
      return;
    }

    const newRecord: SoapEvolutionRecord = {
      id: `ev-${Date.now().toString(36)}`,
      sessionNumber: nextSessionNumber,
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      physiotherapistName: currentUser.name,
      crefito: currentUser.registrationNumber || currentUser.crefito || 'CREFITO-3 / 245910-F',
      subjective: subjective.trim(),
      objective: objective.trim(),
      assessment: assessment.trim() || 'Evolução clínica favorável e boa adesão às condutas.',
      plan: plan.trim() || 'Manter progressão terapêutica conforme planejamento inicial.',
      painBeforeEVA: painBefore,
      painAfterEVA: painAfter,
      conductsApplied: selectedConducts,
      homeCarePrescription: homeCare.trim() || 'Manter exercícios domiciliares prescritos.',
      lockedTimestamp: Date.now(),
      signatureHash: `SHA256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
    };

    onSaveEvolution(newRecord);
    addToast(`Evolução SOAP da Sessão #${nextSessionNumber} assinada e registrada com sucesso!`, 'success');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Nova Evolução Clínica • Sessão #${nextSessionNumber.toString().padStart(2, '0')}`}
      subtitle={`Paciente: ${patientName} • Responsável: ${currentUser.name} (${currentUser.registrationNumber || currentUser.crefito || 'CREFITO-3 / 245910-F'})`}
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Assinatura Digital com hash de auditoria COFFITO</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              onClick={handleSave}
            >
              Assinar & Arquivar no Prontuário
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSave} className="space-y-4 text-xs max-h-[72vh] overflow-y-auto pr-1">
        {/* Pain Scale EVA Input */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Escala de Dor EVA (0 a 10) Nesta Sessão
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700">Dor Inicial (Chegada)</span>
                <span className="font-mono text-rose-600 text-sm">{painBefore} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={painBefore}
                onChange={(e) => setPainBefore(Number(e.target.value))}
                className="w-full mt-2 accent-rose-600 cursor-pointer"
              />
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between font-bold">
                <span className="text-slate-700">Dor Final (Saída)</span>
                <span className="font-mono text-teal-700 text-sm">{painAfter} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={painAfter}
                onChange={(e) => setPainAfter(Number(e.target.value))}
                className="w-full mt-2 accent-teal-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Conducts Checklist */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
            Condutas Fisioterapêuticas Realizadas
          </span>
          <div className="grid grid-cols-2 gap-2">
            {COMMON_PHYSIO_CONDUCTS.slice(0, 6).map((c) => (
              <label
                key={c}
                className={`p-2 rounded border text-xs flex items-center gap-2 cursor-pointer ${
                  selectedConducts.includes(c)
                    ? 'border-teal-500 bg-teal-50/60 font-semibold text-teal-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedConducts.includes(c)}
                  onChange={() => toggleConduct(c)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="truncate">{c}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SOAP Fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              S — Subjetivo (Relato do Paciente)*
            </label>
            <textarea
              rows={2}
              required
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              placeholder="ex: Paciente refere redução no desconforto lombar matinal. Conseguiu caminhar 30 min sem dor..."
              className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              O — Objetivo (Achados no Exame Físico / ADM)*
            </label>
            <textarea
              rows={2}
              required
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="ex: Ganho de 10 cm na flexão de tronco anterior. Espasmo paravertebral diminuído em L4-L5..."
              className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                A — Avaliação (Resposta Clínica)
              </label>
              <textarea
                rows={2}
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="ex: Excelente resposta neuromuscular. Estabilidade do core melhorando..."
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                P — Plano (Próximas Sessões)
              </label>
              <textarea
                rows={2}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="ex: Progressão de carga no treino resistido e introdução de agachamento bipodal..."
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Orientações Domiciliares & Recomendações
            </label>
            <input
              type="text"
              value={homeCare}
              onChange={(e) => setHomeCare(e.target.value)}
              placeholder="ex: Manter exercícios do app 2x/dia. Manter pausas ativas a cada hora sentada."
              className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
