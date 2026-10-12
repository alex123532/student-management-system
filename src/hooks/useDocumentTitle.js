import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | Community Library`;
    return () => {
      document.title = previous; // cleanup runs when the page unmounts
    };
  }, [title]);
}
