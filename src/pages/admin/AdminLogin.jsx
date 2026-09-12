import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Logo from '../../components/common/Logo';

export default function AdminLogin() {
  const { admin, loading, signIn } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address.', {
        duration: 3000,
      });
      return;
    }

    if (!password) {
      toast.error('Please enter your password.', {
        duration: 3000,
      });
      return;
    }

    if (submitting) return;

    setSubmitting(true);

    try {
      await signIn(email.trim(), password);

      toast.success('Welcome back! Login successful.', {
        duration: 2500,
      });

      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(
        err.message || 'Unable to sign in. Please check your credentials.',
        {
          duration: 4000,
        }
      );
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-5 py-10 sm:px-6">

      {/* ───────────────── Background ───────────────── */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Soft lavender wash */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#EFEBFE_0%,transparent_38%),radial-gradient(circle_at_bottom_right,#FFEDE7_0%,transparent_35%)] opacity-70" />

        {/* Decorative violet glow */}
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand/10 blur-[100px]" />

        {/* Decorative coral glow */}
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-coral/10 blur-[100px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #5B3DF0 1px, transparent 1px), linear-gradient(to bottom, #5B3DF0 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ───────────────── Login Area ───────────────── */}

      <div className="relative z-10 w-full max-w-[430px]">

        {/* Logo */}

        <div className="mb-8 flex justify-center">
          <Logo className="h-11 w-auto" />
        </div>

        {/* Login Card */}

        <div className="rounded-[28px] border border-border bg-white p-7 shadow-[0_25px_80px_-25px_rgba(21,22,43,0.15)] sm:p-9">

          {/* Admin badge */}

          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/10 bg-brand-softer px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-brand">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10">
                <ShieldIcon />
              </span>
              Admin Portal
            </div>
          </div>

          {/* Heading */}

          <div className="text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Welcome back
            </h1>

            <p className="mx-auto mt-2 max-w-[320px] text-sm leading-6 text-ink-muted">
              Sign in to manage your services, orders and business operations.
            </p>
          </div>

          {/* Form */}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {/* Email */}

            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-semibold text-ink"
              >
                Email address
              </label>

              <div className="group relative">

                <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint transition-colors group-focus-within:text-brand" />

                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pathansapple.com"
                  className="h-[52px] w-full rounded-xl border border-border bg-canvas-soft pl-10 pr-4 text-sm text-ink outline-none transition-all placeholder:text-ink-faint focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10"
                />

              </div>
            </div>

            {/* Password */}

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold text-ink"
              >
                Password
              </label>

              <div className="group relative">

                <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint transition-colors group-focus-within:text-brand" />

                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-[52px] w-full rounded-xl border border-border bg-canvas-soft pl-10 pr-12 text-sm text-ink outline-none transition-all placeholder:text-ink-faint focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-brand-softer hover:text-brand"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>

              </div>
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={submitting}
              className="group relative mt-2 flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-brand px-6 text-sm font-semibold text-white shadow-[0_12px_25px_-8px_rgba(91,61,240,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-[0_16px_30px_-8px_rgba(91,61,240,0.5)] disabled:pointer-events-none disabled:opacity-60"
            >
              {/* Button shine */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <span className="relative flex items-center gap-2">
                {submitting && <SpinnerIcon />}

                {submitting ? 'Signing in…' : 'Sign in to dashboard'}

                {!submitting && <ArrowRightIcon />}
              </span>
            </button>
          </form>

          {/* Security */}

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-border pt-5 text-[11px] text-ink-faint">
            <LockSmallIcon />
            <span>Secure admin access</span>

            <span className="h-1 w-1 rounded-full bg-border" />

            <span>Authorized users only</span>
          </div>
        </div>

        {/* Footer */}

        <p className="mt-6 text-center text-[11px] leading-5 text-ink-faint">
          This is a restricted administration area.
          <br />
          © {new Date().getFullYear()} Pathans Apple Info Tech
        </p>

      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   Icons
───────────────────────────────────────────── */

function ShieldIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l7 3v5.5c0 4.5-3 7.7-7 9.5-4-1.8-7-5-7-9.5V6l7-3Z" />
      <path d="m9.5 12 1.7 1.7 3.5-3.8" />
    </svg>
  );
}

function MailIcon({ className }) {
  return (
    <svg
      className={className}
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="3"
        y="5.5"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg
      className={className}
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="4.5"
        y="10.5"
        width="15"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 10.5V8a4 4 0 018 0v2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9.9 5.2A10.6 10.6 0 0112 5c6.5 0 10 6.5 10 6.5a13.7 13.7 0 01-3.2 3.9M6.5 6.6C4 8.3 2 11.5 2 11.5S5.5 18 12 18a10.4 10.4 0 003.5-.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 13.9a3 3 0 004.2-4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function LockSmallIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 018 0v3" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.25"
      />
      <path
        d="M21 12a9 9 0 00-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
