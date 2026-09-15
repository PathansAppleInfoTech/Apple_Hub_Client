const STYLES = {
  pending: 'bg-status-pending/10 text-status-pending border-status-pending/30',
  confirmed: 'bg-status-confirmed/10 text-status-confirmed border-status-confirmed/30',
  in_progress: 'bg-status-progress/10 text-status-progress border-status-progress/30',
  completed: 'bg-status-completed/10 text-status-completed border-status-completed/30',
  cancelled: 'bg-status-cancelled/10 text-status-cancelled border-status-cancelled/30',
  paid: 'bg-status-completed/10 text-status-completed border-status-completed/30',
  failed: 'bg-status-cancelled/10 text-status-cancelled border-status-cancelled/30',
  refunded: 'bg-status-progress/10 text-status-progress border-status-progress/30',
};

const LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
};

export default function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
        STYLES[status] || 'border-admin-border text-admin-muted'
      }`}
    >
      {LABELS[status] || status}
    </span>
  );
}
