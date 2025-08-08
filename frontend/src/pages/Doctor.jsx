import React, { useEffect } from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Doctor = () => {

    const {speciality} = useParams()
    const [filterDoc,setFilterDoc] = useState([])
    const navigate = useNavigate();

const {doctors} = useContext(AppContext)


const  applyFilter = () => {
    if (speciality){
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
}     else{
      setFilterDoc(doctors)
}


useEffect(()=>{
    applyFilter()
    },[doctors,speciality])
  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors speciality.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={'py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? `bg-primary text-white` : ``}'} onClick={()=> setShowFilter(prev => !prev)}>Filter</button>
        <div className={'flex-col gap-4 text-sm text-gray-600 ${showFilter ? `flex`: `hidden sm:flex`}'}>
            <p onClick={()=> speciality === 'General Physician' ? navigate('/doctors'): navigate('/doctors/General Physician')} className={'w-[94vw] sm: auto pl-3 py-1.5 pr-16 border-gray-300 rounded transition-all cursor-pointer ${speciality === "General Pysician" ? "bg-indigo-100 text-black" : ""}'}>General Physician</p>
            <p onClick={()=> speciality === 'Gynecologist' ? navigate('/doctors'): navigate('/doctors/Gynecologist')} className={'w-[94vw] sm: auto pl-3 py-1.5 pr-16 border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}'}>Gynecologist</p>
            <p onClick={()=> speciality === 'Dermatologist' ? navigate('/doctors'): navigate('/doctors/Dermatologist')} className={'w-[94vw] sm: auto pl-3 py-1.5 pr-16 border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}'}>Dermatologist</p>
            <p onClick={()=> speciality === 'Pediatricians' ? navigate('/doctors'): navigate('/doctors/Pediatrician')} className={'w-[94vw] sm: auto pl-3 py-1.5 pr-16 border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatrician" ? "bg-indigo-100 text-black" : ""}'}>Pediatricians</p>
            <p onClick={()=> speciality === 'Neurologist' ? navigate('/doctors'): navigate('/doctors/Neurologist')} className={'w-[94vw] sm: auto pl-3 py-1.5 pr-16 border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}'}>Neurologist</p>
            <p onClick={()=> speciality === 'Getroenterologist' ? navigate('/doctors'): navigate('/doctors/Gatroenterologist')} className={'w-[94vw] sm: auto pl-3 py-1.5 pr-16 border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}'}>Gatroenterologist</p>
        </div>
        <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-6'>
            {
              filterDoc.map((item, index)=>(
            <div onClick={()=>navigate(`/appointment/${item.id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[10px] transition-all duration-500' key={index}>
              <img className='bg-blue-50' src={item.image} alt="" />
              <div className='p-4'>
                <div className='flex item-center gap-2 text-sm text-center text-green-500'>
                    <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.speciality}</p>
              </div>
                </div>
          ) )
            }

        </div>
      </div>
    </div>
  )
}};

export default Doctor
