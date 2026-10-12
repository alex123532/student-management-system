export const LOW_STOCK_THRESHOLD = 2; // "fewer than 2 copies" counts as low stock

export const ROLES = {
  ADMIN: 'admin',
  LIBRARIAN: 'librarian',
  MEMBER: 'member',
};

export const ROLE_LABELS = {
  admin: 'Admin',
  librarian: 'Librarian',
  member: 'Member',
};

export const TRANSACTION_TYPES = {
  RESTOCK: 'restock',
  BORROW: 'borrow',
  RETURN: 'return',
};

export const TRANSACTION_LABELS = {
  restock: 'Stock added',
  borrow: 'Borrowed',
  return: 'Returned',
};

export const STORAGE_KEYS = {
  books: 'library.books',
  users: 'library.users',
  transactions: 'library.transactions',
  session: 'library.session',
};
