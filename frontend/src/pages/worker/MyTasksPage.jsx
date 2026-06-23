import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskTable from '../../components/tasks/TaskTable';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import TaskHistoryModal from '../../components/tasks/TaskHistoryModal';
import taskService from '../../services/taskService';
import { translate } from '../../utils/translations';

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({});
  const [historyTask, setHistoryTask] = useState(null);
  const [historyAttachments, setHistoryAttachments] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [lang, setLang] = useState(localStorage.getItem('cwtms_lang') || 'en');
  const navigate = useNavigate();

  const load = () => {
    taskService.myTasks().then((res) => setTasks(res.data)).catch(() => setTasks([]));
  };

  useEffect(() => {
    load();
    const handler = () => {
      setLang(localStorage.getItem('cwtms_lang') || 'en');
    };
    window.addEventListener('cwtms_lang_change', handler);
    return () => window.removeEventListener('cwtms_lang_change', handler);
  }, []);

  const filtered = tasks.filter((t) => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.keyword && !t.title.toLowerCase().includes(filters.keyword.toLowerCase())) return false;
    return true;
  });

  const handleStart = async (task) => {
    await taskService.updateStatus(task.id, 'IN_PROGRESS', 'Started work.');
    load();
  };

  const handleUpload = (task) => {
    navigate(`/worker/tasks/${task.id}/upload`);
  };

  const openHistory = async (task) => {
    try {
      const [att, hist] = await Promise.all([
        taskService.attachments(task.id),
        taskService.history(task.id),
      ]);
      setHistoryAttachments(att.data);
      setHistoryList(hist.data);
      setHistoryTask(task);
    } catch (err) {
      console.error('Could not load task history', err);
    }
  };

  const totalTasks = filtered.length;
  const approvedTasks = filtered.filter((t) => t.status === 'APPROVED').length;
  const rate = totalTasks === 0 ? 0 : Math.round((approvedTasks * 100) / totalTasks);

  return (
    <div>
      <h4 className="mb-4">{translate('myTasks', lang)}</h4>

      <div className="bg-white p-3 rounded shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-semibold text-muted small">{translate('taskSummary', lang)}</span>
          <span className="fw-bold text-success">{rate}% ({approvedTasks}/{totalTasks} {translate('tasksApproved', lang)})</span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div className="progress-bar bg-success" 
               role="progressbar" 
               style={{ width: `${rate}%` }} 
               aria-valuenow={rate} 
               aria-valuemin="0" 
               aria-valuemax="100"></div>
        </div>
      </div>

      <SearchFilterBar filters={filters} onChange={setFilters} />
      <TaskTable
        tasks={filtered}
        role="WORKER"
        onStart={handleStart}
        onUpload={handleUpload}
        onViewHistory={openHistory}
      />

      {historyTask && (
        <TaskHistoryModal
          task={historyTask}
          attachments={historyAttachments}
          history={historyList}
          onClose={() => setHistoryTask(null)}
        />
      )}
    </div>
  );
}

