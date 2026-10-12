import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, TRANSACTION_TYPES } from '../utils/constants';
import { makeId } from '../utils/id';
import { normalizeIsbn } from '../utils/validators';

const LibraryContext = createContext(null);

// Every action returns { ok: true } or { ok: false, error, field? } so forms
// can show the problem next to the right input.
export function LibraryProvider({ children }) {
  const [books, setBooks] = useLocalStorage(STORAGE_KEYS.books, []);
  const [users, setUsers] = useLocalStorage(STORAGE_KEYS.users, []);
  const [transactions, setTransactions] = useLocalStorage(STORAGE_KEYS.transactions, []);
  const [sessionUserId, setSessionUserId] = useLocalStorage(STORAGE_KEYS.session, null);

  const currentUser = useMemo(
    () => users.find((u) => u.id === sessionUserId) || null,
    [users, sessionUserId],
  );

  /* ------------------------------ auth ------------------------------ */
  const login = useCallback(
    (membershipId, password) => {
      const user = users.find(
        (u) => u.membershipId.toLowerCase() === membershipId.trim().toLowerCase(),
      );
      if (!user || user.password !== password) {
        return { ok: false, error: 'Membership ID or password is incorrect.' };
      }
      setSessionUserId(user.id);
      return { ok: true, user };
    },
    [users, setSessionUserId],
  );

  const logout = useCallback(() => setSessionUserId(null), [setSessionUserId]);

  /* ------------------------- transactions log ------------------------ */
  const buildTransaction = useCallback(
    ({ book, type, quantity, member, note, balanceAfter }) => ({
      id: makeId(),
      bookId: book.id,
      bookTitle: book.title,
      type,
      quantity,
      memberId: member ? member.membershipId : '',
      memberName: member ? member.name : '',
      note: note || '',
      performedBy: currentUser ? currentUser.name : 'System',
      date: new Date().toISOString(),
      balanceAfter,
    }),
    [currentUser],
  );

  /* ------------------------------ books ------------------------------ */
  const addBook = useCallback(
    (data) => {
      const isbn = normalizeIsbn(data.isbn);
      if (books.some((b) => normalizeIsbn(b.isbn) === isbn)) {
        return { ok: false, field: 'isbn', error: 'A book with this ISBN already exists.' };
      }
      const quantity = Number(data.quantity);
      const book = {
        id: makeId(),
        title: data.title.trim(),
        author: data.author.trim(),
        genre: data.genre.trim(),
        isbn,
        quantity,
        createdAt: new Date().toISOString(),
      };
      setBooks((prev) => [book, ...prev]);
      if (quantity > 0) {
        const tx = buildTransaction({
          book,
          type: TRANSACTION_TYPES.RESTOCK,
          quantity,
          note: 'Initial stock',
          balanceAfter: quantity,
        });
        setTransactions((prev) => [tx, ...prev]);
      }
      return { ok: true, book };
    },
    [books, setBooks, setTransactions, buildTransaction],
  );

  const updateBook = useCallback(
    (id, data) => {
      const isbn = normalizeIsbn(data.isbn);
      if (books.some((b) => b.id !== id && normalizeIsbn(b.isbn) === isbn)) {
        return { ok: false, field: 'isbn', error: 'Another book already uses this ISBN.' };
      }
      setBooks((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, title: data.title.trim(), author: data.author.trim(), genre: data.genre.trim(), isbn }
            : b,
        ),
      );
      return { ok: true };
    },
    [books, setBooks],
  );

  const deleteBook = useCallback(
    (id) => {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      return { ok: true };
    },
    [setBooks],
  );

  /* --------------------------- transactions -------------------------- */
  const recordTransaction = useCallback(
    ({ bookId, type, quantity, memberId, note }) => {
      const book = books.find((b) => b.id === bookId);
      if (!book) return { ok: false, field: 'bookId', error: 'That book no longer exists.' };

      const qty = Number(quantity);
      const delta = type === TRANSACTION_TYPES.BORROW ? -qty : qty;
      const newQuantity = book.quantity + delta;
      if (newQuantity < 0) {
        return {
          ok: false,
          field: 'quantity',
          error: `Only ${book.quantity} cop${book.quantity === 1 ? 'y' : 'ies'} in stock.`,
        };
      }

      const member = memberId ? users.find((u) => u.id === memberId) : null;
      setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, quantity: newQuantity } : b)));
      const tx = buildTransaction({
        book,
        type,
        quantity: qty,
        member,
        note: note.trim(),
        balanceAfter: newQuantity,
      });
      setTransactions((prev) => [tx, ...prev]);
      return { ok: true, transaction: tx, book };
    },
    [books, users, setBooks, setTransactions, buildTransaction],
  );

  /* ------------------------------ users ------------------------------ */
  const addUser = useCallback(
    (data) => {
      const membershipId = data.membershipId.trim();
      if (users.some((u) => u.membershipId.toLowerCase() === membershipId.toLowerCase())) {
        return { ok: false, field: 'membershipId', error: 'This membership ID is already taken.' };
      }
      const user = {
        id: makeId(),
        name: data.name.trim(),
        membershipId,
        role: data.role,
        password: data.password,
      };
      setUsers((prev) => [...prev, user]);
      return { ok: true, user };
    },
    [users, setUsers],
  );

  const updateUser = useCallback(
    (id, data) => {
      const membershipId = data.membershipId.trim();
      if (users.some((u) => u.id !== id && u.membershipId.toLowerCase() === membershipId.toLowerCase())) {
        return { ok: false, field: 'membershipId', error: 'This membership ID is already taken.' };
      }
      const target = users.find((u) => u.id === id);
      const adminCount = users.filter((u) => u.role === 'admin').length;
      if (target && target.role === 'admin' && data.role !== 'admin' && adminCount === 1) {
        return { ok: false, field: 'role', error: 'There must be at least one admin.' };
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                name: data.name.trim(),
                membershipId,
                role: data.role,
                password: data.password ? data.password : u.password,
              }
            : u,
        ),
      );
      return { ok: true };
    },
    [users, setUsers],
  );

  const deleteUser = useCallback(
    (id) => {
      if (id === sessionUserId) {
        return { ok: false, error: 'You cannot delete the account you are signed in with.' };
      }
      const target = users.find((u) => u.id === id);
      const adminCount = users.filter((u) => u.role === 'admin').length;
      if (target && target.role === 'admin' && adminCount === 1) {
        return { ok: false, error: 'You cannot delete the last admin.' };
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return { ok: true };
    },
    [users, sessionUserId, setUsers],
  );

  const resetDemoData = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
    window.location.reload();
  }, []);

  const value = useMemo(
    () => ({
      books,
      users,
      transactions,
      currentUser,
      login,
      logout,
      addBook,
      updateBook,
      deleteBook,
      recordTransaction,
      addUser,
      updateUser,
      deleteUser,
      resetDemoData,
    }),
    [
      books, users, transactions, currentUser, login, logout, addBook, updateBook,
      deleteBook, recordTransaction, addUser, updateUser, deleteUser, resetDemoData,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used inside <LibraryProvider>');
  return ctx;
}
