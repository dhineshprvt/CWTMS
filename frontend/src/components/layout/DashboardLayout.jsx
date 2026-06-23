import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <Topbar />
      <div className="cwtms-content">
        <Outlet />
      </div>
    </div>
  );
}
