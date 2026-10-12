import { useEffect, useRef } from 'react';

// Uses the native <dialog> element so focus trapping and Esc handling come for free.
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="dialog" onCancel={(e) => { e.preventDefault(); onCancel(); }}>
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="dialog__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Keep it</button>
        <button type="button" className="btn btn--danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </dialog>
  );
}
