import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import { useLibrary } from '../context/LibraryContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { validateLogin } from '../utils/validators';

const DEMO_ACCOUNTS = [
  { role: 'Admin', id: 'ADMIN001', password: 'admin123' },
  { role: 'Librarian', id: 'LIB001', password: 'lib12345' },
  { role: 'Member', id: 'MEM001', password: 'member123' },
];

export default function LoginPage() {
  useDocumentTitle('Sign in');
  const { currentUser, login } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ membershipId: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  if (currentUser) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateLogin(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    const result = login(values.membershipId, values.password);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    navigate(location.state?.from || '/', { replace: true });
  };

  const fillDemo = (account) => {
    setValues({ membershipId: account.id, password: account.password });
    setErrors({});
    setFormError('');
  };

  return (
    <div className="login">
      <section className="login__intro">
        <p className="login__kicker">Community Library</p>
        <h1>Know what is on the shelf.</h1>
        <p>
          Manage the catalogue, track every copy that comes in or goes out, and keep member
          accounts in one place.
        </p>
      </section>

      <section className="login__panel">
        <form className="card form" onSubmit={handleSubmit} noValidate>
          <h2>Sign in</h2>

          {formError && <p className="alert alert--error" role="alert">{formError}</p>}

          <FormField id="login-mid" label="Membership ID" error={errors.membershipId}>
            <input name="membershipId" value={values.membershipId} onChange={handleChange} autoComplete="username" autoFocus />
          </FormField>

          <FormField id="login-password" label="Password" error={errors.password}>
            <input name="password" type="password" value={values.password} onChange={handleChange} autoComplete="current-password" />
          </FormField>

          <div className="form__actions">
            <button type="submit" className="btn btn--primary btn--block">Sign in</button>
          </div>
        </form>

        <div className="demo">
          <p className="demo__title">Demo accounts</p>
          <ul>
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.id}>
                <button type="button" className="link-button" onClick={() => fillDemo(a)}>
                  {a.role}
                </button>
                <span className="cell-mono">{a.id} / {a.password}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
