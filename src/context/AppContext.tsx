import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserProfile, AppNotification } from '../types';
import { AuthSession } from '../types/auth';
import { AppointmentRecord, AppointmentStatusType } from '../types/appointment';
import { mockUsers, mockNotifications } from '../data/mockInitialData';
import { initialMockAppointments } from '../data/mockAppointmentsExtended';
import { AuthService } from '../services/authService';

export type AppRoute = 
  | 'dashboard'
  | 'agenda'
  | 'pacientes'
  | 'profissionais'
  | 'prontuarios'
  | 'relatorios'
  | 'notificacoes'
  | 'configuracoes';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  session: AuthSession | null;
  loginWithSession: (session: AuthSession) => void;
  logout: () => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isQuickBookingOpen: boolean;
  setIsQuickBookingOpen: (open: boolean) => void;
  isPatientBookingOpen: boolean;
  setIsPatientBookingOpen: (open: boolean) => void;
  canAccessRoute: (route: AppRoute) => boolean;
  appointments: AppointmentRecord[];
  addAppointment: (appointment: AppointmentRecord) => void;
  updateAppointmentStatus: (id: string, newStatus: AppointmentStatusType) => void;
}

const ROUTE_PERMISSIONS: Record<AppRoute, UserRole[]> = {
  dashboard: ['admin', 'receptionist', 'physiotherapist', 'patient'],
  agenda: ['admin', 'receptionist', 'physiotherapist'],
  pacientes: ['admin', 'receptionist', 'physiotherapist'],
  prontuarios: ['admin', 'physiotherapist', 'patient'],
  profissionais: ['admin', 'receptionist'],
  relatorios: ['admin', 'physiotherapist'],
  notificacoes: ['admin', 'receptionist', 'physiotherapist'],
  configuracoes: ['admin'],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() => AuthService.restoreSession());
  const [currentRoute, setCurrentRouteState] = useState<AppRoute>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState<boolean>(false);
  const [isPatientBookingOpen, setIsPatientBookingOpen] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(initialMockAppointments);

  const isAuthenticated = !!session;
  const currentRole: UserRole = session?.user?.role || 'admin';
  const currentUser: UserProfile = session?.user || mockUsers.admin;

  const canAccessRoute = (route: AppRoute): boolean => {
    const allowed = ROUTE_PERMISSIONS[route];
    return allowed ? allowed.includes(currentRole) : false;
  };

  const setCurrentRoute = (route: AppRoute) => {
    if (!canAccessRoute(route)) {
      addToast(`Acesso negado à área de ${route.toUpperCase()} para o perfil ${currentRole.toUpperCase()}.`, 'warning');
      return;
    }
    setCurrentRouteState(route);
  };

  const loginWithSession = (newSession: AuthSession) => {
    setSession(newSession);
    setCurrentRouteState('dashboard');
  };

  const logout = () => {
    AuthService.logout();
    setSession(null);
    setCurrentRouteState('dashboard');
    addToast('Sessão encerrada com segurança.', 'info');
  };

  const setRole = (newRole: UserRole) => {
    const updatedUser = mockUsers[newRole];
    if (updatedUser) {
      const newSession: AuthSession = {
        token: `jwt_sec_${Date.now()}`,
        user: updatedUser,
        expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      };
      setSession(newSession);
      addToast(`Perfil alternado para: ${newRole.toUpperCase()} (${updatedUser.name})`, 'info');
      // If current route is forbidden for new role, redirect to dashboard
      if (!ROUTE_PERMISSIONS[currentRoute]?.includes(newRole)) {
        setCurrentRouteState('dashboard');
      }
    }
  };

  const addAppointment = (newApt: AppointmentRecord) => {
    setAppointments((prev) => [newApt, ...prev]);
    addToast(`Consulta de ${newApt.patientName} agendada para ${newApt.date} às ${newApt.startTime}!`, 'success');
  };

  const updateAppointmentStatus = (id: string, newStatus: AppointmentStatusType) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        session,
        loginWithSession,
        logout,
        currentRole,
        setRole,
        currentUser,
        currentRoute,
        setCurrentRoute,
        sidebarOpen,
        setSidebarOpen,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        toasts,
        addToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        isQuickBookingOpen,
        setIsQuickBookingOpen,
        isPatientBookingOpen,
        setIsPatientBookingOpen,
        canAccessRoute,
        appointments,
        addAppointment,
        updateAppointmentStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
