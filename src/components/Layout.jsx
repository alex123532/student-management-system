import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { ROLE_LABELS } from '../utils/constants';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', roles: ['admin', 'librarian', 'member'], end: true },
  { to: '/books', label: 'Books', roles: ['admin', 'librarian'] },
  { to: '/transactions', label: 'Transactions', roles: ['admin', 'librarian'] },
  { to: '/users', label: 'Users', roles: ['admin'] },
];

export default function Layout() {
  const { currentUser, logout } = useLibrary();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="topbar">
        <div className="topbar__inner">
          <NavLink to="/" className="brand" aria-label="Community Library home">
            <span className="brand__mark" aria-hidden="true">CL</span>
            <span className="brand__name">Community Library</span>
          </NavLink>

          <nav className="nav" aria-label="Main">
            {NAV_ITEMS.filter((item) => item.roles.includes(currentUser.role)).map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className="nav__link">
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="account">
            <div className="account__who">
              <span className="account__name">{currentUser.name}</span>
              <span className="account__role">{ROLE_LABELS[currentUser.role]}</span>
            </div>
            <button type="button" className="btn btn--ghost-light" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <p>Community Library Management System. Data is saved in this browser only.</p>
      </footer>
    </div>
  );
}
