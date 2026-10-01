/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { SchedulePage } from './pages/SchedulePage';
import { RecordsPage } from './pages/RecordsPage';
import { ProfessionalsPage } from './pages/ProfessionalsPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ShieldAlert } from 'lucide-react';
import { Button } from './components/common/Button';
import { getRoleLabel } from './utils/formatters';

const AppContent: React.FC = () => {
  const { isAuthenticated, currentRoute, canAccessRoute, currentRole, setCurrentRoute } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Access control guard
  if (!canAccessRoute(currentRoute)) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-rose-200 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Acesso Restrito por Perfil (RBAC)</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Seu perfil atual de <strong>{getRoleLabel(currentRole)}</strong> não possui autorização para acessar o módulo selecionado.
          </p>
          <div className="mt-6">
            <Button variant="primary" size="sm" onClick={() => setCurrentRoute('dashboard')}>
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage />;
      case 'pacientes':
        return <PatientsPage />;
      case 'agenda':
        return <SchedulePage />;
      case 'prontuarios':
        return <RecordsPage />;
      case 'profissionais':
        return <ProfessionalsPage />;
      case 'relatorios':
        return <ReportsPage />;
      case 'notificacoes':
        return <NotificationsPage />;
      case 'configuracoes':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <MainLayout>{renderCurrentPage()}</MainLayout>;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
