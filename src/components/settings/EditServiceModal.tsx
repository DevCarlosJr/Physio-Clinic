import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ClinicServiceItem } from '../../types/clinicSettings';
import { CheckCircle2, DollarSign, Clock, Users, Building2 } from 'lucide-react';

interface EditServiceModalProps {
  service: ClinicServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: ClinicServiceItem) => void;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  service,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(50);
  const [referencePrice, setReferencePrice] = useState(180);
  const [category, setCategory] = useState('Ortopedia & Esporte');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setDurationMinutes(service.durationMinutes);
      setReferencePrice(service.referencePrice);
      setCategory(service.category);
      setIsActive(service.isActive);
    } else {
      setName('');
      setDescription('');
      setDurationMinutes(50);
      setReferencePrice(180);
      setCategory('Ortopedia & Esporte');
      setIsActive(true);
    }
  }, [service, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ClinicServiceItem = {
      id: service ? service.id : `srv-${Date.now().toString(36)}`,
      name: name.trim(),
      description: description.trim(),
      durationMinutes: Number(durationMinutes),
      referencePrice: Number(referencePrice),
      category,
      isActive,
      allowedPhysioNames: service?.allowedPhysioNames || ['Dr. Lucas Silveira'],
      allowedRoomNames: service?.allowedRoomNames || ['Box 01 - Cinesioterapia'],
    };

    onSave(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? 'Editar Serviço Clínico' : 'Novo Serviço / Procedimento'}
      subtitle="Defina os parâmetros operacionais, duração padrão e preço de referência"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>

          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Salvar Procedimento
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Nome do Serviço"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Reabilitação Traumato-Ortopédica"
          />

          <Select
            label="Categoria Clínica"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'Ortopedia & Esporte', label: 'Ortopedia & Esporte' },
              { value: 'Postura & Coluna', label: 'Postura & Coluna' },
              { value: 'Cinesioterapia', label: 'Cinesioterapia' },
              { value: 'Cardiorrespiratória', label: 'Cardiorrespiratória' },
              { value: 'Terapia Manual & Eletro', label: 'Terapia Manual & Eletro' },
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Descrição do Procedimento
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Indicações, objetivos terapêuticos e metodologia aplicada..."
            className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Duração Padrão (Minutos)
            </label>
            <input
              type="number"
              min={15}
              max={120}
              step={5}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Preço de Referência (R$)
            </label>
            <input
              type="number"
              min={0}
              step={10}
              value={referencePrice}
              onChange={(e) => setReferencePrice(Number(e.target.value))}
              className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>

          <Select
            label="Status do Serviço"
            value={isActive ? 'true' : 'false'}
            onChange={(e) => setIsActive(e.target.value === 'true')}
            options={[
              { value: 'true', label: 'Ativo na Agenda' },
              { value: 'false', label: 'Inativo / Pausado' },
            ]}
          />
        </div>
      </form>
    </Modal>
  );
};
