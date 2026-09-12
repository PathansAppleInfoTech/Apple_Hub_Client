import { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAdminAuth } from '../context/AdminAuthContext';
import Logo from '../components/common/Logo';

const NAV_ITEMS = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
  },
  {
    to: '/admin/services',
    label: 'Services',
    icon: ServicesIcon,
    adminOnly: true,
  },
  {
    to: '/admin/categories',
    label: 'Categories',
    icon: CategoriesIcon,
    adminOnly: true,
  },
  {
    to: '/admin/orders',
    label: 'Orders',
    icon: OrdersIcon,
  },
  {
    to: '/admin/team',
    label: 'Team',
    icon: TeamIcon,
    adminOnly: true,
  },
];

export default function AdminLayout() {
  const { admin, loading, signOut } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas-soft">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
          <p className="text-sm font-medium text-ink-muted">
            Loading admin portal...
          </p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || admin.role === 'admin'
  );

  async function handleSignOut() {
    await signOut();
    setMobileOpen(false);
  }

  return (
    <div className="min-h-screen bg-canvas-soft text-ink">

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Desktop / Mobile Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-border bg-surface
          shadow-[8px_0_30px_rgba(21,22,43,0.04)]
          transition-transform duration-300
          md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        {/* Logo */}
        <div className="flex h-20 items-center border-b border-border px-6">
          <Logo className="h-10 w-auto" />

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl text-ink-muted transition hover:bg-canvas-soft hover:text-ink md:hidden"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
            Management
          </p>

          <div className="space-y-1">
            {visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `
                  group flex items-center gap-3 rounded-xl px-3.5 py-3
                  text-sm font-semibold transition-all
                  ${isActive
                    ? 'bg-brand-soft text-brand shadow-sm'
                    : 'text-ink-muted hover:bg-canvas-soft hover:text-ink'
                  }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`
                        flex h-9 w-9 shrink-0 items-center justify-center
                        rounded-lg transition
                        ${isActive
                          ? 'bg-brand text-white shadow-sm shadow-brand/20'
                          : 'bg-canvas-soft text-ink-muted group-hover:bg-brand-softer group-hover:text-brand'
                        }
                      `}
                    >
                      <item.icon />
                    </span>

                    <span>{item.label}</span>

                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Admin profile */}
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-canvas-soft p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
              {getInitials(admin.name)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">
                {admin.name}
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" />
                <p className="text-xs font-medium capitalize text-ink-muted">
                  {admin.role}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="
              flex w-full items-center gap-3 rounded-xl px-3.5 py-3
              text-sm font-semibold text-ink-muted
              transition hover:bg-coral-soft hover:text-coral
            "
          >
            <LogoutIcon />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="min-h-screen md:pl-72">

        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur-md md:hidden">

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-canvas-soft text-ink transition hover:bg-brand-soft hover:text-brand"
            aria-label="Open navigation"
          >
            <MenuIcon />
          </button>

          <Logo className="h-8 w-auto" />

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            {getInitials(admin.name)}
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden h-20 items-center justify-between border-b border-border bg-surface px-8 lg:flex">
          <div>
            <p className="font-display text-sm font-bold text-ink">
              Admin Portal
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">
              Manage your Apple Hub services and operations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-ink">
                {admin.name}
              </p>
              <p className="text-xs capitalize text-ink-muted">
                {admin.role}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
              {getInitials(admin.name)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:min-h-[calc(100vh-5rem)] lg:p-8 xl:p-10">
          <Outlet />
        </main>
      </div>

      {/* Toast notifications */}
      {/* <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '14px',
            padding: '12px 16px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
          },
        }}
      /> */}
    </div>
  );
}

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
}

/* -------------------------------------------------------
   Icons
------------------------------------------------------- */

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 5H5v14h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M14 8l4 4-4 4M18 12H9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="1"
        y="1"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect
        x="10"
        y="1"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect
        x="1"
        y="10"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect
        x="10"
        y="10"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function ServicesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 5l7-4 7 4-7 4-7-4z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M2 9l7 4 7-4M2 13l7 4 7-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CategoriesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M2 3h6v6H2V3zM10 3h6v6h-6V3zM2 11h6v6H2v-6zM10 11h6v6h-6v-6z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3 2h12v14l-3-2-3 2-3-2-3 2V2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M6 6h6M6 9h6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle
        cx="6.5"
        cy="6"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M2 16c0-2.5 2-4.5 4.5-4.5S11 13.5 11 16"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle
        cx="13"
        cy="6.5"
        r="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M12 11.7c2 .3 3.5 2 3.5 4.3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
