import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { PhysiotherapistProfessional } from '../../types/professional';
import { maskPhone } from '../../utils/validators';
import { parseProfessionalName, formatProfessionalName } from '../../utils/formatters';

interface ProfessionalFormModalProps {
  professional: PhysiotherapistProfessional | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (prof: PhysiotherapistProfessional) => void;
}

const AVAILABLE_SERVICES = [
  'Reabilitação Traumato-Ortopédica',
  'Reeducação Postural Global (RPG)',
  'Cinesioterapia Motora & Core',
  'Fisioterapia Respiratória',
  'Eletroterapia & Liberação Miofascial (IASTM)',
];

export const ProfessionalFormModal: React.FC<ProfessionalFormModalProps> = ({
  professional,
  isOpen,
  onClose,
  onSave,
}) => {
  const [titlePrefix, setTitlePrefix] = useState<'Dr.' | 'Dra.' | ''>('Dr.');
  const [baseName, setBaseName] = useState('');
  const [crefito, setCrefito] = useState('');
  const [primarySpecialty, setPrimarySpecialty] = useState('Traumato-Ortopédica');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'on_leave' | 'inactive'>('active');
  const [defaultRoom, setDefaultRoom] = useState('Box 01 - Cinesioterapia');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Reabilitação Traumato-Ortopédica',
    'Cinesioterapia Motora & Core',
  ]);

  useEffect(() => {
    if (professional) {
      const parsed = parseProfessionalName(professional.name);
      setTitlePrefix(parsed.prefix || 'Dr.');
      setBaseName(parsed.baseName);
      setCrefito(professional.crefito);
      setPrimarySpecialty(professional.primarySpecialty);
      setEmail(professional.email);
      setPhone(maskPhone(professional.phone));
      setStatus(professional.status);
      setDefaultRoom(professional.assignedDefaultRoomName);
      setSelectedServices(professional.allowedServices);
    } else {
      setTitlePrefix('Dr.');
      setBaseName('');
      setCrefito('CREFITO-3 / ');
      setPrimarySpecialty('Traumato-Ortopédica');
      setEmail('');
      setPhone('');
      setStatus('active');
      setDefaultRoom('Box 01 - Cinesioterapia');
      setSelectedServices(['Reabilitação Traumato-Ortopédica', 'Cinesioterapia Motora & Core']);
    }
  }, [professional, isOpen]);

  const handleNameInput = (inputValue: string) => {
    // If user typed or pasted "Dr." or "Dra.", parse it cleanly without duplicating
    const parsed = parseProfessionalName(inputValue);
    if (parsed.prefix) {
      setTitlePrefix(parsed.prefix);
    }
    setBaseName(parsed.baseName);
  };

  const toggleService = (srv: string) => {
    setSelectedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCleanName = formatProfessionalName(titlePrefix, baseName);

    const item: PhysiotherapistProfessional = {
      id: professional ? professional.id : `usr_physio_${Date.now()}`,
      name: finalCleanName,
      crefito: crefito.trim(),
      primarySpecialty,
      specialtiesList: [primarySpecialty],
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      status,
      assignedDefaultRoomId: 'box-01',
      assignedDefaultRoomName: defaultRoom,
      allowedServices: selectedServices,
      weeklySchedule: professional?.weeklySchedule || [],
      totalActivePatients: professional?.totalActivePatients || 0,
      completedAppointmentsCount: professional?.completedAppointmentsCount || 0,
    };

    onSave(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={professional ? 'Editar Fisioterapeuta' : 'Cadastrar Novo Fisioterapeuta'}
      subtitle="Dados de registro no conselho regional (CREFITO) e credenciamento de serviços"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>

          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Salvar Profissional
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
        {/* Name with Treatment Prefix to prevent duplications */}
        <div className="space-y-1">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-3">
              <Select
                label="Tratamento"
                value={titlePrefix}
                onChange={(e) => setTitlePrefix(e.target.value as any)}
                options={[
                  { value: 'Dr.', label: 'Dr.' },
                  { value: 'Dra.', label: 'Dra.' },
                  { value: '', label: 'Nenhum' },
                ]}
              />
            </div>

            <div className="sm:col-span-9">
              <Input
                label="Nome do Fisioterapeuta"
                required
                value={baseName}
                onChange={(e) => handleNameInput(e.target.value)}
                placeholder="ex: Lucas Silveira"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
            <span>
              Nome exibido no prontuário e agenda:{' '}
              <strong className="text-teal-800 font-semibold">
                {formatProfessionalName(titlePrefix, baseName) || 'Não informado'}
              </strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Registro no Conselho (CREFITO)"
            required
            value={crefito}
            onChange={(e) => setCrefito(e.target.value)}
            placeholder="CREFITO-3 / 245910-F"
          />

          <Select
            label="Especialidade Primária"
            value={primarySpecialty}
            onChange={(e) => setPrimarySpecialty(e.target.value)}
            options={[
              { value: 'Traumato-Ortopédica', label: 'Fisioterapia Traumato-Ortopédica' },
              { value: 'Fisioterapia Esportiva', label: 'Fisioterapia Esportiva' },
              { value: 'Reeducação Postural Global (RPG)', label: 'RPG & Coluna Vertebral' },
              { value: 'Fisioterapia Respiratória', label: 'Fisioterapia Cardiorrespiratória' },
              { value: 'Neurofuncional', label: 'Fisioterapia Neurofuncional' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Select
            label="Situação do Profissional"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            options={[
              { value: 'active', label: 'Ativo na Escala' },
              { value: 'on_leave', label: 'Em Férias / Licença' },
              { value: 'inactive', label: 'Inativo' },
            ]}
          />

          <Select
            label="Box / Sala Padrão de Atendimento"
            value={defaultRoom}
            onChange={(e) => setDefaultRoom(e.target.value)}
            options={[
              { value: 'Box 01 - Cinesioterapia', label: 'Box 01 - Cinesioterapia' },
              { value: 'Box 02 - Traumato-Ortopedia', label: 'Box 02 - Traumato-Ortopedia' },
              { value: 'Sala 03 - Postura & Coluna', label: 'Sala 03 - Postura & Coluna' },
              { value: 'Box 04 - Eletrotermofototerapia', label: 'Box 04 - Eletrotermofototerapia' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Telefone / WhatsApp"
            required
            value={phone}
            onChange={(e) => setPhone(maskPhone(e.target.value))}
            placeholder="(11) 98765-4321"
          />

          <Input
            label="E-mail Profissional"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="fisioterapeuta@physioclinic.com.br"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            Procedimentos que este Profissional Atende:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AVAILABLE_SERVICES.map((srv) => (
              <label
                key={srv}
                className={`p-2 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                  selectedServices.includes(srv)
                    ? 'border-teal-500 bg-teal-50/60 font-semibold text-teal-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedServices.includes(srv)}
                  onChange={() => toggleService(srv)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="truncate">{srv}</span>
              </label>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};
