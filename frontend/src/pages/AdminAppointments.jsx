import React from 'react';

export default function AdminAppointments(){
  // Placeholder static list; integrate API later
  const rows = [];
  return (
    <div className="py-6">
      <h2 className="text-xl font-semibold mb-4">Appointments</h2>
      {rows.length === 0 && <p className="text-sm text-gray-600">No appointments yet.</p>}
    </div>
  );
}
