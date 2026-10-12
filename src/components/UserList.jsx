import EmptyState from './EmptyState';
import { ROLE_LABELS } from '../utils/constants';

export default function UserList({ users, currentUserId, editingId, onUpdate, onDelete }) {
  if (users.length === 0) return <EmptyState title="No users yet">Add the first user with the form above.</EmptyState>;

  return (
    <div className="table-wrap">
      <table className="table table--stack">
        <thead>
          <tr>
            <th>Name</th>
            <th>Membership ID</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className={u.id === editingId ? 'row--editing' : undefined}>
              <td data-label="Name" className="cell-title">
                {u.name} {u.id === currentUserId && <span className="tag tag--you">You</span>}
              </td>
              <td data-label="Membership ID" className="cell-mono">{u.membershipId}</td>
              <td data-label="Role"><span className={`tag tag--role-${u.role}`}>{ROLE_LABELS[u.role]}</span></td>
              <td data-label="Actions">
                <div className="row-actions">
                  <button type="button" className="btn btn--small btn--ghost" onClick={() => onUpdate(u)}>Update</button>
                  <button
                    type="button"
                    className="btn btn--small btn--danger-ghost"
                    onClick={() => onDelete(u)}
                    disabled={u.id === currentUserId}
                    title={u.id === currentUserId ? 'You cannot delete your own account' : undefined}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
