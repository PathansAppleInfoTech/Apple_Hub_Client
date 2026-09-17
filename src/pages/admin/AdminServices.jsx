import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import {
  getAllServices,
  getAllCategories,
  createService,
  updateService,
  deleteService,
} from '../../api/admin';

import { formatPrice } from '../../components/user/ServiceCard';
import { LoadingState } from '../../components/admin/StateViews';
import ServiceModal from '../../components/admin/ServicesModal';

const EMPTY_FORM = {
  title: '',
  category_id: '',
  tier: '',
  short_description: '',
  description: '',
  price: '',
  price_suffix: '',
  tax_type: 'not_applicable',
  tax_rate: '',
  duration: '',
  popular: 0,
  features: [],
  notes: [],
  freebies: '',
  image: '',
  is_active: 1,
};
export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({ ...EMPTY_FORM });

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // =========================================================
  // LOAD DATA
  // =========================================================

  const loadData = useCallback(async () => {
    console.log('[Admin Services] Loading services...');

    setLoading(true);

    try {
      const [servicesData, categoriesData] = await Promise.all([
        getAllServices(),
        getAllCategories(),
      ]);

      setServices(
        Array.isArray(servicesData) ? servicesData : []
      );

      setCategories(
        Array.isArray(categoriesData) ? categoriesData : []
      );

      console.log('[Admin Services] Services loaded:', {
        services: servicesData?.length || 0,
        categories: categoriesData?.length || 0,
      });
    } catch (error) {
      console.error(
        '[Admin Services] Failed to load services:',
        error
      );

      toast.error(
        error?.message || 'Failed to load services.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =========================================================
  // FILTERS
  // =========================================================

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !query ||
        service.title?.toLowerCase().includes(query) ||
        service.short_description?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        service.category_name?.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === 'all' ||
        String(service.category_id) === String(categoryFilter);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' &&
          Number(service.is_active) === 1) ||
        (statusFilter === 'inactive' &&
          Number(service.is_active) === 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    services,
    search,
    categoryFilter,
    statusFilter,
  ]);

  const activeCount = useMemo(
    () =>
      services.filter(
        (service) => Number(service.is_active) === 1
      ).length,
    [services]
  );

  const inactiveCount =
    services.length - activeCount;

  const customPricingCount = useMemo(
    () =>
      services.filter(
        (service) =>
          service.price === null ||
          service.price === undefined ||
          service.price === ''
      ).length,
    [services]
  );

  const hasFilters =
    search.trim() ||
    categoryFilter !== 'all' ||
    statusFilter !== 'all';

  // =========================================================
  // FORM
  // =========================================================

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreate() {
    console.log('[Admin Services] Opening create modal');

    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  }

  function openEdit(service) {
    console.log(
      '[Admin Services] Opening edit modal:',
      service.id
    );

    setEditing(service);

    setForm({
      title: service.title || '',
      category_id: service.category_id || '',

      tier: service.tier || '',

      short_description:
        service.short_description || '',

      description:
        service.description || '',

      price:
        service.price === null ||
          service.price === undefined
          ? ''
          : String(service.price),

      price_suffix:
        service.price_suffix || '',

      tax_type:
        service.tax_type || 'not_applicable',

      tax_rate:
        service.tax_rate === null || service.tax_rate === undefined
          ? ''
          : String(service.tax_rate),

      duration:
        service.duration || '',

      popular:
        Number(service.popular) === 1 ? 1 : 0,

      features:
        Array.isArray(service.features)
          ? service.features
          : [],

      notes:
        Array.isArray(service.notes)
          ? service.notes
          : [],

      freebies:
        service.freebies || '',

      is_active:
        Number(service.is_active) === 1 ? 1 : 0,
    });

    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditing(null);
    setForm({ ...EMPTY_FORM });
  }

  // =========================================================
  // SAVE
  // =========================================================

  async function handleSave(event) {
    event.preventDefault();

    const payload = {
      title: form.title.trim(),
      category_id: form.category_id
        ? Number(form.category_id)
        : null,

      tier: form.tier.trim() || null,

      short_description:
        form.short_description.trim() || null,

      description:
        form.description.trim() || null,

      // Empty price = Custom = NULL
      price:
        form.price === '' ||
          form.price === null
          ? null
          : Number(form.price),

      price_suffix:
        form.price_suffix.trim() || null,

      tax_type: form.tax_type === 'included' ? 'included' : 'not_applicable',
      tax_rate:
        form.tax_type === 'included' && form.tax_rate !== ''
          ? Number(form.tax_rate)
          : null,

      duration:
        form.duration.trim() || null,

      popular: Number(form.popular) ? 1 : 0,

      features: Array.isArray(form.features)
        ? form.features
        : [],

      notes: Array.isArray(form.notes)
        ? form.notes
        : [],

      freebies:
        form.freebies.trim() || null,

      image:
        form.image?.trim() || null,

      is_active: Number(form.is_active) ? 1 : 0,
    };

    console.log(
      `[Services] ${editing ? 'Updating' : 'Creating'} service:`,
      {
        title: payload.title,
        category_id: payload.category_id,
        price: payload.price,
        popular: payload.popular,
      }
    );

    try {
      setSaving(true);

      if (editing) {
        await updateService(editing.id, payload);
        toast.success('Service updated successfully.');
      } else {
        await createService(payload);
        toast.success('Service created successfully.');
      }

      closeModal();
      await loadData();
    } catch (error) {
      console.error(
        '[Services] Save failed:',
        error
      );

      toast.error(
        error.message ||
        `Unable to ${editing ? 'update' : 'create'
        } service.`
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // DELETE
  // =========================================================

  function openDelete(service) {
    console.log(
      '[Admin Services] Delete requested:',
      service.id
    );

    setDeleteTarget(service);
    setDeleteModalOpen(true);
  }

  function closeDelete() {
    if (deleting) return;

    setDeleteModalOpen(false);
    setDeleteTarget(null);
  }

  async function handleDelete() {
    if (!deleteTarget || deleting) return;

    console.log(
      '[Admin Services] Deleting service:',
      deleteTarget.id
    );

    setDeleting(true);

    try {
      await deleteService(deleteTarget.id);

      toast.success(
        'Service removed successfully'
      );

      setDeleteModalOpen(false);
      setDeleteTarget(null);

      await loadData();
    } catch (error) {
      console.error(
        '[Admin Services] Delete failed:',
        error
      );

      toast.error(
        error?.message ||
        'Failed to remove service'
      );
    } finally {
      setDeleting(false);
    }
  }

  function clearFilters() {
    setSearch('');
    setCategoryFilter('all');
    setStatusFilter('all');
  }


  function CustomDropdown({
    value,
    onChange,
    options,
    placeholder = 'Select',
    width = 'w-full',
    icon,
  }) {
    const [open, setOpen] = useState(false);

    const selectedOption =
      options.find((option) => option.value === value) || options[0];

    useEffect(() => {
      function handleClickOutside(event) {
        if (!event.target.closest('[data-custom-dropdown]')) {
          setOpen(false);
        }
      }

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div
        className={`relative ${width}`}
        data-custom-dropdown
      >
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`
          flex h-11 w-full items-center
          justify-between
          rounded-xl
          border
          bg-canvas-soft
          px-3.5
          text-left
          outline-none
          transition-all duration-200
          ${open
              ? 'border-brand bg-white ring-4 ring-brand/10'
              : 'border-border hover:border-brand/25 hover:bg-white'
            }
        `}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            {/* Icon */}
            <span
              className={`
              flex h-7 w-7 shrink-0 items-center justify-center
              rounded-lg
              transition-colors
              ${open
                  ? 'bg-brand-soft text-brand'
                  : 'bg-white text-ink-muted'
                }
            `}
            >
              {icon}
            </span>

            <span className="truncate text-sm font-medium text-ink">
              {selectedOption?.label || placeholder}
            </span>
          </span>

          {/* Chevron */}
          <span
            className={`
            ml-2 flex h-6 w-6 shrink-0 items-center justify-center
            text-ink-muted
            transition-transform duration-200
            ${open ? 'rotate-180 text-brand' : ''}
          `}
          >
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
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="
            absolute left-0 right-0 top-[calc(100%+8px)]
            z-50
            overflow-hidden
            rounded-xl
            border border-border
            bg-white
            p-1.5
            shadow-[0_16px_40px_rgba(21,22,43,0.12)]
            animate-in
          "
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`
                  flex w-full items-center
                  justify-between
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  transition-all duration-150
                  ${isSelected
                      ? 'bg-brand-soft text-brand'
                      : 'text-ink hover:bg-canvas-soft'
                    }
                `}
                >
                  <span className="flex items-center gap-2.5">
                    {option.dot && (
                      <span
                        className={`
                        h-2 w-2 rounded-full
                        ${option.dot}
                      `}
                      />
                    )}

                    <span className="text-sm font-medium">
                      {option.label}
                    </span>
                  </span>

                  {isSelected && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-brand"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <div className="mx-auto max-w-[1600px]">

        {/* =====================================================
            PAGE HEADING
        ====================================================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Service management
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Services
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-ink-muted">
              Manage the services and packages available
              for customers to purchase.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="
              inline-flex w-fit items-center gap-2
              rounded-xl bg-brand px-4 py-2.5
              text-sm font-bold text-white
              shadow-lg shadow-brand/20
              transition
              hover:-translate-y-0.5
              hover:bg-brand-deep
            "
          >
            <PlusIcon />
            Add service
          </button>
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total Services"
            value={services.length}
            description="All services"
            icon={<ServicesIcon />}
            className="bg-brand-soft text-brand"
          />

          <SummaryCard
            label="Active Services"
            value={activeCount}
            description="Visible to customers"
            icon={<CheckIcon />}
            className="bg-whatsapp-soft text-whatsapp"
          />

          <SummaryCard
            label="Inactive"
            value={inactiveCount}
            description="Currently hidden"
            icon={<PauseIcon />}
            className="bg-canvas-soft text-ink-muted"
          />

          <SummaryCard
            label="Custom Pricing"
            value={customPricingCount}
            description="Requires enquiry"
            icon={<TagIcon />}
            className="bg-coral-soft text-coral"
          />
        </div>

        {/* =====================================================
            FILTER PANEL
        ====================================================== */}

        <div className="mt-6 rounded-2xl border border-border bg-surface p-4 shadow-[0_8px_30px_rgba(21,22,43,0.035)]">
          {/* Filter Controls */}
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">

            {/* Search */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted">
                <SearchIcon />
              </div>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services, descriptions or categories..."
                className="
          h-11 w-full rounded-xl
          border border-border
          bg-canvas-soft
          pl-10 pr-4
          text-sm text-ink
          outline-none
          transition-all duration-200
          placeholder:text-ink-faint
          hover:border-brand/25
          hover:bg-white
          focus:border-brand
          focus:bg-white
          focus:ring-4
          focus:ring-brand/10
        "
              />
            </div>

            {/* Category Filter */}
            <div className="relative w-full xl:w-60">

              <CustomDropdown
                value={categoryFilter}
                onChange={setCategoryFilter}
                width="w-full xl:w-60"
                icon={
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
                    <path d="M4 6h16" />
                    <path d="M7 12h10" />
                    <path d="M10 18h4" />
                  </svg>
                }
                options={[
                  {
                    value: 'all',
                    label: 'All categories',
                  },
                  ...categories.map((category) => ({
                    value: String(category.id),
                    label: category.name,
                  })),
                ]}
              />

            </div>

            {/* Status Filter */}
            <div className="relative w-full xl:w-44">


              <CustomDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                width="w-full xl:w-44"
                icon={
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
                    <path d="M12 8v4l2.5 2.5" />
                  </svg>
                }
                options={[
                  {
                    value: 'all',
                    label: 'All status',
                  },
                  {
                    value: 'active',
                    label: 'Active',
                    dot: 'bg-whatsapp',
                  },
                  {
                    value: 'inactive',
                    label: 'Inactive',
                    dot: 'bg-ink-faint',
                  },
                ]}
              />


            </div>

            {/* Clear Filters */}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="
          group
          flex h-11 items-center justify-center gap-2
          rounded-xl
          border border-border
          bg-white
          px-4
          text-sm font-semibold
          text-ink-muted
          transition-all duration-200
          hover:border-brand/20
          hover:bg-brand-soft
          hover:text-brand
          active:scale-[0.98]
        "
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
                  className="transition-transform duration-200 group-hover:rotate-90"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>

                Clear
              </button>
            )}
          </div>

          {/* Filter Summary */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <p className="text-xs text-ink-muted">
              Showing{' '}
              <span className="font-semibold text-ink">
                {filteredServices.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-ink">
                {services.length}
              </span>{' '}
              services
            </p>

            <div className="flex items-center gap-2">
              {search && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-bold text-brand">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  Search active
                </span>
              )}

              {categoryFilter !== 'all' && (
                <span className="hidden rounded-full bg-teal-soft px-2.5 py-1 text-[10px] font-bold text-teal sm:inline-flex">
                  Category filtered
                </span>
              )}

              {statusFilter !== 'all' && (
                <span className="hidden rounded-full bg-whatsapp-soft px-2.5 py-1 text-[10px] font-bold text-whatsapp-deep sm:inline-flex">
                  Status filtered
                </span>
              )}

              {hasFilters && (
                <span className="rounded-full border border-border bg-canvas-soft px-2.5 py-1 text-[10px] font-semibold text-ink-muted">
                  Filters active
                </span>
              )}
            </div>
          </div>
        </div>


        {/* =====================================================
            SERVICE LIST
        ====================================================== */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_8px_30px_rgba(21,22,43,0.035)]">

          {loading ? (
            <div className="p-6">
              <LoadingState label="Loading services…" />
            </div>
          ) : services.length === 0 ? (
            <EmptyServices onCreate={openCreate} />
          ) : filteredServices.length === 0 ? (
            <NoResults onClear={clearFilters} />
          ) : (
            <>
              {/* -------------------------------------------------
                  TABLE HEADER
              -------------------------------------------------- */}

              <div className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-6">
                <div>
                  <h2 className="font-display text-sm font-bold text-ink">
                    Service catalogue
                  </h2>

                  <p className="mt-1 text-xs text-ink-muted">
                    Your customer-facing services and packages
                  </p>
                </div>

                <span className="rounded-lg bg-canvas-soft px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  {filteredServices.length} items
                </span>
              </div>

              {/* -------------------------------------------------
                  DESKTOP TABLE
              -------------------------------------------------- */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[820px]">
                  <thead>
                    <tr className="border-b border-border bg-canvas-soft/60">
                      <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                        Service
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                        Category
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                        Price
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                        Status
                      </th>

                      <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {filteredServices.map(
                      (service) => (
                        <ServiceRow
                          key={service.id}
                          service={service}
                          onEdit={openEdit}
                          onDelete={openDelete}
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* -------------------------------------------------
                  MOBILE
              -------------------------------------------------- */}

              <div className="divide-y divide-border md:hidden">
                {filteredServices.map(
                  (service) => (
                    <MobileServiceCard
                      key={service.id}
                      service={service}
                      onEdit={openEdit}
                      onDelete={openDelete}
                    />
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* =======================================================
          CUSTOM ADD / EDIT MODAL
      ======================================================== */}

      {modalOpen && (
        <ServiceModal
          editing={editing}
          form={form}
          categories={categories}
          saving={saving}
          updateForm={updateForm}
          onClose={closeModal}
          onSubmit={handleSave}
        />
      )}

      {/* =======================================================
          CUSTOM DELETE MODAL
      ======================================================== */}

      {deleteModalOpen && deleteTarget && (
        <DeleteModal
          service={deleteTarget}
          deleting={deleting}
          onClose={closeDelete}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}

// =============================================================
// SUMMARY CARD
// =============================================================

function SummaryCard({
  label,
  value,
  description,
  icon,
  className,
}) {
  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl border border-border
        bg-surface p-5
        shadow-[0_8px_30px_rgba(21,22,43,0.035)]
        transition duration-300
        hover:-translate-y-1
        hover:shadow-[0_14px_35px_rgba(21,22,43,0.08)]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
        >
          {icon}
        </div>

        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-faint">
          Overview
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

// =============================================================
// DESKTOP ROW
// =============================================================

function ServiceRow({
  service,
  onEdit,
  onDelete,
}) {
  const active =
    Number(service.is_active) === 1;

  return (
    <tr className="group transition hover:bg-canvas-soft/50">

      <td className="px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <ServicesIcon />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              {service.title}
            </p>

            {service.short_description && (
              <p className="mt-0.5 max-w-[360px] truncate text-xs text-ink-muted">
                {service.short_description}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        {service.category_name ? (
          <span className="inline-flex max-w-[200px] truncate rounded-lg bg-brand-softer px-2.5 py-1 text-xs font-medium text-brand">
            {service.category_name}
          </span>
        ) : (
          <span className="text-sm text-ink-faint">
            Uncategorized
          </span>
        )}
      </td>

      <td className="px-5 py-4">
        {isCustomPrice(service) ? (
          <span className="text-sm font-semibold text-brand">
            Custom
          </span>
        ) : (
          <div>
            <span className="text-sm font-semibold text-ink">
              {formatPrice(service.price)}
            </span>

            {service.price_suffix && (
              <span className="ml-1 text-[10px] text-ink-muted">
                {service.price_suffix}
              </span>
            )}
          </div>
        )}
      </td>

      <td className="px-5 py-4">
        <StatusBadge active={active} />
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">

          <button
            type="button"
            onClick={() => onEdit(service)}
            className="
              inline-flex items-center gap-1.5
              rounded-lg border border-border
              bg-white px-3 py-2
              text-xs font-semibold text-ink
              transition
              hover:border-brand/20
              hover:bg-brand-soft
              hover:text-brand
            "
          >
            <EditIcon />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(service)}
            className="
              rounded-lg px-3 py-2
              text-xs font-semibold text-coral
              transition
              hover:bg-coral-soft
            "
          >
            Delete
          </button>

        </div>
      </td>
    </tr>
  );
}

// =============================================================
// MOBILE CARD
// =============================================================

function MobileServiceCard({
  service,
  onEdit,
  onDelete,
}) {
  const active =
    Number(service.is_active) === 1;

  return (
    <div className="px-5 py-5">

      <div className="flex items-start gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <ServicesIcon />
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-ink">
                {service.title}
              </h3>

              {service.category_name && (
                <p className="mt-1 text-xs text-ink-muted">
                  {service.category_name}
                </p>
              )}
            </div>

            <StatusBadge active={active} />
          </div>

          {service.short_description && (
            <p className="mt-2 text-xs leading-5 text-ink-muted">
              {service.short_description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                Price
              </p>

              {isCustomPrice(service) ? (
                <p className="mt-0.5 text-sm font-bold text-brand">
                  Custom
                </p>
              ) : (
                <p className="mt-0.5 text-sm font-bold text-ink">
                  {formatPrice(service.price)}
                </p>
              )}
            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() => onEdit(service)}
                className="
                  rounded-lg border border-border
                  bg-white px-3 py-2
                  text-xs font-semibold text-ink
                  hover:bg-canvas-soft
                "
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete(service)}
                className="
                  rounded-lg border border-coral/10
                  bg-white px-3 py-2
                  text-xs font-semibold text-coral
                  hover:bg-coral-soft
                "
              >
                Delete
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// STATUS
// =============================================================

function StatusBadge({ active }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-2.5 py-1
        text-[11px] font-semibold
        ${active
          ? 'bg-whatsapp-soft text-whatsapp-deep'
          : 'bg-canvas-soft text-ink-muted'
        }
      `}
    >
      <span
        className={`
          h-1.5 w-1.5 rounded-full
          ${active
            ? 'bg-whatsapp'
            : 'bg-ink-faint'
          }
        `}
      />

      {active ? 'Active' : 'Inactive'}
    </span>
  );
}


// =============================================================
// CUSTOM DELETE MODAL
// =============================================================

function DeleteModal({
  service,
  deleting,
  onClose,
  onConfirm,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (
        event.key === 'Escape' &&
        !deleting
      ) {
        onClose();
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [deleting, onClose]);

  return (
    <div
      className="
        fixed inset-0 z-[110]
        flex items-center justify-center
        bg-ink/30 p-4
        backdrop-blur-[2px]
      "
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !deleting
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full max-w-md
          overflow-hidden
          rounded-2xl
          border border-border
          bg-surface
          shadow-[0_30px_90px_rgba(21,22,43,0.18)]
        "
      >
        <div className="p-6 sm:p-7">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-soft text-coral">
            <TrashLargeIcon />
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-coral">
            Delete service
          </p>

          <h2 className="mt-1 font-display text-xl font-bold text-ink">
            Remove this service?
          </h2>

          <p className="mt-2 text-sm leading-6 text-ink-muted">
            You are about to remove{' '}
            <span className="font-semibold text-ink">
              "{service.title}"
            </span>
            . This action cannot be undone from this
            screen.
          </p>

          <div className="mt-5 rounded-xl border border-border bg-canvas-soft p-3.5">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <ServicesIcon />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {service.title}
                </p>

                <p className="mt-0.5 truncate text-xs text-ink-muted">
                  {service.category_name ||
                    'Uncategorized'}
                </p>
              </div>

            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="
                rounded-xl border border-border
                bg-white px-5 py-2.5
                text-sm font-semibold text-ink
                transition
                hover:bg-canvas-soft
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="
                inline-flex items-center
                justify-center gap-2
                rounded-xl bg-coral
                px-5 py-2.5
                text-sm font-bold text-white
                shadow-lg shadow-coral/20
                transition
                hover:bg-coral-deep
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {deleting ? (
                <>
                  <Spinner />
                  Removing…
                </>
              ) : (
                <>
                  <TrashIcon />
                  Remove Service
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// MODAL HELPERS
// =============================================================

function ModalSection({
  title,
  description,
}) {
  return (
    <div>
      <h3 className="font-display text-sm font-bold text-ink">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-ink-muted">
        {description}
      </p>
    </div>
  );
}

function FormField({
  label,
  required = false,
  hint,
  children,
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-ink">
          {label}

          {required && (
            <span className="ml-1 text-coral">
              *
            </span>
          )}
        </label>

        {hint && (
          <span className="text-[10px] text-ink-faint">
            {hint}
          </span>
        )}
      </div>

      <div className="mt-1.5">
        {children}
      </div>
    </div>
  );
}

function isCustomPrice(service) {
  return (
    service.price === null ||
    service.price === undefined ||
    service.price === ''
  );
}

// =============================================================
// ICONS
// =============================================================

function ServicesIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
    >
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

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
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

function CheckSmallIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M10 9v6M14 9v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 13 13 20a2 2 0 0 1-2.8 0L4 13.8V5h8.8L20 12.2a.6.6 0 0 1 0 .8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <circle
        cx="8.5"
        cy="8.5"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m4 16 10.5-10.5a2.1 2.1 0 0 1 3 0l1 1a2.1 2.1 0 0 1 0 3L8 20H4v-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="m13 7 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EditIconLarge() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m4 16 10.5-10.5a2.1 2.1 0 0 1 3 0l1 1a2.1 2.1 0 0 1 0 3L8 20H4v-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="m13 7 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashLargeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m3 3 18 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M10.6 6.2A9.5 9.5 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-3.1 3.8M6.2 6.7C3.9 8.2 2.5 12 2.5 12s3.5 6 9.5 6c1.2 0 2.3-.2 3.3-.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity=".25"
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

// =============================================================
// EMPTY STATES
// =============================================================

function EmptyServices({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <ServicesIcon />
      </div>

      <h3 className="mt-4 font-display text-sm font-bold text-ink">
        No services yet
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-ink-muted">
        Add your first service to start building your
        customer-facing catalogue.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="
          mt-5 inline-flex items-center gap-2
          rounded-xl bg-brand
          px-4 py-2.5
          text-sm font-bold text-white
          shadow-lg shadow-brand/20
          transition
          hover:bg-brand-deep
        "
      >
        <PlusIcon />
        Add service
      </button>
    </div>
  );
}

function NoResults({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <SearchIcon />
      </div>

      <h3 className="mt-4 font-display text-sm font-bold text-ink">
        No services found
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-ink-muted">
        Try changing your search or filters.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-4 text-sm font-semibold text-brand hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}
