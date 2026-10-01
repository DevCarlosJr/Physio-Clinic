import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  Plus,
  Edit2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Ban,
  DoorOpen,
  Phone,
  Mail,
  Trash2,
  Sparkles,
} from 'lucide-react';
import {
  initialProfessionalsList,
  initialScheduleBlocks,
} from '../data/mockProfessionalsData';
import {
  PhysiotherapistProfessional,
  ScheduleBlockItem,
  WeeklyWorkShift,
} from '../types/professional';
import { Button } from '../components/common/Button';
import { ProfessionalFormModal } from '../components/professionals/ProfessionalFormModal';
import { WeeklyScheduleModal } from '../components/professionals/WeeklyScheduleModal';
import { ScheduleBlockModal } from '../components/professionals/ScheduleBlockModal';
import { useApp } from '../context/AppContext';
import { formatPhone, parseProfessionalName, formatProfessionalName } from '../utils/formatters';

export const ProfessionalsPage: React.FC = () => {
  const { addToast } = useApp();

  const [professionals, setProfessionals] = useState<PhysiotherapistProfessional[]>(initialProfessionalsList);
  const [blocks, setBlocks] = useState<ScheduleBlockItem[]>(initialScheduleBlocks);
  const [activeTab, setActiveTab] = useState<'team' | 'grid' | 'blocks'>('team');

  // Modals state
  const [selectedProfForEdit, setSelectedProfForEdit] = useState<PhysiotherapistProfessional | null>(null);
  const [isProfModalOpen, setIsProfModalOpen] = useState(false);

  const [selectedProfForSchedule, setSelectedProfForSchedule] = useState<PhysiotherapistProfessional | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const handleSaveProfessional = (savedProf: PhysiotherapistProfessional) => {
    // Sanitize any accidental prefix repetition in savedProf.name
    const parsed = parseProfessionalName(savedProf.name);
    const sanitizedName = formatProfessionalName(parsed.prefix, parsed.baseName);
    const normalizedProf: PhysiotherapistProfessional = { ...savedProf, name: sanitizedName };

    setProfessionals((prev) => {
      const idx = prev.findIndex((p) => p.id === normalizedProf.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = normalizedProf;
        return copy;
      }
      return [...prev, normalizedProf];
    });
    addToast(`Fisioterapeuta ${normalizedProf.name} salvo com sucesso!`, 'success');
  };

  const handleSaveWeeklySchedule = (profId: string, updatedSchedule: WeeklyWorkShift[]) => {
    setProfessionals((prev) =>
      prev.map((p) => (p.id === profId ? { ...p, weeklySchedule: updatedSchedule } : p))
    );
    addToast('Escala de trabalho semanal atualizada com sucesso!', 'success');
  };

  const handleAddBlock = (newBlock: ScheduleBlockItem) => {
    setBlocks((prev) => [newBlock, ...prev]);
    addToast(`Bloqueio de agenda para ${newBlock.professionalName} cadastrado com sucesso!`, 'success');
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    addToast('Bloqueio de agenda removido.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Corpo Clínico & Gestão de Escalas</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre fisioterapeutas, defina turnos de atendimento, aloque boxes e gerencie bloqueios
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Ban className="w-3.5 h-3.5 text-rose-600" />}
            onClick={() => setIsBlockModalOpen(true)}
          >
            + Novo Bloqueio de Agenda
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setSelectedProfForEdit(null);
              setIsProfModalOpen(true);
            }}
          >
            Cadastrar Fisioterapeuta
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Fisioterapeutas
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {professionals.length}
            </span>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded">
              Corpo Clínico
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Registrados no CREFITO-3</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Ativos na Escala
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {professionals.filter((p) => p.status === 'active').length}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              100%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Disponíveis para agenda</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Bloqueios Registrados
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-800">
              {blocks.length}
            </span>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
              Ausências
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Férias / Congressos</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Boxes Alocados
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-teal-800">4</span>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded">
              Boxes
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Ocupação otimizada</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 text-xs font-semibold space-x-2 bg-white px-4 rounded-xl shadow-2xs">
        <button
          onClick={() => setActiveTab('team')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'team'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Fisioterapeutas & Especialidades ({professionals.length})
        </button>

        <button
          onClick={() => setActiveTab('grid')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'grid'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Grade Semanal Consolidada de Turnos
        </button>

        <button
          onClick={() => setActiveTab('blocks')}
          className={`py-3 px-3.5 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'blocks'
              ? 'border-teal-600 text-teal-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Bloqueios de Agenda & Ausências ({blocks.length})
        </button>
      </div>

      {/* TAB 1: LISTA DE PROFISSIONAIS */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {professionals.map((prof) => (
            <div
              key={prof.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5 hover:border-teal-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                    {prof.name.split(' ')[1]?.charAt(0) || prof.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{prof.name}</h3>
                    <p className="text-[11px] font-mono text-teal-800 font-semibold">{prof.crefito}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{prof.primarySpecialty}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${
                    prof.status === 'active'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {prof.status === 'active' ? 'Ativo na Escala' : 'Em Licença'}
                </span>
              </div>

              {/* Box & Contacts */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium text-slate-800">
                    <DoorOpen className="w-3.5 h-3.5 text-teal-600" />
                    Box Alocado: {prof.assignedDefaultRoomName}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-700">
                    {prof.totalActivePatients} pacientes ativos
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                  <span>{formatPhone(prof.phone)}</span>
                  <span>{prof.email}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setSelectedProfForSchedule(prof);
                    setIsScheduleModalOpen(true);
                  }}
                >
                  Escala Semanal
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setSelectedProfForEdit(prof);
                    setIsProfModalOpen(true);
                  }}
                >
                  Editar Dados
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: GRADE SEMANAL CONSOLIDADA */}
      {activeTab === 'grid' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-100 bg-slate-50/60">
            <h3 className="font-bold text-slate-800 text-sm">
              Matriz Semanal de Cobertura e Ocupação de Boxes
            </h3>
            <p className="text-slate-400 text-xs">
              Visualização simultânea dos horários de atendimento dos especialistas
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'].map(
              (dayName, dayIdx) => {
                const dayNum = dayIdx + 1;
                return (
                  <div key={dayName} className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="w-36 shrink-0">
                      <span className="font-bold text-slate-900 block">{dayName}</span>
                      <span className="text-[10px] text-slate-400">Escala Clínica</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      {professionals.map((prof) => {
                        const shift = prof.weeklySchedule.find((s) => s.dayOfWeek === dayNum);
                        if (!shift || !shift.isWorking) return null;

                        return (
                          <div
                            key={prof.id}
                            className="p-2.5 rounded-lg border border-teal-200 bg-teal-50/60 text-xs space-y-0.5 min-w-[200px]"
                          >
                            <span className="font-bold text-slate-900 block">{prof.name}</span>
                            <span className="text-[11px] font-mono text-teal-800 font-semibold block">
                              {shift.startTime} às {shift.endTime} (Almoço: {shift.breakStartTime || '12:00'})
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {shift.defaultRoomName.split(' - ')[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BLOQUEIOS DE AGENDA */}
      {activeTab === 'blocks' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Bloqueios Programados de Agenda (Item 23)
              </h3>
              <p className="text-slate-500 text-xs">
                Períodos em que o motor anti-conflito impede novos agendamentos para o profissional
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsBlockModalOpen(true)}
            >
              Novo Bloqueio
            </Button>
          </div>

          <div className="space-y-3">
            {blocks.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Nenhum bloqueio de agenda ativo no momento.
              </div>
            ) : (
              blocks.map((block) => (
                <div
                  key={block.id}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{block.professionalName}</span>
                      <span className="text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded">
                        {block.reasonLabel}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      <strong>Período:</strong> {block.startDate} {block.endDate !== block.startDate && `até ${block.endDate}`}{' '}
                      {!block.isAllDay && `(${block.startTime} às ${block.endTime})`}
                    </p>
                    {block.notes && (
                      <p className="text-slate-500 italic text-[11px]">"{block.notes}"</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg cursor-pointer transition-colors"
                    title="Remover Bloqueio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <ProfessionalFormModal
        professional={selectedProfForEdit}
        isOpen={isProfModalOpen}
        onClose={() => setIsProfModalOpen(false)}
        onSave={handleSaveProfessional}
      />

      <WeeklyScheduleModal
        professional={selectedProfForSchedule}
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSaveSchedule={handleSaveWeeklySchedule}
      />

      <ScheduleBlockModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onAddBlock={handleAddBlock}
        professionals={professionals.map((p) => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
};
