/**
 * PhysioClinic Reports & Analytics Domain Types
 * Fase 14: Relatórios Operacionais, Ocupação, Taxas de Comparecimento e Desfechos Clínicos
 */

export type ReportTimeframe = 'today' | 'this_week' | 'this_month' | 'this_quarter';

export interface ClinicOccupancyMetric {
  boxId: string;
  boxName: string;
  totalAvailableHours: number;
  occupiedHours: number;
  occupancyPercentage: number;
}

export interface AttendanceStatusDistribution {
  totalAppointments: number;
  completedCount: number;
  confirmedCount: number;
  cancelledCount: number;
  noShowCount: number;
  attendanceRate: number; // e.g. 87.5%
  cancellationRate: number; // e.g. 8.7%
  noShowRate: number; // e.g. 3.8%
}

export interface PhysioPerformanceMetric {
  physioId: string;
  physioName: string;
  specialty: string;
  totalAppointments: number;
  completedAppointments: number;
  activePatientsCount: number;
  avgPainReductionEVA: number; // e.g. 5.2 points
  occupancyPercentage: number;
}

export interface ServiceShareMetric {
  serviceName: string;
  category: string;
  appointmentsCount: number;
  percentage: number;
}

export interface InsuranceShareMetric {
  modalityName: string;
  appointmentsCount: number;
  percentage: number;
}

export interface ClinicalOutcomeMetric {
  category: string;
  initialPainEVA: number;
  currentPainEVA: number;
  painDropEVA: number;
  reliefPercentage: number;
  avgSessionsCompleted: number;
}
