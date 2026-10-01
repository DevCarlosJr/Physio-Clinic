/**
 * PhysioClinic Medical Record Domain Types
 * Fase 10: Prontuário Eletrônico, Avaliação Fisioterapêutica, Evolução SOAP e Relatório Clínico
 */

export interface FunctionalAssessment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  evaluatedAt: string;
  evaluatorPhysioName: string;
  evaluatorCrefito: string;

  // Anamnese & Queixa
  chiefComplaint: string;
  historyCurrentIllness: string; // HMA
  pastMedicalHistory: string; // Cirurgias, traumas, patologias prévias
  lifestyleHabits: string; // Ergonomia, atividade física, sono

  // Dor
  painLocation: string;
  painType: string; // Queimação, pontada, peso, latejante
  initialPainScaleEVA: number; // 0 a 10
  aggravatingFactors: string;
  relievingFactors: string;

  // Exame Físico Fisioterapêutico
  posturalInspection: string;
  palpationFindings: string;
  rangeOfMotionADM: string;
  muscleStrengthMRC: string; // Escala 0 a 5
  specialOrthopedicTests: string; // Testes clínicos ortopédicos

  // Diagnóstico & Metas
  functionalPhysioDiagnosis: string;
  shortTermGoals: string;
  longTermGoals: string;
  therapeuticPlan: string;
  plannedSessionsCount: number;
}

export interface SoapEvolutionRecord {
  id: string;
  sessionNumber: number;
  date: string;
  time: string;
  physiotherapistName: string;
  crefito: string;

  // SOAP
  subjective: string; // S: Relato do paciente
  objective: string; // O: Achados no exame físico do dia
  assessment: string; // A: Avaliação da evolução e resposta clínica
  plan: string; // P: Condutas e plano para a próxima sessão

  // Metrics & Conducts
  painBeforeEVA: number; // 0-10
  painAfterEVA: number; // 0-10
  conductsApplied: string[];
  homeCarePrescription: string;

  lockedTimestamp: number; // Imutabilidade COFFITO
  signatureHash: string;
}

export interface MedicalTimelineItem {
  id: string;
  type: 'assessment' | 'session' | 'reassessment' | 'exam' | 'discharge';
  date: string;
  title: string;
  author: string;
  crefito: string;
  summary: string;
  painEVA?: number;
}
