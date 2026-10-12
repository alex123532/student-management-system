import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';

// Redirects to /login when signed out, and to the dashboard when the user's
// role is not allowed on this route.
export default function ProtectedRoute({ roles }) {
  const { currentUser } = useLibrary();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
