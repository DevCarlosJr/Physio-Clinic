import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { PatientRecord, PatientFormData, PatientStatus } from '../../types/patient';
import { isValidCPF, isValidEmail, isValidPhone, maskCPF, maskPhone, maskCEP } from '../../utils/validators';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: PatientRecord) => void;
  editingPatient?: PatientRecord | null;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPatient,
}) => {
  const [formData, setFormData] = useState<PatientFormData>({
    fullName: '',
    socialName: '',
    cpf: '',
    birthDate: '',
    gender: 'Feminino',
    phone: '',
    email: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    insurance: 'Particular',
    assignedPhysioId: 'usr_physio_1',
    administrativeNotes: '',
    status: 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingPatient) {
      setFormData({
        fullName: editingPatient.fullName,
        socialName: editingPatient.socialName || '',
        cpf: maskCPF(editingPatient.cpf),
        birthDate: editingPatient.birthDate,
        gender: editingPatient.gender || 'Feminino',
        phone: maskPhone(editingPatient.phone),
        email: editingPatient.email,
        street: editingPatient.address.street,
        number: editingPatient.address.number,
        complement: editingPatient.address.complement || '',
        neighborhood: editingPatient.address.neighborhood,
        city: editingPatient.address.city,
        state: editingPatient.address.state,
        zipCode: maskCEP(editingPatient.address.zipCode),
        emergencyName: editingPatient.emergencyContact.name,
        emergencyPhone: maskPhone(editingPatient.emergencyContact.phone),
        emergencyRelationship: editingPatient.emergencyContact.relationship,
        insurance: editingPatient.insurance,
        assignedPhysioId: editingPatient.assignedPhysioId,
        administrativeNotes: editingPatient.administrativeNotes || '',
        status: editingPatient.status,
      });
    } else {
      setFormData({
        fullName: '',
        socialName: '',
        cpf: '',
        birthDate: '',
        gender: 'Feminino',
        phone: '',
        email: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '',
        emergencyName: '',
        emergencyPhone: '',
        emergencyRelationship: '',
        insurance: 'Particular',
        assignedPhysioId: 'usr_physio_1',
        administrativeNotes: '',
        status: 'active',
      });
    }
    setErrors({});
  }, [editingPatient, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'O nome completo é obrigatório.';
    }

    const cpfValidation = isValidCPF(formData.cpf);
    if (!cpfValidation.isValid) {
      newErrors.cpf = cpfValidation.message || 'CPF inválido.';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória.';
    }

    if (!formData.phone.trim() || !isValidPhone(formData.phone)) {
      newErrors.phone = 'Informe um telefone/celular válido com DDD.';
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      newErrors.email = 'Informe um endereço de e-mail válido.';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Logradouro é obrigatório.';
    }

    if (!formData.number.trim()) {
      newErrors.number = 'Número é obrigatório.';
    }

    if (!formData.emergencyName.trim() || !formData.emergencyPhone.trim()) {
      newErrors.emergency = 'Contato de emergência (nome e telefone) é obrigatório.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const physioMap: Record<string, string> = {
      usr_physio_1: 'Dr. Lucas Silveira',
      usr_physio_2: 'Dra. Camila Ramos',
      usr_physio_3: 'Dr. Thiago Medeiros',
      usr_admin_1: 'Dra. Helena Vasconcelos',
    };

    setTimeout(() => {
      const patientRecord: PatientRecord = {
        id: editingPatient ? editingPatient.id : `pat_${Date.now()}`,
        fullName: formData.fullName.trim(),
        socialName: formData.socialName.trim() || undefined,
        cpf: formData.cpf.replace(/\D/g, ''),
        birthDate: formData.birthDate,
        gender: formData.gender,
        phone: formData.phone.replace(/\D/g, ''),
        email: formData.email.trim().toLowerCase(),
        address: {
          street: formData.street.trim(),
          number: formData.number.trim(),
          complement: formData.complement.trim() || undefined,
          neighborhood: formData.neighborhood.trim() || 'Centro',
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.replace(/\D/g, ''),
        },
        emergencyContact: {
          name: formData.emergencyName.trim(),
          phone: formData.emergencyPhone.replace(/\D/g, ''),
          relationship: formData.emergencyRelationship.trim() || 'Familiar',
        },
        administrativeNotes: formData.administrativeNotes.trim() || undefined,
        status: formData.status,
        insurance: formData.insurance,
        assignedPhysioId: formData.assignedPhysioId,
        assignedPhysioName: physioMap[formData.assignedPhysioId] || 'Dr. Lucas Silveira',
        // Preserve clinical history if editing
        clinicalDiagnosis: editingPatient?.clinicalDiagnosis || 'Em avaliação funcional inicial',
        functionalGoal: editingPatient?.functionalGoal || 'Definição de condutas fisioterapêuticas',
        initialPainLevel: editingPatient?.initialPainLevel ?? 5,
        currentPainLevel: editingPatient?.currentPainLevel ?? 5,
        totalSessionsPlanned: editingPatient?.totalSessionsPlanned ?? 10,
        completedSessionsCount: editingPatient?.completedSessionsCount ?? 0,
        createdAt: editingPatient?.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      onSave(patientRecord);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPatient ? 'Editar Dados do Paciente' : 'Cadastro de Novo Paciente'}
      subtitle="Dados cadastrais completos em conformidade com as diretrizes de privacidade LGPD"
      maxWidth="2xl"
      footer={
        <>
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" type="button" onClick={handleSubmit} isLoading={isSubmitting}>
            {editingPatient ? 'Salvar Alterações' : 'Cadastrar Paciente'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[68vh] overflow-y-auto pr-1">
        {/* Seção 1: Identificação Básica */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 flex items-center justify-between">
            <span>1. Dados Pessoais & Identificação</span>
            <span className="text-[10px] text-slate-400 font-normal">Campos com * são obrigatórios</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Nome Completo do Paciente"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="ex: Carlos Eduardo Santos"
                error={errors.fullName}
              />
            </div>

            <Input
              label="Nome Social (quando aplicável)"
              value={formData.socialName}
              onChange={(e) => setFormData({ ...formData, socialName: e.target.value })}
              placeholder="Nome de preferência"
            />

            <Input
              label="CPF (apenas números ou formatado)"
              required
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
              placeholder="000.000.000-00"
              error={errors.cpf}
            />

            <Input
              type="date"
              label="Data de Nascimento"
              required
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              error={errors.birthDate}
            />

            <Select
              label="Gênero"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { value: 'Feminino', label: 'Feminino' },
                { value: 'Masculino', label: 'Masculino' },
                { value: 'Outro', label: 'Outro / Não especificado' },
              ]}
            />
          </div>
        </div>

        {/* Seção 2: Contatos */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100">
            2. Canais de Contato & E-mail
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Telefone / Celular (WhatsApp)"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
              placeholder="(11) 99999-9999"
              error={errors.phone}
            />

            <Input
              type="email"
              label="E-mail Principal"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="paciente@exemplo.com"
              error={errors.email}
            />
          </div>
        </div>

        {/* Seção 3: Endereço */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100">
            3. Endereço Residencial
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="CEP"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: maskCEP(e.target.value) })}
              placeholder="00000-000"
            />

            <div className="sm:col-span-2">
              <Input
                label="Logradouro (Rua / Av)"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="Rua Augusta"
                error={errors.street}
              />
            </div>

            <Input
              label="Número"
              required
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              placeholder="123"
              error={errors.number}
            />

            <Input
              label="Complemento"
              value={formData.complement}
              onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
              placeholder="Apto 42, Bloco B"
            />

            <Input
              label="Bairro"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              placeholder="Centro / Consolação"
            />

            <Input
              label="Cidade"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />

            <Input
              label="Estado (UF)"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              maxLength={2}
            />
          </div>
        </div>

        {/* Seção 4: Contato de Emergência */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100">
            4. Contato de Emergência
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Nome do Contato"
              required
              value={formData.emergencyName}
              onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
              placeholder="Nome do parente ou responsável"
            />

            <Input
              label="Telefone de Emergência"
              required
              value={formData.emergencyPhone}
              onChange={(e) => setFormData({ ...formData, emergencyPhone: maskPhone(e.target.value) })}
              placeholder="(11) 98888-8888"
            />

            <Input
              label="Grau de Parentesco"
              value={formData.emergencyRelationship}
              onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
              placeholder="ex: Cônjuge, Mãe, Filho"
            />
          </div>
          {errors.emergency && <p className="text-xs text-rose-600 mt-1">{errors.emergency}</p>}
        </div>

        {/* Seção 5: Informações Administrativas & Convênio */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100">
            5. Convênio & Vínculo Profissional
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Modalidade / Convênio"
              value={formData.insurance}
              onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
              options={[
                { value: 'Particular', label: 'Particular (Recibo / Reembolso)' },
                { value: 'Bradesco Saúde', label: 'Bradesco Saúde' },
                { value: 'SulAmérica', label: 'SulAmérica' },
                { value: 'Amil Saúde', label: 'Amil Saúde' },
                { value: 'Unimed Seguros', label: 'Unimed Seguros' },
                { value: 'Porto Seguro', label: 'Porto Seguro Saúde' },
              ]}
            />

            <Select
              label="Fisioterapeuta Responsável"
              value={formData.assignedPhysioId}
              onChange={(e) => setFormData({ ...formData, assignedPhysioId: e.target.value })}
              options={[
                { value: 'usr_physio_1', label: 'Dr. Lucas Silveira (Ortopedia/Esporte)' },
                { value: 'usr_physio_2', label: 'Dra. Camila Ramos (RPG/Coluna)' },
                { value: 'usr_physio_3', label: 'Dr. Thiago Medeiros (Respiratória/Eletro)' },
                { value: 'usr_admin_1', label: 'Dra. Helena Vasconcelos (Neurofuncional)' },
              ]}
            />

            <Select
              label="Situação Cadastral"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PatientStatus })}
              options={[
                { value: 'active', label: 'Em Tratamento Ativo' },
                { value: 'paused', label: 'Tratamento Pausado' },
                { value: 'discharged', label: 'Alta Concedida' },
              ]}
            />

            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Observações Administrativas (Acesso Geral da Recepção)
              </label>
              <textarea
                rows={2}
                value={formData.administrativeNotes}
                onChange={(e) => setFormData({ ...formData, administrativeNotes: e.target.value })}
                placeholder="Horários preferenciais, restrições de mobilidade na recepção, autorização de convênio..."
                className="block w-full rounded-lg text-xs border border-slate-300 p-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 bg-white"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
