import { useRef, useState } from 'react';
import BookFilters from '../components/BookFilters';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';
import ConfirmDialog from '../components/ConfirmDialog';
import PageHeader from '../components/PageHeader';
import { useLibrary } from '../context/LibraryContext';
import { useToast } from '../context/ToastContext';
import { useBookFilters } from '../hooks/useBookFilters';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function BooksPage() {
  useDocumentTitle('Books');
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const { showToast } = useToast();
  const filters = useBookFilters(books);
  const [editingBook, setEditingBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const formRef = useRef(null);

  const handleSubmit = (values) => {
    if (editingBook) {
      const result = updateBook(editingBook.id, values);
      if (result.ok) {
        showToast(`Updated "${values.title.trim()}".`);
        setEditingBook(null);
      }
      return result;
    }
    const result = addBook(values);
    if (result.ok) showToast(`Added "${values.title.trim()}" to the catalogue.`);
    return result;
  };

  const handleStartEdit = (book) => {
    setEditingBook(book);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleConfirmDelete = () => {
    deleteBook(bookToDelete.id);
    if (editingBook && editingBook.id === bookToDelete.id) setEditingBook(null);
    showToast(`Deleted "${bookToDelete.title}".`);
    setBookToDelete(null);
  };

  return (
    <>
      <PageHeader title="Books" description="Add new titles, correct details, or remove books the library no longer holds." />

      <div ref={formRef} className="scroll-anchor">
        <BookForm
          editingBook={editingBook}
          genres={filters.genres}
          onSubmit={handleSubmit}
          onCancel={() => setEditingBook(null)}
        />
      </div>

      <section className="card">
        <h2>All books ({books.length})</h2>
        <BookFilters
          query={filters.query}
          onQuery={filters.setQuery}
          genre={filters.genre}
          onGenre={filters.setGenre}
          genres={filters.genres}
        />
        <BookList
          books={filters.filtered}
          editingId={editingBook?.id}
          onUpdate={handleStartEdit}
          onDelete={setBookToDelete}
        />
      </section>

      <ConfirmDialog
        open={Boolean(bookToDelete)}
        title="Delete this book?"
        message={bookToDelete ? `"${bookToDelete.title}" will be removed from the catalogue. Its transaction history stays in the log.` : ''}
        confirmLabel="Delete book"
        onConfirm={handleConfirmDelete}
        onCancel={() => setBookToDelete(null)}
      />
    </>
  );
}
