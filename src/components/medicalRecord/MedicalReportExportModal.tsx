import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FunctionalAssessment, SoapEvolutionRecord } from '../../types/medicalRecord';
import { Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface MedicalReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: FunctionalAssessment;
  evolutions: SoapEvolutionRecord[];
}

export const MedicalReportExportModal: React.FC<MedicalReportExportModalProps> = ({
  isOpen,
  onClose,
  assessment,
  evolutions,
}) => {
  if (!isOpen) return null;

  const currentPain = evolutions.length > 0 ? evolutions[0].painAfterEVA : assessment.initialPainScaleEVA;
  const painDrop = assessment.initialPainScaleEVA - currentPain;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Relatório de Evolução Fisioterapêutica"
      subtitle="Documento clínico oficial para encaminhamento médico e comprovação de convênio"
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Printer className="w-3.5 h-3.5" />}
            onClick={handlePrint}
          >
            Imprimir / Salvar em PDF
          </Button>
        </div>
      }
    >
      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6 text-xs text-slate-800 font-sans shadow-xs print:p-0 print:border-none">
        {/* Clinic Header */}
        <div className="border-b-2 border-teal-800 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-black text-teal-900 tracking-tight">
              PhysioClinic Reabilitação & Fisioterapia Integrada
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              CNPJ: 12.345.678/0001-90 • Registro Empresa: CREFITO-3 / PJ-8921
            </p>
            <p className="text-[11px] text-slate-500">
              Av. Paulista, 1842 - Torre Norte, Conj. 1204 - Bela Vista, São Paulo - SP • Tel: (11) 91234-5678
            </p>
          </div>

          <div className="text-right text-[10px] text-slate-400 font-mono">
            <span>RELATÓRIO CLÍNICO #{assessment.patientId.toUpperCase()}</span>
            <span className="block mt-0.5">Emissão: {new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Patient Identification */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/90 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Paciente:</span>
            <span className="font-bold text-slate-900">{assessment.patientName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Idade:</span>
            <span className="font-semibold text-slate-800">{assessment.patientAge} anos</span>
          </div>
          <div className="col-span-2 pt-1 border-t border-slate-200/60">
            <span className="text-slate-400 block text-[10px]">Diagnóstico Fisioterapêutico / Funcional:</span>
            <span className="font-bold text-teal-900">{assessment.functionalPhysioDiagnosis}</span>
          </div>
        </div>

        {/* Clinical Evolution Summary */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
            1. Resumo da Evolução Clínica
          </h4>
          <p className="text-slate-600 leading-relaxed text-xs">
            O paciente compareceu regularmente às sessões de fisioterapia prescritas, apresentando evolução clínica expressiva e favorável. Inicialmente apresentava limitação significativa na flexão de tronco e dor incapacitante. Ao longo do tratamento, apresentou ganho de amplitude de movimento de 18 cm e melhora no recrutamento do core.
          </p>
        </div>

        {/* Pain Comparison Metric */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
            2. Escala Visual Analógica de Dor (EVA 0 a 10)
          </h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Admissão</span>
              <span className="font-mono font-black text-rose-600 text-lg">
                {assessment.initialPainScaleEVA} / 10
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200">
              <span className="text-[10px] text-teal-700 block">Quadro Atual</span>
              <span className="font-mono font-black text-teal-800 text-lg">
                {currentPain} / 10
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-700 block">Alívio Obtido</span>
              <span className="font-mono font-black text-emerald-800 text-lg">
                -{painDrop} pontos
              </span>
            </div>
          </div>
        </div>

        {/* Applied Conducts */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
            3. Condutas Terapêuticas Realizadas ({evolutions.length} sessões concluídas de {assessment.plannedSessionsCount})
          </h4>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Cinesioterapia ativa e estabilização lombo-pélvica (Core profundo);</li>
            <li>Liberação miofascial instrumental e desativação de pontos-gatilho glúteos;</li>
            <li>Mobilização articular passiva da coluna lombar (Conceito Maitland);</li>
            <li>Eletroterapia analgésica (TENS convencional em frequência de 100 Hz);</li>
            <li>Programa de exercícios terapêuticos domiciliares monitorados.</li>
          </ul>
        </div>

        {/* Digital Signature & CREFITO */}
        <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Assinado digitalmente em conformidade com o Código de Ética COFFITO</span>
          </div>

          <div className="text-center sm:text-right">
            <p className="font-bold text-slate-900 text-xs">{assessment.evaluatorPhysioName}</p>
            <p className="font-mono text-[11px] text-teal-800 font-semibold">{assessment.evaluatorCrefito}</p>
            <p className="text-[10px] text-slate-400">Responsável Técnico / Fisioterapeuta Especialista</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
