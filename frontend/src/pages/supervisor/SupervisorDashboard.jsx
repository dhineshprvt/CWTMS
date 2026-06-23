import { useEffect, useState } from 'react';
import StatCard from '../../components/common/StatCard';
import dashboardService from '../../services/dashboardService';

export default function SupervisorDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardService.supervisorStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h4 className="mb-4">Supervisor Dashboard</h4>
      <div className="row g-3">
        <div className="col-md-3"><StatCard label="Tasks Created" value={stats.totalTasksCreated} /></div>
        <div className="col-md-3"><StatCard label="Pending Review" value={stats.pendingReview} color="#fd7e14" /></div>
        <div className="col-md-3"><StatCard label="In Progress" value={stats.inProgress} color="#0d6efd" /></div>
        <div className="col-md-3"><StatCard label="Approved" value={stats.approved} color="#198754" /></div>
      </div>
      <p className="text-muted mt-4">
        Go to <strong>Manage Tasks</strong> to create new tasks, assign them to workers, and review submissions.
      </p>
    </div>
  );
}
