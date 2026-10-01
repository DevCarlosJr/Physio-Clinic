/**
 * PhysioClinic Clinical Attendance Domain Types
 * Fase 07: Experiência do Atendimento pelo Fisioterapeuta, Cockpit Clínico e Cronômetro
 */

export interface ClinicalSessionRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  clinicalDiagnosis: string;
  roomName: string;
  physiotherapistId: string;
  physiotherapistName: string;
  
  // Timer & Session state
  status: 'waiting' | 'in_progress' | 'completed';
  startedAtTimestamp: number;
  durationMinutesPlanned: number;
  elapsedSeconds: number;

  // Clinical data & EVA scale
  painScaleBefore: number; // 0 to 10
  painScaleAfter?: number; // 0 to 10
  subjectiveReport: string; // Relato do paciente
  objectiveAssessment: string; // Achados palpatórios / ADM / força
  conducts: string[]; // Procedimentos realizados na sessão
  homeCareGuidance: string; // Orientações domiciliares

  // Safety & Contraindications alerts
  clinicalAlerts: string[];

  completedAt?: string;
}

export const COMMON_PHYSIO_CONDUCTS = [
  'Cinesioterapia Ativa e Resistida',
  'Liberação Miofascial Instrumental (IASTM)',
  'Mobilização Articular Passiva (Maitland)',
  'Eletroterapia Analgésica (TENS Convencional)',
  'Treino de Estabilidade e Propriocepção',
  'Alongamento Estático de Cadeia Posterior',
  'Reeducação Postural Global (RPG)',
  'Fortalecimento Isométrico de Core',
  'Crioterapia / Termoterapia',
  'Treino Funcional de Marcha e Pliometria',
];
