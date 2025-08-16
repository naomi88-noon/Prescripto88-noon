import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

export default function AdminAddDoctor() {
  const { doctors, setDoctors } = useContext(AppContext);
  const [form, setForm] = useState({
    name: '',
    speciality: '',
    fee: '',
    degree: '',
    experienceYears: '',
    about: '',
    addressLine1: '',
    addressLine2: '',
    image: '',
    _file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); 

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === 'image' && files?.[0]) {
      const url = URL.createObjectURL(files[0]);
      setForm(f => ({ ...f, image: url, _file: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('speciality', form.speciality);
      fd.append('fee', form.fee);
      fd.append('degree', form.degree);
      fd.append('experienceYears', form.experienceYears);
      fd.append('about', form.about);
      fd.append('addressLine1', form.addressLine1);
      fd.append('addressLine2', form.addressLine2);
      if (form._file) fd.append('image', form._file);

      const token = localStorage.getItem('token') || '';

      const { data: newDoctor } = await axios.post(
        `${API_BASE_URL}/doctors`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setDoctors([newDoctor, ...doctors]);

      // reset form
      setForm({
        name: '',
        speciality: '',
        fee: '',
        degree: '',
        experienceYears: '',
        about: '',
        addressLine1: '',
        addressLine2: '',
        image: '',
        _file: null
      });

      setSuccess('Doctor added successfully!');
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        'Failed to add doctor'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Add Doctor</h2>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
     
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Speciality</label>
          <input name="speciality" value={form.speciality} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fee</label>
            <input name="fee" value={form.fee} onChange={handleChange} type="number" min="0" required className="w-full border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Experience (yrs)</label>
            <input name="experienceYears" value={form.experienceYears} onChange={handleChange} type="number" min="0" className="w-full border rounded px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Degree</label>
          <input name="degree" value={form.degree} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">About</label>
          <textarea name="about" value={form.about} onChange={handleChange} rows={3} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address Line 1</label>
          <input name="addressLine1" value={form.addressLine1} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address Line 2</label>
          <input name="addressLine2" value={form.addressLine2} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input name="image" type="file" accept="image/*" onChange={handleChange} required className="w-full text-sm" />
          {form.image && <img src={form.image} alt="preview" className="mt-2 w-24 h-24 object-cover rounded" />}
        </div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded text-sm">
          {loading ? 'Saving...' : 'Add Doctor'}
        </button>
         {success && <p className="text-green-600 text-sm mb-2">{success}</p>} 
      </form>
    </div>
  );
}
