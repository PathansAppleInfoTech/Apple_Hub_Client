import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function ArrowLeftIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M19 12H5M11 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3.5 10.8 12 3.5l8.5 7.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 9.8v9.7h13V9.8M9.5 19.5v-5.8h5v5.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="10.8"
        cy="10.8"
        r="6.3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m16 16 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas-soft px-5 py-20 text-ink sm:px-8">
      
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-brand/5 blur-3xl" />

        <div className="absolute left-[12%] top-[22%] h-2 w-2 rounded-full bg-brand/20" />
        <div className="absolute right-[18%] top-[28%] h-3 w-3 rounded-full bg-brand/10" />
        <div className="absolute bottom-[22%] left-[20%] h-3 w-3 rounded-full bg-brand/10" />
        <div className="absolute bottom-[18%] right-[12%] h-2 w-2 rounded-full bg-brand/20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">

        {/* Small label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 shadow-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />

          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted">
            Page not found
          </span>
        </motion.div>

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mb-5"
        >
          <h1
            className="
              select-none
              text-[clamp(7rem,24vw,15rem)]
              font-black
              leading-[0.75]
              tracking-[-0.08em]
              text-brand/10
            "
          >
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[clamp(4rem,13vw,8rem)] font-black leading-none tracking-[-0.06em] text-ink">
              404
            </span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.25,
          }}
        >
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Looks like you took a wrong turn.
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-ink-muted sm:text-base">
            The page you're looking for doesn't exist, may have moved,
            or the link you followed might be outdated.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <Link
              to="/"
              className="
                group inline-flex items-center justify-center gap-2.5
                rounded-full
                bg-brand
                px-6 py-3.5
                text-sm font-bold
                text-white
                shadow-lg shadow-brand/15
                transition-all duration-300
                hover:-translate-y-0.5
                hover:bg-brand-deep
                hover:shadow-xl hover:shadow-brand/20
              "
            >
              <HomeIcon className="h-4 w-4" />
              Back to Home
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="
                group inline-flex items-center justify-center gap-2.5
                rounded-full
                border border-border
                bg-surface
                px-6 py-3.5
                text-sm font-bold
                text-ink
                shadow-sm
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-brand/20
                hover:bg-brand-soft
                hover:text-brand
              "
            >
              <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Go Back
            </button>

          </div>
        </motion.div>

        {/* Bottom hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-14 flex max-w-md items-center justify-center gap-3 text-xs text-ink-faint"
        >
          <span className="h-px flex-1 bg-border" />

          <div className="flex items-center gap-2">
            <SearchIcon className="h-3.5 w-3.5" />
            <span>Try checking the URL</span>
          </div>

          <span className="h-px flex-1 bg-border" />
        </motion.div>

      </div>
    </main>
  );
}
