import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  FileText,
  Settings,
  Activity,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  X,
  LogOut,
  BarChart3,
  Bell,
} from 'lucide-react';
import { useApp, AppRoute } from '../../context/AppContext';
import { UserRole } from '../../types';
import { getRoleLabel } from '../../utils/formatters';

interface NavItem {
  id: AppRoute;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: UserRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['admin', 'receptionist', 'physiotherapist', 'patient'],
  },
  {
    id: 'agenda',
    label: 'Agenda',
    icon: Calendar,
    allowedRoles: ['admin', 'receptionist', 'physiotherapist'],
    badge: 'Hoje (6)',
  },
  {
    id: 'pacientes',
    label: 'Pacientes',
    icon: Users,
    allowedRoles: ['admin', 'receptionist', 'physiotherapist'],
  },
  {
    id: 'prontuarios',
    label: 'Prontuários & Clínico',
    icon: FileText,
    allowedRoles: ['admin', 'physiotherapist', 'patient'],
  },
  {
    id: 'profissionais',
    label: 'Profissionais',
    icon: UserCheck,
    allowedRoles: ['admin', 'receptionist'],
  },
  {
    id: 'relatorios',
    label: 'Relatórios & Métricas',
    icon: BarChart3,
    allowedRoles: ['admin', 'physiotherapist'],
  },
  {
    id: 'notificacoes',
    label: 'Notificações & Lembretes',
    icon: Bell,
    allowedRoles: ['admin', 'receptionist', 'physiotherapist'],
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
    allowedRoles: ['admin'],
  },
];

export const Sidebar: React.FC = () => {
  const { currentRole, currentRoute, setCurrentRoute, sidebarOpen, setSidebarOpen, currentUser, logout } =
    useApp();

  const handleNavigate = (route: AppRoute) => {
    setCurrentRoute(route);
    setSidebarOpen(false);
  };

  const filteredItems = navItems.filter((item) => item.allowedRoles.includes(currentRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                  Physio<span className="text-teal-600">Clinic</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none">
                Gestão & Fisioterapia
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinic & Tenant Info */}
        <div className="px-4 py-3 mx-4 my-3 rounded-lg bg-slate-50 border border-slate-200/70">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Unidade Matriz - SP
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Sistema online" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Assinatura Ativa • 4 Especialistas</p>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navegação Principal
          </div>
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] font-medium text-slate-400 truncate">
                  {getRoleLabel(currentRole)}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Encerrar Sessão (Logout Seguro)"
              aria-label="Encerrar Sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
