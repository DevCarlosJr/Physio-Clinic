import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  X,
  Layers,
  Clock,
  Sparkles,
  CalendarCheck,
} from 'lucide-react';
import { initialMockAppointments } from '../data/mockAppointmentsExtended';
import {
  AppointmentRecord,
  AgendaViewMode,
  AgendaFilterState,
  AppointmentStatusType,
} from '../types/appointment';
import { Button } from '../components/common/Button';
import { DayView } from '../components/schedule/views/DayView';
import { WeekView } from '../components/schedule/views/WeekView';
import { MonthView } from '../components/schedule/views/MonthView';
import { ListView } from '../components/schedule/views/ListView';
import { AppointmentDetailModal } from '../components/schedule/AppointmentDetailModal';
import { useApp } from '../context/AppContext';

export const SchedulePage: React.FC = () => {
  const {
    setIsQuickBookingOpen,
    addToast,
    currentRole,
    appointments,
    updateAppointmentStatus,
  } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>('2026-09-30'); // Quarta-feira (Hoje)
  const [viewMode, setViewMode] = useState<AgendaViewMode>('day');

  // Filters
  const [filters, setFilters] = useState<AgendaFilterState>({
    professionalId: 'all',
    roomId: 'all',
    serviceType: 'all',
    status: 'all',
    insurance: 'all',
  });

  // Selected appointment for detail modal
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(null);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchPhysio =
        filters.professionalId === 'all' || apt.physiotherapistId === filters.professionalId;
      const matchRoom = filters.roomId === 'all' || apt.roomId === filters.roomId;
      const matchStatus = filters.status === 'all' || apt.status === filters.status;
      const matchInsurance = filters.insurance === 'all' || apt.insurance === filters.insurance;

      return matchPhysio && matchRoom && matchStatus && matchInsurance;
    });
  }, [appointments, filters]);

  // Navigate Date
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate('2026-09-30');
  };

  const handleStatusChange = (id: string, newStatus: AppointmentStatusType) => {
    updateAppointmentStatus(id, newStatus);
  };

  const handleSelectEmptySlot = (time: string) => {
    setIsQuickBookingOpen(true);
    addToast(`Iniciando agendamento para ${selectedDate} às ${time}`);
  };

  const clearFilters = () => {
    setFilters({
      professionalId: 'all',
      roomId: 'all',
      serviceType: 'all',
      status: 'all',
      insurance: 'all',
    });
  };

  const isFiltering =
    filters.professionalId !== 'all' ||
    filters.roomId !== 'all' ||
    filters.status !== 'all' ||
    filters.insurance !== 'all';

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Agenda Clínica</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {filteredAppointments.length} consultas listadas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestão visual de horários, boxes de atendimento e confirmação de presença
          </p>
        </div>

        {/* View Mode Switcher and New Booking */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs text-xs">
            {(['day', 'week', 'month', 'list'] as AgendaViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded font-semibold cursor-pointer transition-colors ${
                  viewMode === mode
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'day' && 'Dia'}
                {mode === 'week' && 'Semana'}
                {mode === 'month' && 'Mês'}
                {mode === 'list' && 'Lista'}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsQuickBookingOpen(true)}
          >
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Date Navigation & Status Legend Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Date Navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            aria-label="Dia anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleToday}
            className={`px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
              selectedDate === '2026-09-30'
                ? 'bg-teal-50 border-teal-200 text-teal-800'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Hoje
          </button>

          <button
            onClick={handleNextDay}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            aria-label="Próximo dia"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-slate-800 px-2 font-mono">
            {selectedDate === '2026-09-30' ? 'Quarta-feira, 30/09/2026 (Hoje)' : selectedDate}
          </span>
        </div>

        {/* Status Legend (Accessible Colors + Symbols) */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Confirmado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Em Atendimento
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" /> Agendado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Concluído
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600" /> Falta
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5 text-teal-600" />
            <span>Filtrar:</span>
          </div>

          <select
            value={filters.professionalId}
            onChange={(e) => setFilters({ ...filters, professionalId: e.target.value })}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer text-xs"
          >
            <option value="all">Todos os Profissionais</option>
            <option value="usr_physio_1">Dr. Lucas Silveira</option>
            <option value="usr_physio_2">Dra. Camila Ramos</option>
            <option value="usr_physio_3">Dr. Thiago Medeiros</option>
          </select>

          <select
            value={filters.roomId}
            onChange={(e) => setFilters({ ...filters, roomId: e.target.value })}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer text-xs"
          >
            <option value="all">Todas as Salas / Boxes</option>
            <option value="box-01">Box 01 - Cinesioterapia</option>
            <option value="box-02">Box 02 - Traumato-Ortopedia</option>
            <option value="sala-03">Sala 03 - Postura & Coluna</option>
            <option value="box-04">Box 04 - Eletrotermo</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer text-xs"
          >
            <option value="all">Todos os Status</option>
            <option value="confirmed">Confirmados</option>
            <option value="in_progress">Em Atendimento</option>
            <option value="scheduled">Agendados</option>
            <option value="completed">Concluídos</option>
            <option value="no_show">Faltas</option>
            <option value="cancelled">Cancelados</option>
          </select>

          <select
            value={filters.insurance}
            onChange={(e) => setFilters({ ...filters, insurance: e.target.value })}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer text-xs"
          >
            <option value="all">Todos os Convênios</option>
            <option value="Particular">Particular</option>
            <option value="Bradesco Saúde">Bradesco Saúde</option>
            <option value="SulAmérica">SulAmérica</option>
            <option value="Unimed Seguros">Unimed Seguros</option>
            <option value="Amil Saúde">Amil Saúde</option>
          </select>
        </div>

        {isFiltering && (
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpar Filtros</span>
          </button>
        )}
      </div>

      {/* Selected View Mode Content */}
      {viewMode === 'day' && (
        <DayView
          selectedDate={selectedDate}
          appointments={filteredAppointments}
          onSelectAppointment={(apt) => setSelectedAppointment(apt)}
          onSelectEmptySlot={handleSelectEmptySlot}
        />
      )}

      {viewMode === 'week' && (
        <WeekView
          appointments={filteredAppointments}
          onSelectAppointment={(apt) => setSelectedAppointment(apt)}
          onSelectDate={(d) => {
            setSelectedDate(d);
            setViewMode('day');
          }}
          selectedDate={selectedDate}
        />
      )}

      {viewMode === 'month' && (
        <MonthView
          appointments={filteredAppointments}
          onSelectDate={(d) => {
            setSelectedDate(d);
            setViewMode('day');
          }}
          selectedDate={selectedDate}
        />
      )}

      {viewMode === 'list' && (
        <ListView
          appointments={filteredAppointments}
          onSelectAppointment={(apt) => setSelectedAppointment(apt)}
        />
      )}

      {/* Appointment Detail & Status Transition Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};
