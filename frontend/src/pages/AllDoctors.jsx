import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { API_BASE_URL } from '../utils/config';

const AllDoctors = () => {
  const { searchTerm } = useContext(AppContext);
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [speciality, setSpeciality] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch all doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = { page: page.toString(), limit: '20' };
      if (speciality) params.speciality = speciality;
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get(`${API_BASE_URL}/doctors`, { params });
      setDoctors(response.data.data);
      setTotalPages(Math.ceil(response.data.meta.total / response.data.meta.limit));
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
  }, [searchTerm, speciality, page]);

  const filteredDoctors = useMemo(() => doctors, [doctors]);

  // Fetch single doctor details before navigating
  const handleBook = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/doctors/${id}`);
      const doctor = response.data;
      navigate(`/appointment/${id}`, { state: { doctor } });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch doctor details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
    onClick={() => navigate('/my-appointments')}
    className="absolute top-0 right-0 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
  >
    My Appointments
  </button>

      <p className="text-gray-600 mb-5">Browse through the doctors' specialties.</p>
      {searchTerm && (
        <p className="text-xs text-gray-500 mt-1">
          Showing {filteredDoctors.length} result{filteredDoctors.length !== 1 && 's'} for "{searchTerm}"
        </p>
      )}

      {/* Speciality filter */}
      <div className="mb-4">
        <label className="mr-2 text-sm font-medium">Filter by speciality:</label>
        <select
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">All Specialities</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Neurology">Neurology</option>
          <option value="Obstetrics">Obstetrics</option>
          <option value="Orthopedics">Orthopedics</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-6">
          {loading ? (
            <div className="col-span-full text-center py-10 text-gray-500">Loading doctors...</div>
          ) : error ? (
            <div className="col-span-full text-center py-10 text-red-500">{error}</div>
          ) : filteredDoctors.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">No doctors match your search.</div>
          ) : (
            filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleBook(doc.id)}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-full aspect-[4/3] bg-blue-50 flex justify-center items-center overflow-hidden">
                  {doc.image && (
                    <img
                      className="w-full h-full object-cover"
                      src={doc.image} // use backend full URL directly
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
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-5">
          <button
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllDoctors;
