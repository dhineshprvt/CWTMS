export default function UserTable({ users, onEdit, onDelete, onActivate, onPermanentDelete }) {
  return (
    <div className="table-responsive bg-white rounded shadow-sm">
      <table className="table align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr><td colSpan={6} className="text-center text-muted py-4">No users found.</td></tr>
          )}
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.fullName}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td><span className="badge bg-secondary">{u.role}</span></td>
              <td>
                <span className={`badge ${u.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>
                  {u.status}
                </span>
              </td>
              <td className="d-flex gap-1">
                <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(u)}>Edit</button>
                {u.status === 'ACTIVE' ? (
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(u)}>Deactivate</button>
                ) : (
                  <button className="btn btn-sm btn-outline-success" onClick={() => onActivate(u)}>Activate</button>
                )}
                {u.role !== 'ADMIN' && (
                  <button className="btn btn-sm btn-danger ms-1" onClick={() => {
                    if (window.confirm(`Are you sure you want to PERMANENTLY delete user "${u.fullName}"? All their files, notifications, and tasks will be deleted or reassigned. This action cannot be undone.`)) {
                      onPermanentDelete(u);
                    }
                  }}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
