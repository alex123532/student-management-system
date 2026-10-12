import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <div className="card empty">
      <p className="empty__title">That page does not exist</p>
      <p className="empty__text"><Link to="/">Go back to the dashboard</Link></p>
    </div>
  );
}
