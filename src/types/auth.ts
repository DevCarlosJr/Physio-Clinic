/**
 * PhysioClinic Auth & Security Types
 * Fase 02: Autenticação, RBAC, Sessão e Auditoria
 */

import { UserProfile, UserRole } from './index';

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
  expiresAt: number; // timestamp
}

export type AuditAction = 
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGIN_BLOCKED'
  | 'LOGOUT'
  | 'PASSWORD_RESET_REQUEST';

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userName?: string;
  role?: UserRole;
  action: AuditAction;
  details: string;
  ipAddress: string;
}

export interface LoginAttemptState {
  attempts: number;
  blockedUntil: number | null;
}
