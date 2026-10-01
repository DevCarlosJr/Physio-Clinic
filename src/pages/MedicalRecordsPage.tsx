import React, { useState } from 'react';
import {
  FileText,
  User,
  Activity,
  Plus,
  Printer,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  Lock,
  Search,
  Filter,
} from 'lucide-react';
import {
  mockCarlosAssessment,
  mockCarlosEvolutions,
  mockCarlosTimeline,
} from '../data/mockMedicalRecordsData';
import {
  FunctionalAssessment,
  SoapEvolutionRecord,
  MedicalTimelineItem,
} from '../types/medicalRecord';
import { Button } from '../components/common/Button';
import { PainEvolutionChart } from '../components/medicalRecord/PainEvolutionChart';
import { EvolutionSoapModal } from '../components/medicalRecord/EvolutionSoapModal';
import { MedicalReportExportModal } from '../components/medicalRecord/MedicalReportExportModal';
import { useApp } from '../context/AppContext';

export const MedicalRecordsPage: React.FC = () => {
  const { currentRole, addToast } = useApp();

  const [assessment, setAssessment] = useState<FunctionalAssessment>(mockCarlosAssessment);
  const [evolutions, setEvolutions] = useState<SoapEvolutionRecord[]>(mockCarlosEvolutions);
  const [timeline, setTimeline] = useState<MedicalTimelineItem[]>(mockCarlosTimeline);

  const [activeTab, setActiveTab] = useState<'timeline' | 'assessment' | 'pain_chart' | 'soap'>('timeline');
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'sessions' | 'assessment'>('all');

  // Modals state
  const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Security guard for Receptionists
  if (currentRole === 'receptionist') {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3 max-w-md mx-auto my-12 shadow-sm">
        <Lock className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="font-bold text-base text-slate-900">Acesso Restrito ao Prontuário</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Conforme as diretrizes da LGPD (Lei 13.709/18) e normas do COFFITO/CREFITO, o prontuário eletrônico com evoluções e anamnese clínica é reservado exclusivamente a Fisioterapeutas e Diretores Clínicos.
        </p>
      </div>
    );
  }

  const handleSaveNewEvolution = (newRecord: SoapEvolutionRecord) => {
    setEvolutions((prev) => [newRecord, ...prev]);

    const newTimelineItem: MedicalTimelineItem = {
      id: `tl-${Date.now().toString(36)}`,
      type: 'session',
      date: newRecord.date,
      title: `Sessão #${newRecord.sessionNumber.toString().padStart(2, '0')} • SOAP`,
      author: newRecord.physiotherapistName,
      crefito: newRecord.crefito,
      summary: newRecord.assessment,
      painEVA: newRecord.painAfterEVA,
    };

    setTimeline((prev) => [newTimelineItem, ...prev]);
  };

  const filteredTimeline = timeline.filter((item) => {
    if (timelineFilter === 'all') return true;
    if (timelineFilter === 'sessions') return item.type === 'session';
    if (timelineFilter === 'assessment') return item.type === 'assessment';
    return true;
  });

  const nextSessionNumber = evolutions.length + 1;

  return (
    <div className="space-y-6">
      {/* Patient Header & Quick Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
            {assessment.patientName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900">{assessment.patientName}</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Em Tratamento Ativo
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prontuário #{assessment.patientId.toUpperCase()} • {assessment.patientAge} anos • Responsável: <span className="font-semibold text-teal-700">{assessment.evaluatorPhysioName}</span>
            </p>
            <p className="text-xs font-medium text-slate-700 mt-1">
              Diagnóstico: {assessment.functionalPhysioDiagnosis}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            icon={<Printer className="w-3.5 h-3.5" />}
            onClick={() => setIsReportModalOpen(true)}
          >
            Emitir Laudo / Relatório
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsEvolutionModalOpen(true)}
          >
            + Nova Evolução (SOAP)
          </Button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 text-xs font-semibold space-x-2 bg-white px-4 rounded-xl shadow-2xs">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'timeline'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Linha do Tempo Completa
        </button>

        <button
          onClick={() => setActiveTab('assessment')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'assessment'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Avaliação Fisioterapêutica Inicial
        </button>

        <button
          onClick={() => setActiveTab('pain_chart')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'pain_chart'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Curva de Evolução da Dor (EVA)
        </button>

        <button
          onClick={() => setActiveTab('soap')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'soap'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Registros SOAP ({evolutions.length})
        </button>
      </div>

      {/* TAB 1: LINHA DO TEMPO */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Histórico de Eventos Clínicos</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setTimelineFilter('all')}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  timelineFilter === 'all' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setTimelineFilter('sessions')}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  timelineFilter === 'sessions' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Sessões
              </button>
              <button
                onClick={() => setTimelineFilter('assessment')}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  timelineFilter === 'assessment' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Avaliação
              </button>
            </div>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {filteredTimeline.map((item) => (
              <div key={item.id} className="relative">
                <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-teal-600 border-2 border-white shadow-xs" />
                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                    <span className="font-mono text-slate-400 font-semibold">{item.date}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{item.summary}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-100">
                    <span>{item.author} ({item.crefito})</span>
                    {item.painEVA !== undefined && (
                      <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Dor EVA: {item.painEVA}/10
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AVALIAÇÃO FISIOTERAPÊUTICA INICIAL */}
      {activeTab === 'assessment' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6 text-xs text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Ficha de Avaliação Fisioterapêutica & Anamnese
              </h3>
              <p className="text-slate-400 text-xs">
                Realizada em {assessment.evaluatedAt} por {assessment.evaluatorPhysioName} ({assessment.evaluatorCrefito})
              </p>
            </div>
            <span className="font-mono text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded">
              Meta: {assessment.plannedSessionsCount} Sessões
            </span>
          </div>

          {/* Anamnese */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-teal-800">
              1. Anamnese & Queixa Principal
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 space-y-2">
              <p><strong>Queixa Principal:</strong> {assessment.chiefComplaint}</p>
              <p><strong>História da Moléstia Atual (HMA):</strong> {assessment.historyCurrentIllness}</p>
              <p><strong>Antecedentes Pessoais e Familiares:</strong> {assessment.pastMedicalHistory}</p>
              <p><strong>Hábitos de Vida & Ergonomia:</strong> {assessment.lifestyleHabits}</p>
            </div>
          </div>

          {/* Dor */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-teal-800">
              2. Caracterização da Dor
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px]">Localização Anatômica:</span>
                <span className="font-medium text-slate-800">{assessment.painLocation}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Tipo da Dor:</span>
                <span className="font-medium text-slate-800">{assessment.painType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Fatores de Piora:</span>
                <span className="font-medium text-slate-800">{assessment.aggravatingFactors}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Fatores de Alívio:</span>
                <span className="font-medium text-slate-800">{assessment.relievingFactors}</span>
              </div>
            </div>
          </div>

          {/* Exame Físico */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-teal-800">
              3. Exame Físico Fisioterapêutico
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 space-y-2">
              <p><strong>Inspeção Postural:</strong> {assessment.posturalInspection}</p>
              <p><strong>Palpação & Tônus Muscular:</strong> {assessment.palpationFindings}</p>
              <p><strong>Amplitude de Movimento (ADM):</strong> {assessment.rangeOfMotionADM}</p>
              <p><strong>Força Muscular (Escala MRC 0 a 5):</strong> {assessment.muscleStrengthMRC}</p>
              <p><strong>Testes Especiais Ortopédicos:</strong> {assessment.specialOrthopedicTests}</p>
            </div>
          </div>

          {/* Diagnóstico & Metas */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-teal-800">
              4. Diagnóstico Fisioterapêutico & Metas
            </h4>
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200/80 space-y-2 text-teal-950">
              <p><strong>Diagnóstico Funcional:</strong> {assessment.functionalPhysioDiagnosis}</p>
              <p><strong>Metas a Curto Prazo:</strong> {assessment.shortTermGoals}</p>
              <p><strong>Metas a Longo Prazo:</strong> {assessment.longTermGoals}</p>
              <p><strong>Conduta Terapêutica Planejada:</strong> {assessment.therapeuticPlan}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GRÁFICO DE EVOLUÇÃO DA DOR */}
      {activeTab === 'pain_chart' && (
        <PainEvolutionChart
          evolutions={evolutions}
          initialPain={assessment.initialPainScaleEVA}
        />
      )}

      {/* TAB 4: EVOLUÇÕES CLÍNICAS (SOAP) */}
      {activeTab === 'soap' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Registros SOAP Concluídos e Assinados ({evolutions.length})
            </span>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsEvolutionModalOpen(true)}
            >
              Adicionar Evolução SOAP
            </Button>
          </div>

          <div className="space-y-4">
            {evolutions.map((ev) => (
              <div
                key={ev.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      Sessão #{ev.sessionNumber.toString().padStart(2, '0')}
                    </span>
                    <span className="font-mono text-slate-400">
                      {ev.date} às {ev.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                      EVA: {ev.painBeforeEVA}/10 → {ev.painAfterEVA}/10
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      <Lock className="w-3 h-3 text-slate-400" />
                      Assinado
                    </span>
                  </div>
                </div>

                {/* SOAP Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-[11px] text-slate-700 uppercase">
                      S — Subjetivo
                    </span>
                    <p className="text-slate-600 leading-relaxed">{ev.subjective}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-[11px] text-slate-700 uppercase">
                      O — Objetivo
                    </span>
                    <p className="text-slate-600 leading-relaxed">{ev.objective}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-[11px] text-slate-700 uppercase">
                      A — Avaliação
                    </span>
                    <p className="text-slate-600 leading-relaxed">{ev.assessment}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-[11px] text-slate-700 uppercase">
                      P — Plano
                    </span>
                    <p className="text-slate-600 leading-relaxed">{ev.plan}</p>
                  </div>
                </div>

                {/* Conducts and Signature */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <div>
                    <strong>Condutas:</strong> {ev.conductsApplied.join(' • ')}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400">
                    Hash: {ev.signatureHash.slice(0, 24)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evolution Modal */}
      <EvolutionSoapModal
        isOpen={isEvolutionModalOpen}
        onClose={() => setIsEvolutionModalOpen(false)}
        nextSessionNumber={nextSessionNumber}
        patientName={assessment.patientName}
        onSaveEvolution={handleSaveNewEvolution}
      />

      {/* Report Export Modal */}
      <MedicalReportExportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        assessment={assessment}
        evolutions={evolutions}
      />
    </div>
  );
};
