import React from 'react';
import { Link } from 'react-router-dom';

const cards = [
  { to: '/admin/overview', label: 'Overview' },
  { to: '/admin/doctors', label: 'Doctors' },
  { to: '/admin/appointments', label: 'Appointments' },
  { to: '/admin/patients', label: 'Patients' },
  { to: '/admin/doctors/new', label: 'Add Doctor' },
];

export default function AdminDashboard() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold mb-6">Admin Panel</h1>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        {cards.map(c => (
          <Link key={c.to} to={c.to} className="p-4 bg-white shadow rounded hover:shadow-md transition text-center text-sm font-medium">
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
