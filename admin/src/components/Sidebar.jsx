import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-1/5 min-h-screen w-64 bg-blue-900 text-white flex flex-col justify-between p-4">
      <div>
        <h1 className="text-3xl font-bold mb-6">Freigeist</h1>
        <nav>
          <NavLink
            to="/user"
            className={({ isActive }) =>
              `block mb-4 text-2xl ${isActive ? 'text-blue-200 font-bold' : 'text-white hover:underline'}`
            }
          >
            User
          </NavLink>
          <NavLink
            to="/report"
            className={({ isActive }) =>
              `block mb-4 text-2xl ${isActive ? 'text-blue-200 font-bold' : 'text-white hover:underline'}`
            }
          >
            Report
          </NavLink>
          <NavLink
            to="/feedback"
            className={({ isActive }) =>
              `block mb-4 text-2xl ${isActive ? 'text-blue-200 font-bold' : 'text-white hover:underline'}`
            }
          >
            Feedback
          </NavLink>
        </nav>
      </div>
      <div className="mt-12">
        <NavLink
          to="/logout"
          className={({ isActive }) =>
            `block ${isActive ? 'text-blue-200 font-bold text-3xl' : 'text-white hover:underline'}`}
        >
          Logout
        </NavLink>
      </div>
    </div>
  );
}