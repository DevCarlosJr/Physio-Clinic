import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ClinicRoomItem } from '../../types/clinicSettings';

interface EditRoomModalProps {
  room: ClinicRoomItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: ClinicRoomItem) => void;
}

export const EditRoomModal: React.FC<EditRoomModalProps> = ({
  room,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'box' | 'individual' | 'studio' | 'pool'>('box');
  const [capacity, setCapacity] = useState(1);
  const [equipmentSummary, setEquipmentSummary] = useState('');
  const [status, setStatus] = useState<'active' | 'maintenance' | 'inactive'>('active');

  useEffect(() => {
    if (room) {
      setName(room.name);
      setType(room.type);
      setCapacity(room.capacity);
      setEquipmentSummary(room.equipmentSummary);
      setStatus(room.status);
    } else {
      setName('');
      setType('box');
      setCapacity(1);
      setEquipmentSummary('');
      setStatus('active');
    }
  }, [room, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: ClinicRoomItem = {
      id: room ? room.id : `room-${Date.now().toString(36)}`,
      name: name.trim(),
      type,
      capacity: Number(capacity),
      equipmentSummary: equipmentSummary.trim(),
      status,
    };

    onSave(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={room ? 'Editar Box / Sala' : 'Cadastrar Novo Box ou Sala'}
      subtitle="Defina o tipo de ambiente, capacidade simultânea e equipamentos disponíveis"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>

          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Salvar Sala / Box
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Input
          label="Identificação da Sala ou Box"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex: Box 05 - Hidroterapia & Reabilitação"
        />

        <div className="grid grid-cols-2 gap-3.5">
          <Select
            label="Tipo de Espaço"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            options={[
              { value: 'box', label: 'Box de Atendimento' },
              { value: 'individual', label: 'Sala Individual Fechada' },
              { value: 'studio', label: 'Estúdio / Salão de Pilates' },
              { value: 'pool', label: 'Piscina / Tanque de Hidro' },
            ]}
          />

          <Select
            label="Status Operacional"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            options={[
              { value: 'active', label: 'Ativo e Liberado' },
              { value: 'maintenance', label: 'Em Manutenção / Higienização' },
              { value: 'inactive', label: 'Bloqueado' },
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Equipamentos e Recursos Instalados
          </label>
          <textarea
            rows={2}
            value={equipmentSummary}
            onChange={(e) => setEquipmentSummary(e.target.value)}
            placeholder="Aparelhos, macas, espaldar, pesos, laser, etc..."
            className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </form>
    </Modal>
  );
};
