import React, {useContext, useState, useMemo} from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

import {assets} from '../assets/assets_frontend/assets';

const AllDoctors = () => {
const { doctors, searchTerm } = useContext(AppContext);
const navigate = useNavigate();
const [showFilter, setShowFilter] = useState(false);
const [speciality, setSpeciality] = useState('');

//  const doctorImages = {
    // 1: doc1Img,
    // 2: doc2Img,
    // 3: doc3Img,
//   };

  const handleBook = (id) => {
    navigate(`/appointment/${id}`);
  };

  const filtered = useMemo(()=> {
    let list = doctors;
    if(searchTerm){
      const q = searchTerm.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        (d.speciality && d.speciality.toLowerCase().includes(q))
      );
    }
    if(speciality){
      list = list.filter(d => d.speciality === speciality);
    }
    return list;
  }, [doctors, searchTerm, speciality]);

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors speciality.</p>
      {searchTerm && (
        <p className='text-xs text-gray-500 mt-1'>Showing {filtered.length} result{filtered.length!==1 && 's'} for "{searchTerm}"</p>
      )}
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={()=> setShowFilter(prev => !prev)}>Filter</button>
        <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-6'>
          {filtered.map((doc, index)=>(
            <div onClick={()=>navigate(`/appointment/${doc.id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300' key={index}>
              <div className='w-full aspect-[4/3] bg-blue-50'>
                <img className='w-full h-full object-cover' src={doc.image || assets.about_image} alt={doc.name} loading='lazy' />
              </div>
              <div className='p-4'>
                <div className='flex items-center gap-2 text-sm text-green-500'>
                  <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{doc.name}</p>
                <p className='text-gray-600 text-sm'>{doc.speciality}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className='col-span-full text-center text-gray-500 py-10'>No doctors match your search.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllDoctors