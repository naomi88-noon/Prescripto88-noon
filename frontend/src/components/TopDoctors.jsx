import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const TopDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch top doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors`, {
        params: { page: '1', limit: '10' }, // top 10 doctors
      });
      setDoctors(response.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleBook = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/doctors/${id}`);
      const doctor = response.data;
      navigate(`/appointment/${id}`, { state: { doctor } });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch doctor details.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors To Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {loading ? (
        <p className="mt-6 text-gray-500">Loading top doctors...</p>
      ) : error ? (
        <p className="mt-6 text-red-500">{error}</p>
      ) : (
        <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleBook(doc.id)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-full aspect-[4/3] bg-blue-50 flex justify-center items-center overflow-hidden">
                {doc.image && (
                  <img
                    className="w-full h-full object-cover"
                    src={doc.image}
                    alt={doc.name}
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                  <p>Available</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{doc.name}</p>
                <p className="text-gray-600 text-sm">{doc.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default TopDoctors;
