import { NavLink } from 'react-router-dom';

import Logo from '../common/Logo';
import { ADMIN_NAV_ITEMS } from './adminNavigation';
import { CloseIcon, LogoutIcon } from './AdminIcons';

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
}

export default function AdminSidebar({
  admin,
  mobileOpen,
  onClose,
  onSignOut,
  unattendedOrderCount = 0,
}) {
  const visibleItems = ADMIN_NAV_ITEMS.filter(
    (item) =>
      !item.adminOnly ||
      admin?.role === 'admin'
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-ink/20 backdrop-blur-sm
            md:hidden
          "
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          border-r border-border
          bg-surface
          shadow-[8px_0_30px_rgba(21,22,43,0.04)]
          transition-transform duration-300
          md:translate-x-0
          ${
            mobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-border px-6">
          <Logo className="h-10 w-auto" />

          <button
            type="button"
            onClick={onClose}
            className="
              ml-auto flex h-9 w-9
              items-center justify-center
              rounded-xl
              text-ink-muted
              transition
              hover:bg-canvas-soft
              hover:text-ink
              md:hidden
            "
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
            {visibleItems.map((item) => {
              const Icon = item.icon;

              const isOrders =
                item.to === '/admin/orders';

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    group flex items-center gap-3
                    rounded-xl px-3.5 py-3
                    text-sm font-semibold
                    transition-all
                    ${
                      isActive
                        ? 'bg-brand-soft text-brand shadow-sm'
                        : 'text-ink-muted hover:bg-canvas-soft hover:text-ink'
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Icon */}
                      <span
                        className={`
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-lg transition
                          ${
                            isActive
                              ? 'bg-brand text-white shadow-sm shadow-brand/20'
                              : 'bg-canvas-soft text-ink-muted group-hover:bg-brand-softer group-hover:text-brand'
                          }
                        `}
                      >
                        <Icon />
                      </span>

                      {/* Label */}
                      <span>{item.label}</span>

                      {/* Unattended Orders Count */}
                      {isOrders &&
                        unattendedOrderCount > 0 && (
                          <span
                            className="
                              ml-auto
                              flex min-w-6 h-6
                              items-center justify-center
                              rounded-full
                              bg-coral
                              px-1.5
                              text-[11px]
                              font-extrabold
                              leading-none
                              text-white
                              shadow-sm
                            "
                            title={`${unattendedOrderCount} unattended orders`}
                          >
                            {unattendedOrderCount > 99
                              ? '99+'
                              : unattendedOrderCount}
                          </span>
                        )}

                      {/* Active indicator */}
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Profile */}
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-canvas-soft p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
              {getInitials(admin?.name)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">
                {admin?.name}
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" />

                <p className="text-xs font-medium capitalize text-ink-muted">
                  {admin?.role}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="
              flex w-full items-center gap-3
              rounded-xl px-3.5 py-3
              text-sm font-semibold
              text-ink-muted
              transition
              hover:bg-coral-soft
              hover:text-coral
            "
          >
            <LogoutIcon />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}