/**
 * PhysioClinic Clinic Settings Domain Types
 * Fase 11: Configurações da Clínica, Horários, Serviços e Boxes de Atendimento
 */

export interface ClinicGeneralInfo {
  legalName: string; // Razão Social
  tradeName: string; // Nome Fantasia
  cnpj: string;
  crefitoPJ: string;
  technicalManagerName: string;
  technicalManagerCrefito: string;
  phone: string;
  contactEmail: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  addressZipCode: string;
}

export interface OperatingDaySchedule {
  dayOfWeek: number; // 0=Domingo, 1=Segunda, ..., 6=Sábado
  dayName: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  hasBreak: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
}

export interface ClinicSchedulingRules {
  defaultDurationMinutes: number;
  bufferBetweenSlotsMinutes: number;
  minAdvanceBookingHours: number;
  minAdvanceCancellationHours: number;
  allowPatientOnlineBooking: boolean;
}

export interface ClinicServiceItem {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  referencePrice: number;
  isActive: boolean;
  category: string;
  allowedPhysioNames: string[];
  allowedRoomNames: string[];
}

export interface ClinicRoomItem {
  id: string;
  name: string;
  type: 'box' | 'individual' | 'studio' | 'pool';
  capacity: number;
  equipmentSummary: string;
  status: 'active' | 'maintenance' | 'inactive';
}
