import React, { useEffect, useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({speciality,docId}) => {

  const {doctors} = useContext(AppContext)
  const navigate = useNavigate()

  const [relDoc,setRelDoc] = useState([])

useEffect(()=>{
  if (doctors.length > 0 && speciality){
     const doctorsData = doctors.filter((doc)=> doc.speciality === speciality && doc.id !== docId)
     setRelDoc(doctorsData)
  }

},[doctors,speciality,docId])

  return (
    <div  className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
       <h1 className='text-3xl font-medium'>Top Doctors To Book</h1>
       <p className='sm:w-1/3 text-center text-sm'>simply browse through our extensive list of trusted doctors.</p>
       <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
          {relDoc.slice(0,5).map((item, index)=>(
            <div onClick={()=>{navigate(`/appointment/${item.id}`); window.scrollTo(0,0)}} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300' key={index}>
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
       <button onClick={()=> navigate('/doctors')} className='bg-blue-500 text-white px-12 py-3 rounded-full mt-10'>More</button>

    </div>
  )
}

export default RelatedDoctors