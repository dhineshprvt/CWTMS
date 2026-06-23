import { useEffect, useState } from 'react';
import UserTable from '../../components/users/UserTable';
import UserForm from '../../components/users/UserForm';
import userService from '../../services/userService';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    userService.getAll(roleFilter || undefined)
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  };

  useEffect(() => { load(); }, [roleFilter]);

  const handleCreate = async (form) => {
    setError('');
    try {
      await userService.create(form);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create user.');
    }
  };

  const handleUpdate = async (form) => {
    setError('');
    try {
      await userService.update(editingUser.id, form);
      setEditingUser(null);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update user.');
    }
  };

  const handleDelete = async (user) => {
    setError('');
    try {
      await userService.update(user.id, {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: 'INACTIVE'
      });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not deactivate user.');
    }
  };

  const handlePermanentDelete = async (user) => {
    setError('');
    try {
      await userService.remove(user.id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not permanently delete user.');
    }
  };

  const handleActivate = async (user) => {
    setError('');
    try {
      await userService.update(user.id, {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: 'ACTIVE'
      });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not activate user.');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Manage Users</h4>
        <button className="btn btn-primary" onClick={() => { setEditingUser(null); setShowForm(true); }}>
          + New User
        </button>
      </div>

      <select className="form-select mb-3" style={{ maxWidth: 220 }}
              value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
        <option value="">All Roles</option>
        <option value="SUPERVISOR">Supervisor</option>
        <option value="WORKER">Worker</option>
        <option value="ADMIN">Admin</option>
      </select>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {showForm && (
        <div className="mb-4">
          <UserForm
            initialValue={editingUser}
            onSubmit={editingUser ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditingUser(null); }}
          />
        </div>
      )}

      <UserTable
        users={users}
        onEdit={(u) => { setEditingUser(u); setShowForm(true); }}
        onDelete={handleDelete}
        onActivate={handleActivate}
        onPermanentDelete={handlePermanentDelete}
      />
    </div>
  );
}
