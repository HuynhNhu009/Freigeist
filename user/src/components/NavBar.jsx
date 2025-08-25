import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black text-white px-6 py-3">
      <div className="flex justify-between items-center">
        <NavLink to="/" className="text-3xl font-bold italic">Freigeist</NavLink>

        {/* Hamburger Button for Mobile */}
        <button 
          className="md:hidden focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-2xl font-semibold">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "underline" : ""}
          >
            Home
          </NavLink>
          <NavLink 
            to="/diary" 
            className={({ isActive }) => isActive ? "underline" : ""}
          >
            My Diary
          </NavLink>
          <NavLink 
            to="/reminder" 
            className={({ isActive }) => isActive ? "underline" : ""}
          >
            Reminder
          </NavLink>
          <NavLink 
            to="/mood-chart" 
            className={({ isActive }) => isActive ? "underline" : ""}
          >
            Mood Chart
          </NavLink>
        </div>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center gap-4 text-lg font-semibold">
          {user ? (
            <NavLink to="/user-profile" title="Profile">
              <img
                src={user.avatar || 'https://i.pravatar.cc/150?img=1'}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            </NavLink>
          ) : (
            <>
              <NavLink to="/login" className="hover:underline">Login</NavLink>
              <span>|</span>
              <NavLink to="/register" className="hover:underline">Register</NavLink>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col gap-4 py-4 text-xl font-semibold">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "underline" : ""}
            onClick={toggleMenu}
          >
            Home
          </NavLink>
          <NavLink 
            to="/diary" 
            className={({ isActive }) => isActive ? "underline" : ""}
            onClick={toggleMenu}
          >
            My Diary
          </NavLink>
          <NavLink 
            to="/reminder" 
            className={({ isActive }) => isActive ? "underline" : ""}
            onClick={toggleMenu}
          >
            Reminder
          </NavLink>
          <NavLink 
            to="/mood-chart" 
            className={({ isActive }) => isActive ? "underline" : ""}
            onClick={toggleMenu}
          >
            Mood Chart
          </NavLink>
          
          {user ? (
            <NavLink 
              to="/user-profile" 
              className="flex items-center gap-2"
              onClick={toggleMenu}
            >
              <img
                src={user.avatar || 'https://i.pravatar.cc/150?img=1'}
                alt="Avatar"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
              <span>Profile</span>
            </NavLink>
          ) : (
            <div className="flex flex-col gap-4">
              <NavLink 
                to="/login" 
                className="hover:underline"
                onClick={toggleMenu}
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className="hover:underline"
                onClick={toggleMenu}
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}