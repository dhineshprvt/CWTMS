import { useEffect, useState } from 'react';
import StatCard from '../../components/common/StatCard';
import dashboardService from '../../services/dashboardService';
import { translate } from '../../utils/translations';

export default function WorkerDashboard() {
  const [stats, setStats] = useState(null);
  const [lang, setLang] = useState(localStorage.getItem('cwtms_lang') || 'en');

  useEffect(() => {
    dashboardService.workerStats().then((res) => setStats(res.data));

    const handler = () => {
      setLang(localStorage.getItem('cwtms_lang') || 'en');
    };
    window.addEventListener('cwtms_lang_change', handler);
    return () => window.removeEventListener('cwtms_lang_change', handler);
  }, []);

  if (!stats) return <p className="text-muted p-3">{translate('loading', lang)}</p>;

  const total = stats.assigned + stats.inProgress + stats.submitted + stats.approved;
  const completed = stats.approved;
  const rate = total === 0 ? 0 : Math.round((completed * 100) / total);

  return (
    <div>
      <h4 className="mb-4">{translate('myDashboard', lang)}</h4>
      
      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-semibold text-muted small">{translate('taskProgress', lang)}</span>
          <span className="fw-bold text-primary">{rate}% ({completed}/{total} {translate('tasksApproved', lang)})</span>
        </div>
        <div className="progress" style={{ height: '12px' }}>
          <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" 
               role="progressbar" 
               style={{ width: `${rate}%` }} 
               aria-valuenow={rate} 
               aria-valuemin="0" 
               aria-valuemax="100"></div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-3"><StatCard label={translate('assignedCount', lang)} value={stats.assigned} /></div>
        <div className="col-md-3"><StatCard label={translate('inProgressCount', lang)} value={stats.inProgress} color="#0d6efd" /></div>
        <div className="col-md-3"><StatCard label={translate('submittedCount', lang)} value={stats.submitted} color="#fd7e14" /></div>
        <div className="col-md-3"><StatCard label={translate('approvedCount', lang)} value={stats.approved} color="#198754" /></div>
      </div>
      <p className="text-muted mt-4">
        {translate('goMyTasks', lang)}
      </p>
    </div>
  );
}

