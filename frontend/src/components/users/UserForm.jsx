import { useEffect, useState } from 'react';

const EMPTY = { username: '', password: '', fullName: '', email: '', phone: '', role: 'WORKER', status: 'ACTIVE' };

export default function UserForm({ initialValue, onSubmit, onCancel }) {
  const isEdit = Boolean(initialValue);
  const [form, setForm] = useState(initialValue || EMPTY);

  useEffect(() => {
    if (initialValue) setForm({ ...EMPTY, ...initialValue });
  }, [initialValue]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="bg-white p-4 rounded shadow-sm">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Full Name</label>
          <input className="form-control" required value={form.fullName}
                 onChange={(e) => update('fullName', e.target.value)} />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Username</label>
          <input className="form-control" required disabled={isEdit} value={form.username}
                 onChange={(e) => update('username', e.target.value)} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" required value={form.email}
                 onChange={(e) => update('email', e.target.value)} />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Phone</label>
          <input className="form-control" value={form.phone || ''}
                 onChange={(e) => update('phone', e.target.value)} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Role</label>
          <select className="form-select" value={form.role} onChange={(e) => update('role', e.target.value)}>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="WORKER">Worker</option>
          </select>
        </div>
        {!isEdit && (
          <div className="col-md-6 mb-3">
            <label className="form-label">Temporary Password</label>
            <input className="form-control" required minLength={6} value={form.password}
                   onChange={(e) => update('password', e.target.value)} />
          </div>
        )}
      </div>

      {isEdit && (
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => update('status', e.target.value)}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">New Password (leave blank to keep unchanged)</label>
            <input className="form-control" minLength={6} placeholder="Enter new password" value={form.password || ''}
                   onChange={(e) => update('password', e.target.value)} />
          </div>
        </div>
      )}

      <div className="d-flex gap-2 justify-content-end">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save User</button>
      </div>
    </form>
  );
}
