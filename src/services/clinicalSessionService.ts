import { ClinicalSessionRecord } from '../types/clinicalSession';
import { AppointmentRecord } from '../types/appointment';

const ACTIVE_SESSION_STORAGE_KEY = 'physioclinic_active_clinical_session_v1';

export class ClinicalSessionService {
  public static getActiveSession(): ClinicalSessionRecord | null {
    try {
      const raw = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return null;
  }

  public static startSessionFromAppointment(
    appointment: AppointmentRecord,
    patientAge = 39,
    clinicalAlerts = ['Lombalgia crônica', 'Sem cirurgias prévias', 'Pressão arterial estável']
  ): ClinicalSessionRecord {
    const existing = this.getActiveSession();
    if (existing && existing.appointmentId === appointment.id) {
      return existing;
    }

    const newSession: ClinicalSessionRecord = {
      id: `ses-${Date.now().toString(36)}`,
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      patientAge,
      clinicalDiagnosis: appointment.serviceName,
      roomName: appointment.roomName,
      physiotherapistId: appointment.physiotherapistId,
      physiotherapistName: appointment.physiotherapistName,
      status: 'in_progress',
      startedAtTimestamp: Date.now() - 18 * 60 * 1000, // 18 minutes ago for active session demo
      durationMinutesPlanned: appointment.durationMinutes,
      elapsedSeconds: 18 * 60,
      painScaleBefore: 7,
      painScaleAfter: 4,
      subjectiveReport: 'Paciente refere dor lombar moderada ao ficar em pé por períodos prolongados (> 30 min). Sem irradiação para membros inferiores.',
      objectiveAssessment: 'Contratura muscular paravertebral lombar bilateral. Amplitude de flexão de tronco reduzida em 30%. Teste de Lasègue negativo bilateralmente.',
      conducts: [
        'Cinesioterapia Ativa e Resistida',
        'Liberação Miofascial Instrumental (IASTM)',
        'Fortalecimento Isométrico de Core',
      ],
      homeCareGuidance: 'Aplicar compressa morna por 20 minutos à noite. Realizar os 3 exercícios domiciliares de ponte e transverso prescritos.',
      clinicalAlerts,
    };

    this.saveSession(newSession);
    return newSession;
  }

  public static saveSession(session: ClinicalSessionRecord): void {
    try {
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }
  }

  public static finishSession(session: ClinicalSessionRecord): void {
    try {
      const finished: ClinicalSessionRecord = {
        ...session,
        status: 'completed',
        completedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
      // Can store in history
    } catch {
      // ignore
    }
  }
}
