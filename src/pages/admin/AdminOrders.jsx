import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getOrders,
  updateOrderStatus,
  assignOrder,
  getTeam,
} from '../../api/admin';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { formatPrice } from '../../components/ServiceCard';
import { LoadingState } from '../../components/StateViews';

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
];

export default function AdminOrders() {
  const { admin } = useAdminAuth();

  const [orders, setOrders] = useState([]);
  const [team, setTeam] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [detailOrder, setDetailOrder] = useState(null);

  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [assigningOrderId, setAssigningOrderId] = useState(null);

  const isAdmin = admin?.role === 'admin';

  /* ---------------------------------------------------------------------- */
  /* Load Orders                                                            */
  /* ---------------------------------------------------------------------- */

  const loadOrders = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const params = {};

        if (search.trim()) {
          params.search = search.trim();
        }

        if (statusFilter !== 'all') {
          params.status = statusFilter;
        }

        console.log('[Orders] Loading orders:', params);

        const data = await getOrders(params);

        setOrders(Array.isArray(data) ? data : []);

        console.log(
          '[Orders] Orders loaded:',
          Array.isArray(data) ? data.length : 0
        );
      } catch (error) {
        console.error('[Orders] Failed to load orders:', error);

        toast.error(
          error.message || 'Unable to load orders. Please try again.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search, statusFilter]
  );

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  /* ---------------------------------------------------------------------- */
  /* Load Team                                                              */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!isAdmin) return;

    async function loadTeam() {
      try {
        console.log('[Orders] Loading team members...');

        const data = await getTeam();

        setTeam(Array.isArray(data) ? data : []);

        console.log(
          '[Orders] Team members loaded:',
          Array.isArray(data) ? data.length : 0
        );
      } catch (error) {
        console.error('[Orders] Failed to load team:', error);

        toast.error(
          error.message || 'Unable to load team members.'
        );
      }
    }

    loadTeam();
  }, [isAdmin]);

  /* ---------------------------------------------------------------------- */
  /* Stats                                                                  */
  /* ---------------------------------------------------------------------- */

  const stats = useMemo(() => {
    const total = orders.length;

    const pending = orders.filter(
      (order) => order.order_status === 'pending'
    ).length;

    const inProgress = orders.filter(
      (order) => order.order_status === 'in_progress'
    ).length;

    const completed = orders.filter(
      (order) => order.order_status === 'completed'
    ).length;

    return {
      total,
      pending,
      inProgress,
      completed,
    };
  }, [orders]);

  /* ---------------------------------------------------------------------- */
  /* Status Update                                                          */
  /* ---------------------------------------------------------------------- */

  async function handleStatusChange(order, newStatus) {
    if (!order || order.order_status === newStatus) return;

    setUpdatingOrderId(order.id);

    try {
      console.log(
        '[Orders] Updating status:',
        order.id,
        newStatus
      );

      await updateOrderStatus(order.id, newStatus);

      toast.success(
        `Order ${order.order_number} is now ${formatStatus(newStatus)}.`
      );

      await loadOrders({ silent: true });
    } catch (error) {
      console.error('[Orders] Status update failed:', error);

      toast.error(
        error.message || 'Unable to update order status.'
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Assignment                                                             */
  /* ---------------------------------------------------------------------- */

  async function handleAssign(order, staffId) {
    setAssigningOrderId(order.id);

    try {
      console.log(
        '[Orders] Updating assignment:',
        order.id,
        staffId || 'unassigned'
      );

      await assignOrder(order.id, staffId || null);

      toast.success(
        staffId
          ? 'Order assigned successfully.'
          : 'Order unassigned successfully.'
      );

      await loadOrders({ silent: true });
    } catch (error) {
      console.error('[Orders] Assignment update failed:', error);

      toast.error(
        error.message || 'Unable to update order assignment.'
      );
    } finally {
      setAssigningOrderId(null);
    }
  }

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
  }

  return (
    <div className="min-w-0">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <OrdersIcon />
            </span>

            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Orders
              </h1>

              <p className="mt-0.5 text-sm text-ink-muted">
                {isAdmin
                  ? 'Manage customer orders, status and team assignments.'
                  : 'View and manage the orders assigned to you.'}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loadOrders({ silent: true })}
          disabled={refreshing}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-ink-muted shadow-sm transition hover:border-brand/20 hover:bg-brand-softer hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshIcon spinning={refreshing} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Stats                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={stats.total}
          icon={<OrdersIcon />}
          iconClass="bg-brand-soft text-brand"
        />

        <StatCard
          label="Pending"
          value={stats.pending}
          icon={<ClockIcon />}
          iconClass="bg-gold-soft text-gold"
        />

        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={<ProgressIcon />}
          iconClass="bg-teal-soft text-teal-deep"
        />

        <StatCard
          label="Completed"
          value={stats.completed}
          icon={<CheckIcon />}
          iconClass="bg-whatsapp-soft text-whatsapp-deep"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Filters                                                            */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-7 rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-ink/[0.025] sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-lg">
            <SearchIcon />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order number, customer or email..."
              className="h-11 w-full rounded-xl border border-border bg-canvas-soft pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <FilterIcon />

            {[
              { value: 'all', label: 'All Orders' },
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ].map((filter) => {
              const active = statusFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={`h-10 shrink-0 rounded-xl px-3.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-brand text-white shadow-sm shadow-brand/20'
                      : 'border border-border bg-white text-ink-muted hover:border-brand/20 hover:bg-brand-softer hover:text-brand'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {(search || statusFilter !== 'all') && (
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <p className="text-xs text-ink-muted">
              {loading
                ? 'Searching orders...'
                : `${orders.length} order${orders.length === 1 ? '' : 's'} found`}
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Orders                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-5">
        {loading ? (
          <div className="rounded-2xl border border-border bg-surface">
            <LoadingState label="Loading orders..." />
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders
            hasFilters={Boolean(search) || statusFilter !== 'all'}
            onClear={clearFilters}
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-sm shadow-ink/[0.025] xl:block">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="font-display text-sm font-semibold text-ink">
                    Customer Orders
                  </h2>

                  <p className="mt-0.5 text-xs text-ink-muted">
                    {orders.length} order{orders.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">
                  <thead>
                    <tr className="border-b border-border bg-canvas-soft/70">
                      <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Order
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Customer
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Service
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Amount
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Payment
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Status
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Assigned
                      </th>

                      <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {orders.map((order) => (
                      <OrderTableRow
                        key={order.id}
                        order={order}
                        team={team}
                        isAdmin={isAdmin}
                        updating={updatingOrderId === order.id}
                        assigning={assigningOrderId === order.id}
                        onStatusChange={handleStatusChange}
                        onAssign={handleAssign}
                        onView={setDetailOrder}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tablet / Mobile */}
            <div className="space-y-3 xl:hidden">
              {orders.map((order) => (
                <OrderMobileCard
                  key={order.id}
                  order={order}
                  team={team}
                  isAdmin={isAdmin}
                  updating={updatingOrderId === order.id}
                  assigning={assigningOrderId === order.id}
                  onStatusChange={handleStatusChange}
                  onAssign={handleAssign}
                  onView={setDetailOrder}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Details Modal                                                      */}
      {/* ------------------------------------------------------------------ */}

      {detailOrder && (
        <OrderDetailsModal
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
        />
      )}
    </div>
  );
}

/* ========================================================================== */
/* STAT CARD                                                                  */
/* ========================================================================== */

function StatCard({ label, value, icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-ink/[0.025] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </span>

        <span className="text-xs font-medium text-ink-faint">
          Overview
        </span>
      </div>

      <p className="mt-5 text-xs font-medium text-ink-muted">
        {label}
      </p>

      <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}

/* ========================================================================== */
/* DESKTOP ORDER ROW                                                          */
/* ========================================================================== */

function OrderTableRow({
  order,
  team,
  isAdmin,
  updating,
  assigning,
  onStatusChange,
  onAssign,
  onView,
}) {
  return (
    <tr className="group transition hover:bg-canvas-soft/50">
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={() => onView(order)}
          className="text-left"
        >
          <p className="text-sm font-semibold text-ink transition group-hover:text-brand">
            {order.order_number}
          </p>

          <p className="mt-0.5 text-xs text-ink-faint">
            {formatDate(order.created_at)}
          </p>
        </button>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-ink">
          {order.customer_name}
        </p>

        <p className="mt-0.5 max-w-[190px] truncate text-xs text-ink-muted">
          {order.customer_email}
        </p>
      </td>

      <td className="max-w-[220px] px-5 py-4">
        <p className="truncate text-sm text-ink-muted">
          {order.service_title}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-ink">
          {formatPrice(order.amount)}
        </p>
      </td>

      <td className="px-5 py-4">
        <PaymentBadge status={order.payment_status} />
      </td>

      <td className="px-5 py-4">
        <StatusSelect
          value={order.order_status}
          disabled={updating}
          onChange={(value) => onStatusChange(order, value)}
        />
      </td>

      <td className="px-5 py-4">
        {isAdmin ? (
          <AssignmentSelect
            order={order}
            team={team}
            disabled={assigning}
            onChange={(value) => onAssign(order, value)}
          />
        ) : (
          <span className="text-xs text-ink-muted">
            {order.assigned_to_name || 'Unassigned'}
          </span>
        )}
      </td>

      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={() => onView(order)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-semibold text-ink-muted transition hover:border-brand/20 hover:bg-brand-softer hover:text-brand"
        >
          <EyeIcon />
          View
        </button>
      </td>
    </tr>
  );
}

/* ========================================================================== */
/* MOBILE ORDER CARD                                                          */
/* ========================================================================== */

function OrderMobileCard({
  order,
  team,
  isAdmin,
  updating,
  assigning,
  onStatusChange,
  onAssign,
  onView,
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-ink/[0.025]">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onView(order)}
          className="min-w-0 text-left"
        >
          <p className="truncate text-sm font-semibold text-ink">
            {order.order_number}
          </p>

          <p className="mt-0.5 text-xs text-ink-faint">
            {formatDate(order.created_at)}
          </p>
        </button>

        <PaymentBadge status={order.payment_status} />
      </div>

      <div className="mt-4 rounded-xl bg-canvas-soft p-3.5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <UserIcon />
          </span>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">
              {order.customer_name}
            </p>

            <p className="mt-0.5 truncate text-xs text-ink-muted">
              {order.customer_email}
            </p>

            {order.customer_phone && (
              <p className="mt-0.5 text-xs text-ink-muted">
                {order.customer_phone}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
          Service
        </p>

        <p className="mt-1 text-sm font-medium text-ink">
          {order.service_title}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Amount
          </p>

          <p className="mt-1 font-display text-base font-semibold text-ink">
            {formatPrice(order.amount)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Status
          </p>

          <div className="mt-1">
            <StatusBadge status={order.order_status} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Order Status
          </p>

          <StatusSelect
            value={order.order_status}
            disabled={updating}
            onChange={(value) => onStatusChange(order, value)}
            fullWidth
          />
        </div>

        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Assigned To
          </p>

          {isAdmin ? (
            <AssignmentSelect
              order={order}
              team={team}
              disabled={assigning}
              onChange={(value) => onAssign(order, value)}
              fullWidth
            />
          ) : (
            <div className="flex h-10 items-center rounded-xl border border-border bg-white px-3 text-xs text-ink-muted">
              {order.assigned_to_name || 'Unassigned'}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onView(order)}
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white text-xs font-semibold text-ink-muted transition hover:border-brand/20 hover:bg-brand-softer hover:text-brand"
      >
        <EyeIcon />
        View Order Details
      </button>
    </div>
  );
}

/* ========================================================================== */
/* STATUS SELECT                                                              */
/* ========================================================================== */

function StatusSelect({
  value,
  disabled,
  onChange,
  fullWidth = false,
}) {
  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'w-[145px]'}`}>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 appearance-none rounded-xl border border-border bg-white pl-3 pr-8 text-xs font-semibold text-ink outline-none transition focus:border-brand/40 focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60 ${
          fullWidth ? 'w-full' : 'w-full'
        }`}
      >
        {ORDER_STATUSES.map((status) => (
          <option key={status} value={status}>
            {formatStatus(status)}
          </option>
        ))}
      </select>

      <ChevronIcon />
    </div>
  );
}

/* ========================================================================== */
/* ASSIGNMENT SELECT                                                          */
/* ========================================================================== */

function AssignmentSelect({
  order,
  team,
  disabled,
  onChange,
  fullWidth = false,
}) {
  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'w-[145px]'}`}>
      <select
        value={order.assigned_to || ''}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-xl border border-border bg-white px-3 pr-8 text-xs font-medium text-ink outline-none transition focus:border-brand/40 focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">Unassigned</option>

        {team.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>

      <ChevronIcon />
    </div>
  );
}

/* ========================================================================== */
/* PAYMENT BADGE                                                              */
/* ========================================================================== */

function PaymentBadge({ status }) {
  const config = {
    paid: {
      label: 'Paid',
      className: 'bg-whatsapp-soft text-whatsapp-deep',
      dot: 'bg-whatsapp',
    },
    pending: {
      label: 'Pending',
      className: 'bg-gold-soft text-gold',
      dot: 'bg-gold',
    },
    failed: {
      label: 'Failed',
      className: 'bg-coral-soft text-coral-deep',
      dot: 'bg-coral',
    },
    refunded: {
      label: 'Refunded',
      className: 'bg-teal-soft text-teal-deep',
      dot: 'bg-teal',
    },
  };

  const current = config[status] || {
    label: formatStatus(status),
    className: 'bg-canvas-soft text-ink-muted',
    dot: 'bg-ink-faint',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${current.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
}

/* ========================================================================== */
/* STATUS BADGE                                                               */
/* ========================================================================== */

function StatusBadge({ status }) {
  const config = {
    pending: {
      className: 'bg-gold-soft text-gold',
      dot: 'bg-gold',
    },
    confirmed: {
      className: 'bg-brand-soft text-brand',
      dot: 'bg-brand',
    },
    in_progress: {
      className: 'bg-teal-soft text-teal-deep',
      dot: 'bg-teal',
    },
    completed: {
      className: 'bg-whatsapp-soft text-whatsapp-deep',
      dot: 'bg-whatsapp',
    },
    cancelled: {
      className: 'bg-coral-soft text-coral-deep',
      dot: 'bg-coral',
    },
  };

  const current = config[status] || {
    className: 'bg-canvas-soft text-ink-muted',
    dot: 'bg-ink-faint',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${current.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {formatStatus(status)}
    </span>
  );
}

/* ========================================================================== */
/* EMPTY STATE                                                                */
/* ========================================================================== */

function EmptyOrders({ hasFilters, onClear }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-6 py-14 text-center shadow-sm shadow-ink/[0.025]">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <OrdersIcon size={24} />
      </span>

      <h3 className="mt-5 font-display text-base font-semibold text-ink">
        {hasFilters ? 'No orders found' : 'No orders yet'}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">
        {hasFilters
          ? 'Try changing your search or status filter.'
          : 'Customer orders will appear here once purchases are placed.'}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 h-10 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-ink-muted transition hover:border-brand/20 hover:text-brand"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

/* ========================================================================== */
/* ORDER DETAILS MODAL                                                        */
/* ========================================================================== */

function OrderDetailsModal({ order, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-2xl shadow-ink/20">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <OrdersIcon />
            </span>

            <div>
              <p className="text-xs font-medium text-ink-muted">
                Order Details
              </p>

              <h2 className="mt-0.5 font-display text-lg font-semibold text-ink">
                {order.order_number}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-faint transition hover:bg-canvas-soft hover:text-ink"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-6">
          {/* Status */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={order.order_status} />
            <PaymentBadge status={order.payment_status} />
          </div>

          {/* Customer */}
          <DetailSection
            title="Customer Information"
            icon={<UserIcon />}
          >
            <DetailRow
              label="Name"
              value={order.customer_name}
            />

            <DetailRow
              label="Email"
              value={order.customer_email}
            />

            <DetailRow
              label="Phone"
              value={order.customer_phone}
            />

            <DetailRow
              label="Address"
              value={order.customer_address || 'Not provided'}
              multiline
            />
          </DetailSection>

          {/* Order */}
          <DetailSection
            title="Order Information"
            icon={<OrdersIcon />}
          >
            <DetailRow
              label="Service"
              value={order.service_title}
              multiline
            />

            <DetailRow
              label="Amount"
              value={formatPrice(order.amount)}
              strong
            />

            <DetailRow
              label="Assigned to"
              value={order.assigned_to_name || 'Unassigned'}
            />

            <DetailRow
              label="Placed on"
              value={formatDateTime(order.created_at)}
            />
          </DetailSection>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-border bg-canvas-soft/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-border bg-white px-5 text-sm font-semibold text-ink-muted transition hover:text-ink"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* DETAIL SECTION                                                             */
/* ========================================================================== */

function DetailSection({ title, icon, children }) {
  return (
    <section className="mt-6 first:mt-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
          {icon}
        </span>

        <h3 className="text-sm font-semibold text-ink">
          {title}
        </h3>
      </div>

      <div className="rounded-2xl border border-border bg-canvas-soft/60 px-4">
        {children}
      </div>
    </section>
  );
}

/* ========================================================================== */
/* DETAIL ROW                                                                 */
/* ========================================================================== */

function DetailRow({
  label,
  value,
  multiline = false,
  strong = false,
}) {
  return (
    <div
      className={`flex gap-4 border-b border-border py-3.5 last:border-b-0 ${
        multiline ? 'items-start' : 'items-center'
      }`}
    >
      <span className="w-28 shrink-0 text-xs font-medium text-ink-muted">
        {label}
      </span>

      <span
        className={`min-w-0 flex-1 text-right text-sm ${
          strong
            ? 'font-display font-semibold text-ink'
            : 'text-ink'
        } ${multiline ? 'break-words leading-6' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function formatStatus(status) {
  if (!status) return 'Unknown';

  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ========================================================================== */
/* ICONS                                                                      */
/* ========================================================================== */

function OrdersIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12v18H6z" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}

function UserIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.3 3.1-5 7-5s6.2 1.7 7 5" />
    </svg>
  );
}

function ClockIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ProgressIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 17V7M10 17v-4M16 17V9M22 17V4" />
    </svg>
  );
}

function CheckIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function FilterIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-ink-faint"
    >
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

function RefreshIcon({ spinning = false }) {
  return (
    <svg
      className={spinning ? 'animate-spin' : ''}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11a8.1 8.1 0 0 0-14.8-4L3 10" />
      <path d="M3 4v6h6" />
      <path d="M4 13a8.1 8.1 0 0 0 14.8 4L21 14" />
      <path d="M21 20v-6h-6" />
    </svg>
  );
}

function EyeIcon({ size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CloseIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
