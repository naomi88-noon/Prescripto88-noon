import React, { useState, useContext, useEffect } from 'react';
import { assets } from '../assets/assets_frontend/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { user, setUser, isAdmin, loginDemo, searchTerm, setSearchTerm } = useContext(AppContext);

  // Load user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && !user) {
      setUser(JSON.parse(storedUser));
    }
  }, [user, setUser]);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <div className="flex w-full items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img onClick={() => navigate('/')} className="w-44 cursor-pointer" src={assets.logo} alt="Logo" />
      
      <ul className="hidden md:flex items-center gap-6 font-medium">
        <NavLink to="/" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'hover:text-primary'}>Home</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'hover:text-primary'}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'hover:text-primary'}>Contact</NavLink>
        {user && <NavLink to="/doctors" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'hover:text-primary'}>Doctors</NavLink>}
        {isAdmin && <NavLink to="/admin/overview" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'hover:text-primary'}>Admin</NavLink>}
      </ul>

      {/* Show search bar only if user is authenticated */}
      {user && (
        <div className="hidden md:block w-56">
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search doctors..."
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 h-8 object-cover rounded-full ring-1 ring-primary/30"
              src={user.image || assets.profile_pic}
              alt={user.name}
              crossOrigin="anonymous"
            />
            <img className="w-2.5" src={assets.dropdown_icon} alt="dropdown" />
            <div className="absolute top-0 right-0 pt-14 text-sm font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-white border rounded-md shadow-xl flex flex-col gap-2 p-4">
                <p className="text-xs text-gray-500">{user.name} ({user.role})</p>
                <button onClick={() => navigate('/my-profile')} className="text-left hover:text-primary">My Profile</button>
                <button onClick={() => navigate('/doctors')} className="text-left hover:text-primary">View Doctors</button>
                <button onClick={() => navigate('/my-appointments')} className="text-left hover:text-primary">My Appointments</button>
                {isAdmin && <button onClick={() => navigate('/admin/overview')} className="text-left hover:text-primary">Admin Dashboard</button>}
                <button
                  onClick={() => { logout(); setShowMenu(false); navigate('/'); }}
                  className="text-left text-red-500 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => loginDemo('ADMIN')} className="px-4 py-2 text-sm border rounded hover:bg-gray-50">Demo Admin</button>
            <button onClick={() => navigate('/login')} className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium">Register</button>
          </div>
        )}
        <img onClick={() => setShowMenu(true)} className="w-6 md:hidden" src={assets.menu_icon} alt="menu" />
      </div>

      {/* Mobile Menu */}
      <div className={`${showMenu ? 'fixed w-full' : 'hidden'}`}>
        <div className={`${showMenu ? 'fixed w-full right-0' : 'left-0 w-0'} top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="Logo" />
            <img className="w-7" onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="close" />
          </div>
          <div className="px-5">
            {/* Mobile search bar visible only if user is logged in */}
            {user && (
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search doctors..."
                className="w-full mb-4 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            )}
            <ul className="flex flex-col items-start gap-1 mt-2 text-base font-medium">
              <NavLink to="/" onClick={() => setShowMenu(false)} className="px-3 py-2 rounded hover:bg-gray-100 w-full">Home</NavLink>
              <NavLink to="/about" onClick={() => setShowMenu(false)} className="px-3 py-2 rounded hover:bg-gray-100 w-full">About</NavLink>
              <NavLink to="/contact" onClick={() => setShowMenu(false)} className="px-3 py-2 rounded hover:bg-gray-100 w-full">Contact</NavLink>
              {user && <NavLink to="/doctors" onClick={() => setShowMenu(false)} className="px-3 py-2 rounded hover:bg-gray-100 w-full">Doctors</NavLink>}
              {isAdmin && <NavLink to="/admin/overview" onClick={() => setShowMenu(false)} className="px-3 py-2 rounded hover:bg-gray-100 w-full">Admin</NavLink>}

              {!user && (
                <>
                  <button
                    onClick={() => { loginDemo('ADMIN'); setShowMenu(false); }}
                    className="mt-1 px-3 py-2 border rounded w-full"
                  >
                    Demo Admin
                  </button>
                  <button
                    onClick={() => { navigate('/login'); setShowMenu(false); }}
                    className="mt-1 px-3 py-2 border rounded w-full"
                  >
                    Register
                  </button>
                </>
              )}

              {user && (
                <button
                  onClick={() => { logout(); setShowMenu(false); navigate('/'); }}
                  className="mt-3 text-left text-red-500 text-sm w-full"
                >
                  Logout
                </button>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
