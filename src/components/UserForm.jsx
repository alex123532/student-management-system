import { useEffect, useState } from 'react';
import FormField from './FormField';
import { ROLE_LABELS } from '../utils/constants';
import { validateUser } from '../utils/validators';

const EMPTY = { name: '', membershipId: '', role: 'member', password: '' };

export default function UserForm({ editingUser, onSubmit, onCancel }) {
  const isEditing = Boolean(editingUser);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(
      editingUser
        ? { name: editingUser.name, membershipId: editingUser.membershipId, role: editingUser.role, password: '' }
        : EMPTY,
    );
    setErrors({});
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateUser(values, { isEditing });
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    const result = onSubmit(values);
    if (!result.ok) {
      setErrors({ [result.field || 'name']: result.error });
      return;
    }
    if (!isEditing) setValues(EMPTY);
  };

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>{isEditing ? 'Update user' : 'Add a new user'}</h2>

      <div className="form__grid">
        <FormField id="user-name" label="Full name" error={errors.name}>
          <input name="name" value={values.name} onChange={handleChange} autoComplete="off" />
        </FormField>

        <FormField id="user-mid" label="Membership ID" error={errors.membershipId} hint="Used to sign in, e.g. MEM010">
          <input name="membershipId" value={values.membershipId} onChange={handleChange} autoComplete="off" />
        </FormField>

        <FormField id="user-role" label="Role" error={errors.role}>
          <select name="role" value={values.role} onChange={handleChange}>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </FormField>

        <FormField
          id="user-password"
          label={isEditing ? 'New password' : 'Password'}
          error={errors.password}
          hint={isEditing ? 'Leave blank to keep the current password.' : 'At least 6 characters.'}
        >
          <input name="password" type="password" value={values.password} onChange={handleChange} autoComplete="new-password" />
        </FormField>
      </div>

      <div className="form__actions">
        <button type="submit" className="btn btn--primary">{isEditing ? 'Save changes' : 'Add user'}</button>
        {isEditing && <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
