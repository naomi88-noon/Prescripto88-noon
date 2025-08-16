import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const MyAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAppointments = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setMessage('You must be logged in to view appointments.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(response.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setMessage('Session expired. Please login again.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } else {
        setMessage('Failed to load appointments.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setMessage('You must be logged in to cancel.');
      return;
    }

    try {
      await axios.patch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(prev =>
        prev.map(a => (a.id === appointmentId ? { ...a, status: 'CANCELLED' } : a))
      );
      setMessage('Appointment cancelled successfully.');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error?.message || 'Failed to cancel appointment.');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return <p className="text-center mt-12">Loading appointments...</p>;
  if (!appointments.length) return <p className="text-center mt-12 text-gray-500">No appointments found.</p>;

  return (
    <div className="mt-12">
      <p className="pb-3 font-medium text-zinc-700 border-b">My Appointments</p>
      <div className="mt-4">
        {appointments.map((apt, index) => (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
            <div>
              <img
               className="w-32 h-32 bg-indigo-50 rounded-full object-cover"
                src={apt.Doctor?.image || ''}
                alt={apt.Doctor?.name || 'Doctor'}
                crossOrigin="anonymous" 
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{apt.Doctor?.name}</p>
              <p>{apt.Doctor?.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{apt.Doctor?.addressLine1}</p>
              <p className="text-xs">{apt.Doctor?.addressLine2}</p>
              <p className="text-sm mt-1">
                <span className="text-sm text-neutral-700 font-medium">Date & Time:</span>{' '}
                {new Date(apt.start).toLocaleString()}
              </p>
              <p className="text-sm mt-1">
                <span className="text-sm text-neutral-700 font-medium">Status:</span> {apt.status}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-end">
              <button
                disabled={apt.status !== 'BOOKED'}
                className={`text-sm text-stone-500 text-center sm:min-48 py-2 border rounded transition-all duration-300 ${
                  apt.status === 'BOOKED' ? 'hover:bg-primary hover:text-white' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                Pay Online
              </button>
              <button
                disabled={apt.status !== 'BOOKED'}
                onClick={() => handleCancel(apt.id)}
                className={`text-sm text-stone-500 text-center sm:min-48 py-2 border rounded transition-all duration-300 ${
                  apt.status === 'BOOKED' ? 'hover:bg-red hover:text-white' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                Cancel appointment
              </button>
            </div>
          </div>
        ))}
      </div>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default MyAppointment;
