import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu whenever route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-black/[0.06] bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl'
          : 'bg-white/70 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-[100px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

        {/* ───────────────── Logo ───────────────── */}
        <Link
          to="/"
          className="group shrink-0"
          aria-label="Apple Hub Home"
        >
          <Logo />
        </Link>

        {/* ───────────────── Desktop Navigation ───────────────── */}
        <nav className="hidden items-center gap-1 rounded-full border border-black/[0.05] bg-white/70 p-1.5 shadow-sm md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.href);

            return (
              <Link
                key={link.label}
                to={link.href}
                className={`relative rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-ink text-white shadow-sm'
                    : 'text-ink-muted hover:bg-black/[0.04] hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ───────────────── Desktop Actions ───────────────── */}
        <div className="hidden items-center gap-2.5 md:flex">

          {/* Admin */}
          <Link
            to="/admin/login"
            className="group flex items-center gap-2 rounded-full border border-black/[0.07] bg-white px-3.5 py-2 text-[12px] font-semibold text-ink-muted transition-all duration-200 hover:border-black/10 hover:bg-black/[0.03] hover:text-ink"
            title="Admin Login"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.04] transition-colors group-hover:bg-brand/10">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.09a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15a1.7 1.7 0 0 0-1.56-1.03H6v-2.4h.9A1.7 1.7 0 0 0 8.46 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5h2.4v.09A1.7 1.7 0 0 0 16.16 6.65a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03H21v2.4h-.04A1.7 1.7 0 0 0 19.4 15Z" />
              </svg>
            </span>
            Admin
          </Link>

          {/* Get Started */}
          <Link
            to="/contact"
            className="group flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lg"
          >
            Get Started
            <svg
              width="14"
              height="14"
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
          </Link>
        </div>

        {/* ───────────────── Mobile Menu Button ───────────────── */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.07] bg-white text-ink shadow-sm transition-all hover:bg-black/[0.03] md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ───────────────── Mobile Navigation ───────────────── */}
      {open && (
        <div className="border-t border-black/[0.06] bg-white/95 px-5 pb-5 pt-3 shadow-lg backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.href);

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-ink text-white'
                      : 'text-ink-muted hover:bg-black/[0.04] hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Admin */}
            <Link
              to="/admin/login"
              className="mt-2 flex items-center justify-between rounded-xl border border-black/[0.07] px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-black/[0.03]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/[0.04]">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                  </svg>
                </span>
                Admin Login
              </span>

              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>

            {/* Mobile CTA */}
            <Link
              to="/contact"
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
            >
              Get Started
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
