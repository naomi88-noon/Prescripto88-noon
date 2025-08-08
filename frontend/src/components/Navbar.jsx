import React, { useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
// import imageName  from "../assets/assets/assets_frontend/profile_pic.png"
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false)
  const [token, setToken] = useState(true)
  return (
    <div className="flex w-full items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
      <ul className='hidden md:flex items-start gap-5 font-meduim'>
        <NavLink to='/' className="active">
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-white w-3/5 m-auto hidden ' />
        </NavLink>
        <NavLink to='/doctor'>
          <li className='py-1'>All DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-white w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-white w-3/5 m-auto hidden' />
        </NavLink >
        <NavLink to='/contact'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-white w-3/5 m-auto hidden' />
        </NavLink>

      </ul>
      <div className='flex items-center gap-4'>
        {
          token ? <div className='flex intems-center gap-2 cursor pointer group relative'>
            <img className='w-8 rounded-full' src={assets.profile_pic} alt="" />
            <img className='w-2.5' src={assets.dropdown_icon} alt="" />
            <div className='absolute top-0 right-0 pt-14 text-base font-meduim text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4' >
                <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                <p onClick={() => navigate('MyAppointment')} className='hover:text-black cursor-pointer'>My Appointment</p>
                <p onClick={() => setToken(false)} className='hover:text-black cursor-pointer'>Logout</p>
                <p onClick={() => navigate('Appointment')} className='hover:text-black cursor-pointer'>Appointment</p>

              </div>
            </div>
          </div>
            : <button onClick={() => { localStorage.removeItem("token"); navigate('/logout') }} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block' > Create Account </button>
        }

        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

      </div>

      <div className={`${showMenu ? 'fixed w-full' : 'hidden'}`} >
        {/* ----------- Mobile Menu   ----------------- */}
        <div className={`${showMenu ? 'fixed w-full' : 'left-0 w-0'}  right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex item-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt="" />
            <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className='flex flex-col item-center gap-2 mt-5 px-5 text-lg font-medium '>
            <NavLink to='/'><p className='px-4 py-2 rounded  inline-block' onClick={() => setShowMenu(false)}>Home</p></NavLink>
            <NavLink to='/doctor'><p className='px-4 py-2 rounded  inline-block' onClick={() => setShowMenu(false)}>ALL DOCTORS</p></NavLink>
            <NavLink to='/about'><p className='px-4 py-2 rounded  inline-block' onClick={() => setShowMenu(false)}>ABOUT</p></NavLink>
            <NavLink to='/contact'><p className='px-4 py-2 rounded  inline-block' onClick={() => setShowMenu(false)}>CONTACT</p></NavLink>
          </ul>
        </div>
      </div>


    </div>
  )
}

export default Navbar
