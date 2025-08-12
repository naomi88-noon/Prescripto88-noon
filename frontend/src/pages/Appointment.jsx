import React, {  useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {AppContext} from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors';


const Appointment = () => {

const {docId} = useParams();
const {doctors, currencySymbol} = useContext(AppContext);
const daysOfweek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const [docInfo, setDocInfo] = useState(null);
const [docSlots, setDocSlots] = useState([]);
const [slotIndex, setSlotIndex] = useState(0);;
const [slotTime, setSlotTime] = useState('')

const fetchDocInfo = () => {
  const foundDoc = doctors.find(doc => doc.id === docId);
  setDocInfo(foundDoc || null);
};

const getAvailableSlots = async () => {
  console.log("Getting slots...")
  const allSlots = [];

    // getting current date
    const today = new Date();

  for(let i =0; i < 7; i++){
    // getting date with index
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    // setting end time of the date with index
    const endTime = new Date(today);
    endTime.setDate(today.getDate() + i);
    endTime.setHours(21,0,0,0);

    // setting hours
    if (today.getDate() === currentDate.getDate()){
      currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
      currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
    } else {
      currentDate.setHours(10)
      currentDate.setMinutes(0)
    }

    let timeSlots = [];

    while(currentDate < endTime){
      let formattedTime = currentDate.toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit'});

      // add slot to array
      timeSlots.push({
        datetime: new Date(currentDate),
        time: formattedTime
      });

      // increment current time by 30 minutes
      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

     allSlots.push(timeSlots);

  }
  setDocSlots(allSlots);

};

useEffect(()=>{
  if (doctors.length>0 && docId){
    fetchDocInfo();
  }
},[doctors,docId]);

useEffect(()=>{
 if (docInfo){
   getAvailableSlots();
 }
}, [docInfo])

useEffect(()=>{
   console.log("Doctor infor:" , docInfo);

},[docSlots]);



  if(!docInfo) return <p className='text-center text-gray-500'>Loading doctor...</p>;
  return (

    <div>
      {/*--------------- Doctors Details  --------------*/}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='w-full sm:max-w-72'>
          <div className='w-full aspect-[4/3] bg-primary rounded-lg overflow-hidden'>
            <img className='w-full h-full object-cover' src={docInfo.image} alt={docInfo.name} />
          </div>
        </div >

        <div className='flex-1 border  border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[80px] sm:mt-0 '>
          {/* -------------- Doc Info : name, degree, experience  ------------*/}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name} 
            <img className='w-5' src={assets.verified_icon} alt="" />
            </p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
            </div>

            {/* ------------- Doctor About  ---------------*/}
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                About <img src={assets.info_icon} alt="" />
                </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fee}</span>
            </p>
        </div>
      </div>

     {/* --------Booking slots ------ */}
  <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slot</p>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'> 
          {
          docSlots.length > 0 && docSlots.map((item,index)=>(
              <div onClick={()=> setSlotIndex(index)} key={index} className={`text-center py-6 px-2 min-w-16 rounded-full cursor-pointer border ${slotIndex === index ? 'bg-primary text-white border-primary' : 'border-gray-200'}`}> 
                <p>{item[0] && daysOfweek[item[0].datetime.getDay()]} </p>
                <p>{item[0] && item[0].datetime.getDate()}</p>

              </div>
            ))
          }
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 && docSlots[slotIndex].map((item,index)=>(
            <button  onClick={()=>setSlotTime(item.time)} key={index} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full border ${item.time === slotTime ? 'bg-primary text-white border-primary' : 'text-gray-500 border-gray-300'}`}>
              {item.time.toLowerCase()}
            </button>
          ))}
        </div>
        <button className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>
     </div>

     {/* -------------- Listing Related Doctors ----------- */}
  <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
     

    </div>
  )
}

export default Appointment
