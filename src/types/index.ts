/**
 * PhysioClinic Core TypeScript Interfaces & Types
 * Fase 01: Arquitetura, Modelos Base e Tipagem Estrita
 */

export type UserRole = 'admin' | 'receptionist' | 'physiotherapist' | 'patient';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  registrationNumber?: string; // e.g. CREFITO for physiotherapists
  crefito?: string;
  specialty?: string;
  phone?: string;
  clinicId: string;
}

export type AppointmentStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface AppointmentSummary {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  physiotherapistId: string;
  physiotherapistName: string;
  service: string;
  time: string; // HH:mm
  durationMinutes: number;
  room: string;
  status: AppointmentStatus;
  insurance?: string;
}

export interface PatientBasicInfo {
  id: string;
  name: string;
  socialName?: string;
  cpf: string;
  phone: string;
  email: string;
  birthDate: string;
  treatmentType: string;
  assignedPhysio: string;
  lastSessionDate?: string;
  nextSessionDate?: string;
  status: 'active' | 'discharged' | 'paused';
}

export interface ClinicMetric {
  id: string;
  label: string;
  value: string | number;
  changePercentage: number;
  trend: 'up' | 'down' | 'neutral';
  timeframe: string;
  iconName: string;
  category: 'clinical' | 'operational' | 'occupancy';
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  badge?: string | number;
  allowedRoles: UserRole[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'appointment' | 'system' | 'patient';
}
