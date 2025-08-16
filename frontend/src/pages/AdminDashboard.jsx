import React from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import AdminOverview from './AdminOverview';
import AdminDoctors from './AdminDoctors';
import AdminAppointments from './AdminAppointments';
import AdminPatients from './AdminPatients';
import AdminAddDoctor from './AdminAddDoctor';

const cards = [
  { to: 'overview', label: 'Overview' },
  { to: 'doctors', label: 'Doctors' },
  { to: 'appointments', label: 'Appointments' },
  { to: 'patients', label: 'Patients' },
  { to: 'doctors/new', label: 'Add Doctor' },
];

export default function AdminDashboard() {
  return (
    <div className="flex gap-6 py-8">
      {/* Sidebar */}
      <div className="w-48 flex flex-col gap-2">
        {cards.map((c, index) => (
          <Link
            key={index}
            to={`/admin/${c.to}`} 
            className="p-4 bg-white shadow rounded hover:shadow-md transition text-sm font-medium text-center"
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="doctors/new" element={<AdminAddDoctor />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="patients" element={<AdminPatients />} />
        </Routes>
      </main>
    </div>
  );
}
