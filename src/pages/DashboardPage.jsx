import { useMemo } from 'react';
import BookFilters from '../components/BookFilters';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StockBadge, { stockLevel } from '../components/StockBadge';
import { useLibrary } from '../context/LibraryContext';
import { useBookFilters } from '../hooks/useBookFilters';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { LOW_STOCK_THRESHOLD } from '../utils/constants';

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  const { books, currentUser } = useLibrary();
  const filters = useBookFilters(books);

  const stats = useMemo(() => {
    const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0);
    const low = books.filter((b) => b.quantity > 0 && b.quantity < LOW_STOCK_THRESHOLD).length;
    const out = books.filter((b) => b.quantity === 0).length;
    return { titles: books.length, totalCopies, low, out };
  }, [books]);

  const needsAttention = stats.low + stats.out;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${currentUser.name.split(' ')[0]}. Here is what is on the shelves right now.`}
      />

      <section className="stats" aria-label="Library summary">
        <StatCard label="Book titles" value={stats.titles} />
        <StatCard label="Copies in stock" value={stats.totalCopies} />
        <StatCard label="Low stock" value={stats.low} tone={stats.low ? 'warn' : 'neutral'} />
        <StatCard label="Out of stock" value={stats.out} tone={stats.out ? 'danger' : 'neutral'} />
      </section>

      {needsAttention > 0 && (
        <p className="alert alert--warn" role="status">
          {needsAttention} {needsAttention === 1 ? 'title has' : 'titles have'} fewer than {LOW_STOCK_THRESHOLD} copies
          and may need restocking. Highlighted rows below.
        </p>
      )}

      <section className="card">
        <h2>Book availability</h2>
        <BookFilters
          query={filters.query}
          onQuery={filters.setQuery}
          genre={filters.genre}
          onGenre={filters.setGenre}
          genres={filters.genres}
          lowOnly={filters.lowOnly}
          onLowOnly={filters.setLowOnly}
        />

        {filters.filtered.length === 0 ? (
          <EmptyState title="No matching books">Try a different search or clear the filters.</EmptyState>
        ) : (
          <div className="table-wrap">
            <table className="table table--stack">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th className="num">Copies</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filters.filtered.map((b) => (
                  <tr key={b.id} className={`row--${stockLevel(b.quantity)}`}>
                    <td data-label="Title" className="cell-title">{b.title}</td>
                    <td data-label="Author">{b.author}</td>
                    <td data-label="Genre">{b.genre}</td>
                    <td data-label="Copies" className="num">{b.quantity}</td>
                    <td data-label="Status"><StockBadge quantity={b.quantity} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
