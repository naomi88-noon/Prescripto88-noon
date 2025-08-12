import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';

// Simple sparkline component using inline SVG
function Sparkline({ data, color='#2563eb', height=40 }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const points = data.map((d,i)=>{
    const x = (i/(data.length-1))*100;
    const y = max === 0 ? 100 : 100 - (d/max)*100;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-10">
      <polyline fill="none" stroke={color} strokeWidth="3" points={points} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function BarChart({ data, labels, color='#16a34a' }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((v,i)=> (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-gray-100 rounded h-full flex items-end">
            <div style={{ height: `${(v/max)*100}%` }} className="w-full rounded bg-gradient-to-t from-green-600 to-green-400"></div>
          </div>
          <span className="text-[10px] font-medium text-gray-600">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminOverview(){
  const { doctors } = useContext(AppContext);

  // Sample analytics data (replace with API fetch soon)
  const stats = useMemo(()=>({
    totalDoctors: doctors.length,
    totalPatients: 128, // sample
    totalAppointments: 342, // sample
    cancelledToday: 3,
    revenueMonth: 7850,
  }), [doctors.length]);

  const weeklyAppointments = [12,18,25,22,30,28,26]; // sample sparkline
  const monthlyRevenue = [5.2,6.1,7.3,6.8,8.0,7.85]; // in k
  const specialityDist = useMemo(()=>{
    const counts = doctors.reduce((acc,d)=>{ acc[d.speciality] = (acc[d.speciality]||0)+1; return acc; },{});
    const entries = Object.entries(counts).slice(0,6);
    return { labels: entries.map(e=>e[0]), data: entries.map(e=>e[1]) };
  },[doctors]);

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-6">Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="p-4 bg-white rounded shadow-sm">
          <p className="text-xs uppercase text-gray-500 mb-1">Doctors</p>
          <p className="text-2xl font-semibold">{stats.totalDoctors}</p>
        </div>
        <div className="p-4 bg-white rounded shadow-sm">
          <p className="text-xs uppercase text-gray-500 mb-1">Patients</p>
          <p className="text-2xl font-semibold">{stats.totalPatients}</p>
        </div>
        <div className="p-4 bg-white rounded shadow-sm">
          <p className="text-xs uppercase text-gray-500 mb-1">Appointments</p>
          <p className="text-2xl font-semibold">{stats.totalAppointments}</p>
        </div>
        <div className="p-4 bg-white rounded shadow-sm">
          <p className="text-xs uppercase text-gray-500 mb-1">Cancelled (Today)</p>
          <p className="text-2xl font-semibold">{stats.cancelledToday}</p>
        </div>
        <div className="p-4 bg-white rounded shadow-sm">
          <p className="text-xs uppercase text-gray-500 mb-1">Revenue (Month)</p>
          <p className="text-2xl font-semibold">${stats.revenueMonth.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Weekly Appointments</h2>
            <span className="text-xs text-gray-500">Last 7 days</span>
          </div>
          <Sparkline data={weeklyAppointments} color="#2563eb" />
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            {['M','T','W','T','F','S','S'].map(d=> <span key={d}>{d}</span>)}
          </div>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Monthly Revenue (k)</h2>
            <span className="text-xs text-gray-500">6 mo</span>
          </div>
          <Sparkline data={monthlyRevenue} color="#16a34a" />
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            {['Mar','Apr','May','Jun','Jul','Aug'].map(m=> <span key={m}>{m}</span>)}
          </div>
        </div>
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Speciality Mix</h2>
            <span className="text-xs text-gray-500">Top 6</span>
          </div>
          {specialityDist.data.length === 0 && <p className="text-xs text-gray-500">No data</p>}
          {specialityDist.data.length > 0 && (
            <BarChart data={specialityDist.data} labels={specialityDist.labels} />
          )}
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-4">
        <h2 className="font-semibold mb-2">Recent Activity (Sample)</h2>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>Dr. Smith booked with Patient A (09:00)</li>
            <li>Appointment #A102 cancelled (patient)</li>
            <li>New doctor added: Dr. Jane Doe</li>
            <li>System: Daily availability recomputed</li>
        </ul>
      </div>
    </div>
  );
}
