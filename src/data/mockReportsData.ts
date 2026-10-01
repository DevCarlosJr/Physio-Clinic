import {
  ClinicOccupancyMetric,
  AttendanceStatusDistribution,
  PhysioPerformanceMetric,
  ServiceShareMetric,
  InsuranceShareMetric,
  ClinicalOutcomeMetric,
} from '../types/reports';

export const mockMonthlyAttendance: AttendanceStatusDistribution = {
  totalAppointments: 482,
  completedCount: 398,
  confirmedCount: 24,
  cancelledCount: 42,
  noShowCount: 18,
  attendanceRate: 87.5,
  cancellationRate: 8.7,
  noShowRate: 3.8,
};

export const mockBoxesOccupancy: ClinicOccupancyMetric[] = [
  {
    boxId: 'box-01',
    boxName: 'Box 01 - Cinesioterapia & Funcional',
    totalAvailableHours: 240,
    occupiedHours: 212.4,
    occupancyPercentage: 88.5,
  },
  {
    boxId: 'box-02',
    boxName: 'Box 02 - Traumato-Ortopedia',
    totalAvailableHours: 240,
    occupiedHours: 202.1,
    occupancyPercentage: 84.2,
  },
  {
    boxId: 'sala-03',
    boxName: 'Sala 03 - Postura & RPG',
    totalAvailableHours: 200,
    occupiedHours: 172.0,
    occupancyPercentage: 86.0,
  },
  {
    boxId: 'box-04',
    boxName: 'Box 04 - Eletrotermofototerapia',
    totalAvailableHours: 220,
    occupiedHours: 166.8,
    occupancyPercentage: 75.8,
  },
];

export const mockPhysioPerformance: PhysioPerformanceMetric[] = [
  {
    physioId: 'usr_physio_1',
    physioName: 'Dr. Lucas Silveira',
    specialty: 'Traumato-Ortopedia & Esporte',
    totalAppointments: 182,
    completedAppointments: 164,
    activePatientsCount: 38,
    avgPainReductionEVA: 5.4,
    occupancyPercentage: 89.2,
  },
  {
    physioId: 'usr_physio_2',
    physioName: 'Dra. Camila Ramos',
    specialty: 'RPG & Coluna Vertebral',
    totalAppointments: 138,
    completedAppointments: 122,
    activePatientsCount: 29,
    avgPainReductionEVA: 5.5,
    occupancyPercentage: 86.0,
  },
  {
    physioId: 'usr_physio_3',
    physioName: 'Dr. Thiago Medeiros',
    specialty: 'Cardiorrespiratória & Eletro',
    totalAppointments: 112,
    completedAppointments: 98,
    activePatientsCount: 24,
    avgPainReductionEVA: 4.9,
    occupancyPercentage: 76.5,
  },
  {
    physioId: 'usr_admin_1',
    physioName: 'Dra. Helena Vasconcelos',
    specialty: 'Diretoria & Neurofuncional',
    totalAppointments: 50,
    completedAppointments: 46,
    activePatientsCount: 16,
    avgPainReductionEVA: 5.1,
    occupancyPercentage: 81.0,
  },
];

export const mockClinicalOutcomes: ClinicalOutcomeMetric[] = [
  {
    category: 'Ortopedia & Traumatologia',
    initialPainEVA: 8.1,
    currentPainEVA: 2.8,
    painDropEVA: 5.3,
    reliefPercentage: 65.4,
    avgSessionsCompleted: 8.4,
  },
  {
    category: 'RPG & Desvios Posturais',
    initialPainEVA: 7.8,
    currentPainEVA: 2.4,
    painDropEVA: 5.4,
    reliefPercentage: 69.2,
    avgSessionsCompleted: 9.6,
  },
  {
    category: 'Cinesioterapia de Core',
    initialPainEVA: 6.9,
    currentPainEVA: 2.1,
    painDropEVA: 4.8,
    reliefPercentage: 69.6,
    avgSessionsCompleted: 7.2,
  },
  {
    category: 'Fisioterapia Respiratória',
    initialPainEVA: 7.4,
    currentPainEVA: 2.6,
    painDropEVA: 4.8,
    reliefPercentage: 64.9,
    avgSessionsCompleted: 6.8,
  },
];

export const mockServicesDistribution: ServiceShareMetric[] = [
  {
    serviceName: 'Reabilitação Traumato-Ortopédica',
    category: 'Ortopedia',
    appointmentsCount: 184,
    percentage: 38.2,
  },
  {
    serviceName: 'Reeducação Postural Global (RPG)',
    category: 'Postura',
    appointmentsCount: 116,
    percentage: 24.1,
  },
  {
    serviceName: 'Cinesioterapia Motora & Core',
    category: 'Cinesioterapia',
    appointmentsCount: 96,
    percentage: 19.9,
  },
  {
    serviceName: 'Fisioterapia Respiratória',
    category: 'Respiratória',
    appointmentsCount: 52,
    percentage: 10.8,
  },
  {
    serviceName: 'Eletroterapia & Liberação Miofascial',
    category: 'Eletro',
    appointmentsCount: 34,
    percentage: 7.0,
  },
];

export const mockInsuranceDistribution: InsuranceShareMetric[] = [
  {
    modalityName: 'Particular (Direto)',
    appointmentsCount: 202,
    percentage: 41.9,
  },
  {
    modalityName: 'Bradesco Saúde',
    appointmentsCount: 126,
    percentage: 26.1,
  },
  {
    modalityName: 'SulAmérica',
    appointmentsCount: 88,
    percentage: 18.3,
  },
  {
    modalityName: 'Amil Saúde',
    appointmentsCount: 66,
    percentage: 13.7,
  },
];
