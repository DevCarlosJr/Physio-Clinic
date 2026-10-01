/**
 * PhysioClinic Dashboard Types
 * Fase 03: Dashboards Especializados por Perfil (Admin, Fisioterapeuta, Recepção, Paciente)
 */

export type PeriodFilter = 'today' | '7days' | '30days' | 'month';

export interface DashboardFilterState {
  period: PeriodFilter;
  professionalId: string; // 'all' or specific id
  serviceType: string; // 'all' or specific service
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  percentage?: number;
}

export interface WaitingPatient {
  id: string;
  patientName: string;
  checkInTime: string;
  waitingMinutes: number;
  physiotherapistName: string;
  service: string;
  assignedRoom: string;
  status: 'waiting' | 'in_attendance' | 'called';
}

export interface ClinicalTask {
  id: string;
  patientId: string;
  patientName: string;
  type: 'evaluation' | 'reevaluation' | 'discharge' | 'report';
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

export interface PatientPrescribedExercise {
  id: string;
  name: string;
  group: string;
  sets: number;
  repetitions: string;
  frequency: string;
  notes: string;
}
