import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deactivateCategory,
} from '../../api/admin';
import { LoadingState } from '../../components/admin/StateViews';

const EMPTY_FORM = {
  name: '',
  description: '',
  is_active: 1,
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDeactivate, setCategoryToDeactivate] = useState(null);
  const [deactivating, setDeactivating] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      console.log('[Categories] Loading categories...');

      const data = await getAllCategories();

      setCategories(Array.isArray(data) ? data : []);

      console.log(
        '[Categories] Categories loaded:',
        Array.isArray(data) ? data.length : 0
      );
    } catch (error) {
      console.error('[Categories] Failed to load categories:', error);
      toast.error(
        error.message || 'Unable to load categories. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((category) => Number(category.is_active) === 1).length;
    const inactive = total - active;

    return {
      total,
      active,
      inactive,
    };
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        category.name?.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query) ||
        category.slug?.toLowerCase().includes(query);

      const isActive = Number(category.is_active) === 1;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'inactive' && !isActive);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  function openCreate() {
    console.log('[Categories] Opening create modal');

    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(category) {
    console.log('[Categories] Editing category:', category.id);

    setEditing(category);

    setForm({
      name: category.name || '',
      description: category.description || '',
      is_active: Number(category.is_active) === 1 ? 1 : 0,
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

  async function handleSave(e) {
    e.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      toast.error('Please enter a category name.');
      return;
    }

    if (name.length < 2) {
      toast.error('Category name must be at least 2 characters.');
      return;
    }

    if (saving) return;

    setSaving(true);

    const payload = {
      name,
      description,
      is_active: Number(form.is_active),
    };

    try {
      if (editing) {
        console.log('[Categories] Updating category:', editing.id);

        await updateCategory(editing.id, payload);

        toast.success('Category updated successfully.');
      } else {
        console.log('[Categories] Creating category:', name);

        await createCategory(payload);

        toast.success('Category created successfully.');
      }

      closeModal();
      await loadData();
    } catch (error) {
      console.error('[Categories] Save failed:', error);

      toast.error(
        error.message ||
        `Unable to ${editing ? 'update' : 'create'} category.`
      );
    } finally {
      setSaving(false);
    }
  }

  function openDeactivateModal(category) {
    console.log('[Categories] Deactivate confirmation:', category.id);

    setCategoryToDeactivate(category);
    setDeleteModalOpen(true);
  }

  function closeDeactivateModal() {
    if (deactivating) return;

    setDeleteModalOpen(false);
    setCategoryToDeactivate(null);
  }

  async function handleDeactivate() {
    if (!categoryToDeactivate || deactivating) return;

    setDeactivating(true);

    try {
      console.log(
        '[Categories] Deactivating category:',
        categoryToDeactivate.id
      );

      await deactivateCategory(categoryToDeactivate.id);

      toast.success(
        `"${categoryToDeactivate.name}" has been deactivated.`
      );

      closeDeactivateModal();
      await loadData();
    } catch (error) {
      console.error('[Categories] Deactivation failed:', error);

      toast.error(
        error.message || 'Unable to deactivate this category.'
      );
    } finally {
      setDeactivating(false);
    }
  }

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <CategoryIcon />
            </span>

            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
                Categories
              </h1>

              <p className="mt-0.5 text-sm text-ink-muted">
                Organize your services into clear customer-facing categories.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-deep active:scale-[0.98]"
        >
          <PlusIcon />
          Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Categories"
          value={stats.total}
          icon={<LayersIcon />}
          iconClass="bg-brand-soft text-brand"
        />

        <StatCard
          label="Active Categories"
          value={stats.active}
          icon={<CheckIcon />}
          iconClass="bg-whatsapp-soft text-whatsapp-deep"
        />

        <StatCard
          label="Inactive Categories"
          value={stats.inactive}
          icon={<ArchiveIcon />}
          iconClass="bg-coral-soft text-coral-deep"
        />
      </div>

      {/* Filters */}
      <div className="mt-7 rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-ink/[0.025] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <SearchIcon />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="h-11 w-full rounded-xl border border-border bg-canvas-soft pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
          </div>

          <div className="flex w-full gap-2 overflow-x-auto lg:w-auto">
            {[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ].map((filter) => {
              const active = statusFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={`h-10 shrink-0 rounded-xl px-4 text-sm font-medium transition ${active
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
      </div>

      {/* Content */}
      <div className="mt-5">
        {loading ? (
          <div className="rounded-2xl border border-border bg-surface">
            <LoadingState label="Loading categories…" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <EmptyCategories
            hasFilters={Boolean(search.trim()) || statusFilter !== 'all'}
            onClear={() => {
              setSearch('');
              setStatusFilter('all');
            }}
            onCreate={openCreate}
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-sm shadow-ink/[0.025] md:block">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="font-display text-sm font-semibold text-ink">
                    All Categories
                  </h2>

                  <p className="mt-0.5 text-xs text-ink-muted">
                    Showing {filteredCategories.length} of {categories.length} categories
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-canvas-soft/70">
                      <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Category
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                        Description
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
                    {filteredCategories.map((category) => (
                      <CategoryTableRow
                        key={category.id}
                        category={category}
                        onEdit={openEdit}
                        onDeactivate={openDeactivateModal}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {filteredCategories.map((category) => (
                <CategoryMobileCard
                  key={category.id}
                  category={category}
                  onEdit={openEdit}
                  onDeactivate={openDeactivateModal}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <CategoryModal
          editing={editing}
          form={form}
          saving={saving}
          onChange={handleChange}
          onStatusChange={handleStatusChange}
          onClose={closeModal}
          onSubmit={handleSave}
        />
      )}

      {/* Deactivate Modal */}
      {deleteModalOpen && (
        <DeactivateModal
          category={categoryToDeactivate}
          loading={deactivating}
          onClose={closeDeactivateModal}
          onConfirm={handleDeactivate}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({ label, value, icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-ink/[0.025] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
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

/* -------------------------------------------------------------------------- */
/* Desktop Row                                                                */
/* -------------------------------------------------------------------------- */

function CategoryTableRow({ category, onEdit, onDeactivate }) {
  const active = Number(category.is_active) === 1;

  return (
    <tr className="group transition hover:bg-canvas-soft/50">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft font-display text-sm font-semibold text-brand">
            {category.name?.charAt(0)?.toUpperCase() || 'C'}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              {category.name}
            </p>

            {category.slug && (
              <p className="mt-0.5 truncate text-xs text-ink-faint">
                /{category.slug}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="max-w-md px-5 py-4">
        <p className="line-clamp-2 text-sm leading-6 text-ink-muted">
          {category.description || 'No description added'}
        </p>
      </td>

      <td className="px-5 py-4">
        <StatusBadge active={active} />
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-semibold text-ink-muted transition hover:border-brand/20 hover:bg-brand-softer hover:text-brand"
          >
            <EditIcon />
            Edit
          </button>

          {active && (
            <button
              type="button"
              onClick={() => onDeactivate(category)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-coral/15 bg-coral-soft/40 px-3 text-xs font-semibold text-coral-deep transition hover:bg-coral-soft"
            >
              <ArchiveIcon />
              Deactivate
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile Card                                                                */
/* -------------------------------------------------------------------------- */

function CategoryMobileCard({ category, onEdit, onDeactivate }) {
  const active = Number(category.is_active) === 1;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-ink/[0.025]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft font-display font-semibold text-brand">
            {category.name?.charAt(0)?.toUpperCase() || 'C'}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              {category.name}
            </p>

            {category.slug && (
              <p className="mt-0.5 truncate text-xs text-ink-faint">
                /{category.slug}
              </p>
            )}
          </div>
        </div>

        <StatusBadge active={active} />
      </div>

      <p className="mt-4 text-sm leading-6 text-ink-muted">
        {category.description || 'No description added'}
      </p>

      <div className="mt-4 flex gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-white text-xs font-semibold text-ink-muted transition hover:border-brand/20 hover:bg-brand-softer hover:text-brand"
        >
          <EditIcon />
          Edit
        </button>

        {active && (
          <button
            type="button"
            onClick={() => onDeactivate(category)}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-coral/15 bg-coral-soft/40 text-xs font-semibold text-coral-deep transition hover:bg-coral-soft"
          >
            <ArchiveIcon />
            Deactivate
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${active
          ? 'bg-whatsapp-soft text-whatsapp-deep'
          : 'bg-canvas-soft text-ink-faint'
        }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-whatsapp' : 'bg-ink-faint'
          }`}
      />

      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyCategories({ hasFilters, onClear, onCreate }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-6 py-14 text-center shadow-sm shadow-ink/[0.025]">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <CategoryIcon size={24} />
      </span>

      <h3 className="mt-5 font-display text-base font-semibold text-ink">
        {hasFilters ? 'No categories found' : 'No categories yet'}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">
        {hasFilters
          ? 'Try changing your search or status filter to find what you are looking for.'
          : 'Create your first category to start organizing your services.'}
      </p>

      <div className="mt-5 flex justify-center gap-2">
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
            Add Category
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Category Modal                                                              */
/* -------------------------------------------------------------------------- */

function CategoryModal({
  editing,
  form,
  saving,
  onChange,
  onStatusChange,
  onClose,
  onSubmit,
}) {
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
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                {editing ? <EditIcon size={18} /> : <PlusIcon size={19} />}
              </span>

              <div>
                <h2 className="font-display text-lg font-semibold text-ink">
                  {editing ? 'Edit Category' : 'Add Category'}
                </h2>

                <p className="mt-0.5 text-xs text-ink-muted">
                  {editing
                    ? 'Update your category details.'
                    : 'Create a new service category.'}
                </p>
              </div>
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

        {/* Modal Body */}
        <form onSubmit={onSubmit}>
          <div className="space-y-5 px-6 py-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Category Name
              </label>

              <input
                autoFocus
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="e.g. Facebook & Instagram Marketing"
                disabled={saving}
                className="mt-2 h-11 w-full rounded-xl border border-border bg-canvas-soft px-4 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Description
              </label>

              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={onChange}
                disabled={saving}
                placeholder="Briefly describe what services belong to this category..."
                className="mt-2 w-full resize-none rounded-xl border border-border bg-canvas-soft px-4 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-ink-faint focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-1.5 text-[11px] text-ink-faint">
                Keep the description short and customer-friendly.
              </p>
            </div>

            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-canvas-soft px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-ink">
                  Active Category
                </p>

                <p className="mt-0.5 text-xs text-ink-muted">
                  Active categories can be shown to customers.
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
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${Number(form.is_active) === 1
                    ? 'bg-brand'
                    : 'bg-ink-faint/30'
                  } disabled:opacity-50`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${Number(form.is_active) === 1
                      ? 'left-6'
                      : 'left-1'
                    }`}
                />
              </button>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border bg-canvas-soft/50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-10 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-ink-muted transition hover:border-ink/10 hover:text-ink disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 min-w-[125px] items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Spinner />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon size={16} />
                  {editing ? 'Update Category' : 'Create Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Deactivate Modal                                                            */
/* -------------------------------------------------------------------------- */

function DeactivateModal({
  category,
  loading,
  onClose,
  onConfirm,
}) {
  if (!category) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-white shadow-2xl shadow-ink/20">
        <div className="p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-soft text-coral-deep">
            <ArchiveIcon size={21} />
          </div>

          <h2 className="mt-5 font-display text-lg font-semibold text-ink">
            Deactivate category?
          </h2>

          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Are you sure you want to deactivate{' '}
            <span className="font-semibold text-ink">
              {category.name}
            </span>
            ? This category will no longer be active.
          </p>

          <div className="mt-5 rounded-xl bg-canvas-soft px-4 py-3 text-xs leading-5 text-ink-muted">
            Existing services in this category will not be deleted.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border bg-canvas-soft/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-10 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-ink-muted transition hover:text-ink disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex h-10 min-w-[125px] items-center justify-center gap-2 rounded-xl bg-coral px-4 text-sm font-semibold text-white transition hover:bg-coral-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Spinner />
                Deactivating...
              </>
            ) : (
              <>
                <ArchiveIcon size={15} />
                Deactivate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function CategoryIcon({ size = 18 }) {
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
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function LayersIcon({ size = 18 }) {
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
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
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

function ArchiveIcon({ size = 18 }) {
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
      <path d="M4 7h16" />
      <path d="M6 7v12h12V7" />
      <path d="M8 4h8l1 3H7l1-3Z" />
      <path d="M9.5 11h5" />
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
