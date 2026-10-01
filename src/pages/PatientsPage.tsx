import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  User,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  ChevronLeft,
  Edit,
  Eye,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import { initialMockPatients } from '../data/mockPatientsExtended';
import { PatientRecord, PatientStatus } from '../types/patient';
import { formatCPF, formatPhone } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { PatientFormModal } from '../components/patients/PatientFormModal';
import { PatientDetailDrawer } from '../components/patients/PatientDetailDrawer';
import { useApp } from '../context/AppContext';

export const PatientsPage: React.FC = () => {
  const { addToast, currentRole, setIsQuickBookingOpen, setCurrentRoute } = useApp();

  const [patients, setPatients] = useState<PatientRecord[]>(initialMockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PatientStatus>('all');
  const [physioFilter, setPhysioFilter] = useState<string>('all');
  const [insuranceFilter, setInsuranceFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'name_asc' | 'name_desc' | 'recent' | 'sessions'>('name_asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientRecord | null>(null);
  const [selectedPatientForDrawer, setSelectedPatientForDrawer] = useState<PatientRecord | null>(null);

  // Filtering & Sorting
  const filteredPatients = useMemo(() => {
    let result = patients.filter((p) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        p.fullName.toLowerCase().includes(search) ||
        (p.socialName && p.socialName.toLowerCase().includes(search)) ||
        p.cpf.includes(search.replace(/\D/g, '')) ||
        p.phone.includes(search.replace(/\D/g, '')) ||
        p.email.toLowerCase().includes(search);

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesPhysio = physioFilter === 'all' || p.assignedPhysioId === physioFilter;
      const matchesInsurance = insuranceFilter === 'all' || p.insurance === insuranceFilter;

      return matchesSearch && matchesStatus && matchesPhysio && matchesInsurance;
    });

    // Sort
    result.sort((a, b) => {
      if (sortOption === 'name_asc') return a.fullName.localeCompare(b.fullName);
      if (sortOption === 'name_desc') return b.fullName.localeCompare(a.fullName);
      if (sortOption === 'recent') return b.createdAt.localeCompare(a.createdAt);
      if (sortOption === 'sessions') return (b.completedSessionsCount ?? 0) - (a.completedSessionsCount ?? 0);
      return 0;
    });

    return result;
  }, [patients, searchTerm, statusFilter, physioFilter, insuranceFilter, sortOption]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPatients.slice(start, start + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  // Reset page when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    if (filterType === 'status') setStatusFilter(value as 'all' | PatientStatus);
    if (filterType === 'physio') setPhysioFilter(value);
    if (filterType === 'insurance') setInsuranceFilter(value);
  };

  const handleCreateNew = () => {
    setEditingPatient(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (patient: PatientRecord) => {
    setEditingPatient(patient);
    setIsFormModalOpen(true);
  };

  const handleSavePatient = (savedPatient: PatientRecord) => {
    setPatients((prev) => {
      const exists = prev.some((p) => p.id === savedPatient.id);
      if (exists) {
        addToast(`Dados de ${savedPatient.fullName} atualizados com sucesso!`, 'success');
        return prev.map((p) => (p.id === savedPatient.id ? savedPatient : p));
      } else {
        addToast(`Paciente ${savedPatient.fullName} cadastrado com sucesso!`, 'success');
        return [savedPatient, ...prev];
      }
    });

    if (selectedPatientForDrawer && selectedPatientForDrawer.id === savedPatient.id) {
      setSelectedPatientForDrawer(savedPatient);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPhysioFilter('all');
    setInsuranceFilter('all');
    setSortOption('name_asc');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Base Geral de Pacientes</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {filteredPatients.length} pacientes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastros unificados, dados administrativos, convênios e prontuários vinculados
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreateNew}
          >
            Cadastrar Novo Paciente
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF, telefone ou e-mail..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Status Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => handleFilterChange('status', 'all')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({patients.length})
            </button>
            <button
              onClick={() => handleFilterChange('status', 'active')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors whitespace-nowrap ${
                statusFilter === 'active'
                  ? 'bg-white text-teal-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Em Tratamento ({patients.filter((p) => p.status === 'active').length})
            </button>
            <button
              onClick={() => handleFilterChange('status', 'paused')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors whitespace-nowrap ${
                statusFilter === 'paused'
                  ? 'bg-white text-amber-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pausados
            </button>
            <button
              onClick={() => handleFilterChange('status', 'discharged')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors whitespace-nowrap ${
                statusFilter === 'discharged'
                  ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alta Concedida
            </button>
          </div>
        </div>

        {/* Extended Filter Dropdowns */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={physioFilter}
              onChange={(e) => handleFilterChange('physio', e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer text-xs"
            >
              <option value="all">Todos os Fisioterapeutas</option>
              <option value="usr_physio_1">Dr. Lucas Silveira</option>
              <option value="usr_physio_2">Dra. Camila Ramos</option>
              <option value="usr_physio_3">Dr. Thiago Medeiros</option>
            </select>

            <select
              value={insuranceFilter}
              onChange={(e) => handleFilterChange('insurance', e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer text-xs"
            >
              <option value="all">Todas as Modalidades</option>
              <option value="Particular">Particular</option>
              <option value="Bradesco Saúde">Bradesco Saúde</option>
              <option value="SulAmérica">SulAmérica</option>
              <option value="Amil Saúde">Amil Saúde</option>
              <option value="Unimed Seguros">Unimed Seguros</option>
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer text-xs"
            >
              <option value="name_asc">Ordenar: Nome (A-Z)</option>
              <option value="name_desc">Ordenar: Nome (Z-A)</option>
              <option value="recent">Ordenar: Cadastrados Recentes</option>
              <option value="sessions">Ordenar: Mais Sessões</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== 'all' || physioFilter !== 'all' || insuranceFilter !== 'all') && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Paciente</th>
                <th className="py-3 px-4">CPF / Contato</th>
                <th className="py-3 px-4">Modalidade / Convênio</th>
                <th className="py-3 px-4">Fisioterapeuta</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 text-sm">
                      Nenhum paciente encontrado com os filtros selecionados.
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      Tente ajustar seus termos de busca ou filtros de status.
                    </p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" onClick={clearAllFilters}>
                        Limpar Filtros
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((pat) => (
                  <tr
                    key={pat.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => setSelectedPatientForDrawer(pat)}
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                          {pat.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {pat.fullName}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{pat.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-mono text-slate-700">{formatCPF(pat.cpf)}</p>
                      <p className="text-[11px] text-slate-500">{formatPhone(pat.phone)}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{pat.insurance}</span>
                      <span className="block text-[11px] text-slate-400">
                        {pat.completedSessionsCount} de {pat.totalSessionsPlanned} sessões
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {pat.assignedPhysioName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          pat.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : pat.status === 'discharged'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            pat.status === 'active'
                              ? 'bg-emerald-500'
                              : pat.status === 'discharged'
                              ? 'bg-sky-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        {pat.status === 'active' && 'Em Tratamento'}
                        {pat.status === 'discharged' && 'Alta Concedida'}
                        {pat.status === 'paused' && 'Pausado'}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPatientForDrawer(pat)}
                          className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title="Ver Ficha Cadastral e Resumo"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleEdit(pat)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title="Editar Dados Cadastrais"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {(currentRole === 'admin' || currentRole === 'physiotherapist') && (
                          <button
                            onClick={() => {
                              setCurrentRoute('prontuarios');
                              addToast(`Prontuário de ${pat.fullName} aberto.`);
                            }}
                            className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg cursor-pointer"
                            title="Acessar Prontuário Clínico"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {filteredPatients.length > pageSize && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Mostrando {(currentPage - 1) * pageSize + 1} a{' '}
              {Math.min(currentPage * pageSize, filteredPatients.length)} de {filteredPatients.length} pacientes
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-7 h-7 rounded text-xs font-semibold cursor-pointer ${
                    currentPage === idx + 1
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Patient Form Modal (Create / Edit) */}
      <PatientFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSavePatient}
        editingPatient={editingPatient}
      />

      {/* Patient Detail Drawer */}
      <PatientDetailDrawer
        patient={selectedPatientForDrawer}
        isOpen={!!selectedPatientForDrawer}
        onClose={() => setSelectedPatientForDrawer(null)}
        onEdit={(patient) => {
          setSelectedPatientForDrawer(null);
          handleEdit(patient);
        }}
      />
    </div>
  );
};
