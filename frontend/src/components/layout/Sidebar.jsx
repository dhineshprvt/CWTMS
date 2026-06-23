import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaTasks, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const LINKS = {
  ADMIN: [
    { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/admin/users', label: 'Manage Users', icon: <FaUsers /> },
  ],
  SUPERVISOR: [
    { to: '/supervisor', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/supervisor/tasks', label: 'Manage Tasks', icon: <FaTasks /> },
    { to: '/supervisor/reports', label: 'Reports', icon: <FaChartBar /> },
  ],
  WORKER: [
    { to: '/worker', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/worker/tasks', label: 'My Tasks', icon: <FaTasks /> },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const links = LINKS[user?.role] || [];

  return (
    <div className="cwtms-sidebar d-flex flex-column">
      <div className="p-3 fw-bold fs-5 border-bottom border-secondary">CWTMS</div>
      <div className="flex-grow-1">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end className="d-flex align-items-center gap-2">
            {link.icon} {link.label}
          </NavLink>
        ))}
      </div>
      <button onClick={logout} className="btn btn-link text-start d-flex align-items-center gap-2"
              style={{ color: '#cbd5e1', padding: '12px 20px' }}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}
