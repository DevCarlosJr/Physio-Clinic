import React, { useState } from 'react';
import {
  Bell,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  Edit2,
  Smartphone,
  Mail,
  AlertTriangle,
  Sparkles,
  UserCheck,
  CheckCheck,
} from 'lucide-react';
import {
  initialMessageTemplates,
  initialDispatchedLogs,
} from '../data/mockNotificationsData';
import {
  MessageTemplate,
  DispatchedMessageLog,
} from '../types/notifications';
import { Button } from '../components/common/Button';
import { EditTemplateModal } from '../components/notifications/EditTemplateModal';
import { useApp } from '../context/AppContext';

export const NotificationsPage: React.FC = () => {
  const { addToast } = useApp();

  const [templates, setTemplates] = useState<MessageTemplate[]>(initialMessageTemplates);
  const [logs, setLogs] = useState<DispatchedMessageLog[]>(initialDispatchedLogs);
  const [activeTab, setActiveTab] = useState<'logs' | 'templates' | 'internal'>('logs');

  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSaveTemplate = (savedTemplate: MessageTemplate) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === savedTemplate.id ? savedTemplate : t))
    );
    addToast(`Modelo "${savedTemplate.name}" atualizado com sucesso!`, 'success');
  };

  const handleSimulateDispatches = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const newLog: DispatchedMessageLog = {
        id: `log-${Date.now().toString(36)}`,
        recipientName: 'Mariana Costa Lima',
        recipientContact: '(11) 94321-8765',
        templateName: 'Lembrete de Consulta 24 Horas Antes',
        sentAt: 'Agora mesmo',
        channel: 'push',
        status: 'delivered',
        previewText: 'Olá, Mariana! Lembramos que sua sessão de RPG com Dra. Camila Ramos está agendada...',
      };

      setLogs((prev) => [newLog, ...prev]);
      setIsSimulating(false);
      addToast('Disparo de lembretes automatizados executado com sucesso!', 'success');
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Simulation Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Central de Notificações & Lembretes</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Modelos de mensagens, confirmações automáticas de consultas e registros de entrega
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Send className="w-4 h-4" />}
          onClick={handleSimulateDispatches}
          isLoading={isSimulating}
        >
          Disparar Lembretes Automáticos
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Lembretes Enviados
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {logs.length + 380}
            </span>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded">
              No Mês
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Push, SMS e E-mail</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Taxa de Confirmação
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              91.4%
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              Alta
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Respostas de presença</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Modelos Ativos
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-teal-800">
              {templates.filter((t) => t.isActive).length} de {templates.length}
            </span>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded">
              Templates
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Gatilhos automáticos</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Redução de No-Show
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-800">
              -62%
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              Impacto
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Devido aos lembretes de 24h</span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 text-xs font-semibold space-x-2 bg-white px-4 rounded-xl shadow-2xs">
        <button
          onClick={() => setActiveTab('logs')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'logs'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Histórico de Envios & Confirmações ({logs.length})
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'templates'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Modelos de Mensagens & Lembretes ({templates.length})
        </button>

        <button
          onClick={() => setActiveTab('internal')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'internal'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Notificações Internas da Equipe
        </button>
      </div>

      {/* TAB 1: HISTÓRICO DE ENVIOS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Envios Recentes aos Pacientes
              </h3>
              <p className="text-slate-400 text-xs">
                Acompanhamento em tempo real de entrega e confirmações de presença
              </p>
            </div>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Sincronizado
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{log.recipientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.recipientContact}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {log.channel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {log.templateName}
                  </p>
                  <p className="text-[11px] text-slate-400 italic line-clamp-1">
                    "{log.previewText}"
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400">
                    {log.sentAt}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      log.status === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : log.status === 'delivered'
                        ? 'bg-teal-50 text-teal-800 border-teal-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {log.status === 'confirmed' && (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Confirmado pelo Paciente</span>
                      </>
                    )}
                    {log.status === 'delivered' && (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Entregue no Dispositivo</span>
                      </>
                    )}
                    {log.status === 'sent' && (
                      <>
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Enviado</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MODELOS DE MENSAGENS */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between hover:border-teal-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">
                      {tpl.name}
                    </h4>
                    <p className="text-[11px] text-teal-700 font-medium mt-0.5">
                      {tpl.timingDescription}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase shrink-0 ${
                      tpl.isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {tpl.isActive ? 'Ativo' : 'Pausado'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed font-sans">
                  {tpl.content}
                </div>

                <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-400 pt-1">
                  {tpl.availableVariables.map((v) => (
                    <span key={v} className="bg-slate-100 px-1.5 py-0.5 rounded">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Canal: <strong className="uppercase text-slate-600">{tpl.channel}</strong>
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit2 className="w-3 h-3" />}
                  onClick={() => {
                    setSelectedTemplate(tpl);
                    setIsEditModalOpen(true);
                  }}
                >
                  Personalizar Texto
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: NOTIFICAÇÕES INTERNAS */}
      {activeTab === 'internal' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Mural de Alertas e Notificações Internas da Recepção & Fisioterapeutas
            </h3>
            <p className="text-slate-500 text-xs">
              Eventos automáticos do sistema acionados pela jornada do paciente
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">
                  Paciente Fez Check-in na Recepção
                </span>
                <p className="text-slate-600 mt-0.5">
                  Carlos Eduardo Santos realizou check-in às 08:52 e está na sala de espera aguardando o Dr. Lucas Silveira (Box 01).
                </p>
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">Hoje às 08:52</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">
                  Consulta Confirmada via Aplicativo
                </span>
                <p className="text-slate-600 mt-0.5">
                  Beatriz Almeida confirmou presença na consulta de amanhã às 09:00.
                </p>
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">Hoje às 07:35</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">
                  Vaga Liberada por Cancelamento Antecipado
                </span>
                <p className="text-slate-600 mt-0.5">
                  Horário de amanhã às 14:00 (Box 02) liberado. O sistema notificou os 2 primeiros pacientes da lista de espera.
                </p>
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">Ontem às 16:30</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      <EditTemplateModal
        template={selectedTemplate}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTemplate}
      />
    </div>
  );
};
