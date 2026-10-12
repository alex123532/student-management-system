# Community Library



# student : Tseliso Majalle   student id :901020628  Course:BSCSMY2S1


 Management System

A React web app for a community library. Librarians manage books and stock, admins manage users, and everything is saved to the browser's **local storage** (no backend needed).



## Run it

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

```bash
npm run build     # production build into /dist
npm run preview   # preview the build locally
```

## Demo accounts

| Role      | Membership ID | Password   | Can access                                  |
|-----------|---------------|------------|---------------------------------------------|
| Admin     |33704    |7707Br  | Dashboard, Books, Transactions, Users       |
| Librarian | 71101        | hhzw!1   | Dashboard, Books, Transactions              |
| Member    | 1101101       |zz110zz  | Dashboard                                   |

Sample books, users and transactions are created automatically on the first visit. Admins can restore them from the bottom of the Users page.

## Features (mapped to the brief)

**Book management** (Books page)
- Add a book: title, author, genre, ISBN, initial quantity
- Update details with the Update button (the form switches to edit mode)
- Delete with a confirmation dialog
- Search by title, author or ISBN; filter by genre

**Availability management** (Transactions page)
- Add stock when new books arrive
- Deduct stock when books are borrowed (blocked if more than the copies in stock)
- Return books (adds the copies back)
- Full transaction history log with change, stock after, member, who recorded it, and a type filter

**User management**
- Login form (`/login`) with membership ID and password
- Admin-only Users page: add, update and delete users (name, membership ID, role)
- Safeguards: cannot delete yourself, cannot remove or demote the last admin, membership IDs must be unique

**Dashboard**
- Summary cards: titles, copies in stock, low stock, out of stock
- Availability table with search/genre/low-stock filters
- Books with fewer than 2 copies are highlighted amber; 0 copies are highlighted red

## How the brief's requirements are demonstrated

| Requirement | Where |
|---|---|
| `useState` | Every form and filter (`BookForm`, `TransactionForm`, `useBookFilters` ...) |
| `useEffect` / lifecycle | `useLocalStorage` (persist on change), `useDocumentTitle` (set + cleanup on unmount), `ToastContext` (timer + cleanup), `BookForm`/`UserForm` (refill when the edited item changes), `ConfirmDialog` |
| `useMemo` / `useCallback` / `useRef` / `useContext` | `LibraryContext`, `DashboardPage`, `BooksPage` (scroll to form) |
| Custom hooks | `useLocalStorage`, `useDocumentTitle`, `useBookFilters` |
| Component composition | `FormField`, `StockBadge`, `StatCard`, `PageHeader`, `EmptyState`, `ConfirmDialog`, `BookList`, `TransactionLog`, `UserList` ... reused across pages |
| Controlled forms + validation | `BookForm`, `TransactionForm`, `UserForm`, `LoginPage`; rules live in `utils/validators.js` (ISBN checksum, uniqueness, stock limits) |
| React Router | `App.jsx`: nested routes, `ProtectedRoute` with role checks, redirect-after-login, 404 page |
| Local storage | `hooks/useLocalStorage.js` + `context/LibraryContext.jsx` |
| Responsive CSS | `styles/index.css`: tables become stacked cards on phones; grid forms; keyboard focus styles |

## Project structure

```
src/
  main.jsx                 entry point (seeds demo data, mounts <App />)
  App.jsx                  providers + routes
  context/                 LibraryContext (state + actions), ToastContext
  hooks/                   useLocalStorage, useDocumentTitle, useBookFilters
  components/              reusable UI pieces (forms, lists, layout, dialogs)
  pages/                   Login, Dashboard, Books, Transactions, Users, NotFound
  utils/                   constants, validators, seed data, id helper
  styles/index.css         all styling
```

## Publish to GitHub

```bash
git init
git add .
git commit -m "Community library management system"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Optional live demo on GitHub Pages: `npm run deploy` (publishes `dist` to the `gh-pages` branch, then enable Pages for that branch in the repo settings). The app uses a hash router, so routes work on Pages.

## Notes

- Passwords are stored in plain text in local storage. That is acceptable for a coursework demo with no server, but a real system would hash passwords on a backend.
- Data lives only in the browser you use. Clearing site data removes it.
