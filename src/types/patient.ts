/**
 * PhysioClinic Patient Domain Types
 * Fase 04: Cadastro de Pacientes, RBAC, Validação e Detalhamento
 */

export interface PatientAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export type PatientStatus = 'active' | 'discharged' | 'paused';

export interface PatientRecord {
  id: string;
  fullName: string;
  socialName?: string;
  cpf: string;
  birthDate: string; // YYYY-MM-DD
  gender?: string;
  phone: string;
  email: string;
  address: PatientAddress;
  emergencyContact: EmergencyContact;
  administrativeNotes?: string;
  status: PatientStatus;
  insurance: string;
  assignedPhysioId: string;
  assignedPhysioName: string;

  // Informações Clínicas (Somente para Fisioterapeuta e Administrador)
  clinicalDiagnosis?: string;
  functionalGoal?: string;
  initialPainLevel?: number;
  currentPainLevel?: number;
  totalSessionsPlanned?: number;
  completedSessionsCount?: number;
  lastSessionDate?: string;
  nextSessionDate?: string;

  createdAt: string;
  updatedAt: string;
}

export interface PatientFormData {
  fullName: string;
  socialName: string;
  cpf: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  insurance: string;
  assignedPhysioId: string;
  administrativeNotes: string;
  status: PatientStatus;
}
