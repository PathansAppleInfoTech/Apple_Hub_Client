
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';

const NAV_LINKS = [
  { href: '/', label: 'Home', number: '01' },
  { href: '/about', label: 'About', number: '02' },
  { href: '/services', label: 'Services', number: '03' },
  { href: '/contact', label: 'Contact', number: '04' },
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

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent background page scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-black/[0.06] bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl'
          : 'bg-white/70 backdrop-blur-md'
      }`}
    >
      <div className="relative z-[60] mx-auto flex h-[100px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="group shrink-0"
          aria-label="Apple Hub Home"
        >
          <Logo />
        </Link>

        {/* Desktop Navigation */}
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

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2.5 md:flex">

          {/* Admin */}
          <Link
            to="/admin/login"
            className="group flex items-center gap-2 rounded-full border border-black/[0.07] bg-white px-3.5 py-2 text-[12px] font-semibold text-ink-muted transition-all duration-200 hover:border-black/10 hover:bg-black/[0.03] hover:text-ink"
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300 md:hidden ${
            open
              ? 'border-ink bg-ink text-white shadow-lg shadow-black/10'
              : 'border-black/[0.07] bg-white text-ink shadow-sm'
          }`}
        >
          <span
            className={`absolute h-[1.5px] w-[18px] rounded-full transition-all duration-300 ${
              open
                ? 'rotate-45 bg-white'
                : '-translate-y-[5px] bg-ink'
            }`}
          />

          <span
            className={`absolute h-[1.5px] w-[18px] rounded-full transition-all duration-300 ${
              open
                ? '-rotate-45 bg-white'
                : 'translate-y-[5px] bg-ink'
            }`}
          />
        </button>
      </div>

      {/* Mobile Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 top-[100px] z-40 bg-ink/20 backdrop-blur-[3px] transition-all duration-500 md:hidden ${
          open
            ? 'pointer-events-auto visible opacity-100'
            : 'pointer-events-none invisible opacity-0'
        }`}
      />

      {/* Mobile Navigation */}
      <div
        className={`absolute left-0 right-0 top-full z-50 overflow-hidden md:hidden ${
          open ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          className={`origin-top border-t border-black/[0.06] bg-white px-5 pb-6 pt-4 shadow-[0_25px_50px_rgba(0,0,0,0.12)] transition-all duration-500 ${
            open
              ? 'translate-y-0 scale-y-100 opacity-100'
              : '-translate-y-4 scale-y-95 opacity-0'
          }`}
        >
          {/* Small menu heading */}
          <div
            className={`mb-3 flex items-center justify-between px-1 transition-all duration-500 delay-100 ${
              open
                ? 'translate-y-0 opacity-100'
                : '-translate-y-2 opacity-0'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-faint">
              Navigation
            </span>

            <span className="h-px w-16 bg-black/[0.08]" />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link, index) => {
              const isActive =
                link.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.href);

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  style={{
                    transitionDelay: open
                      ? `${120 + index * 60}ms`
                      : '0ms',
                  }}
                  className={`group relative flex items-center overflow-hidden rounded-2xl px-3 py-3.5 transition-all duration-500 ${
                    open
                      ? 'translate-x-0 opacity-100'
                      : 'translate-x-8 opacity-0'
                  } ${
                    isActive
                      ? 'bg-ink text-white shadow-[0_8px_20px_rgba(21,22,43,0.12)]'
                      : 'text-ink hover:bg-black/[0.035]'
                  }`}
                >
                  {/* Active accent */}
                  <span
                    className={`absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full transition-all duration-300 ${
                      isActive
                        ? 'bg-brand opacity-100'
                        : 'bg-transparent opacity-0'
                    }`}
                  />

                  {/* Number */}
                  <span
                    className={`mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'bg-black/[0.04] text-ink-faint group-hover:bg-brand/10 group-hover:text-brand'
                    }`}
                  >
                    {link.number}
                  </span>

                  {/* Label */}
                  <span className="flex-1 text-[15px] font-semibold">
                    {link.label}
                  </span>

                  {/* Arrow */}
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-ink-faint group-hover:translate-x-1 group-hover:text-brand'
                    }`}
                  >
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
                      <path d="M5 12h13" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div
            className={`my-4 h-px bg-black/[0.06] transition-all duration-500 delay-[360ms] ${
              open ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
            }`}
          />

          {/* Mobile Bottom Actions */}
          <div
            className={`grid grid-cols-2 gap-2.5 transition-all duration-500 delay-[420ms] ${
              open
                ? 'translate-y-0 opacity-100'
                : 'translate-y-3 opacity-0'
            }`}
          >
            {/* Admin */}
            <Link
              to="/admin/login"
              className="group flex items-center justify-center gap-2 rounded-2xl border border-black/[0.07] bg-white px-3 py-3.5 text-[13px] font-semibold text-ink transition-all duration-200 hover:border-brand/20 hover:bg-brand/[0.03]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-black/[0.04] transition-colors group-hover:bg-brand/10">
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
                  <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.09a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15a1.7 1.7 0 0 0-1.56-1.03H6v-2.4h.9A1.7 1.7 0 0 0 8.46 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.03.34 1.7 1.7 0 0 0 1.03-1.56V5h2.4v.09A1.7 1.7 0 0 0 16.16 6.65a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03H21v2.4h-.04A1.7 1.7 0 0 0 19.4 15Z" />
                </svg>
              </span>
              Admin
            </Link>

            {/* Get Started */}
            <Link
              to="/contact"
              className="group flex items-center justify-center gap-2 rounded-2xl bg-ink px-3 py-3.5 text-[13px] font-semibold text-white shadow-sm transition-all duration-300 hover:bg-brand-deep hover:shadow-lg"
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
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
          </div>

          {/* Bottom branding detail */}
          <div
            className={`mt-5 flex items-center justify-center gap-2 transition-all duration-500 delay-500 ${
              open
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="text-[10px] font-medium tracking-wide text-ink-faint">
              Apple Hub by Pathans Apple Info Tech
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          </div>
        </div>
      </div>
    </header>
  );
}
