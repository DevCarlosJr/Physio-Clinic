import { UserProfile, UserRole } from '../types';
import { AuthCredentials, AuthSession, AuditLog, LoginAttemptState } from '../types/auth';
import { mockUsers } from '../data/mockInitialData';

const STORAGE_SESSION_KEY = 'physioclinic_session_v1';
const STORAGE_ATTEMPTS_KEY = 'physioclinic_login_attempts_v1';
const STORAGE_AUDIT_KEY = 'physioclinic_audit_logs_v1';

// Preset credentials for testing & production demonstration
export const REGISTERED_ACCOUNTS: {
  email: string;
  passwordHash: string; // simulated secure bcrypt hash
  plainHint: string;
  role: UserRole;
  profile: UserProfile;
}[] = [
  {
    email: 'admin@physioclinic.com.br',
    passwordHash: 'Admin@123',
    plainHint: 'Admin@123',
    role: 'admin',
    profile: mockUsers.admin,
  },
  {
    email: 'fisioterapeuta@physioclinic.com.br',
    passwordHash: 'Fisio@123',
    plainHint: 'Fisio@123',
    role: 'physiotherapist',
    profile: mockUsers.physiotherapist,
  },
  {
    email: 'recepcao@physioclinic.com.br',
    passwordHash: 'Recep@123',
    plainHint: 'Recep@123',
    role: 'receptionist',
    profile: mockUsers.receptionist,
  },
  {
    email: 'paciente@gmail.com',
    passwordHash: 'Paciente@123',
    plainHint: 'Paciente@123',
    role: 'patient',
    profile: mockUsers.patient,
  },
];

export class AuthService {
  private static getStoredAttempts(): LoginAttemptState {
    try {
      const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return { attempts: 0, blockedUntil: null };
  }

  private static setStoredAttempts(state: LoginAttemptState) {
    try {
      localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }

  public static getAuditLogs(): AuditLog[] {
    try {
      const raw = localStorage.getItem(STORAGE_AUDIT_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return [];
  }

  public static recordAuditLog(
    action: AuditLog['action'],
    userEmail: string,
    details: string,
    role?: UserRole,
    userName?: string
  ) {
    try {
      const current = this.getAuditLogs();
      const newEntry: AuditLog = {
        id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        timestamp: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        userEmail,
        userName,
        role,
        action,
        details,
        ipAddress: '192.168.1.42 (Sessão Segura TLS 1.3)',
      };
      const updated = [newEntry, ...current].slice(0, 50); // keep last 50
      localStorage.setItem(STORAGE_AUDIT_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  public static checkRateLimit(): { isBlocked: boolean; secondsRemaining: number } {
    const state = this.getStoredAttempts();
    if (!state.blockedUntil) return { isBlocked: false, secondsRemaining: 0 };

    const now = Date.now();
    if (now < state.blockedUntil) {
      const secondsRemaining = Math.ceil((state.blockedUntil - now) / 1000);
      return { isBlocked: true, secondsRemaining };
    }

    // Block expired, reset state
    this.setStoredAttempts({ attempts: 0, blockedUntil: null });
    return { isBlocked: false, secondsRemaining: 0 };
  }

  public static async login(credentials: AuthCredentials): Promise<AuthSession> {
    // 1. Check rate limit
    const rateCheck = this.checkRateLimit();
    if (rateCheck.isBlocked) {
      this.recordAuditLog(
        'LOGIN_BLOCKED',
        credentials.email,
        `Tentativa bloqueada por excesso de falhas. Restam ${rateCheck.secondsRemaining}s.`
      );
      throw new Error(
        `Acesso bloqueado temporariamente por excesso de tentativas. Aguarde ${rateCheck.secondsRemaining} segundos.`
      );
    }

    // 2. Validate input fields
    const emailNormalized = credentials.email.trim().toLowerCase();
    if (!emailNormalized || !credentials.password) {
      throw new Error('Informe o e-mail e a senha de acesso.');
    }

    // 3. Find matching account
    const matchedAccount = REGISTERED_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === emailNormalized
    );

    // 4. Verify password
    if (!matchedAccount || matchedAccount.passwordHash !== credentials.password) {
      const state = this.getStoredAttempts();
      const newAttempts = state.attempts + 1;

      if (newAttempts >= 5) {
        const blockedUntil = Date.now() + 60 * 1000; // 60s lock
        this.setStoredAttempts({ attempts: newAttempts, blockedUntil });
        this.recordAuditLog(
          'LOGIN_BLOCKED',
          credentials.email,
          'Conta temporariamente bloqueada por 60s após 5 falhas consecutivas.'
        );
        throw new Error(
          'Limite de 5 tentativas consecutivas excedido. Por segurança, aguarde 60 segundos antes de tentar novamente.'
        );
      } else {
        this.setStoredAttempts({ attempts: newAttempts, blockedUntil: null });
        this.recordAuditLog(
          'LOGIN_FAILURE',
          credentials.email,
          `Credenciais inválidas. Tentativa ${newAttempts} de 5.`
        );
        const remaining = 5 - newAttempts;
        throw new Error(
          `E-mail ou senha incorretos. Você tem mais ${remaining} tentativa(s) antes do bloqueio temporário.`
        );
      }
    }

    // 5. Successful login: reset failed attempts
    this.setStoredAttempts({ attempts: 0, blockedUntil: null });

    const session: AuthSession = {
      token: `jwt_sec_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      user: matchedAccount.profile,
      expiresAt: credentials.rememberMe
        ? Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
        : Date.now() + 8 * 60 * 60 * 1000, // 8 hours
    };

    // Store in storage
    const storage = credentials.rememberMe ? localStorage : sessionStorage;
    storage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));

    this.recordAuditLog(
      'LOGIN_SUCCESS',
      matchedAccount.email,
      `Autenticação autorizada com sucesso. Perfil: ${matchedAccount.role.toUpperCase()}`,
      matchedAccount.role,
      matchedAccount.profile.name
    );

    return session;
  }

  public static restoreSession(): AuthSession | null {
    try {
      const raw =
        localStorage.getItem(STORAGE_SESSION_KEY) ||
        sessionStorage.getItem(STORAGE_SESSION_KEY);
      if (!raw) return null;

      const session: AuthSession = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  public static logout(): void {
    const session = this.restoreSession();
    if (session) {
      this.recordAuditLog(
        'LOGOUT',
        session.user.email,
        'Encerramento voluntário de sessão.',
        session.user.role,
        session.user.name
      );
    }
    localStorage.removeItem(STORAGE_SESSION_KEY);
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
  }

  public static async requestPasswordReset(email: string): Promise<string> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Por favor, digite um e-mail válido.');
    }

    this.recordAuditLog(
      'PASSWORD_RESET_REQUEST',
      cleanEmail,
      'Solicitação de token seguro para recuperação de senha enviada.'
    );

    return `As instruções para redefinição segura de senha foram enviadas para ${cleanEmail}.`;
  }
}
