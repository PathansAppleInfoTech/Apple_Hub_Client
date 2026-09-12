import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getTeam,
  createTeamMember,
  updateTeamMember,
} from '../../api/admin';
import { LoadingState } from '../../components/StateViews';

const EMPTY_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'staff',
  is_active: 1,
};

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      console.log('[Team] Loading team members...');

      const data = await getTeam();

      setTeam(Array.isArray(data) ? data : []);

      console.log(
        '[Team] Team members loaded:',
        Array.isArray(data) ? data.length : 0
      );
    } catch (error) {
      console.error('[Team] Failed to load team:', error);

      toast.error(
        error.message || 'Unable to load team members. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---------------------------------------------------------------------- */
  /* Stats                                                                  */
  /* ---------------------------------------------------------------------- */

  const stats = useMemo(() => {
    const total = team.length;

    const active = team.filter(
      (member) => Number(member.is_active) === 1
    ).length;

    const admins = team.filter(
      (member) => member.role === 'admin'
    ).length;

    const staff = team.filter(
      (member) => member.role === 'staff'
    ).length;

    return {
      total,
      active,
      admins,
      staff,
    };
  }, [team]);

  /* ---------------------------------------------------------------------- */
  /* Filters                                                                */
  /* ---------------------------------------------------------------------- */

  const filteredTeam = useMemo(() => {
    const query = search.trim().toLowerCase();

    return team.filter((member) => {
      const matchesSearch =
        !query ||
        member.name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === 'all' ||
        member.role === roleFilter;

      const isActive = Number(member.is_active) === 1;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'inactive' && !isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [team, search, roleFilter, statusFilter]);

  function clearFilters() {
    setSearch('');
    setRoleFilter('all');
    setStatusFilter('all');
  }

  /* ---------------------------------------------------------------------- */
  /* Modal                                                                  */
  /* ---------------------------------------------------------------------- */

  function openCreate() {
    console.log('[Team] Opening create member modal');

    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(member) {
    console.log('[Team] Editing member:', member.id);

    setEditing(member);

    setForm({
      name: member.name || '',
      email: member.email || '',
      password: '',
      role: member.role || 'staff',
      is_active: Number(member.is_active) === 1 ? 1 : 0,
    });

    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleStatusChange(e) {
    setForm((current) => ({
      ...current,
      is_active: e.target.checked ? 1 : 0,
    }));
  }

  /* ---------------------------------------------------------------------- */
  /* Save                                                                   */
  /* ---------------------------------------------------------------------- */

  async function handleSave(e) {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!name) {
      toast.error('Please enter the team member name.');
      return;
    }

    if (name.length < 2) {
      toast.error('Name must be at least 2 characters.');
      return;
    }

    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!editing && !password) {
      toast.error('Please create a password for this team member.');
      return;
    }

    if (!editing && password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    if (editing && password && password.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }

    if (!['admin', 'staff'].includes(form.role)) {
      toast.error('Please select a valid role.');
      return;
    }

    if (saving) return;

    setSaving(true);

    try {
      if (editing) {
        const payload = {
          name,
          email,
          role: form.role,
          is_active: Number(form.is_active),
        };

        if (password) {
          payload.password = password;
        }

        console.log('[Team] Updating member:', editing.id);

        await updateTeamMember(editing.id, payload);

        toast.success('Team member updated successfully.');
      } else {
        const payload = {
          name,
          email,
          password,
          role: form.role,
          is_active: Number(form.is_active),
        };

        console.log('[Team] Creating team member:', email);

        await createTeamMember(payload);

        toast.success('Team member added successfully.');
      }

      closeModal();
      await loadData({ silent: true });
    } catch (error) {
      console.error('[Team] Save failed:', error);

      toast.error(
        error.message ||
          `Unable to ${editing ? 'update' : 'add'} team member.`
      );
    } finally {
      setSaving(false);
    }
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
              <TeamIcon />
            </span>

            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Team
              </h1>

              <p className="mt-0.5 text-sm text-ink-muted">
                Manage the admins and staff who access your dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadData({ silent: true })}
            disabled={refreshing}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-ink-muted shadow-sm transition hover:border-brand/20 hover:bg-brand-softer hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshIcon spinning={refreshing} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-deep active:scale-[0.98]"
          >
            <PlusIcon />
            Add Member
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Stats                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Members"
          value={stats.total}
          icon={<TeamIcon />}
          iconClass="bg-brand-soft text-brand"
        />

        <StatCard
          label="Active Members"
          value={stats.active}
          icon={<CheckIcon />}
          iconClass="bg-whatsapp-soft text-whatsapp-deep"
        />

        <StatCard
          label="Administrators"
          value={stats.admins}
          icon={<ShieldIcon />}
          iconClass="bg-gold-soft text-gold"
        />

        <StatCard
          label="Staff Members"
          value={stats.staff}
          icon={<UserIcon />}
          iconClass="bg-teal-soft text-teal-deep"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Filters                                                            */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-7 rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-ink/[0.025] sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* Search */}
          <div className="relative w-full xl:max-w-md">
            <SearchIcon />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="h-11 w-full rounded-xl border border-border bg-canvas-soft pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto">
            <FilterGroup
              label="All Roles"
              value="all"
              active={roleFilter === 'all'}
              onClick={() => setRoleFilter('all')}
            />

            <FilterGroup
              label="Admins"
              value="admin"
              active={roleFilter === 'admin'}
              onClick={() => setRoleFilter('admin')}
            />

            <FilterGroup
              label="Staff"
              value="staff"
              active={roleFilter === 'staff'}
              onClick={() => setRoleFilter('staff')}
            />

            <div className="mx-1 h-10 w-px shrink-0 bg-border" />

            <FilterGroup
              label="Active"
              value="active"
              active={statusFilter === 'active'}
              onClick={() =>
                setStatusFilter(
                  statusFilter === 'active' ? 'all' : 'active'
                )
              }
            />

            <FilterGroup
              label="Inactive"
              value="inactive"
              active={statusFilter === 'inactive'}
              onClick={() =>
                setStatusFilter(
                  statusFilter === 'inactive' ? 'all' : 'inactive'
                )
              }
            />
          </div>
        </div>

        {(search || roleFilter !== 'all' || statusFilter !== 'all') && (
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <p className="text-xs text-ink-muted">
              Showing {filteredTeam.length} of {team.length} members
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
      {/* Team List                                                          */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-5">
        {loading ? (
          <div className="rounded-2xl border border-border bg-surface">
            <LoadingState label="Loading team members..." />
          </div>
        ) : filteredTeam.length === 0 ? (
          <EmptyTeam
            hasFilters={
              Boolean(search) ||
              roleFilter !== 'all' ||
              statusFilter !== 'all'
            }
            onClear={clearFilters}
            onCreate={openCreate}
          />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-sm shadow-ink/[0.025] md:block">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="font-display text-sm font-semibold text-ink">
                    Team Members
                  </h2>

                  <p className="mt-0.5 text-xs text-ink-muted">
                    {filteredTeam.length} member
                    {filteredTeam.length === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                  <thead>
                    <tr className="border-b border-border bg-canvas-soft/70">
                      <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Member
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Role
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Status
                      </th>

                      <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {filteredTeam.map((member) => (
                      <TeamTableRow
                        key={member.id}
                        member={member}
                        onEdit={openEdit}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile */}
            <div className="space-y-3 md:hidden">
              {filteredTeam.map((member) => (
                <TeamMobileCard
                  key={member.id}
                  member={member}
                  onEdit={openEdit}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Add / Edit Modal                                                   */}
      {/* ------------------------------------------------------------------ */}

      {modalOpen && (
        <TeamMemberModal
          editing={editing}
          form={form}
          saving={saving}
          onChange={handleChange}
          onStatusChange={handleStatusChange}
          onClose={closeModal}
          onSubmit={handleSave}
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
/* FILTER BUTTON                                                              */
/* ========================================================================== */

function FilterGroup({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 shrink-0 rounded-xl px-3.5 text-xs font-semibold transition ${
        active
          ? 'bg-brand text-white shadow-sm shadow-brand/20'
          : 'border border-border bg-white text-ink-muted hover:border-brand/20 hover:bg-brand-softer hover:text-brand'
      }`}
    >
      {label}
    </button>
  );
}

/* ========================================================================== */
/* DESKTOP ROW                                                                */
/* ========================================================================== */

function TeamTableRow({ member, onEdit }) {
  const active = Number(member.is_active) === 1;

  return (
    <tr className="group transition hover:bg-canvas-soft/50">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={member.name} role={member.role} />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              {member.name}
            </p>

            <p className="mt-0.5 truncate text-xs text-ink-muted">
              {member.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <RoleBadge role={member.role} />
      </td>

      <td className="px-5 py-4">
        <StatusBadge active={active} />
      </td>

      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={() => onEdit(member)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-semibold text-ink-muted transition hover:border-brand/20 hover:bg-brand-softer hover:text-brand"
        >
          <EditIcon />
          Edit
        </button>
      </td>
    </tr>
  );
}

/* ========================================================================== */
/* MOBILE CARD                                                                */
/* ========================================================================== */

function TeamMobileCard({ member, onEdit }) {
  const active = Number(member.is_active) === 1;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-ink/[0.025]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={member.name} role={member.role} size="large" />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              {member.name}
            </p>

            <p className="mt-0.5 truncate text-xs text-ink-muted">
              {member.email}
            </p>
          </div>
        </div>

        <StatusBadge active={active} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <RoleBadge role={member.role} />

        <button
          type="button"
          onClick={() => onEdit(member)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-semibold text-ink-muted transition hover:border-brand/20 hover:bg-brand-softer hover:text-brand"
        >
          <EditIcon />
          Edit
        </button>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* AVATAR                                                                     */
/* ========================================================================== */

function Avatar({ name, role, size = 'normal' }) {
  const initials = getInitials(name);

  const isAdmin = role === 'admin';

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl font-display font-semibold ${
        size === 'large' ? 'h-11 w-11 text-sm' : 'h-10 w-10 text-xs'
      } ${
        isAdmin
          ? 'bg-brand-soft text-brand'
          : 'bg-teal-soft text-teal-deep'
      }`}
    >
      {initials}
    </span>
  );
}

/* ========================================================================== */
/* ROLE BADGE                                                                 */
/* ========================================================================== */

function RoleBadge({ role }) {
  const isAdmin = role === 'admin';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isAdmin
          ? 'bg-brand-soft text-brand'
          : 'bg-teal-soft text-teal-deep'
      }`}
    >
      {isAdmin ? <ShieldIcon size={12} /> : <UserIcon size={12} />}

      {isAdmin ? 'Administrator' : 'Staff'}
    </span>
  );
}

/* ========================================================================== */
/* STATUS BADGE                                                               */
/* ========================================================================== */

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        active
          ? 'bg-whatsapp-soft text-whatsapp-deep'
          : 'bg-canvas-soft text-ink-faint'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? 'bg-whatsapp' : 'bg-ink-faint'
        }`}
      />

      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

/* ========================================================================== */
/* EMPTY STATE                                                                */
/* ========================================================================== */

function EmptyTeam({ hasFilters, onClear, onCreate }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-6 py-14 text-center shadow-sm shadow-ink/[0.025]">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <TeamIcon size={24} />
      </span>

      <h3 className="mt-5 font-display text-base font-semibold text-ink">
        {hasFilters ? 'No team members found' : 'No team members yet'}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">
        {hasFilters
          ? 'Try changing your search or filters to find a team member.'
          : 'Add your first team member so orders can be assigned to your staff.'}
      </p>

      <div className="mt-5 flex justify-center">
        {hasFilters ? (
          <button
            type="button"
            onClick={onClear}
            className="h-10 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-ink-muted transition hover:border-brand/20 hover:text-brand"
          >
            Clear Filters
          </button>
        ) : (
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-deep"
          >
            <PlusIcon />
            Add Team Member
          </button>
        )}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* TEAM MEMBER MODAL                                                          */
/* ========================================================================== */

function TeamMemberModal({
  editing,
  form,
  saving,
  onChange,
  onStatusChange,
  onClose,
  onSubmit,
}) {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && !saving) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, saving]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-white shadow-2xl shadow-ink/20">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
              {editing ? <EditIcon size={18} /> : <TeamIcon size={18} />}
            </span>

            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                {editing ? 'Edit Team Member' : 'Add Team Member'}
              </h2>

              <p className="mt-0.5 text-xs text-ink-muted">
                {editing
                  ? 'Update account details and access.'
                  : 'Create an account for your team.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-faint transition hover:bg-canvas-soft hover:text-ink disabled:opacity-40"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit}>
          <div className="space-y-5 px-6 py-6">
            {/* Name */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Full Name
              </label>

              <input
                autoFocus
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Enter full name"
                disabled={saving}
                className="mt-2 h-11 w-full rounded-xl border border-border bg-canvas-soft px-4 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="name@company.com"
                disabled={saving}
                className="mt-2 h-11 w-full rounded-xl border border-border bg-canvas-soft px-4 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {editing ? 'New Password' : 'Password'}
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder={
                    editing
                      ? 'Leave blank to keep current password'
                      : 'Minimum 8 characters'
                  }
                  disabled={saving}
                  className="h-11 w-full rounded-xl border border-border bg-canvas-soft px-4 pr-11 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={saving}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-faint transition hover:bg-white hover:text-brand disabled:opacity-40"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <p className="mt-1.5 text-[11px] text-ink-faint">
                {editing
                  ? 'Only enter a password if you want to change it.'
                  : 'Use at least 8 characters for better security.'}
              </p>
            </div>

            {/* Role */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Role
              </label>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <RoleOption
                  value="staff"
                  selected={form.role === 'staff'}
                  onClick={() =>
                    onChange({
                      target: {
                        name: 'role',
                        value: 'staff',
                      },
                    })
                  }
                  icon={<UserIcon />}
                  title="Staff"
                  description="Manage assigned orders"
                />

                <RoleOption
                  value="admin"
                  selected={form.role === 'admin'}
                  onClick={() =>
                    onChange({
                      target: {
                        name: 'role',
                        value: 'admin',
                      },
                    })
                  }
                  icon={<ShieldIcon />}
                  title="Admin"
                  description="Full dashboard access"
                />
              </div>
            </div>

            {/* Active */}
            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-canvas-soft px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-ink">
                  Active Account
                </p>

                <p className="mt-0.5 text-xs text-ink-muted">
                  Active members can sign in to the dashboard.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={Boolean(Number(form.is_active))}
                onClick={() =>
                  onStatusChange({
                    target: {
                      checked: !Boolean(Number(form.is_active)),
                    },
                  })
                }
                disabled={saving}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  Number(form.is_active) === 1
                    ? 'bg-brand'
                    : 'bg-ink-faint/30'
                } disabled:opacity-50`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                    Number(form.is_active) === 1
                      ? 'left-6'
                      : 'left-1'
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border bg-canvas-soft/50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-10 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-ink-muted transition hover:text-ink disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 min-w-[140px] items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Spinner />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon size={16} />
                  {editing ? 'Update Member' : 'Create Member'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* ROLE OPTION                                                                */
/* ========================================================================== */

function RoleOption({
  selected,
  onClick,
  icon,
  title,
  description,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-3.5 text-left transition ${
        selected
          ? 'border-brand/30 bg-brand-softer ring-2 ring-brand/10'
          : 'border-border bg-white hover:border-brand/20 hover:bg-brand-softer/50'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            selected
              ? 'bg-brand text-white'
              : 'bg-canvas-soft text-ink-muted'
          }`}
        >
          {icon}
        </span>

        <span>
          <span className="block text-sm font-semibold text-ink">
            {title}
          </span>

          <span className="mt-0.5 block text-[10px] text-ink-muted">
            {description}
          </span>
        </span>
      </div>
    </button>
  );
}

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function getInitials(name) {
  if (!name) return 'TM';

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ========================================================================== */
/* ICONS                                                                      */
/* ========================================================================== */

function TeamIcon({ size = 18 }) {
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
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c.6-3.2 2.4-5 5.5-5s4.9 1.8 5.5 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.9" />
      <path d="M17 15c2.2.3 3.5 1.9 4 4" />
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

function ShieldIcon({ size = 17 }) {
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
      <path d="M12 3 20 6v5c0 5-3.2 8.3-8 10-4.8-1.7-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
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

function PlusIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function EditIcon({ size = 15 }) {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
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

function EyeIcon({ size = 17 }) {
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

function EyeOffIcon({ size = 17 }) {
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
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.1A10.7 10.7 0 0 1 12 5c6 0 9.5 7 9.5 7a17.7 17.7 0 0 1-3.2 3.8" />
      <path d="M6.2 6.2C3.6 8.2 2.5 12 2.5 12s3.5 7 9.5 7c1 0 2-.2 2.8-.5" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="3"
      />

      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
