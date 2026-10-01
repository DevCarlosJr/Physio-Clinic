/**
 * PhysioClinic Professionals & Work Schedule Domain Types
 * Fase 13: Fisioterapeutas, Escalas Semanais, Alocação de Boxes e Bloqueios de Agenda
 */

export interface WeeklyWorkShift {
  dayOfWeek: number; // 1=Segunda, 2=Terça, ..., 6=Sábado, 0=Domingo
  dayName: string;
  isWorking: boolean;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  hasBreak: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
  defaultRoomName: string;
}

export type BlockReason = 'vacation' | 'congress' | 'medical_leave' | 'meeting' | 'day_off';

export interface ScheduleBlockItem {
  id: string;
  professionalId: string;
  professionalName: string;
  reason: BlockReason;
  reasonLabel: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
  notes?: string;
  createdAt: string;
}

export interface PhysiotherapistProfessional {
  id: string;
  name: string;
  crefito: string;
  primarySpecialty: string;
  specialtiesList: string[];
  email: string;
  phone: string;
  avatarUrl?: string;
  status: 'active' | 'on_leave' | 'inactive';
  assignedDefaultRoomId: string;
  assignedDefaultRoomName: string;
  allowedServices: string[];
  weeklySchedule: WeeklyWorkShift[];
  totalActivePatients: number;
  completedAppointmentsCount: number;
}
