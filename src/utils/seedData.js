import { STORAGE_KEYS } from './constants';
import { makeId } from './id';

// First-run demo data. It is only used when local storage is empty.
export function createSeedUsers() {
  return [
    { id: makeId(), name: 'Library Admin', membershipId: 'ADMIN001', role: 'admin', password: 'admin123' },
    { id: makeId(), name: 'Lerato Molapo', membershipId: 'LIB001', role: 'librarian', password: 'lib12345' },
    { id: makeId(), name: 'Thabo Mokoena', membershipId: 'MEM001', role: 'member', password: 'member123' },
    { id: makeId(), name: 'Palesa Nkosi', membershipId: 'MEM002', role: 'member', password: 'member123' },
  ];
}

export function createSeedBooks() {
  const rows = [
    ['Things Fall Apart', 'Chinua Achebe', 'Fiction', '9780385474542', 5],
    ['Long Walk to Freedom', 'Nelson Mandela', 'Biography', '9780316548182', 3],
    ['A Brief History of Time', 'Stephen Hawking', 'Science', '9780553380163', 1],
    ['The Alchemist', 'Paulo Coelho', 'Fiction', '9780062315007', 4],
    ['Clean Code', 'Robert C. Martin', 'Technology', '9780132350884', 2],
    ['Sapiens', 'Yuval Noah Harari', 'History', '9780062316110', 0],
    ['Atomic Habits', 'James Clear', 'Self-help', '9780735211292', 6],
    ['Half of a Yellow Sun', 'Chimamanda Ngozi Adichie', 'Fiction', '9781400095209', 1],
  ];
  const now = new Date().toISOString();
  return rows.map(([title, author, genre, isbn, quantity]) => ({
    id: makeId(),
    title,
    author,
    genre,
    isbn,
    quantity,
    createdAt: now,
  }));
}

export function createSeedTransactions(books) {
  const now = new Date().toISOString();
  return books
    .filter((b) => b.quantity > 0)
    .map((b) => ({
      id: makeId(),
      bookId: b.id,
      bookTitle: b.title,
      type: 'restock',
      quantity: b.quantity,
      memberId: '',
      memberName: '',
      note: 'Initial stock',
      performedBy: 'System',
      date: now,
      balanceAfter: b.quantity,
    }));
}

export function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

// Called once before the app renders: if this is the first visit, write demo
// data into local storage so the dashboard is not empty.
export function seedIfEmpty() {
  try {
    const hasData =
      window.localStorage.getItem(STORAGE_KEYS.books) !== null ||
      window.localStorage.getItem(STORAGE_KEYS.users) !== null;
    if (hasData) return;
    const books = createSeedBooks();
    window.localStorage.setItem(STORAGE_KEYS.books, JSON.stringify(books));
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(createSeedUsers()));
    window.localStorage.setItem(
      STORAGE_KEYS.transactions,
      JSON.stringify(createSeedTransactions(books)),
    );
  } catch (err) {
    console.error('Could not seed demo data', err);
  }
}
