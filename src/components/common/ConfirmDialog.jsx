export default function ConfirmDialog({ open, title, description, confirmLabel = "Confirm", danger = false, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-lg theme-transition">
        <h3 className="text-base font-semibold text-text">{title}</h3>
        {description && <p className="mt-2 text-sm text-text-muted">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text hover:bg-bg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${
              danger ? "bg-danger hover:opacity-90" : "bg-primary hover:bg-primary-hover"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
