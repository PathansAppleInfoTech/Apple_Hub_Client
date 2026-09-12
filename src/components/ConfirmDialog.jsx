import Modal from './Modal';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm' }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-admin-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-admin-border px-4 py-2 text-sm text-admin-text"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-status-cancelled px-4 py-2 text-sm font-medium text-white"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
