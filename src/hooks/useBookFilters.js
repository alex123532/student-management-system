import { useMemo, useState } from 'react';
import { LOW_STOCK_THRESHOLD } from '../utils/constants';

// Shared search / genre / low-stock filtering for book lists.
export function useBookFilters(books) {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [lowOnly, setLowOnly] = useState(false);

  const genres = useMemo(
    () => [...new Set(books.map((b) => b.genre))].sort((a, b) => a.localeCompare(b)),
    [books],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      const matchesQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q);
      const matchesGenre = !genre || b.genre === genre;
      const matchesLow = !lowOnly || b.quantity < LOW_STOCK_THRESHOLD;
      return matchesQuery && matchesGenre && matchesLow;
    });
  }, [books, query, genre, lowOnly]);

  return { query, setQuery, genre, setGenre, lowOnly, setLowOnly, genres, filtered };
}
