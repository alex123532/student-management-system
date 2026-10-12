import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { LibraryProvider } from './context/LibraryContext';
import { ToastProvider } from './context/ToastContext';
import BooksPage from './pages/BooksPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import TransactionsPage from './pages/TransactionsPage';
import UsersPage from './pages/UsersPage';

// HashRouter keeps routes working on GitHub Pages (no server-side rewrites needed).
export default function App() {
  return (
    <LibraryProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<DashboardPage />} />

                <Route element={<ProtectedRoute roles={['admin', 'librarian']} />}>
                  <Route path="books" element={<BooksPage />} />
                  <Route path="transactions" element={<TransactionsPage />} />
                </Route>

                <Route element={<ProtectedRoute roles={['admin']} />}>
                  <Route path="users" element={<UsersPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>
        </HashRouter>
      </ToastProvider>
    </LibraryProvider>
  );
}
