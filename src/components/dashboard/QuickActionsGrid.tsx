import React from 'react';
import { UserPlus, CalendarPlus, Play, FileEdit, ClipboardList } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickActionsGrid: React.FC = () => {
  const { setCurrentRoute, setIsQuickBookingOpen, addToast, currentRole } = useApp();

  const actions = [
    {
      title: 'Novo Paciente',
      desc: 'Cadastrar ficha cadastral',
      icon: UserPlus,
      color: 'text-teal-600 bg-teal-50 hover:bg-teal-100 border-teal-200',
      allowedRoles: ['admin', 'receptionist'],
      onClick: () => {
        setCurrentRoute('pacientes');
        addToast('Direcionado para a base de pacientes');
      },
    },
    {
      title: 'Novo Agendamento',
      desc: 'Verificar horários e salas',
      icon: CalendarPlus,
      color: 'text-sky-600 bg-sky-50 hover:bg-sky-100 border-sky-200',
      allowedRoles: ['admin', 'receptionist', 'physiotherapist'],
      onClick: () => setIsQuickBookingOpen(true),
    },
    {
      title: 'Iniciar Atendimento',
      desc: 'Chamar próximo da fila',
      icon: Play,
      color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
      allowedRoles: ['admin', 'physiotherapist'],
      onClick: () => {
        setCurrentRoute('prontuarios');
        addToast('Atendimento em andamento no Box 01');
      },
    },
    {
      title: 'Registrar Evolução',
      desc: 'Condutas e resposta clínica',
      icon: FileEdit,
      color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
      allowedRoles: ['admin', 'physiotherapist'],
      onClick: () => {
        setCurrentRoute('prontuarios');
        addToast('Módulo clínico de evolução aberto');
      },
    },
  ];

  const visibleActions = actions.filter((a) => a.allowedRoles.includes(currentRole));

  if (visibleActions.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {visibleActions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.title}
            onClick={action.onClick}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer shadow-2xs ${action.color}`}
          >
            <div className="p-2 rounded-lg bg-white/80 shrink-0 shadow-2xs">
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-slate-800 leading-tight">
                {action.title}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {action.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
