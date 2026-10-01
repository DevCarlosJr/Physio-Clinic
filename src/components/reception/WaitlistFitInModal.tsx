import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { WaitlistEntry } from '../../types/reception';
import { useApp } from '../../context/AppContext';
import { AppointmentRecord } from '../../types/appointment';
import {
  Users,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Phone,
  Sparkles,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { formatPhone } from '../../utils/formatters';

interface WaitlistFitInModalProps {
  isOpen: boolean;
  onClose: () => void;
  waitlist: WaitlistEntry[];
  onAddWaitlist: (entry: WaitlistEntry) => void;
  onFitInSuccess: (entry: WaitlistEntry, slotTime: string) => void;
}

export const WaitlistFitInModal: React.FC<WaitlistFitInModalProps> = ({
  isOpen,
  onClose,
  waitlist,
  onAddWaitlist,
  onFitInSuccess,
}) => {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');

  // Form for adding a new patient to the waitlist
  const [newPatientName, setNewPatientName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newService, setNewService] = useState('Reabilitação Traumato-Ortopédica');
  const [newPhysioId, setNewPhysioId] = useState('usr_physio_1');
  const [newShift, setNewShift] = useState<'morning' | 'afternoon' | 'any'>('morning');
  const [newPriority, setNewPriority] = useState<'urgent' | 'normal'>('normal');
  const [newNotes, setNewNotes] = useState('');

  const [selectedEntryForFitIn, setSelectedEntryForFitIn] = useState<WaitlistEntry | null>(null);
  const [selectedFitInSlot, setSelectedFitInSlot] = useState<string>('16:30');

  const physioMap: Record<string, string> = {
    usr_physio_1: 'Dr. Lucas Silveira',
    usr_physio_2: 'Dra. Camila Ramos',
    usr_physio_3: 'Dr. Thiago Medeiros',
  };

  const handleAddNewWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPhone.trim()) {
      addToast('Informe o nome e o telefone do paciente.', 'warning');
      return;
    }

    const entry: WaitlistEntry = {
      id: `wt-${Date.now().toString(36)}`,
      patientName: newPatientName.trim(),
      patientPhone: newPhone.trim(),
      preferredPhysioId: newPhysioId,
      preferredPhysioName: physioMap[newPhysioId] || 'Dr. Lucas Silveira',
      serviceName: newService,
      preferredShift: newShift,
      priority: newPriority,
      dateAdded: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      notes: newNotes.trim() || undefined,
    };

    onAddWaitlist(entry);
    addToast(`${entry.patientName} adicionado à lista de espera de encaixes!`, 'success');
    setNewPatientName('');
    setNewPhone('');
    setNewNotes('');
    setActiveTab('list');
  };

  const handleConfirmFitIn = () => {
    if (!selectedEntryForFitIn) return;
    onFitInSuccess(selectedEntryForFitIn, selectedFitInSlot);
    addToast(
      `Encaixe realizado! ${selectedEntryForFitIn.patientName} agendado para hoje às ${selectedFitInSlot} com ${selectedEntryForFitIn.preferredPhysioName}.`,
      'success'
    );
    setSelectedEntryForFitIn(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestão de Lista de Espera & Encaixes Rápidos"
      subtitle="Otimize a ocupação da clínica preenchendo horários vagos ou cancelados"
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>

          {activeTab === 'list' ? (
            <Button
              variant="secondary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setActiveTab('new')}
            >
              Adicionar Paciente à Fila
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddNewWaitlist}
            >
              Salvar na Fila de Espera
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => {
              setActiveTab('list');
              setSelectedEntryForFitIn(null);
            }}
            className={`flex-1 py-1.5 rounded-md font-semibold cursor-pointer transition-colors ${
              activeTab === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pacientes Aguardando Vaga ({waitlist.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-1.5 rounded-md font-semibold cursor-pointer transition-colors ${
              activeTab === 'new' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Cadastrar na Lista
          </button>
        </div>

        {/* TAB 1: LISTA DE ESPERA */}
        {activeTab === 'list' && (
          <div className="space-y-3">
            {selectedEntryForFitIn ? (
              /* Encaixar Paciente Selecionado Form */
              <div className="p-4 rounded-xl border border-teal-300 bg-teal-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-teal-900">
                    Confirmar Encaixe de {selectedEntryForFitIn.patientName}
                  </span>
                  <button
                    onClick={() => setSelectedEntryForFitIn(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Voltar
                  </button>
                </div>

                <div className="space-y-1 text-slate-700">
                  <p>
                    <strong>Especialista:</strong> {selectedEntryForFitIn.preferredPhysioName}
                  </p>
                  <p>
                    <strong>Procedimento:</strong> {selectedEntryForFitIn.serviceName}
                  </p>
                  <p>
                    <strong>Contato:</strong> {formatPhone(selectedEntryForFitIn.patientPhone)}
                  </p>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Selecione a Vaga Livre Disponível Hoje:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['14:00', '16:30', '17:30'].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedFitInSlot(slot)}
                        className={`p-2 rounded-lg font-mono font-bold text-xs border cursor-pointer ${
                          selectedFitInSlot === slot
                            ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEntryForFitIn(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    onClick={handleConfirmFitIn}
                  >
                    Confirmar Encaixe na Agenda
                  </Button>
                </div>
              </div>
            ) : (
              /* Waitlist items */
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {waitlist.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
                    <p className="font-semibold text-slate-700">Nenhum paciente na fila de espera no momento.</p>
                    <p className="text-xs text-slate-400 mt-0.5">Clique em "+ Cadastrar na Lista" para registrar uma nova solicitação.</p>
                  </div>
                ) : (
                  waitlist.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-teal-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {item.patientName}
                          </span>
                          {item.priority === 'urgent' && (
                            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Flame className="w-3 h-3 text-rose-500" />
                              Urgente
                            </span>
                          )}
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {item.preferredShift === 'morning' ? 'Manhã' : item.preferredShift === 'afternoon' ? 'Tarde' : 'Qualquer turno'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {item.serviceName} • Preferência: <span className="font-medium text-teal-700">{item.preferredPhysioName}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {formatPhone(item.patientPhone)} • Registrado em {item.dateAdded}
                        </p>
                        {item.notes && (
                          <p className="text-[11px] text-slate-600 italic pt-0.5">
                            "{item.notes}"
                          </p>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="primary"
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                        onClick={() => setSelectedEntryForFitIn(item)}
                        className="shrink-0"
                      >
                        Encaixar Vaga
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CADASTRAR NOVO NA FILA */}
        {activeTab === 'new' && (
          <form onSubmit={handleAddNewWaitlist} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nome do Paciente"
                required
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                placeholder="ex: Marcos Vinicius Rezende"
              />

              <Input
                label="Telefone com DDD"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="(11) 98765-4321"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Procedimento / Queixa"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                options={[
                  { value: 'Reabilitação Traumato-Ortopédica', label: 'Reabilitação Traumato-Ortopédica' },
                  { value: 'Reabilitação Lombar Aguda', label: 'Lombalgia / Ciatalgia Aguda' },
                  { value: 'Avaliação Postural Global (RPG)', label: 'RPG Postural' },
                  { value: 'Fisioterapia Respiratória', label: 'Fisioterapia Respiratória' },
                ]}
              />

              <Select
                label="Especialista Preferencial"
                value={newPhysioId}
                onChange={(e) => setNewPhysioId(e.target.value)}
                options={[
                  { value: 'usr_physio_1', label: 'Dr. Lucas Silveira (Ortopedia)' },
                  { value: 'usr_physio_2', label: 'Dra. Camila Ramos (RPG/Coluna)' },
                  { value: 'usr_physio_3', label: 'Dr. Thiago Medeiros (Respiratória)' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Turno Preferencial"
                value={newShift}
                onChange={(e) => setNewShift(e.target.value as any)}
                options={[
                  { value: 'morning', label: 'Manhã (07h às 12h)' },
                  { value: 'afternoon', label: 'Tarde (13h às 20h)' },
                  { value: 'any', label: 'Qualquer Turno Disponível' },
                ]}
              />

              <Select
                label="Nível de Prioridade"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                options={[
                  { value: 'normal', label: 'Normal (aguarda retorno)' },
                  { value: 'urgent', label: 'Urgente (dor aguda / crise)' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Observações Clínicas e Administrativas
              </label>
              <textarea
                rows={2}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="ex: Paciente tem disponibilidade imediata para comparecer em caso de cancelamento..."
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
