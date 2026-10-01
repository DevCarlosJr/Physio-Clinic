import React from 'react';
import { useApp } from '../context/AppContext';
import { AdminDashboardView } from '../components/dashboard/views/AdminDashboardView';
import { PhysiotherapistDashboardView } from '../components/dashboard/views/PhysiotherapistDashboardView';
import { ReceptionistDashboardView } from '../components/dashboard/views/ReceptionistDashboardView';
import { PatientDashboardView } from '../components/dashboard/views/PatientDashboardView';

export const DashboardPage: React.FC = () => {
  const { currentRole } = useApp();

  switch (currentRole) {
    case 'admin':
      return <AdminDashboardView />;
    case 'physiotherapist':
      return <PhysiotherapistDashboardView />;
    case 'receptionist':
      return <ReceptionistDashboardView />;
    case 'patient':
      return <PatientDashboardView />;
    default:
      return <AdminDashboardView />;
  }
};
