import { useRef, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import PageHeader from '../components/PageHeader';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import { useLibrary } from '../context/LibraryContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function UsersPage() {
  useDocumentTitle('Users');
  const { users, currentUser, addUser, updateUser, deleteUser, resetDemoData } = useLibrary();
  const { showToast } = useToast();
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = (values) => {
    if (editingUser) {
      const result = updateUser(editingUser.id, values);
      if (result.ok) {
        showToast(`Updated ${values.name.trim()}.`);
        setEditingUser(null);
      }
      return result;
    }
    const result = addUser(values);
    if (result.ok) showToast(`Added ${values.name.trim()}.`);
    return result;
  };

  const handleStartEdit = (user) => {
    setEditingUser(user);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleConfirmDelete = () => {
    const result = deleteUser(userToDelete.id);
    if (result.ok) {
      if (editingUser && editingUser.id === userToDelete.id) setEditingUser(null);
      showToast(`Deleted ${userToDelete.name}.`);
    } else {
      showToast(result.error, 'error');
    }
    setUserToDelete(null);
  };

  return (
    <>
      <PageHeader title="Users" description="Add library staff and members, change their details or roles, and remove old accounts." />

      <div ref={formRef} className="scroll-anchor">
        <UserForm editingUser={editingUser} onSubmit={handleSubmit} onCancel={() => setEditingUser(null)} />
      </div>

      <section className="card">
        <h2>All users ({users.length})</h2>
        <UserList
          users={users}
          currentUserId={currentUser.id}
          editingId={editingUser?.id}
          onUpdate={handleStartEdit}
          onDelete={setUserToDelete}
        />
      </section>

      <section className="card card--quiet">
        <h2>Reset demo data</h2>
        <p>Clears every book, user and transaction saved in this browser and restores the sample data.</p>
        <button type="button" className="btn btn--danger-ghost" onClick={() => setConfirmReset(true)}>
          Reset all data
        </button>
      </section>

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Delete this user?"
        message={userToDelete ? `${userToDelete.name} (${userToDelete.membershipId}) will no longer be able to sign in.` : ''}
        confirmLabel="Delete user"
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
      />
      <ConfirmDialog
        open={confirmReset}
        title="Reset all data?"
        message="Everything you added or changed will be lost and you will be signed out."
        confirmLabel="Reset data"
        onConfirm={resetDemoData}
        onCancel={() => setConfirmReset(false)}
      />
    </>
  );
}
