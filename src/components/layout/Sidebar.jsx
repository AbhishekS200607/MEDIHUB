import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Calendar, Users, Activity, LogOut, Stethoscope, BarChart3 } from 'lucide-react';

export const Sidebar = () => {
  const { userProfile, logout } = useAuth();

  const patientLinks = [
    { to: '/patient', icon: Home, label: 'Dashboard' },
    { to: '/patient/find-doctor', icon: Stethoscope, label: 'Find Doctor' },
    { to: '/patient/bookings', icon: Calendar, label: 'My Bookings' }
  ];

  const doctorLinks = [
    { to: '/doctor', icon: Activity, label: 'Live Queue' },
    { to: '/doctor/desk', icon: Stethoscope, label: 'Consultation Desk' }
  ];

  const adminLinks = [
    { to: '/admin', icon: BarChart3, label: 'Analytics' },
    { to: '/admin/staff', icon: Users, label: 'Staff Management' }
  ];

  const links = userProfile?.role === 'patient' ? patientLinks
    : userProfile?.role === 'doctor' ? doctorLinks
    : adminLinks;

  return (
    <div className="w-64 bg-white border-r border-clinical-200 h-screen flex flex-col">
      <div className="p-6 border-b border-clinical-200">
        <h1 className="text-2xl font-bold text-primary-600">MediHub</h1>
        <p className="text-sm text-clinical-500 mt-1">{userProfile?.name}</p>
      </div>
      
      <nav className="flex-1 p-4">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive ? 'bg-primary-50 text-primary-700' : 'text-clinical-600 hover:bg-clinical-50'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-clinical-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-clinical-600 hover:bg-clinical-50 w-full transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
