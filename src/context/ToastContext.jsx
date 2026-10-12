import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone, key: Date.now() });
  }, []);

  // Auto-dismiss after 3.5s; the cleanup clears the timer if a new toast arrives.
  useEffect(() => {
    if (!toast) return undefined;
    timerRef.current = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timerRef.current);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-region" aria-live="polite" role="status">
        {toast && (
          <div key={toast.key} className={`toast toast--${toast.tone}`}>
            <span>{toast.message}</span>
            <button type="button" className="toast__close" onClick={() => setToast(null)} aria-label="Dismiss message">
              ×
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
