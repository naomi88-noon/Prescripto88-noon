import React, {useContext, useState} from 'react'
import { useNavigate,   } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

import {assets} from '../assets/assets_frontend/assets';

const AllDoctors = () => {
const { doctors } = useContext(AppContext);
const navigate = useNavigate();
const [showFilter, setShowFilter] = useState(false);
const [speciality, setSpeciality] = useState('');

//  const doctorImages = {
    // 1: doc1Img,
    // 2: doc2Img,
    // 3: doc3Img,
//   };

  const handleBook = (id) => {
    navigate('/appointment/${id}');
  };

  return (
   
    <div>
      <p className='text-gray-600'>Browse through the doctors speciality.</p>
      {console.log('Doctors:', doctors)}
      <div className='flex flex-col flex-row items-start gap-5 mt-5'>
        <button className={'py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? `bg-primary text-white` : ``}'} onClick={()=> setShowFilter(prev => !prev)}>Filter</button>
        
        <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-6'>
            {
              doctors.map((doc, index)=>(
            <div onClick={()=>navigate(`/appointment/${doc.id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[10px] transition-all duration-500' key={index}>
                <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
              <div className='p-4'>
                <div className='flex item-center gap-2 text-sm text-center text-green-500'>
                    <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{doc.name}</p>
                <p className='text-gray-600 text-sm'>{doc.speciality}</p>
              </div>
                </div>
          ) )
            }

        </div>
      </div>
    </div>
  );
}

export default AllDoctors