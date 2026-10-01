import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { MessageTemplate, NotificationChannel } from '../../types/notifications';
import { Sparkles, Check, CheckCircle2 } from 'lucide-react';

interface EditTemplateModalProps {
  template: MessageTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: MessageTemplate) => void;
}

export const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  template,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState<NotificationChannel>('push');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (template) {
      setTitle(template.title);
      setContent(template.content);
      setChannel(template.channel);
      setIsActive(template.isActive);
    }
  }, [template, isOpen]);

  const insertVariable = (variable: string) => {
    setContent((prev) => `${prev} ${variable}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;

    const updated: MessageTemplate = {
      ...template,
      title: title.trim(),
      content: content.trim(),
      channel,
      isActive,
    };

    onSave(updated);
    onClose();
  };

  if (!isOpen || !template) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar Modelo: ${template.name}`}
      subtitle={template.timingDescription}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            onClick={handleSubmit}
          >
            Salvar Alterações no Modelo
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Assunto / Título da Notificação"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Select
            label="Canal Padrão de Envio"
            value={channel}
            onChange={(e) => setChannel(e.target.value as NotificationChannel)}
            options={[
              { value: 'push', label: 'Notificação Push (Aplicativo do Paciente)' },
              { value: 'sms', label: 'SMS Notificação' },
              { value: 'email', label: 'E-mail Transacional' },
            ]}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Texto da Mensagem:
            </label>
            <span className="text-[10px] text-slate-400">
              Clique nas tags abaixo para inserir no texto:
            </span>
          </div>

          <textarea
            rows={4}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed font-sans"
          />

          {/* Dynamic Variables helper badges */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {template.availableVariables.map((v) => (
              <button
                type="button"
                key={v}
                onClick={() => insertVariable(v)}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
              >
                + {v}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-slate-700 font-medium">Disparo Automático Ativo:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600" />
          </label>
        </div>
      </form>
    </Modal>
  );
};
