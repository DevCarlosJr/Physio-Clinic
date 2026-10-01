import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  Activity,
  FileText,
  Clock,
  AlertTriangle,
  Edit,
  Lock,
} from 'lucide-react';
import { PatientRecord } from '../../types/patient';
import { formatCPF, formatPhone } from '../../utils/formatters';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

interface PatientDetailDrawerProps {
  patient: PatientRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (patient: PatientRecord) => void;
}

export const PatientDetailDrawer: React.FC<PatientDetailDrawerProps> = ({
  patient,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { currentRole, setIsQuickBookingOpen, setCurrentRoute, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'admin' | 'clinical' | 'history'>('admin');

  if (!isOpen || !patient) return null;

  const isClinicalAllowed = currentRole === 'admin' || currentRole === 'physiotherapist';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-6 bg-slate-50/70 border-b border-slate-200/90 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
                {patient.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-slate-900 leading-snug">
                    {patient.fullName}
                  </h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      patient.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : patient.status === 'discharged'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {patient.status === 'active' && 'Em Tratamento'}
                    {patient.status === 'discharged' && 'Alta Concedida'}
                    {patient.status === 'paused' && 'Tratamento Pausado'}
                  </span>
                </div>
                {patient.socialName && (
                  <p className="text-xs text-slate-500 font-medium">
                    Nome Social: {patient.socialName}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-0.5">
                  Prontuário #{patient.id.replace('pat-', '')} • Cadastrado em {patient.createdAt}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer"
              aria-label="Fechar ficha"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Edit className="w-3.5 h-3.5" />}
                onClick={() => onEdit(patient)}
              >
                Editar Cadastro
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Calendar className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  setIsQuickBookingOpen(true);
                }}
              >
                Novo Agendamento
              </Button>
            </div>

            {isClinicalAllowed && (
              <Button
                variant="secondary"
                size="sm"
                icon={<FileText className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  setCurrentRoute('prontuarios');
                  addToast(`Prontuário clínico de ${patient.fullName} carregado.`);
                }}
              >
                Prontuário
              </Button>
            )}
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-200 px-6 bg-slate-50/40 text-xs">
            <button
              onClick={() => setActiveTab('admin')}
              className={`py-3 px-3 font-semibold border-b-2 cursor-pointer transition-colors ${
                activeTab === 'admin'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Informações Cadastrais
            </button>

            <button
              onClick={() => setActiveTab('clinical')}
              className={`py-3 px-3 font-semibold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'clinical'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Resumo Clínico</span>
              {!isClinicalAllowed && <Lock className="w-3 h-3 text-slate-400" />}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 px-3 font-semibold border-b-2 cursor-pointer transition-colors ${
                activeTab === 'history'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Histórico de Sessões
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: DADOS CADASTRAIS (Acesso Geral) */}
            {activeTab === 'admin' && (
              <div className="space-y-5 text-xs">
                {/* Contatos */}
                <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-2.5">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Contatos Principais
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{formatPhone(patient.phone)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">CPF</span>
                      <span className="font-mono font-medium">{formatCPF(patient.cpf)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Data de Nascimento</span>
                      <span>{patient.birthDate} ({patient.gender})</span>
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    Endereço Residencial
                  </h4>
                  <p className="text-slate-700 font-medium">
                    {patient.address.street}, {patient.address.number}{' '}
                    {patient.address.complement && `• ${patient.address.complement}`}
                  </p>
                  <p className="text-slate-500">
                    {patient.address.neighborhood} • {patient.address.city} - {patient.address.state}
                  </p>
                  <p className="text-slate-400 font-mono text-[11px]">
                    CEP: {patient.address.zipCode}
                  </p>
                </div>

                {/* Contato de Emergência */}
                <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Contato de Emergência
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{patient.emergencyContact.name}</p>
                      <p className="text-[11px] text-slate-500">{patient.emergencyContact.relationship}</p>
                    </div>
                    <span className="font-mono text-teal-800 font-bold bg-white px-2.5 py-1 rounded border border-slate-200">
                      {formatPhone(patient.emergencyContact.phone)}
                    </span>
                  </div>
                </div>

                {/* Vínculo & Observações */}
                <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Plano & Fisioterapeuta Responsável
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Convênio</span>
                      <span className="font-semibold text-slate-800">{patient.insurance}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Especialista</span>
                      <span className="font-semibold text-teal-700">{patient.assignedPhysioName}</span>
                    </div>
                  </div>
                  {patient.administrativeNotes && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-slate-400 block text-[10px]">Observações da Recepção</span>
                      <p className="text-slate-600 italic mt-0.5">{patient.administrativeNotes}</p>
                    </div>
                  )}
                </div>

                {/* LGPD & Privacidade (Item 50) */}
                <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-teal-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      Conformidade LGPD & Termo de Consentimento
                    </h4>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded">
                      Termo Assinado
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Consentimento de tratamento de dados de saúde assinado digitalmente no primeiro atendimento. Dados criptografados e acessíveis estritamente pela equipe autorizada.
                  </p>
                  <div className="pt-1 flex items-center justify-between border-t border-teal-200/60">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Protocolo LGPD: #BR-LGPD-{patient.id.toUpperCase()}
                    </span>
                    <button
                      onClick={() => addToast(`Relatório de portabilidade LGPD de ${patient.fullName} gerado!`)}
                      className="text-teal-700 hover:text-teal-900 font-semibold text-[11px] cursor-pointer underline"
                    >
                      Exportar Dados do Paciente (LGPD)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: RESUMO CLÍNICO (Acesso Restrito RBAC) */}
            {activeTab === 'clinical' && (
              <>
                {isClinicalAllowed ? (
                  <div className="space-y-5 text-xs">
                    <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                        Diagnóstico Funcional Fisioterapêutico
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {patient.clinicalDiagnosis}
                      </h4>
                      <p className="text-slate-600 leading-relaxed pt-1">
                        <strong>Objetivo do Tratamento:</strong> {patient.functionalGoal}
                      </p>
                    </div>

                    {/* Escala de Dor EVA */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                      <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-teal-600" />
                        Evolução da Escala de Dor (EVA 0 a 10)
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Dor Inicial (Avaliação)</span>
                          <span className="text-2xl font-black text-rose-600 font-mono">
                            {patient.initialPainLevel} / 10
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-teal-50 border border-teal-100">
                          <span className="text-[10px] text-teal-700 block">Dor Atual</span>
                          <span className="text-2xl font-black text-teal-700 font-mono">
                            {patient.currentPainLevel} / 10
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-emerald-700 text-center font-semibold">
                        Redução de {((patient.initialPainLevel ?? 5) - (patient.currentPainLevel ?? 5))} pontos no quadro álgico
                      </p>
                    </div>

                    {/* Plano de Sessões */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Sessões Realizadas</span>
                        <span className="font-mono font-bold text-teal-800">
                          {patient.completedSessionsCount} de {patient.totalSessionsPlanned} sessões
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          style={{
                            width: `${Math.round(
                              ((patient.completedSessionsCount ?? 0) / (patient.totalSessionsPlanned || 1)) * 100
                            )}%`,
                          }}
                          className="bg-teal-600 h-full rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Lock className="w-8 h-8 text-slate-400 mx-auto" />
                    <h4 className="font-bold text-slate-800 text-sm">Acesso Clínico Restrito</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Conforme os princípios de sigilo profissional e a LGPD (Lei 13.709/18), dados clínicos, diagnósticos e escalas de dor são restritos aos Fisioterapeutas e à Diretoria Médica.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* TAB 3: HISTÓRICO DE SESSÕES */}
            {activeTab === 'history' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Sessão #06 • Cinesioterapia</span>
                    <span className="text-slate-400 font-mono font-normal">28/09 às 11:15</span>
                  </div>
                  <p className="text-slate-600">
                    Atendido por {patient.assignedPhysioName}. Exercícios de estabilização completados com sucesso.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Sessão #05 • Terapia Manual</span>
                    <span className="text-slate-400 font-mono font-normal">25/09 às 11:00</span>
                  </div>
                  <p className="text-slate-600">
                    Liberação miofascial e exercícios respiratórios diafragmáticos.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Sessão #01 • Avaliação Inicial</span>
                    <span className="text-slate-400 font-mono font-normal">{patient.createdAt}</span>
                  </div>
                  <p className="text-slate-600">
                    Avaliação postural, anamnese completa e definição do plano terapêutico inicial.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
