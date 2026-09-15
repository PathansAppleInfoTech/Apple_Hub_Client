import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getDashboardStats } from '../../api/admin';
import { formatPrice } from '../../components/ServiceCard';
import StatusPill from '../../components/StatusPill';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      console.log('[Admin Dashboard] Initializing dashboard...');

      try {
        setStatus('loading');

        const data = await getDashboardStats();

        if (!mounted) return;

        setStats(data);
        setStatus('ready');

        console.log('[Admin Dashboard] Dashboard ready.');
      } catch (error) {
        if (!mounted) return;

        console.error(
          '[Admin Dashboard] Dashboard initialization failed:',
          error
        );

        setStatus('error');

        toast.error(
          error.message || "Couldn't load dashboard stats."
        );
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const allowedStatuses = ['confirmed', 'processing', 'completed', 'refunded'];

  const statusCounts = useMemo(() => {
    const counts = {
      confirmed: 0,
      processing: 0,
      completed: 0,
      refunded: 0,
    };

    for (const item of stats?.statusSummary || []) {
      const status = String(item.order_status || '').toLowerCase();

      if (allowedStatuses.includes(status)) {
        counts[status] = Number(item.total || 0);
      }
    }

    return counts;
  }, [stats]);

  const filteredStatusSummary = useMemo(() => {
    return (stats?.statusSummary || []).filter((item) =>
      allowedStatuses.includes(
        String(item.order_status || '').toLowerCase()
      )
    );
  }, [stats]);

  const statusTotals = useMemo(() => {
    return Object.values(statusCounts).reduce(
      (total, value) => total + Number(value || 0),
      0
    );
  }, [statusCounts]);

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (status === 'error' || !stats) {
    return (
      <DashboardError
        onRetry={() => window.location.reload()}
      />
    );
  }

  const cards = [
    {
      label: 'Total Services',
      value: stats.totalServices ?? 0,
      icon: ServicesIcon,
      description: 'Active services',
      className: 'bg-brand-soft text-brand',
    },
    {
      label: 'Total Categories',
      value: stats.totalCategories ?? 0,
      icon: CategoriesIcon,
      description: 'Active categories',
      className: 'bg-teal-soft text-teal',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders ?? 0,
      icon: OrdersIcon,
      description: 'All customer orders',
      className: 'bg-coral-soft text-coral',
    },
    {
      label: 'Revenue',
      value: formatPrice(stats.revenue ?? 0),
      icon: RevenueIcon,
      description: 'Total paid revenue',
      className: 'bg-gold-soft text-gold',
      featured: true,
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px]">

      {/* --------------------------------------------------
          Page heading
      -------------------------------------------------- */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Admin overview
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1.5 max-w-xl text-sm leading-6 text-ink-muted">
            Keep track of your services, orders and business performance
            from one place.
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="
            inline-flex w-fit items-center gap-2 rounded-xl
            bg-brand px-4 py-2.5 text-sm font-bold text-white
            shadow-lg shadow-brand/20
            transition hover:-translate-y-0.5 hover:bg-brand-deep
          "
        >
          View orders
          <ArrowIcon />
        </Link>
      </div>

      {/* --------------------------------------------------
          Stats
      -------------------------------------------------- */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            {...card}
          />
        ))}
      </div>

      {/* --------------------------------------------------
          Main content
      -------------------------------------------------- */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">

        {/* Recent Orders */}
        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_8px_30px_rgba(21,22,43,0.035)]">

          <div className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-display text-sm font-bold text-ink">
                Recent orders
              </h2>

              <p className="mt-1 text-xs text-ink-muted">
                Latest activity from your customers
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="
                inline-flex items-center gap-1.5 rounded-lg
                px-3 py-2 text-xs font-bold text-brand
                transition hover:bg-brand-soft
              "
            >
              View all
              <ArrowIcon small />
            </Link>
          </div>

          {stats.recentOrders?.length === 0 ? (
            <EmptyOrders />
          ) : (
            <>
              {/* Desktop/tablet table */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-canvas-soft/60">
                      <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                        Order
                      </th>

                      <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                        Customer
                      </th>

                      <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                        Amount
                      </th>

                      <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {stats.recentOrders.map((order) => (
                      <RecentOrderRow
                        key={order.id}
                        order={order}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-border sm:hidden">
                {stats.recentOrders.map((order) => (
                  <MobileOrderCard
                    key={order.id}
                    order={order}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Order Status */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-[0_8px_30px_rgba(21,22,43,0.035)] sm:p-6">

          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-sm font-bold text-ink">
                Order status
              </h2>

              <p className="mt-1 text-xs text-ink-muted">
                Current order distribution
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <ChartIcon />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-display text-3xl font-bold tracking-tight text-ink">
                  {statusTotals}
                </p>

                <p className="mt-1 text-xs text-ink-muted">
                  Total orders tracked
                </p>
              </div>

              <Link
                to="/admin/orders"
                className="text-xs font-bold text-brand hover:underline"
              >
                Manage
              </Link>
            </div>
          </div>

          <div className="mt-7 space-y-5">
            {filteredStatusSummary.length === 0 ? (
              <p className="rounded-xl bg-canvas-soft px-4 py-6 text-center text-sm text-ink-muted">
                No orders yet.
              </p>
            ) : (
              filteredStatusSummary.map((item) => (
                <StatusRow
                  key={item.order_status}
                  status={item.order_status}
                  total={Number(item.total || 0)}
                  grandTotal={statusTotals}
                />
              ))
            )}
          </div>
        </section>
      </div>

      {/* --------------------------------------------------
          Quick actions
      -------------------------------------------------- */}
      <section className="mt-6">
        <div className="mb-4">
          <h2 className="font-display text-sm font-bold text-ink">
            Quick actions
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction
            to="/admin/services"
            icon={ServicesIcon}
            title="Manage services"
            description="Add, edit or update your services."
            className="bg-brand-soft text-brand"
          />

          <QuickAction
            to="/admin/categories"
            icon={CategoriesIcon}
            title="Manage categories"
            description="Organize your service catalog."
            className="bg-teal-soft text-teal"
          />

          <QuickAction
            to="/admin/orders"
            icon={OrdersIcon}
            title="Manage orders"
            description="Review and update customer orders."
            className="bg-coral-soft text-coral"
          />
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   Stat Card
========================================================= */

function StatCard({
  label,
  value,
  icon: Icon,
  description,
  className,
  featured,
}) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl border border-border
        bg-surface p-5
        shadow-[0_8px_30px_rgba(21,22,43,0.035)]
        transition duration-300
        hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(21,22,43,0.08)]
        ${featured ? 'xl:col-span-1' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`
            flex h-10 w-10 items-center justify-center rounded-xl
            ${className}
          `}
        >
          <Icon />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-faint">
          {featured ? 'Business' : 'Overview'}
        </span>
      </div>

      <p className="mt-5 text-xs font-semibold text-ink-muted">
        {label}
      </p>

      <p className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
        {value}
      </p>

      <p className="mt-1 text-[11px] font-medium text-ink-faint">
        {description}
      </p>

      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand/[0.025] transition group-hover:scale-150" />
    </div>
  );
}

function getDisplayStatus(status) {
  const normalized = String(status || '').toLowerCase();

  if (normalized === 'pending') return 'confirmed';

  if (allowedOrderStatuses.includes(normalized)) {
    return normalized;
  }

  return 'confirmed';
}

const allowedOrderStatuses = [
  'confirmed',
  'processing',
  'completed',
  'refunded',
];

/* =========================================================
   Recent Order - Desktop
========================================================= */

function RecentOrderRow({ order }) {
  return (
    <tr className="group transition hover:bg-canvas-soft/50">
      <td className="px-6 py-4">
        <span className="font-display text-xs font-bold text-ink">
          {order.order_number}
        </span>
      </td>

      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-ink">
            {order.customer_name}
          </p>

          <p className="mt-0.5 max-w-[240px] truncate text-xs text-ink-muted">
            {order.service_title}
          </p>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="text-sm font-bold text-ink">
          {formatPrice(order.amount)}
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <StatusPill status={getDisplayStatus(order.order_status)} />
      </td>
    </tr>
  );
}

/* =========================================================
   Recent Order - Mobile
========================================================= */

function MobileOrderCard({ order }) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-display text-xs font-bold text-ink">
            {order.order_number}
          </p>

          <p className="mt-1 text-sm font-semibold text-ink">
            {order.customer_name}
          </p>

          <p className="mt-0.5 truncate text-xs text-ink-muted">
            {order.service_title}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-ink">
            {formatPrice(order.amount)}
          </p>

          <div className="mt-2">
            <StatusPill status={getDisplayStatus(order.order_status)} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Status Row
========================================================= */

function StatusRow({
  status,
  total,
  grandTotal,
}) {
  const percentage =
    grandTotal > 0
      ? Math.round((total / grandTotal) * 100)
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <StatusPill status={status} />

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-ink">
            {total}
          </span>

          <span className="text-xs font-medium text-ink-faint">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas-soft">
        <div
          className="h-full rounded-full bg-brand transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   Quick Action
========================================================= */

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
  className,
}) {
  return (
    <Link
      to={to}
      className="
        group flex items-center gap-4 rounded-2xl
        border border-border bg-surface p-4
        shadow-[0_8px_30px_rgba(21,22,43,0.025)]
        transition duration-300
        hover:-translate-y-0.5
        hover:border-brand/20
        hover:shadow-[0_12px_30px_rgba(21,22,43,0.06)]
      "
    >
      <div
        className={`
          flex h-11 w-11 shrink-0 items-center justify-center
          rounded-xl ${className}
        `}
      >
        <Icon />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-ink-muted">
          {description}
        </p>
      </div>

      <ArrowIcon small />
    </Link>
  );
}

/* =========================================================
   Empty / Error / Loading
========================================================= */

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas-soft text-ink-muted">
        <OrdersIcon />
      </div>

      <h3 className="mt-4 text-sm font-bold text-ink">
        No orders yet
      </h3>

      <p className="mt-1 max-w-xs text-xs leading-5 text-ink-muted">
        New customer orders will appear here once they are placed.
      </p>
    </div>
  );
}

function DashboardError({ onRetry }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-soft text-coral">
          <WarningIcon />
        </div>

        <h2 className="mt-5 font-display text-lg font-bold text-ink">
          Dashboard unavailable
        </h2>

        <p className="mt-2 text-sm leading-6 text-ink-muted">
          We couldn't load your dashboard statistics.
          Please try again.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="
            mt-5 rounded-xl bg-brand px-5 py-2.5
            text-sm font-bold text-white
            shadow-lg shadow-brand/20
            transition hover:bg-brand-deep
          "
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px] animate-pulse">
      <div className="h-24 rounded-2xl bg-white" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-36 rounded-2xl border border-border bg-white"
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <div className="h-[420px] rounded-2xl border border-border bg-white" />
        <div className="h-[420px] rounded-2xl border border-border bg-white" />
      </div>
    </div>
  );
}

/* =========================================================
   Icons
========================================================= */

function ArrowIcon({ small = false }) {
  const size = small ? 14 : 16;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServicesIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 7l9-4 9 4-9 4-9-4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M3 12l9 4 9-4M3 17l9 4 9-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 3h14v18l-3.5-2-3.5 2-3.5-2L5 21V3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8 8h8M8 12h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CategoriesIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="4"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="14"
        y="4"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="4"
        y="14"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="14"
        y="14"
        width="6"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m8.5 12 2.3 2.3 4.8-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RevenueIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v18M16 7.5c0-1.7-1.6-3-4-3s-4 1.2-4 3 1.4 2.5 4 3.2 4 1.5 4 3.3-1.6 3-4 3-4-1.3-4-3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 19V5M4 19h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="m7 15 3-4 3 2 5-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4 21 20H3L12 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v5M12 17.2v.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

