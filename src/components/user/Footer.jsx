import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-border bg-white"
    >
      {/* Soft decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-brand/[0.05] blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-coral/[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Main footer */}
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">

          {/* Brand */}
          <div className="max-w-md">
            <Logo />

            <p className="mt-5 max-w-sm text-sm leading-7 text-ink-muted">
              Powerful digital marketing, AI-powered video ads, and WhatsApp
              Business automation — designed to help growing businesses reach
              more customers and generate more enquiries.
            </p>

            {/* Brand highlights */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-canvas-soft px-3.5 py-2 text-xs font-semibold text-ink-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Digital Marketing
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-canvas-soft px-3.5 py-2 text-xs font-semibold text-ink-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                AI Video Ads
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-canvas-soft px-3.5 py-2 text-xs font-semibold text-ink-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" />
                WhatsApp Automation
              </span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
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
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>

              <h3 className="font-display text-sm font-bold text-ink">
                Get in touch
              </h3>
            </div>

            <address className="not-italic text-sm leading-7 text-ink-muted">
              <p className="font-semibold text-ink">
                Pathans Apple Infotech Pvt. Ltd.
              </p>

              <p className="mt-1">
                AMC 19/305, First Floor
                <br />
                Alappuzha 688013
                <br />
                Kerala, India
              </p>

              <p className="mt-1">
                GSTIN:{' '}
                <span className="font-medium text-ink-muted">
                  32AAOCP4547L1ZZ
                </span>
              </p>
            </address>

            <div className="mt-5">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-deep"
              >
                Contact our team

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
            </div>
          </div>

          {/* Websites */}
          <div>
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral-soft text-coral">
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
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18" />
                  <path d="M12 3a14 14 0 0 1 0 18" />
                  <path d="M12 3a14 14 0 0 0 0 18" />
                </svg>
              </span>

              <h3 className="font-display text-sm font-bold text-ink">
                Our websites
              </h3>
            </div>

            <div className="space-y-2">
              <a
                href="https://www.pathansapple.com"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm text-ink-muted transition-all hover:border-border hover:bg-canvas-soft hover:text-ink"
              >
                <span>Pathans Apple Info Tech</span>

                <ExternalIcon />
              </a>

              <a
                href="https://pathansaistudio.com"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm text-ink-muted transition-all hover:border-border hover:bg-canvas-soft hover:text-ink"
              >
                <span>Pathans AI Studio</span>

                <ExternalIcon />
              </a>

              <a
                href="https://www.watichat.com"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm text-ink-muted transition-all hover:border-border hover:bg-canvas-soft hover:text-ink"
              >
                <span>Watichat Whatsapp Api</span>

                <ExternalIcon />
              </a>
            </div>
          </div>

          {/* Policies */}
          <div>
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
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
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                  <path d="M14 2v6h6" />
                  <path d="M8 13h8" />
                  <path d="M8 17h6" />
                </svg>
              </span>

              <h3 className="font-display text-sm font-bold text-ink">
                Policies
              </h3>
            </div>

            <div className="space-y-2">
              <PolicyLink to="/terms-and-conditions">
                Terms & Conditions
              </PolicyLink>

              <PolicyLink to="/privacy-policy">
                Privacy Policy
              </PolicyLink>

              <PolicyLink to="/cancellation-refund-policy">
                Cancellation & Refund Policy
              </PolicyLink>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="my-10 h-px bg-border sm:my-12" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p>
              © {new Date().getFullYear()}{' '}
              <span className="font-semibold text-ink-muted">
                Apple Hub
              </span>{' '}
              — a product by Pathans Apple Infotech Pvt. Ltd.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span>Built for growing businesses</span>

            <span className="h-1 w-1 rounded-full bg-brand/50" />

            <span>All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------
   Policy Link
--------------------------------------------- */

function PolicyLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm text-ink-muted transition-all hover:border-border hover:bg-canvas-soft hover:text-ink"
    >
      <span>{children}</span>

      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-40 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  );
}

/* ---------------------------------------------
   External Website Icon
--------------------------------------------- */

function ExternalIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-40 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
