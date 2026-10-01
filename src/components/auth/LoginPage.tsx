import React, { useState, useEffect } from 'react';
import {
  Activity,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  UserCheck,
  Users,
  Calendar,
  KeyRound,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { AuthService, REGISTERED_ACCOUNTS } from '../../services/authService';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { loginWithSession, addToast } = useApp();

  const [email, setEmail] = useState('admin@physioclinic.com.br');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  // Rate limit countdown timer
  useEffect(() => {
    const rateCheck = AuthService.checkRateLimit();
    if (rateCheck.isBlocked) {
      setSecondsRemaining(rateCheck.secondsRemaining);
      setErrorMessage(
        `Acesso bloqueado temporariamente por excesso de tentativas. Aguarde ${rateCheck.secondsRemaining} segundos.`
      );
    }
  }, []);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setErrorMessage(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const session = await AuthService.login({
        email,
        password,
        rememberMe,
      });
      loginWithSession(session);
      addToast(`Bem-vindo(a) de volta, ${session.user.name}!`, 'success');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
        // check if rate limited
        const rateCheck = AuthService.checkRateLimit();
        if (rateCheck.isBlocked) {
          setSecondsRemaining(rateCheck.secondsRemaining);
        }
      } else {
        setErrorMessage('Falha ao autenticar. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    const target = REGISTERED_ACCOUNTS.find((a) => a.role === role);
    if (!target) return;

    setEmail(target.email);
    setPassword(target.passwordHash);
    setLoading(true);
    setErrorMessage(null);

    try {
      const session = await AuthService.login({
        email: target.email,
        password: target.passwordHash,
        rememberMe: true,
      });
      loginWithSession(session);
      addToast(`Acesso concedido como ${target.role.toUpperCase()}: ${session.user.name}`, 'info');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Side: Brand & Feature Presentation */}
        <div className="lg:col-span-5 bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-400/20 backdrop-blur-md border border-teal-300/30 flex items-center justify-center text-teal-300 shadow-md">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Physio<span className="text-teal-300">Clinic</span>
                </span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-200 border border-teal-300/30">
                  SaaS Clínico
                </span>
              </div>
            </div>

            <div className="mt-8">
              <span className="text-[10px] font-bold tracking-widest uppercase text-teal-300/90 bg-teal-900/60 px-2.5 py-1 rounded-md border border-teal-700/50 inline-block mb-3">
                Ecossistema Especializado de Saúde
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Excelência no cuidado, precisão clínica e gestão de alta performance.
              </h2>
              <p className="text-teal-100/85 text-xs mt-3 leading-relaxed">
                A plataforma definitiva para clínicas de fisioterapia que priorizam prontuários estruturados, agendamento anti-conflito e desfechos terapêuticos mensuráveis.
              </p>
            </div>

            {/* Value bullets */}
            <div className="mt-7 space-y-3.5">
              <div className="flex items-start gap-3 text-xs text-teal-50">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-teal-300" />
                </div>
                <div>
                  <strong className="block text-white font-semibold">Motor Anti-Conflito de Recursos</strong>
                  <span className="text-teal-100/70 text-[11px] leading-tight">
                    Sincronização simultânea de fisioterapeutas, boxes e salas com zero duplicidade.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-teal-50">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-4 h-4 text-teal-300" />
                </div>
                <div>
                  <strong className="block text-white font-semibold">Prontuário & Padrão SOAP Imutável</strong>
                  <span className="text-teal-100/70 text-[11px] leading-tight">
                    Anamnese, avaliação goniométrica, escala EVA e assinatura com hash digital.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-teal-50">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-teal-300" />
                </div>
                <div>
                  <strong className="block text-white font-semibold">Segurança & Conformidade LGPD</strong>
                  <span className="text-teal-100/70 text-[11px] leading-tight">
                    Blindagem de sigilo profissional com controle estrito de perfis (RBAC).
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer certification badge */}
          <div className="relative z-10 pt-5 mt-6 border-t border-teal-700/50 text-[10px] text-teal-200/90 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-teal-300" />
              Diretrizes COFFITO / CREFITO
            </span>
            <span className="font-mono text-teal-300/80 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60">
              LGPD Protegido
            </span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Acesso ao Sistema
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Digite suas credenciais autorizadas para entrar no painel da clínica
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ambiente Seguro
              </span>
            </div>

            {/* Error Notification Alert */}
            {errorMessage && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block">Erro de autenticação</span>
                  <span className="text-[11px] text-rose-700">{errorMessage}</span>
                  {secondsRemaining > 0 && (
                    <div className="mt-1 font-mono text-[11px] text-rose-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-600" />
                      Desbloqueio em {secondsRemaining} segundos
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="E-mail Profissional ou de Paciente"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@physioclinic.com.br"
                icon={<Mail className="w-4 h-4" />}
                disabled={secondsRemaining > 0 || loading}
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Senha de Acesso <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={secondsRemaining > 0 || loading}
                    className="block w-full rounded-lg text-sm border border-slate-300 pl-9 pr-10 py-2 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs text-slate-600 font-medium">
                    Lembrar minha sessão neste dispositivo
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                disabled={secondsRemaining > 0}
                className="w-full mt-2"
                icon={<KeyRound className="w-4 h-4" />}
              >
                Entrar no Sistema
              </Button>
            </form>
          </div>

          {/* Quick Demo Selector for Reviewers / Evaluators */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Acesso Rápido para Avaliação (1 Clique)
              </span>
              <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Homologação
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-teal-50 hover:border-teal-300 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-teal-900 block">
                  Administrador
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                  Dra. Helena
                </span>
                <span className="text-[9px] text-teal-700 block font-mono">
                  Gestão & Ocupação
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('physiotherapist')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-teal-50 hover:border-teal-300 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-teal-900 block">
                  Fisioterapeuta
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                  Dr. Lucas Silveira
                </span>
                <span className="text-[9px] text-teal-700 block font-mono">
                  Prontuários & SOAP
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('receptionist')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-teal-50 hover:border-teal-300 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-teal-900 block">
                  Recepção
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                  Mariana Duarte
                </span>
                <span className="text-[9px] text-teal-700 block font-mono">
                  Check-in & Agenda
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('patient')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-teal-50 hover:border-teal-300 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-teal-900 block">
                  Paciente
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                  Carlos Eduardo
                </span>
                <span className="text-[9px] text-teal-700 block font-mono">
                  Portal & Presença
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onSuccess={(msg) => addToast(msg, 'success')}
      />
    </div>
  );
};
