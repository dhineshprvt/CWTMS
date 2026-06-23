import { useEffect, useState } from 'react';
import TaskTable from '../../components/tasks/TaskTable';
import TaskForm from '../../components/tasks/TaskForm';
import SearchFilterBar from '../../components/common/SearchFilterBar';
import ReviewModal from '../../components/tasks/ReviewModal';
import TaskHistoryModal from '../../components/tasks/TaskHistoryModal';
import taskService from '../../services/taskService';

export default function ManageTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [reviewTask, setReviewTask] = useState(null);
  const [reviewAttachments, setReviewAttachments] = useState([]);
  const [reviewHistory, setReviewHistory] = useState([]);
  const [historyTask, setHistoryTask] = useState(null);
  const [historyAttachments, setHistoryAttachments] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.category) params.category = filters.category;
    if (filters.keyword) params.keyword = filters.keyword;
    taskService.search(params).then((res) => setTasks(res.data)).catch(() => setTasks([]));
  };

  useEffect(() => { load(); }, [filters]);

  const handleCreate = async (form) => {
    setError('');
    try {
      await taskService.create(form);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task.');
    }
  };

  const handleUpdate = async (form) => {
    setError('');
    try {
      await taskService.update(editingTask.id, form);
      setEditingTask(null);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update task.');
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    await taskService.remove(task.id);
    load();
  };

  const openReview = async (task) => {
    const [att, hist] = await Promise.all([
      taskService.attachments(task.id),
      taskService.history(task.id),
    ]);
    setReviewAttachments(att.data);
    setReviewHistory(hist.data);
    setReviewTask(task);
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

  const handleDecision = async (decision, remarks) => {
    await taskService.review(reviewTask.id, decision, remarks);
    setReviewTask(null);
    load();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Manage Tasks</h4>
        <button className="btn btn-primary" onClick={() => { setEditingTask(null); setShowForm(true); }}>
          + New Task
        </button>
      </div>

      <SearchFilterBar filters={filters} onChange={setFilters} />

      {showForm && (
        <div className="mb-4">
          {error && <div className="alert alert-danger">{error}</div>}
          <TaskForm
            initialValue={editingTask}
            onSubmit={editingTask ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditingTask(null); }}
          />
        </div>
      )}

      <TaskTable
        tasks={tasks}
        role="SUPERVISOR"
        onEdit={(t) => { setEditingTask(t); setShowForm(true); }}
        onDelete={handleDelete}
        onReview={openReview}
        onViewHistory={openHistory}
      />

      {reviewTask && (
        <ReviewModal
          task={reviewTask}
          attachments={reviewAttachments}
          history={reviewHistory}
          onDecision={handleDecision}
          onClose={() => setReviewTask(null)}
        />
      )}

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
