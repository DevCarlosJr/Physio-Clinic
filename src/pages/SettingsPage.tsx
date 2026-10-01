import React, { useState } from 'react';
import {
  Building2,
  Clock,
  Briefcase,
  Layers,
  Save,
  Plus,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  DoorOpen,
} from 'lucide-react';
import {
  initialClinicInfo,
  initialOperatingHours,
  initialSchedulingRules,
  initialClinicServices,
  initialClinicRooms,
} from '../data/mockClinicSettingsData';
import {
  ClinicGeneralInfo,
  OperatingDaySchedule,
  ClinicSchedulingRules,
  ClinicServiceItem,
  ClinicRoomItem,
} from '../types/clinicSettings';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { EditServiceModal } from '../components/settings/EditServiceModal';
import { EditRoomModal } from '../components/settings/EditRoomModal';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'hours' | 'services' | 'rooms'>('general');

  // State
  const [clinicInfo, setClinicInfo] = useState<ClinicGeneralInfo>(initialClinicInfo);
  const [operatingHours, setOperatingHours] = useState<OperatingDaySchedule[]>(initialOperatingHours);
  const [schedulingRules, setSchedulingRules] = useState<ClinicSchedulingRules>(initialSchedulingRules);
  const [services, setServices] = useState<ClinicServiceItem[]>(initialClinicServices);
  const [rooms, setRooms] = useState<ClinicRoomItem[]>(initialClinicRooms);

  // Modals
  const [selectedService, setSelectedService] = useState<ClinicServiceItem | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState<ClinicRoomItem | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast('Configurações da clínica salvas e sincronizadas com sucesso!', 'success');
    }, 400);
  };

  const handleHourToggle = (dayOfWeek: number) => {
    setOperatingHours((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, isOpen: !d.isOpen } : d))
    );
  };

  const handleHourChange = (dayOfWeek: number, field: 'openTime' | 'closeTime', val: string) => {
    setOperatingHours((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, [field]: val } : d))
    );
  };

  const handleSaveService = (savedItem: ClinicServiceItem) => {
    setServices((prev) => {
      const idx = prev.findIndex((s) => s.id === savedItem.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = savedItem;
        return copy;
      }
      return [...prev, savedItem];
    });
    addToast(`Serviço "${savedItem.name}" salvo com sucesso!`, 'success');
  };

  const handleSaveRoom = (savedRoom: ClinicRoomItem) => {
    setRooms((prev) => {
      const idx = prev.findIndex((r) => r.id === savedRoom.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = savedRoom;
        return copy;
      }
      return [...prev, savedRoom];
    });
    addToast(`Ambiente "${savedRoom.name}" atualizado!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Configurações da Clínica</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestão institucional, horários de atendimento, catálogo de serviços e boxes
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Save className="w-4 h-4" />}
          onClick={handleSaveAll}
          isLoading={isSaving}
        >
          Salvar Alterações
        </Button>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 text-xs font-semibold space-x-2 bg-white px-4 rounded-xl shadow-2xs">
        <button
          onClick={() => setActiveTab('general')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'general'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Dados da Clínica & COFFITO
        </button>

        <button
          onClick={() => setActiveTab('hours')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'hours'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Horários & Regras de Agendamento
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'services'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Catálogo de Procedimentos ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'rooms'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Salas & Boxes de Atendimento ({rooms.length})
        </button>
      </div>

      {/* TAB 1: DADOS INSTITUCIONAIS & REGISTRO COFFITO */}
      {activeTab === 'general' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Informações Institucionais e Responsabilidade Técnica
              </h3>
              <p className="text-slate-500 text-xs">
                Dados oficiais emitidos em atestados, declarações e relatórios clínicos
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Empresa Homologada no CREFITO-3
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome Fantasia"
              value={clinicInfo.tradeName}
              onChange={(e) => setClinicInfo({ ...clinicInfo, tradeName: e.target.value })}
            />

            <Input
              label="Razão Social Completa"
              value={clinicInfo.legalName}
              onChange={(e) => setClinicInfo({ ...clinicInfo, legalName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="CNPJ"
              value={clinicInfo.cnpj}
              onChange={(e) => setClinicInfo({ ...clinicInfo, cnpj: e.target.value })}
            />

            <Input
              label="Registro da Clínica no CREFITO (PJ)"
              value={clinicInfo.crefitoPJ}
              onChange={(e) => setClinicInfo({ ...clinicInfo, crefitoPJ: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Responsável Técnico (Fisioterapeuta Chefe)"
              value={clinicInfo.technicalManagerName}
              onChange={(e) => setClinicInfo({ ...clinicInfo, technicalManagerName: e.target.value })}
            />

            <Input
              label="CREFITO do Responsável Técnico"
              value={clinicInfo.technicalManagerCrefito}
              onChange={(e) => setClinicInfo({ ...clinicInfo, technicalManagerCrefito: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Telefone Principal da Clínica"
              value={clinicInfo.phone}
              onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
            />

            <Input
              label="E-mail de Contato e Ouvidoria"
              value={clinicInfo.contactEmail}
              onChange={(e) => setClinicInfo({ ...clinicInfo, contactEmail: e.target.value })}
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              Endereço Físico da Unidade
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Logradouro"
                  value={clinicInfo.addressStreet}
                  onChange={(e) => setClinicInfo({ ...clinicInfo, addressStreet: e.target.value })}
                />
              </div>
              <Input
                label="Número"
                value={clinicInfo.addressNumber}
                onChange={(e) => setClinicInfo({ ...clinicInfo, addressNumber: e.target.value })}
              />
              <Input
                label="Complemento"
                value={clinicInfo.addressComplement}
                onChange={(e) => setClinicInfo({ ...clinicInfo, addressComplement: e.target.value })}
              />
              <Input
                label="Bairro"
                value={clinicInfo.addressNeighborhood}
                onChange={(e) => setClinicInfo({ ...clinicInfo, addressNeighborhood: e.target.value })}
              />
              <Input
                label="Cidade / UF"
                value={`${clinicInfo.addressCity} - ${clinicInfo.addressState}`}
                onChange={(e) => setClinicInfo({ ...clinicInfo, addressCity: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HORÁRIOS & REGRAS */}
      {activeTab === 'hours' && (
        <div className="space-y-6">
          {/* Operating Hours Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                Horários de Atendimento da Clínica por Dia da Semana
              </h3>
              <p className="text-slate-500 text-xs">
                O motor anti-conflito respeita estritamente estes horários na geração de slots
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {operatingHours.map((schedule) => (
                <div
                  key={schedule.dayOfWeek}
                  className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="w-36 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={schedule.isOpen}
                      onChange={() => handleHourToggle(schedule.dayOfWeek)}
                      className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                    <span className={`font-semibold ${schedule.isOpen ? 'text-slate-900' : 'text-slate-400'}`}>
                      {schedule.dayName}
                    </span>
                  </div>

                  {schedule.isOpen ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Abertura:</span>
                        <input
                          type="time"
                          value={schedule.openTime}
                          onChange={(e) =>
                            handleHourChange(schedule.dayOfWeek, 'openTime', e.target.value)
                          }
                          className="border border-slate-300 rounded px-2 py-1 font-mono text-xs text-slate-800"
                        />
                      </div>
                      <span className="text-slate-400">às</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Fechamento:</span>
                        <input
                          type="time"
                          value={schedule.closeTime}
                          onChange={(e) =>
                            handleHourChange(schedule.dayOfWeek, 'closeTime', e.target.value)
                          }
                          className="border border-slate-300 rounded px-2 py-1 font-mono text-xs text-slate-800"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-rose-600 font-semibold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                      Clínica Fechada
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scheduling & Cancellation Rules (Item 48) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                Regras Operacionais da Agenda e Política de Cancelamento
              </h3>
              <p className="text-slate-500 text-xs">
                Controle de buffers entre sessões e tolerâncias de antecedência
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Duração Padrão da Consulta
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={schedulingRules.defaultDurationMinutes}
                    onChange={(e) =>
                      setSchedulingRules({
                        ...schedulingRules,
                        defaultDurationMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono text-xs"
                  />
                  <span className="text-slate-500">min</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Intervalo / Buffer Entre Atendimentos
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={schedulingRules.bufferBetweenSlotsMinutes}
                    onChange={(e) =>
                      setSchedulingRules({
                        ...schedulingRules,
                        bufferBetweenSlotsMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono text-xs"
                  />
                  <span className="text-slate-500">min</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Antecedência Mínima para Cancelamento Online (Item 48)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={schedulingRules.minAdvanceCancellationHours}
                    onChange={(e) =>
                      setSchedulingRules({
                        ...schedulingRules,
                        minAdvanceCancellationHours: Number(e.target.value),
                      })
                    }
                    className="w-full border border-teal-500 bg-teal-50/50 rounded-lg p-2 font-mono text-xs font-bold text-teal-900"
                  />
                  <span className="text-slate-500">horas</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Abaixo deste prazo, o cancelamento é bloqueado no app e redirecionado à recepção.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATÁLOGO DE SERVIÇOS */}
      {activeTab === 'services' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Catálogo de Procedimentos e Serviços Fisioterapêuticos
              </h3>
              <p className="text-slate-500 text-xs">
                Procedimentos disponíveis para agendamento interno e pelo Portal do Paciente
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setSelectedService(null);
                setIsServiceModalOpen(true);
              }}
            >
              Novo Procedimento
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {services.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors p-2 rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        item.isActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {item.isActive ? 'Ativo' : 'Pausado'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs">{item.description}</p>
                  <p className="text-[11px] text-teal-700">
                    Especialistas: {item.allowedPhysioNames.join(', ')} • Salas: {item.allowedRoomNames.join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right font-mono">
                    <span className="font-bold text-slate-900 block text-sm">
                      R$ {item.referencePrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.durationMinutes} min</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Edit2 className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setSelectedService(item);
                      setIsServiceModalOpen(true);
                    }}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SALAS & BOXES */}
      {activeTab === 'rooms' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Salas e Boxes de Atendimento Clínico
              </h3>
              <p className="text-slate-500 text-xs">
                Espaços físicos gerenciados pelo motor anti-conflito de ocupação
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setSelectedRoom(null);
                setIsRoomModalOpen(true);
              }}
            >
              Novo Box / Sala
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-teal-400 transition-all space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{room.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      room.status === 'active'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : room.status === 'maintenance'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {room.status === 'active' && 'Liberado para Agenda'}
                    {room.status === 'maintenance' && 'Em Manutenção'}
                    {room.status === 'inactive' && 'Bloqueado'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>
                    <strong>Tipo:</strong> {room.type === 'box' ? 'Box de Atendimento Individual' : room.type === 'individual' ? 'Sala Fechada' : room.type} • <strong>Capacidade:</strong> {room.capacity} paciente
                  </p>
                  <p className="text-slate-600 italic">
                    {room.equipmentSummary}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Edit2 className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setSelectedRoom(room);
                      setIsRoomModalOpen(true);
                    }}
                  >
                    Editar Box
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      <EditServiceModal
        service={selectedService}
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSave={handleSaveService}
      />

      {/* Edit Room Modal */}
      <EditRoomModal
        room={selectedRoom}
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSave={handleSaveRoom}
      />
    </div>
  );
};
