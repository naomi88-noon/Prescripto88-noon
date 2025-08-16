import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { currencySymbol } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');

  // Fetch doctor details
  const fetchDocInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/doctors/${docId}`);
    const data = response.data;

    // Prepend full URL to image if it exists
    if (data.image && !data.image.startsWith('http')) {
      data.image = `${API_BASE_URL}${data.image}`;
    }

    setDocInfo(data);
  } catch (err) {
    console.error('Failed to fetch doctor:', err);
    setDocInfo(null);
    setMessage('Failed to load doctor details.');
    setMessageType('error');
  }
};

  // Generate time slots
  const getAvailableSlots = () => {
    if (!docInfo) return;

    const allSlots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSlots.push({ datetime: new Date(currentDate), time: formattedTime });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
  };

  // Book appointment
  const handleBook = async () => {
    if (!slotTime || !docSlots[slotIndex]) {
      setMessage('Please select a date and time.');
      setMessageType('error');
      return;
    }

    const slot = docSlots[slotIndex].find(s => s.time === slotTime);
    if (!slot) {
      setMessage('Invalid slot selected.');
      setMessageType('error');
      return;
    }

    const start = slot.datetime;
    const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 minutes
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setMessage('You must be logged in to book an appointment.');
      setMessageType('error');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      await axios.post(
        `${API_BASE_URL}/appointments`,
        { doctorId: docInfo.id, start, end },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Appointment booked successfully!');
      setMessageType('success');

      setTimeout(() => navigate('/my-appointments'), 1500);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setMessage('Session expired. Please login again.');
        setMessageType('error');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else if (err.response?.data?.error?.message) {
        setMessage(err.response.data.error.message);
        setMessageType('error');
      } else {
        setMessage('Failed to book appointment.');
        setMessageType('error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (docId) fetchDocInfo();
  }, [docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  if (!docInfo) return <p className="text-center text-gray-500">Loading doctor...</p>;

  return (
    <div>
      {/* Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:max-w-72">
          <div className="w-full aspect-[4/3] bg-primary rounded-lg overflow-hidden">
            {docInfo.image && (
              <img
                className="w-full h-full object-cover"
                src={docInfo.image}
                alt={docInfo.name}
                crossOrigin="anonymous" 
              />
            )}
          </div>
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experienceYears} yrs</button>
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
          </div>
          <p className="text-gray-500 font-medium mt-4">
            Appointment fee: <span className="text-gray-600">{currencySymbol}{docInfo.fee}</span>
          </p>
        </div>
      </div>

      {/* Booking slots */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking slot</p>
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots.length > 0 && docSlots.map((item, index) => (
            <div
              key={index}
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 px-2 min-w-16 rounded-full cursor-pointer border ${
                slotIndex === index ? 'bg-primary text-white border-primary' : 'border-gray-200'
              }`}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
            <button
              key={index}
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full border ${
                item.time === slotTime ? 'bg-primary text-white border-primary' : 'text-gray-500 border-gray-300'
              }`}
            >
              {item.time.toLowerCase()}
            </button>
          ))}
        </div>

        <button
          onClick={handleBook}
          disabled={loading}
          className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
        >
          {loading ? 'Booking...' : 'Book an Appointment'}
        </button>

        {message && (
          <p className={`mt-2 text-sm text-center ${messageType === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
