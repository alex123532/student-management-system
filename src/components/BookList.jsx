import StockBadge from './StockBadge';
import EmptyState from './EmptyState';

export default function BookList({ books, editingId, onUpdate, onDelete }) {
  if (books.length === 0) {
    return <EmptyState title="No books found">Add a book with the form above, or clear your search.</EmptyState>;
  }

  return (
    <div className="table-wrap">
      <table className="table table--stack">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th className="num">Copies</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className={book.id === editingId ? 'row--editing' : undefined}>
              <td data-label="Title" className="cell-title">{book.title}</td>
              <td data-label="Author">{book.author}</td>
              <td data-label="Genre">{book.genre}</td>
              <td data-label="ISBN" className="cell-mono">{book.isbn}</td>
              <td data-label="Copies" className="num">
                {book.quantity} <StockBadge quantity={book.quantity} />
              </td>
              <td data-label="Actions">
                <div className="row-actions">
                  <button type="button" className="btn btn--small btn--ghost" onClick={() => onUpdate(book)}>
                    Update
                  </button>
                  <button type="button" className="btn btn--small btn--danger-ghost" onClick={() => onDelete(book)}>
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
