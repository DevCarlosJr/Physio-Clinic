import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Mail, CheckCircle2, ShieldAlert } from 'lucide-react';
import { AuthService } from '../../services/authService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const message = await AuthService.requestPasswordReset(email);
      setIsSent(true);
      setTimeout(() => {
        onSuccess(message);
        handleClose();
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao processar sua solicitação.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError(null);
    setIsSent(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Recuperação de Senha"
      subtitle="Instruções seguras para restaurar seu acesso profissional ou pessoal"
      maxWidth="md"
    >
      {isSent ? (
        <div className="py-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Link de Redefinição Enviado!</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Verifique sua caixa de entrada no e-mail <strong>{email}</strong> com as instruções temporárias.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Informe o e-mail cadastrado na sua conta do PhysioClinic. Você receberá um link protegido por token criptográfico de uso único com validade de 30 minutos.
          </p>

          <Input
            label="E-mail Cadastrado"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex: seu.email@physioclinic.com.br"
            icon={<Mail className="w-4 h-4" />}
            error={error || undefined}
          />

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Por motivos de segurança e LGPD, nunca compartilhe links de acesso ou tokens de verificação com terceiros.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={loading}>
              Enviar Link Seguro
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
