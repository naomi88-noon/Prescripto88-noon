import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctor = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality.toLowerCase() === speciality.toLowerCase()));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const handleNavigate = (path) => {
    if (speciality === path) navigate('/doctors'); else navigate(`/doctors/${path}`);
  };

  const specialities = [
    'General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'
  ];

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors speciality.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}>Filter</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {specialities.map(s => (
            <p key={s}
               onClick={() => handleNavigate(s)}
               className={`w-[94vw] sm:auto pl-3 py-1.5 pr-16 border-gray-300 rounded transition-all cursor-pointer ${speciality && speciality.toLowerCase() === s.toLowerCase() ? 'bg-indigo-100 text-black' : ''}`}>{s}</p>
          ))}
        </div>
        <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-6'>
          {filterDoc.map((item) => (
            <div onClick={() => navigate(`/appointment/${item.id}`)} key={item.id} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300'>
              <div className='w-full aspect-[4/3] bg-blue-50'>
                <img className='w-full h-full object-cover' src={item.image} alt={item.name} loading='lazy' />
              </div>
              <div className='p-4'>
                <div className='flex items-center gap-2 text-sm text-green-500'>
                  <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctor
