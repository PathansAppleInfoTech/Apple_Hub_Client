export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-paper-muted">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-navy-border px-6 py-16 text-center">
      <h3 className="font-display text-lg text-paper">{title}</h3>
      {description && <p className="max-w-sm text-sm text-paper-muted">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-status-cancelled/30 bg-status-cancelled/5 px-6 py-16 text-center">
      <h3 className="font-display text-lg text-paper">We hit a snag</h3>
      <p className="max-w-sm text-sm text-paper-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-full border border-brass/50 px-4 py-2 text-sm text-brass hover:bg-brass/10"
        >
          Try again
        </button>
      )}
    </div>
  );
}
