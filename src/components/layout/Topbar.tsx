import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { getRoleLabel } from '../../utils/formatters';

export const Topbar: React.FC = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    currentRoute,
    currentRole,
    setRole,
    currentUser,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    searchQuery,
    setSearchQuery,
    setIsQuickBookingOpen,
    logout,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const routeTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard Executivo', subtitle: 'Visão geral da clínica e atendimentos' },
    agenda: { title: 'Agenda Clínica', subtitle: 'Gestão de horários, salas e confirmações' },
    pacientes: { title: 'Prontuário & Pacientes', subtitle: 'Cadastro unificado e histórico' },
    prontuarios: { title: 'Atendimento & Evolução', subtitle: 'Avaliações e condutas fisioterapêuticas' },
    profissionais: { title: 'Corpo Clínico & Equipe', subtitle: 'Escalas, especialidades e salas' },
    configuracoes: { title: 'Configurações do Sistema', subtitle: 'Parâmetros operacionais e segurança' },
  };

  const currentMeta = routeTitles[currentRoute] || {
    title: 'PhysioClinic',
    subtitle: 'Gestão para Fisioterapia',
  };

  const availableRoles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'admin', title: 'Administrador', desc: 'Acesso irrestrito e indicadores' },
    { role: 'physiotherapist', title: 'Fisioterapeuta', desc: 'Agenda, avaliações e condutas' },
    { role: 'receptionist', title: 'Recepcionista', desc: 'Atendimento e agendamentos' },
    { role: 'patient', title: 'Paciente', desc: 'Portal pessoal e orientações' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-none">
                {currentMeta.title}
              </h1>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 font-normal">
                • {currentMeta.subtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar paciente, CPF, profissional ou agendamento..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-2xs"
            />
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action button for scheduling (disabled in patient mode) */}
          {currentRole !== 'patient' && (
            <Button
              size="sm"
              variant="primary"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsQuickBookingOpen(true)}
              className="hidden sm:inline-flex"
            >
              Novo Agendamento
            </Button>
          )}

          {/* Role Switcher (Crucial for RBAC testing and demonstration) */}
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer transition-colors"
              title="Alternar perfil de acesso (Simulação RBAC)"
            >
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden md:inline text-slate-500">Perfil:</span>
              <span className="font-semibold text-slate-800">{getRoleLabel(currentRole)}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Controle de Acesso (RBAC)
                  </p>
                  <p className="text-[11px] text-slate-500">Simule a visão de cada usuário</p>
                </div>
                {availableRoles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setRole(r.role);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      currentRole === r.role
                        ? 'bg-teal-50 text-teal-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-slate-800">{r.title}</p>
                      <p className="text-[10px] text-slate-400">{r.desc}</p>
                    </div>
                    {currentRole === r.role && (
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              aria-label="Notificações"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Notificações</span>
                  <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-medium">
                    {unreadNotificationsCount} novas
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                        !n.read ? 'bg-teal-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-800 leading-tight">{n.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Logout Button */}
          <button
            onClick={logout}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 text-xs font-medium cursor-pointer transition-colors"
            title="Encerrar Sessão Segura"
          >
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};
