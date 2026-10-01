/**
 * PhysioClinic Appointment Domain Types
 * Fase 05: Agenda Completa (Dia, Semana, Mês, Lista), Filtros e Gestão de Status
 */

export type AppointmentStatusType =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface AppointmentRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  physiotherapistId: string;
  physiotherapistName: string;
  roomId: string;
  roomName: string;
  serviceName: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatusType;
  insurance: string;
  observation?: string;
  checkInTime?: string;
}

export type AgendaViewMode = 'day' | 'week' | 'month' | 'list';

export interface AgendaFilterState {
  professionalId: string; // 'all' or id
  roomId: string; // 'all' or id
  serviceType: string; // 'all' or name
  status: 'all' | AppointmentStatusType;
  insurance: string; // 'all' or insurance name
}
