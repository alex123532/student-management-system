import { useState, useEffect } from 'react';

// Works like useState, but the value is read from / written to localStorage.
// - lazy initial state reads storage once on mount
// - useEffect writes every change back to storage
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const fallback = typeof initialValue === 'function' ? initialValue() : initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Could not save "${key}" to local storage`, err);
    }
  }, [key, value]);

  return [value, setValue];
}
