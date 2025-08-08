import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './pages/home';
import Contact from './pages/contact';
import Login from './pages/Login';
import About from './pages/About';
import AllDoctors from './pages/AllDoctors';
import Doctor from './pages/Doctor'; 
import MyProfile from './pages/MyProfile';
import MyAppointment from './pages/MyAppointment';
import Appointment from './pages/Appointment';
import Header from  './components/Header'
import AppContextProvider from './context/AppContext';
import TopDoctors from './components/TopDoctors';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import footer from './components/footer';

const App = () => {
  return (
    <AppContextProvider>
    <div className='mx-4 sm:mx-[10%]'>
      
      <Navbar/>
     
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/header' element={<Header/>}/>
        <Route path='/banner' element={<Banner/>}/>
        <Route path='/top-doctors' element={<TopDoctors/>}/> 
        <Route path="/doctor/" element={<AllDoctors />} />
        <Route path='/doctors/:speciality' element={<Doctor/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/My-profile' element={<MyProfile/>} />
        <Route path='/MyAppointment' element={<MyAppointment/>} />
        <Route path='/Appointment' element={<Appointment/>} /> 
         
      </Routes>
      
        <footer/> 

    </div> 
</AppContextProvider>
  );
} ;

export default App
