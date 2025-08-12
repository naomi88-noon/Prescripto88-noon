import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function AdminAddDoctor() {
  const { doctors, setDoctors } = useContext(AppContext);
  const [form, setForm] = useState({ name:'', speciality:'', fee:'', degree:'', experience:'', about:'', image:'' });

  function handleChange(e){
    const { name, value, files } = e.target;
    if (name === 'image' && files?.[0]) {
      const url = URL.createObjectURL(files[0]);
      setForm(f => ({ ...f, image:url, _file: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleSubmit(e){
    e.preventDefault();
    // Placeholder: just add locally; integrate API multipart later
    const id = `tmp_${Date.now()}`;
    setDoctors([{ id, name: form.name, image: form.image, speciality: form.speciality, degree: form.degree, experience: Number(form.experience)||0, about: form.about, fee: Number(form.fee)||0, address: { line1:'' } }, ...doctors]);
    setForm({ name:'', speciality:'', fee:'', degree:'', experience:'', about:'', image:'' });
  }

  return (
    <div className="py-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Add Doctor</h2>
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
            <input name="experience" value={form.experience} onChange={handleChange} type="number" min="0" className="w-full border rounded px-3 py-2 text-sm" />
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
          <label className="block text-sm font-medium mb-1">Image</label>
          <input name="image" type="file" accept="image/*" onChange={handleChange} required className="w-full text-sm" />
          {form.image && <img src={form.image} alt="preview" className="mt-2 w-24 h-24 object-cover rounded" />}
        </div>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded text-sm">Save</button>
      </form>
    </div>
  );
}
