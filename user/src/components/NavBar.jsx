import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className="bg-black text-white flex justify-between items-center px-6 py-3">
      <NavLink to="/" className="text-3xl font-bold italic">Freigeist</NavLink>

      <div className="flex gap-6 text-2xl font-semibold">
        <NavLink to="/" className={({ isActive }) => isActive ? "underline" : ""}>Home</NavLink>
        <NavLink to="/diary" className={({ isActive }) => isActive ? "underline" : ""}>My Diary</NavLink>
        <NavLink to="/reminder" className={({ isActive }) => isActive ? "underline" : ""}>Reminder</NavLink>
        <NavLink to="/mood-chart" className={({ isActive }) => isActive ? "underline" : ""}>Mood Chart</NavLink>
      </div>

      <div className="text-lg font-semibold flex items-center gap-4">
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
            <NavLink to="/login" className="hover:underline text-lg">Đăng nhập</NavLink>
            <NavLink to="/register" className="hover:underline text-lg">Đăng ký</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
