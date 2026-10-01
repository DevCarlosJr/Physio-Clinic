/**
 * PhysioClinic Schedule Conflict Validation Service
 * Fase 06: Validação de Conflito de Horário, Sala, Profissional e Horário de Funcionamento
 */

import { AppointmentRecord } from '../types/appointment';

export interface ConflictCheckParams {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  physiotherapistId: string;
  roomId: string;
  excludeAppointmentId?: string;
  existingAppointments: AppointmentRecord[];
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictType?: 'professional' | 'room' | 'operating_hours' | 'blocked_day';
  message?: string;
  conflictingAppointment?: AppointmentRecord;
}

export class ScheduleConflictService {
  /**
   * Converts HH:mm to minutes from midnight
   */
  public static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Converts minutes from midnight to HH:mm
   */
  public static minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  /**
   * Checks if two time intervals overlap: [startA, endA) and [startB, endB)
   */
  public static isOverlapping(
    startA: number,
    endA: number,
    startB: number,
    endB: number
  ): boolean {
    return Math.max(startA, startB) < Math.min(endA, endB);
  }

  /**
   * Verifies clinic working hours
   * Seg a Sex: 07:00 às 20:00 (420 to 1200)
   * Sábado: 08:00 às 13:00 (480 to 780)
   * Domingo: Fechado
   */
  public static checkClinicHours(
    dateStr: string,
    startTime: string,
    durationMinutes: number
  ): { isValid: boolean; message?: string } {
    // Parse date safely
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday

    if (dayOfWeek === 0) {
      return {
        isValid: false,
        message: 'A clínica não realiza atendimentos aos domingos.',
      };
    }

    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = startMinutes + durationMinutes;

    if (dayOfWeek === 6) {
      // Sábado
      const openMinutes = 8 * 60; // 08:00
      const closeMinutes = 13 * 60; // 13:00
      if (startMinutes < openMinutes || endMinutes > closeMinutes) {
        return {
          isValid: false,
          message:
            'Aos sábados, o horário de atendimento da clínica é das 08:00 às 13:00.',
        };
      }
    } else {
      // Segunda a Sexta
      const openMinutes = 7 * 60; // 07:00
      const closeMinutes = 20 * 60; // 20:00
      if (startMinutes < openMinutes || endMinutes > closeMinutes) {
        return {
          isValid: false,
          message:
            'De segunda a sexta-feira, o horário de atendimento da clínica é das 07:00 às 20:00.',
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Main conflict validator: checks operating hours, professional overlap, and room overlap
   */
  public static validateAppointment(
    params: ConflictCheckParams
  ): ConflictCheckResult {
    const {
      date,
      startTime,
      durationMinutes,
      physiotherapistId,
      roomId,
      excludeAppointmentId,
      existingAppointments,
    } = params;

    // 1. Check clinic operating hours
    const hoursCheck = this.checkClinicHours(date, startTime, durationMinutes);
    if (!hoursCheck.isValid) {
      return {
        hasConflict: true,
        conflictType: 'operating_hours',
        message: hoursCheck.message,
      };
    }

    const newStart = this.timeToMinutes(startTime);
    const newEnd = newStart + durationMinutes;

    // Filter relevant appointments on same date that are not cancelled
    const sameDayAppointments = existingAppointments.filter(
      (a) =>
        a.date === date &&
        a.status !== 'cancelled' &&
        a.id !== excludeAppointmentId
    );

    for (const apt of sameDayAppointments) {
      const existingStart = this.timeToMinutes(apt.startTime);
      const existingEnd = this.timeToMinutes(apt.endTime);

      if (this.isOverlapping(newStart, newEnd, existingStart, existingEnd)) {
        // Conflito de profissional
        if (apt.physiotherapistId === physiotherapistId) {
          return {
            hasConflict: true,
            conflictType: 'professional',
            message: `Não foi possível agendar: ${apt.physiotherapistName} já possui a consulta de "${apt.patientName}" (${apt.startTime} às ${apt.endTime}) neste mesmo horário.`,
            conflictingAppointment: apt,
          };
        }

        // Conflito de sala
        if (apt.roomId === roomId) {
          return {
            hasConflict: true,
            conflictType: 'room',
            message: `Não foi possível agendar: A sala/box "${apt.roomName}" já está ocupada pela consulta de "${apt.patientName}" (${apt.startTime} às ${apt.endTime}) neste mesmo horário.`,
            conflictingAppointment: apt,
          };
        }
      }
    }

    return { hasConflict: false };
  }

  /**
   * Returns list of available time slots for a given date, physio, room and duration
   */
  public static getAvailableSlots(
    date: string,
    physiotherapistId: string,
    roomId: string,
    durationMinutes: number,
    existingAppointments: AppointmentRecord[]
  ): string[] {
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    if (dayOfWeek === 0) return []; // Sunday closed

    const candidateSlots =
      dayOfWeek === 6
        ? ['08:00', '09:00', '10:00', '11:00', '12:00']
        : [
            '07:30',
            '08:00',
            '09:00',
            '10:00',
            '11:15',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
          ];

    return candidateSlots.filter((slot) => {
      const validation = this.validateAppointment({
        date,
        startTime: slot,
        durationMinutes,
        physiotherapistId,
        roomId,
        existingAppointments,
      });
      return !validation.hasConflict;
    });
  }
}
