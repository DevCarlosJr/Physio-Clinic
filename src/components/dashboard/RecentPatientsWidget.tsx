import React from 'react';
import { Users, ChevronRight, Phone } from 'lucide-react';
import { PatientBasicInfo } from '../../types';
import { formatCPF, formatPhone } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

interface RecentPatientsWidgetProps {
  patients: PatientBasicInfo[];
}

export const RecentPatientsWidget: React.FC<RecentPatientsWidgetProps> = ({ patients }) => {
  const { setCurrentRoute } = useApp();

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-800">
            Pacientes em Acompanhamento Ativo
          </h3>
        </div>
        <button
          onClick={() => setCurrentRoute('pacientes')}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
        >
          <span>Ver todos os pacientes</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-4">Paciente</th>
              <th className="py-2.5 px-4 hidden md:table-cell">CPF & Contato</th>
              <th className="py-2.5 px-4">Tratamento / Queixa</th>
              <th className="py-2.5 px-4 hidden sm:table-cell">Fisioterapeuta</th>
              <th className="py-2.5 px-4 text-right">Próxima Sessão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {patients.map((pat) => (
              <tr
                key={pat.id}
                onClick={() => setCurrentRoute('pacientes')}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{pat.name}</div>
                  <div className="text-[11px] text-slate-400 sm:hidden">
                    {formatPhone(pat.phone)}
                  </div>
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <div className="font-mono text-slate-600">{formatCPF(pat.cpf)}</div>
                  <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {formatPhone(pat.phone)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-slate-700">{pat.treatmentType}</span>
                </td>
                <td className="py-3 px-4 hidden sm:table-cell text-slate-600">
                  {pat.assignedPhysio}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                    {pat.nextSessionDate || 'Não agendado'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
