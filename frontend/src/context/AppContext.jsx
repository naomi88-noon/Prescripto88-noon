import React, { createContext, useState } from 'react'
import { doctors as seedDoctors } from '../assets/assets_frontend/assets'

export const AppContext = createContext();

// Map assets doctors to normalized schema expected by components
const mapToDomainDoctor = (d) => ({
  id: d._id,
  name: d.name,
  image: d.image,
  speciality: d.speciality,
  degree: d.degree,
  experience: d.experience,
  about: d.about,
  fee: d.fees,
  address: d.address,
});

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const [doctors, setDoctors] = useState(seedDoctors.map(mapToDomainDoctor));
  // rudimentary auth/user placeholder until real backend integration
  const [user, setUser] = useState(null); // { id, name, role }
  const [searchTerm, setSearchTerm] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  // Demo auth functions (replace with real API integration)
  const loginDemo = (role = 'PATIENT') => setUser({ id: 'demo', name: role === 'ADMIN' ? 'Admin User' : 'Demo User', role });
  const logout = () => setUser(null);

  const value = {
    doctors,
    setDoctors,
    currencySymbol,
    user,
    setUser,
    isAdmin,
    loginDemo,
    logout,
    searchTerm,
    setSearchTerm,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider