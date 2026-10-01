import { ChartDataPoint, WaitingPatient, ClinicalTask, PatientPrescribedExercise } from '../types/dashboard';

export const mockPeriodAppointmentsData: Record<string, ChartDataPoint[]> = {
  'today': [
    { label: '08h', value: 3 },
    { label: '09h', value: 4 },
    { label: '10h', value: 4 },
    { label: '11h', value: 3 },
    { label: '14h', value: 4 },
    { label: '15h', value: 3 },
    { label: '16h', value: 3 },
    { label: '17h', value: 2 },
  ],
  '7days': [
    { label: 'Seg', value: 24, secondaryValue: 2 },
    { label: 'Ter', value: 28, secondaryValue: 1 },
    { label: 'Qua (Hoje)', value: 26, secondaryValue: 3 },
    { label: 'Qui', value: 27, secondaryValue: 2 },
    { label: 'Sex', value: 29, secondaryValue: 1 },
    { label: 'Sáb', value: 14, secondaryValue: 0 },
  ],
  '30days': [
    { label: 'Sem 1', value: 128, secondaryValue: 8 },
    { label: 'Sem 2', value: 142, secondaryValue: 6 },
    { label: 'Sem 3', value: 135, secondaryValue: 9 },
    { label: 'Sem 4', value: 148, secondaryValue: 7 },
  ],
  'month': [
    { label: 'Sem 1', value: 128, secondaryValue: 8 },
    { label: 'Sem 2', value: 142, secondaryValue: 6 },
    { label: 'Sem 3', value: 135, secondaryValue: 9 },
    { label: 'Sem 4', value: 148, secondaryValue: 7 },
  ],
};

export const mockProfessionalOccupancy: ChartDataPoint[] = [
  { label: 'Dr. Lucas Silveira (Ortopedia)', value: 92, percentage: 92 },
  { label: 'Dra. Camila Ramos (RPG/Coluna)', value: 88, percentage: 88 },
  { label: 'Dr. Thiago Medeiros (Respiratória)', value: 76, percentage: 76 },
  { label: 'Dra. Helena Vasconcelos (Neuro)', value: 84, percentage: 84 },
];

export const mockTimeSlotsHeatmap: ChartDataPoint[] = [
  { label: '08:00 - 10:00 (Manhã Cedo)', value: 95 },
  { label: '10:00 - 12:00 (Fim da Manhã)', value: 88 },
  { label: '14:00 - 16:00 (Início da Tarde)', value: 82 },
  { label: '16:00 - 18:00 (Pico Tarde)', value: 98 },
  { label: '18:00 - 20:00 (Noite)', value: 74 },
];

export const mockWaitingRoom: WaitingPatient[] = [
  {
    id: 'wp-1',
    patientName: 'Carlos Eduardo Santos',
    checkInTime: '08:52',
    waitingMinutes: 8,
    physiotherapistName: 'Dr. Lucas Silveira',
    service: 'Cinesioterapia Lombar',
    assignedRoom: 'Box 01',
    status: 'in_attendance',
  },
  {
    id: 'wp-2',
    patientName: 'Juliana Mendes Ribeiro',
    checkInTime: '09:48',
    waitingMinutes: 12,
    physiotherapistName: 'Dra. Camila Ramos',
    service: 'RPG Postural Global',
    assignedRoom: 'Sala 03',
    status: 'waiting',
  },
  {
    id: 'wp-3',
    patientName: 'Roberto Fagundes',
    checkInTime: '11:05',
    waitingMinutes: 2,
    physiotherapistName: 'Dr. Lucas Silveira',
    service: 'Reabilitação Ombro',
    assignedRoom: 'Box 02',
    status: 'waiting',
  },
];

export const mockClinicalTasks: ClinicalTask[] = [
  {
    id: 'tsk-1',
    patientId: 'pat-2',
    patientName: 'Carlos Eduardo Santos',
    type: 'reevaluation',
    dueDate: 'Hoje',
    priority: 'high',
    description: 'Completou 6ª sessão. Realizar reavaliação de flexão de tronco e escala EVA.',
  },
  {
    id: 'tsk-2',
    patientId: 'pat-1',
    patientName: 'Beatriz Almeida',
    type: 'report',
    dueDate: 'Amanhã',
    priority: 'medium',
    description: 'Emitir relatório de evolução para o cirurgião ortopédico (Pós-op LCA 8 semanas).',
  },
  {
    id: 'tsk-3',
    patientId: 'pat-7',
    patientName: 'Mariana Couto',
    type: 'evaluation',
    dueDate: '02/10',
    priority: 'low',
    description: 'Revisar exercícios domiciliares de propriocepção para tornozelo.',
  },
];

export const mockPatientPrescriptions: PatientPrescribedExercise[] = [
  {
    id: 'ex-1',
    name: 'Ponte de Glúteos com Isometria',
    group: 'Estabilidade Lombopélvica / Core',
    sets: 3,
    repetitions: '12 repetições com pausa de 3s no topo',
    frequency: 'Diariamente (Manhã e Noite)',
    notes: 'Manter abdome contraído sem arquear excessivamente a lombar.',
  },
  {
    id: 'ex-2',
    name: 'Alongamento de Isquiotibiais com Faixa',
    group: 'Cadeia Posterior',
    sets: 3,
    repetitions: 'Sustentar 30 segundos cada perna',
    frequency: 'Todos os dias pós-caminhada',
    notes: 'Respirar profundamente, nunca forçar até sentir dor aguda.',
  },
  {
    id: 'ex-3',
    name: 'Ativação do Músculo Transverso do Abdome',
    group: 'Estabilização Estática',
    sets: 2,
    repetitions: '10 respirações mantendo o umbigo sugado',
    frequency: '2 vezes ao dia',
    notes: 'Pode ser executado deitado ou sentado no trabalho.',
  },
];
