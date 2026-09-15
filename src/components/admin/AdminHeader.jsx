import Logo from '../common/Logo';
import { MenuIcon } from './AdminIcons';

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');
}

export default function AdminHeader({
  admin,
  onMenuOpen,
}) {
  return (
    <>
      {/* Mobile Header */}
      <header
        className="
          sticky top-0 z-30
          flex h-16 items-center
          justify-between
          border-b border-border
          bg-white/95
          px-4
          backdrop-blur-md
          md:hidden
        "
      >
        <button
          type="button"
          onClick={onMenuOpen}
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            bg-canvas-soft
            text-ink
            transition
            hover:bg-brand-soft
            hover:text-brand
          "
          aria-label="Open navigation"
        >
          <MenuIcon />
        </button>

        <Logo className="h-8 w-auto" />

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
          {getInitials(admin?.name)}
        </div>
      </header>

      {/* Desktop Header */}
      <header
        className="
          hidden h-20
          items-center justify-between
          border-b border-border
          bg-surface px-8
          lg:flex
        "
      >
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
              {admin?.name}
            </p>

            <p className="text-xs capitalize text-ink-muted">
              {admin?.role}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
            {getInitials(admin?.name)}
          </div>
        </div>
      </header>
    </>
  );
}