import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useApp } from '../../context/AppContext';
import { QuickBookingModal } from '../modals/QuickBookingModal';
import { PatientSelfBookingFlow } from '../patientPortal/PatientSelfBookingFlow';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { toasts, removeToast, isPatientBookingOpen, setIsPatientBookingOpen } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Wrapper */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
        <Topbar />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* System Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-3.5 px-6 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">PhysioClinic SaaS</span>
            <span>•</span>
            <span>Arquitetura em Conformidade LGPD & Diretrizes COFFITO/CREFITO</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              API Gateway & Banco Operacional
            </span>
            <span>v1.0.0 (Fase 01-06)</span>
          </div>
        </footer>
      </div>

      {/* Quick Booking Modal (Reception / Admin / Staff) */}
      <QuickBookingModal />

      {/* Patient Self-Booking Portal Flow */}
      <PatientSelfBookingFlow
        isOpen={isPatientBookingOpen}
        onClose={() => setIsPatientBookingOpen(false)}
      />

      {/* Floating Toast Notification Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const typeConfig = {
            success: {
              icon: CheckCircle2,
              bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
              iconColor: 'text-emerald-600',
            },
            info: {
              icon: Info,
              bg: 'bg-sky-50 border-sky-200 text-sky-800',
              iconColor: 'text-sky-600',
            },
            warning: {
              icon: AlertTriangle,
              bg: 'bg-amber-50 border-amber-200 text-amber-800',
              iconColor: 'text-amber-600',
            },
            error: {
              icon: AlertCircle,
              bg: 'bg-rose-50 border-rose-200 text-rose-800',
              iconColor: 'text-rose-600',
            },
          }[toast.type];

          const Icon = typeConfig.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-center justify-between gap-3 text-xs font-medium animate-in slide-in-from-bottom-2 duration-150 ${typeConfig.bg}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${typeConfig.iconColor}`} />
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
