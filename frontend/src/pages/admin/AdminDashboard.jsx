import { useEffect, useState } from 'react';
import StatCard from '../../components/common/StatCard';
import dashboardService from '../../services/dashboardService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardService.adminStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h4 className="mb-4">Admin Dashboard</h4>
      <div className="row g-3">
        <div className="col-md-3"><StatCard label="Total Users" value={stats.totalUsers} /></div>
        <div className="col-md-3"><StatCard label="Supervisors" value={stats.totalSupervisors} color="#0d6efd" /></div>
        <div className="col-md-3"><StatCard label="Workers" value={stats.totalWorkers} color="#198754" /></div>
        <div className="col-md-3"><StatCard label="Active Accounts" value={stats.activeUsers} color="#fd7e14" /></div>
      </div>

      <div className="alert alert-info mt-4">
        As an Admin, you can create, update, and deactivate Supervisor and Worker accounts,
        assign roles, and reset passwords from the <strong>Manage Users</strong> page. Admins
        do not create or approve tasks — that is handled by Supervisors.
      </div>
    </div>
  );
}
