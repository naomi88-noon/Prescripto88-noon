import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function AdminDoctors() {
  const { doctors, currencySymbol } = useContext(AppContext);
  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Doctors</h2>
        <Link to="/admin/doctors/new" className="px-3 py-2 bg-blue-600 text-white rounded text-sm">Add Doctor</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Speciality</th>
              <th className="p-2">Fee</th>
              <th className="p-2">Experience</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="p-2 flex items-center gap-2">
                  <img src={d.image} alt={d.name} className="w-10 h-10 object-cover rounded" />
                  <span>{d.name}</span>
                </td>
                <td className="p-2">{d.speciality}</td>
                <td className="p-2">{currencySymbol}{d.fee}</td>
                <td className="p-2">{d.experience || 0} yrs</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
