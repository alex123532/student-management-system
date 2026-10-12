// Pure validation helpers - each returns an object of { fieldName: 'message' }.

export function normalizeIsbn(value) {
  return String(value).replace(/[\s-]/g, '').toUpperCase();
}

function isValidIsbn10(isbn) {
  if (!/^\d{9}[\dX]$/.test(isbn)) return false;
  const sum = isbn
    .split('')
    .reduce((acc, ch, i) => acc + (ch === 'X' ? 10 : Number(ch)) * (10 - i), 0);
  return sum % 11 === 0;
}

function isValidIsbn13(isbn) {
  if (!/^\d{13}$/.test(isbn)) return false;
  const sum = isbn
    .split('')
    .reduce((acc, ch, i) => acc + Number(ch) * (i % 2 === 0 ? 1 : 3), 0);
  return sum % 10 === 0;
}

export function validateBook(values, { isEditing = false } = {}) {
  const errors = {};

  if (!values.title.trim()) errors.title = 'Enter the book title.';
  else if (values.title.trim().length > 150) errors.title = 'Title must be 150 characters or fewer.';

  if (!values.author.trim()) errors.author = 'Enter the author name.';

  if (!values.genre.trim()) errors.genre = 'Enter or choose a genre.';

  const isbn = normalizeIsbn(values.isbn);
  if (!isbn) errors.isbn = 'Enter the ISBN.';
  else if (!isValidIsbn10(isbn) && !isValidIsbn13(isbn)) {
    errors.isbn = 'Enter a valid 10 or 13 digit ISBN (hyphens are fine).';
  }

  if (!isEditing) {
    const qty = Number(values.quantity);
    if (values.quantity === '' || Number.isNaN(qty)) errors.quantity = 'Enter the initial quantity.';
    else if (!Number.isInteger(qty)) errors.quantity = 'Quantity must be a whole number.';
    else if (qty < 0) errors.quantity = 'Quantity cannot be negative.';
    else if (qty > 9999) errors.quantity = 'Quantity must be 9,999 or fewer.';
  }

  return errors;
}

export function validateUser(values, { isEditing = false } = {}) {
  const errors = {};

  if (!values.name.trim()) errors.name = 'Enter the full name.';

  const mid = values.membershipId.trim();
  if (!mid) errors.membershipId = 'Enter a membership ID.';
  else if (!/^[A-Za-z0-9-]{3,20}$/.test(mid)) {
    errors.membershipId = 'Use 3-20 letters, numbers or hyphens, with no spaces.';
  }

  if (!values.role) errors.role = 'Choose a role.';

  // When editing, a blank password means "keep the current one".
  if (!isEditing || values.password) {
    if (!values.password) errors.password = 'Enter a password.';
    else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

export function validateLogin(values) {
  const errors = {};
  if (!values.membershipId.trim()) errors.membershipId = 'Enter your membership ID.';
  if (!values.password) errors.password = 'Enter your password.';
  return errors;
}

export function validateTransaction(values, book) {
  const errors = {};

  if (!values.bookId) errors.bookId = 'Choose a book.';

  const qty = Number(values.quantity);
  if (values.quantity === '' || Number.isNaN(qty)) errors.quantity = 'Enter a quantity.';
  else if (!Number.isInteger(qty) || qty < 1) errors.quantity = 'Quantity must be a whole number of 1 or more.';
  else if (values.type === 'borrow' && book && qty > book.quantity) {
    errors.quantity = `Only ${book.quantity} cop${book.quantity === 1 ? 'y' : 'ies'} in stock.`;
  } else if (qty > 9999) errors.quantity = 'Quantity must be 9,999 or fewer.';

  if ((values.type === 'borrow' || values.type === 'return') && !values.memberId) {
    errors.memberId = 'Choose the member.';
  }

  if (values.note.length > 200) errors.note = 'Note must be 200 characters or fewer.';

  return errors;
}
