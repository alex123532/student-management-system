import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import TransactionForm from '../components/TransactionForm';
import TransactionLog from '../components/TransactionLog';
import { useLibrary } from '../context/LibraryContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { TRANSACTION_LABELS } from '../utils/constants';

export default function TransactionsPage() {
  useDocumentTitle('Transactions');
  const { books, users, transactions, recordTransaction } = useLibrary();
  const { showToast } = useToast();
  const [typeFilter, setTypeFilter] = useState('');

  const sortedBooks = useMemo(
    () => [...books].sort((a, b) => a.title.localeCompare(b.title)),
    [books],
  );

  const visible = useMemo(
    () => (typeFilter ? transactions.filter((t) => t.type === typeFilter) : transactions),
    [transactions, typeFilter],
  );

  const handleSubmit = (values) => {
    const result = recordTransaction(values);
    if (result.ok) {
      const verb = { restock: 'Added', borrow: 'Borrowed', return: 'Returned' }[values.type];
      showToast(`${verb} ${values.quantity} x "${result.book.title}". Stock is now ${result.transaction.balanceAfter}.`);
    }
    return result;
  };

  return (
    <>
      <PageHeader title="Transactions" description="Add stock when new copies arrive, deduct it when books are borrowed." />

      {books.length === 0 ? (
        <p className="alert alert--warn">Add a book on the Books page before recording transactions.</p>
      ) : (
        <TransactionForm books={sortedBooks} members={users} onSubmit={handleSubmit} />
      )}

      <section className="card">
        <div className="card__head">
          <h2>Transaction history</h2>
          <div className="filters__item">
            <label htmlFor="log-type">Show</label>
            <select id="log-type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All transactions</option>
              {Object.entries(TRANSACTION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        <TransactionLog transactions={visible} />
      </section>
    </>
  );
}
