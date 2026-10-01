/**
 * PhysioClinic Patient Portal Domain Types
 * Fase 09: Portal do Paciente, Exercícios Domiciliares, Política de Cancelamento e Documentos
 */

export interface HomeExerciseDetail {
  id: string;
  name: string;
  targetRegion: string;
  group: string;
  sets: number;
  repetitions: string;
  holdSeconds?: number;
  frequency: string;
  biomechanicalDescription: string;
  breathingTechnique: string;
  safetyPrecautions: string;
  isCompletedToday: boolean;
  completedAt?: string;
  streakDays: number;
}

export interface PatientDocumentItem {
  id: string;
  title: string;
  category: 'declaration' | 'receipt' | 'report' | 'evolution';
  issuedDate: string;
  issuedByName: string;
  description: string;
  fileSize: string;
}

export interface PastSessionRecord {
  id: string;
  sessionNumber: number;
  date: string;
  time: string;
  physiotherapistName: string;
  procedure: string;
  painLevelBefore: number;
  painLevelAfter: number;
  conductSummary: string;
  physioFeedback: string;
}
