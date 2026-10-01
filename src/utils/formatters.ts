/**
 * Utility functions and formatters for PhysioClinic
 */

import { AppointmentStatus, UserRole } from '../types';

export function formatCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return cpf;
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

export function getStatusDetails(status: AppointmentStatus): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  switch (status) {
    case 'scheduled':
      return {
        label: 'Agendado',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
        dotClass: 'bg-sky-500',
      };
    case 'confirmed':
      return {
        label: 'Confirmado',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotClass: 'bg-emerald-500',
      };
    case 'in_progress':
      return {
        label: 'Em Atendimento',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse',
        dotClass: 'bg-amber-500',
      };
    case 'completed':
      return {
        label: 'Concluído',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        dotClass: 'bg-slate-400',
      };
    case 'cancelled':
      return {
        label: 'Cancelado',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        dotClass: 'bg-rose-500',
      };
    case 'no_show':
      return {
        label: 'Não Compareceu',
        badgeClass: 'bg-red-50 text-red-800 border-red-200',
        dotClass: 'bg-red-600',
      };
    default:
      return {
        label: 'Indefinido',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        dotClass: 'bg-slate-400',
      };
  }
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'receptionist':
      return 'Recepção';
    case 'physiotherapist':
      return 'Fisioterapeuta';
    case 'patient':
      return 'Paciente';
  }
}

/**
 * Normaliza e previne duplicidade de prefixos honoríficos (Dr. / Dra.)
 */
export function parseProfessionalName(fullName: string): { prefix: 'Dr.' | 'Dra.' | ''; baseName: string } {
  let clean = fullName.trim();
  let detectedPrefix: 'Dr.' | 'Dra.' | '' = '';

  while (/^(Dr\.|Dra\.|Dr|Dra)\s+/i.test(clean)) {
    if (/^Dra\.?\s+/i.test(clean)) {
      if (!detectedPrefix) detectedPrefix = 'Dra.';
      clean = clean.replace(/^Dra\.?\s+/i, '').trim();
    } else if (/^Dr\.?\s+/i.test(clean)) {
      if (!detectedPrefix) detectedPrefix = 'Dr.';
      clean = clean.replace(/^Dr\.?\s+/i, '').trim();
    }
  }

  return {
    prefix: detectedPrefix,
    baseName: clean,
  };
}

export function formatProfessionalName(prefix: string, baseName: string): string {
  let cleanBase = baseName.trim();
  while (/^(Dr\.|Dra\.|Dr|Dra)\s+/i.test(cleanBase)) {
    cleanBase = cleanBase.replace(/^(Dr\.|Dra\.|Dr|Dra)\s+/i, '').trim();
  }

  if (prefix) {
    return `${prefix} ${cleanBase}`.trim();
  }
  return cleanBase;
}

