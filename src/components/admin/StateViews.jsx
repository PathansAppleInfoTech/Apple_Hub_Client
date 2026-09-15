export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
        {/* Soft glow */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-brand/10 blur-xl" />

        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-brand/10" />

        {/* Spinning ring */}
        <div className="absolute inset-1 animate-spin rounded-full border-[3px] border-brand/10 border-t-brand" />

        {/* Inner circle */}
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-brand animate-pulse" />
        </div>
      </div>

      <p className="font-display text-sm font-semibold text-ink">
        {label}
      </p>

      <p className="mt-1 text-xs text-ink-faint">
        Please wait a moment
      </p>
    </div>
  );
}

export function EmptyState({
  title = 'Nothing here yet',
  description,
  action,
}) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-surface px-6 py-20 text-center shadow-sm">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-coral/5 blur-3xl" />

      {/* Icon */}
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-canvas-soft shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-7 w-7 text-brand"
        >
          <path
            d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20V3.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M14 3.5V8h4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M10 12h4M10 15.5h4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h3 className="font-display text-lg font-bold tracking-tight text-ink">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-ink-muted">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

export function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-coral/20 bg-coral-soft/30 px-6 py-20 text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-coral/10 blur-3xl" />

      {/* Error icon */}
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-coral/20 bg-white shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-coral-soft">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 text-coral"
          >
            <path
              d="M12 8v4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 16h.01"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M10.3 3.8 2.9 17a2 2 0 0 0 1.75 3h14.7a2 2 0 0 0 1.75-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <h3 className="font-display text-lg font-bold tracking-tight text-ink">
        We hit a snag
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-ink-muted">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand hover:shadow-lg active:translate-y-0"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-180"
          >
            <path
              d="M20 11a8 8 0 1 0 1 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M20 5v6h-6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          Try again
        </button>
      )}
    </div>
  );
}
