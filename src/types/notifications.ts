/**
 * PhysioClinic Notifications & Messaging Domain Types
 * Fase 15: Notificações, Lembretes, Confirmações e Mensagens Padrão
 */

export type NotificationChannel = 'push' | 'sms' | 'email' | 'system';

export type TemplateTriggerType =
  | 'reminder_24h'
  | 'reminder_2h'
  | 'booking_confirmation'
  | 'pre_assessment_prep'
  | 'cancellation_notice'
  | 'home_exercises_update';

export interface MessageTemplate {
  id: string;
  name: string;
  triggerType: TemplateTriggerType;
  title: string;
  content: string;
  availableVariables: string[];
  channel: NotificationChannel;
  isActive: boolean;
  timingDescription: string;
}

export type DeliveryStatus = 'sent' | 'delivered' | 'confirmed' | 'failed';

export interface DispatchedMessageLog {
  id: string;
  recipientName: string;
  recipientContact: string;
  templateName: string;
  sentAt: string;
  channel: NotificationChannel;
  status: DeliveryStatus;
  patientConfirmationResponse?: 'confirmed' | 'reschedule_requested';
  previewText: string;
}
