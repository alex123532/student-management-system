import { useMemo, useState } from 'react';
import FormField from './FormField';
import StockBadge from './StockBadge';
import { validateTransaction } from '../utils/validators';

const EMPTY = { bookId: '', type: 'restock', quantity: '1', memberId: '', note: '' };

const TYPE_OPTIONS = [
  { value: 'restock', label: 'Add stock', help: 'New copies arrived' },
  { value: 'borrow', label: 'Borrow', help: 'Deduct copies for a member' },
  { value: 'return', label: 'Return', help: 'Member brought copies back' },
];

export default function TransactionForm({ books, members, onSubmit }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const selectedBook = useMemo(
    () => books.find((b) => b.id === values.bookId) || null,
    [books, values.bookId],
  );
  const needsMember = values.type === 'borrow' || values.type === 'return';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateTransaction(values, selectedBook);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    const result = onSubmit(values);
    if (!result.ok) {
      setErrors({ [result.field || 'quantity']: result.error });
      return;
    }
    // keep the chosen book and type so several transactions can be entered quickly
    setValues((prev) => ({ ...EMPTY, bookId: prev.bookId, type: prev.type }));
    setErrors({});
  };

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>Record a transaction</h2>

      <fieldset className="segmented">
        <legend>Transaction type</legend>
        {TYPE_OPTIONS.map((opt) => (
          <label key={opt.value} className={`segmented__option${values.type === opt.value ? ' is-selected' : ''}`}>
            <input
              type="radio"
              name="type"
              value={opt.value}
              checked={values.type === opt.value}
              onChange={handleChange}
            />
            <span className="segmented__label">{opt.label}</span>
            <span className="segmented__help">{opt.help}</span>
          </label>
        ))}
      </fieldset>

      <div className="form__grid">
        <FormField id="tx-book" label="Book" error={errors.bookId}>
          <select name="bookId" value={values.bookId} onChange={handleChange}>
            <option value="">Choose a book</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>{b.title} ({b.quantity} in stock)</option>
            ))}
          </select>
        </FormField>

        <FormField id="tx-quantity" label="Quantity" error={errors.quantity}>
          <input name="quantity" type="number" min="1" step="1" value={values.quantity} onChange={handleChange} />
        </FormField>

        {needsMember && (
          <FormField id="tx-member" label="Member" error={errors.memberId}>
            <select name="memberId" value={values.memberId} onChange={handleChange}>
              <option value="">Choose a member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.membershipId})</option>
              ))}
            </select>
          </FormField>
        )}

        <FormField id="tx-note" label="Note (optional)" error={errors.note}>
          <input name="note" value={values.note} onChange={handleChange} autoComplete="off" />
        </FormField>
      </div>

      {selectedBook && (
        <p className="form__context">
          <strong>{selectedBook.title}</strong> currently has {selectedBook.quantity} cop
          {selectedBook.quantity === 1 ? 'y' : 'ies'} <StockBadge quantity={selectedBook.quantity} />
        </p>
      )}

      <div className="form__actions">
        <button type="submit" className="btn btn--primary">Record transaction</button>
      </div>
    </form>
  );
}
