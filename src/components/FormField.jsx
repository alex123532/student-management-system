import { cloneElement } from 'react';

// Wraps a single input with its label, hint and error message.
// The child input receives id / aria attributes automatically.
export default function FormField({ id, label, error, hint, children }) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {cloneElement(children, {
        id,
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': describedBy,
      })}
      {hint && !error && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field__error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}
