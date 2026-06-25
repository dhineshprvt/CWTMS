import { useEffect, useState } from 'react';
import { CATEGORY_LABELS } from '../../utils/statusColors';
import taskService from '../../services/taskService';

const EMPTY = { title: '', description: '', category: 'CLASSROOM_CLEANING', customCategory: '', priority: 'MEDIUM', location: '', assignedToId: '', dueDate: '' };

export default function TaskForm({ initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValue || EMPTY);
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    taskService.getWorkers().then((res) => setWorkers(res.data)).catch(() => setWorkers([]));
  }, []);

  useEffect(() => {
    if (initialValue) setForm({ ...EMPTY, ...initialValue });
  }, [initialValue]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      assignedToId: form.assignedToId ? Number(form.assignedToId) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
      <div className="mb-3">
        <label className="form-label">Title <span className="text-danger">*</span></label>
        <input className="form-control" required value={form.title}
               onChange={(e) => update('title', e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Description <span className="text-danger">*</span></label>
        <textarea className="form-control" rows={3} required value={form.description}
                  onChange={(e) => update('description', e.target.value)} />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Category <span className="text-danger">*</span></label>
          <select className="form-select" required value={form.category}
                  onChange={(e) => update('category', e.target.value)}>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        {form.category === 'OTHER' && (
          <div className="col-md-6 mb-3">
            <label className="form-label">Category Name <span className="text-danger">*</span></label>
            <input className="form-control" required value={form.customCategory || ''}
                   onChange={(e) => update('customCategory', e.target.value)}
                   placeholder="Enter custom category name" />
          </div>
        )}
        <div className={form.category === 'OTHER' ? "col-md-12 mb-3" : "col-md-6 mb-3"}>
          <label className="form-label">Location <span className="text-danger">*</span></label>
          <input className="form-control" required value={form.location}
                 onChange={(e) => update('location', e.target.value)} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">Assign To <span className="text-danger">*</span></label>
          <select className="form-select" required value={form.assignedToId || ''}
                  onChange={(e) => update('assignedToId', e.target.value)}>
            <option value="">Select Worker...</option>
            {workers.filter(w => w.status === 'ACTIVE').map((w) => (
              <option key={w.id} value={w.id}>{w.fullName}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Priority <span className="text-danger">*</span></label>
          <select className="form-select" required value={form.priority}
                  onChange={(e) => update('priority', e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Due Date <span className="text-danger">*</span></label>
          <input type="date" className="form-control" required value={form.dueDate || ''}
                 onChange={(e) => update('dueDate', e.target.value)} />
        </div>
      </div>

      <div className="d-flex gap-2 justify-content-end">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Task</button>
      </div>
    </form>
  );
}
