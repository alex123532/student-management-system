import { useEffect, useState } from 'react';
import FormField from './FormField';
import { validateBook } from '../utils/validators';

const EMPTY = { title: '', author: '', genre: '', isbn: '', quantity: '1' };

export default function BookForm({ editingBook, genres, onSubmit, onCancel }) {
  const isEditing = Boolean(editingBook);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // Lifecycle: refill (or clear) the form whenever the book being edited changes.
  useEffect(() => {
    setValues(
      editingBook
        ? {
            title: editingBook.title,
            author: editingBook.author,
            genre: editingBook.genre,
            isbn: editingBook.isbn,
            quantity: String(editingBook.quantity),
          }
        : EMPTY,
    );
    setErrors({});
  }, [editingBook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateBook(values, { isEditing });
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    const result = onSubmit(values);
    if (!result.ok) {
      setErrors({ [result.field || 'title']: result.error });
      return;
    }
    if (!isEditing) setValues(EMPTY);
  };

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>{isEditing ? 'Update book' : 'Add a new book'}</h2>

      <div className="form__grid">
        <FormField id="book-title" label="Title" error={errors.title}>
          <input name="title" value={values.title} onChange={handleChange} autoComplete="off" />
        </FormField>

        <FormField id="book-author" label="Author" error={errors.author}>
          <input name="author" value={values.author} onChange={handleChange} autoComplete="off" />
        </FormField>

        <FormField id="book-genre" label="Genre" error={errors.genre}>
          <input name="genre" list="genre-options" value={values.genre} onChange={handleChange} autoComplete="off" />
        </FormField>
        <datalist id="genre-options">
          {genres.map((g) => <option key={g} value={g} />)}
        </datalist>

        <FormField id="book-isbn" label="ISBN" error={errors.isbn} hint="10 or 13 digits, e.g. 978-0-13-235088-4">
          <input name="isbn" value={values.isbn} onChange={handleChange} inputMode="numeric" autoComplete="off" />
        </FormField>

        <FormField
          id="book-quantity"
          label={isEditing ? 'Copies in stock' : 'Initial quantity'}
          error={errors.quantity}
          hint={isEditing ? 'Change stock on the Transactions page so it is logged.' : undefined}
        >
          <input
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={values.quantity}
            onChange={handleChange}
            disabled={isEditing}
          />
        </FormField>
      </div>

      <div className="form__actions">
        <button type="submit" className="btn btn--primary">{isEditing ? 'Save changes' : 'Add book'}</button>
        {isEditing && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
}
