/**
 * PhysioClinic Reception Domain Types
 * Fase 08: Recepção, Check-in, Sala de Espera, Confirmações e Fila de Encaixes
 */

export interface WaitingRoomCheckIn {
  id: string;
  appointmentId: string;
  patientName: string;
  patientPhone: string;
  checkInTime: string; // HH:mm
  arrivalTimestamp: number;
  physiotherapistId: string;
  physiotherapistName: string;
  roomId: string;
  roomName: string;
  serviceName: string;
  status: 'waiting' | 'called' | 'in_attendance';
}

export interface WaitlistEntry {
  id: string;
  patientName: string;
  patientPhone: string;
  preferredPhysioId: string;
  preferredPhysioName: string;
  serviceName: string;
  preferredShift: 'morning' | 'afternoon' | 'any';
  priority: 'urgent' | 'normal';
  dateAdded: string;
  notes?: string;
}

export interface PendingConfirmationItem {
  id: string;
  appointmentId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  physiotherapistName: string;
  serviceName: string;
  status: 'pending' | 'confirmed' | 'unreachable';
}
