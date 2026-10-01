import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Seo from '../../components/common/Seo';
import toast from 'react-hot-toast';

import {
  getServices,
  getCategories,
} from '../../api/services';

// --------------------------------------------------
// CATEGORY COLORS
// --------------------------------------------------

const COLOR_MAP = {
  brand: {
    iconBg: 'bg-brand text-white',
    tagBg: 'bg-brand-soft text-brand-deep',
    ring: 'hover:border-brand/40',
    price: 'text-brand-deep',
    pillActive: 'bg-brand text-white border-brand',
  },

  teal: {
    iconBg: 'bg-teal text-white',
    tagBg: 'bg-teal-soft text-teal-deep',
    ring: 'hover:border-teal/40',
    price: 'text-teal-deep',
    pillActive: 'bg-teal text-white border-teal',
  },

  whatsapp: {
    iconBg: 'bg-whatsapp text-white',
    tagBg: 'bg-whatsapp-soft text-whatsapp-deep',
    ring: 'hover:border-whatsapp/40',
    price: 'text-whatsapp-deep',
    pillActive: 'bg-whatsapp text-white border-whatsapp',
  },

  coral: {
    iconBg: 'bg-coral text-white',
    tagBg: 'bg-coral-soft text-coral-deep',
    ring: 'hover:border-coral/40',
    price: 'text-coral-deep',
    pillActive: 'bg-coral text-white border-coral',
  },
};

const DEFAULT_COLORS = ['brand', 'teal', 'whatsapp', 'coral'];

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function parseJsonField(value, fallback = []) {
  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

function getCategoryColor(category, index = 0) {
  if (category?.color && COLOR_MAP[category.color]) {
    return category.color;
  }

  return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

function getCategoryImage(category) {
  return {
    image:
      category.image_url ||
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85',
    position: 'center',
  };
}

function formatServicePrice(service) {
  if (
    service.price === null ||
    service.price === undefined ||
    service.price === ''
  ) {
    return service.price_suffix || 'Custom';
  }

  const numericPrice = Number(service.price);

  if (Number.isNaN(numericPrice)) {
    return service.price_suffix || service.price;
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numericPrice);

  return `${formatted}${service.price_suffix ? ` ${service.price_suffix}` : ''}`;
}

function normalizeCategory(category, index) {
  return {
    ...category,
    color: getCategoryColor(category, index),
    tagline:
      category.tagline ||
      category.description ||
      'Professional solutions designed to help your business grow.',
    imageData: getCategoryImage(category),
  };
}

function normalizeService(service, categories) {
  const category =
    categories.find(
      (cat) => String(cat.id) === String(service.category_id)
    ) || null;

  return {
    ...service,

    category:
      service.category ||
      category?.slug ||
      service.category_slug ||
      'other',

    category_name:
      service.category_name ||
      category?.name ||
      'Services',

    tier:
      service.tier ||
      'Service Package',

    summary:
      service.short_description ||
      service.description ||
      'Professional service package designed for your business.',

    features: parseJsonField(service.features, []),

    notes: parseJsonField(service.notes, []),

    freebies:
      service.freebies || null,

    popular:
      Number(service.popular) === 1,

    is_active:
      Number(service.is_active) === 1,
  };
}

// --------------------------------------------------
// HERO
// --------------------------------------------------

function ServicesHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand/20 blur-[90px]" />

        <div className="absolute right-[-6rem] top-10 h-96 w-96 rounded-full bg-coral/20 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-10 pt-16 text-center md:pb-14 md:pt-24">
        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand-deep"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />

          Our Services
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl"
        >
          Powerful solutions,

          <span className="bg-gradient-to-r from-brand to-coral bg-clip-text text-transparent">
            {' '}
            priced for your growth.
          </span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          custom={2}
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg"
        >
          Explore our latest services and packages, choose the plan that
          fits your business, and get started with confidence.
        </motion.p>
      </div>
    </section>
  );
}

// --------------------------------------------------
// SEARCH + FILTER
// --------------------------------------------------

function FilterBar({
  query,
  setQuery,
  activeCategory,
  setActiveCategory,
  categories,
  counts,
  services,
}) {
  return (
    <div className="sticky top-0 z-10 -mx-6 border-y border-border bg-white/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-full border border-border bg-canvas-soft py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterPill
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            colorClass="bg-ink text-white border-ink"
          >
            All ({services.length})
          </FilterPill>

          {categories.map((category, index) => {
            const color = getCategoryColor(
              category,
              index
            );

            return (
              <FilterPill
                key={category.id || category.slug}
                active={activeCategory === String(category.id)}
                onClick={() =>
                  setActiveCategory(String(category.id))
                }
                colorClass={COLOR_MAP[color].pillActive}
              >
                {category.name} ({counts[category.id] || 0})
              </FilterPill>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  colorClass,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${active
        ? colorClass
        : 'border-border bg-white text-ink-muted hover:border-ink/20'
        }`}
    >
      {children}
    </button>
  );
}

// --------------------------------------------------
// SERVICE CARD
// --------------------------------------------------

function ServiceCard({
  service,
  category,
  index,
}) {
  const color = getCategoryColor(category, index);
  const colors = COLOR_MAP[color];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
      }}
    >
      <Link
        to={`/services/${service.slug || service.id}`}
        className={`group relative flex h-full flex-col rounded-3xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${colors.ring}`}
      >
        {service.popular && (
          <span className="absolute -right-1 top-5 rounded-full bg-coral px-3 py-1 text-[11px] font-bold text-white shadow-sm">
            Popular
          </span>
        )}

        <span
          className={`inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold ${colors.tagBg}`}
        >
          {service.tier}
        </span>

        <h3 className="mt-4 font-display text-lg font-bold text-ink">
          {service.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
          {service.summary}
        </p>

        {service.features?.length > 0 && (
          <ul className="mt-4 space-y-2">
            {service.features.slice(0, 3).map(
              (feature, featureIndex) => (
                <li
                  key={`${feature}-${featureIndex}`}
                  className="flex items-start gap-2 text-xs text-ink-muted"
                >
                  <svg
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${colors.price}`}
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M3 8.5l3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {feature}
                </li>
              )
            )}
          </ul>
        )}

        {service.freebies && (
          <p className="mt-3 text-xs font-semibold text-gold">
            🎁 {service.freebies}
          </p>
        )}

        <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p
              className={`font-display text-xl font-bold ${colors.price}`}
            >
              {formatServicePrice(service)}
            </p>

            {service.duration && (
              <p className="mt-0.5 text-xs text-ink-faint">
                {service.duration}
              </p>
            )}
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white">
            View details
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// --------------------------------------------------
// CATEGORY SECTION
// --------------------------------------------------

function ServiceCategorySection({
  category,
  services,
  categoryIndex,
}) {
  if (!services.length) return null;

  const color = getCategoryColor(
    category,
    categoryIndex
  );

  const colors = COLOR_MAP[color];

  const imageData =
    category.imageData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        margin: '-40px',
      }}
      transition={{ duration: 0.5 }}
      className="py-10"
    >
      {/* Category Visual Header */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm">
        <div className="relative h-56 overflow-hidden sm:h-64 md:h-72">
          <img
            src={imageData.image}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{
              objectPosition:
                imageData.position || 'center',
            }}
            loading="lazy"
          />

          {/* Image overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Category content */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-6 sm:p-8 md:p-10">
              <div className="flex items-end gap-4">
                <span
                  className={`hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg sm:inline-flex ${colors.iconBg}`}
                >
                  <DotIcon />
                </span>

                <div className="min-w-0">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                    Service Category
                  </p>

                  <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                    {category.name}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                    {/* {category.tagline} */}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service count */}
          <div className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md sm:right-7 sm:top-7">
            {services.length}{' '}
            {services.length === 1
              ? 'service'
              : 'services'}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id || service.slug}
            service={service}
            category={category}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}

// --------------------------------------------------
// EMPTY STATE
// --------------------------------------------------

function EmptyState({
  query,
  onClear,
}) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <SearchIcon />
      </div>

      <p className="mt-5 font-display text-lg font-bold text-ink">
        No services found
      </p>

      <p className="mt-2 text-sm text-ink-muted">
        {query
          ? `Nothing matched "${query}". Try another keyword.`
          : 'There are currently no active services available.'}
      </p>

      {query && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30"
        >
          Clear search
        </button>
      )}
    </div>
  );
}

// --------------------------------------------------
// LOADING
// --------------------------------------------------

function LoadingState() {
  return (
    <div className="space-y-10 py-10">
      {[1, 2].map((category) => (
        <div key={category}>
          {/* Category image skeleton */}
          <div className="animate-pulse overflow-hidden rounded-[2rem] border border-border bg-white">
            <div className="h-56 bg-canvas-soft sm:h-64 md:h-72" />
          </div>

          {/* Cards */}
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl border border-border bg-white p-6"
              >
                <div className="h-6 w-28 rounded-full bg-canvas-soft" />

                <div className="mt-5 h-6 w-3/4 rounded-lg bg-canvas-soft" />

                <div className="mt-3 h-4 w-full rounded bg-canvas-soft" />

                <div className="mt-2 h-4 w-5/6 rounded bg-canvas-soft" />

                <div className="mt-6 h-px bg-border" />

                <div className="mt-5 h-7 w-24 rounded bg-canvas-soft" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// --------------------------------------------------
// ICONS
// --------------------------------------------------

function SearchIcon({ className = '' }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M21 21l-4.3-4.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DotIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="currentColor"
      />

      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.5"
      />
    </svg>
  );
}

// --------------------------------------------------
// ANIMATION
// --------------------------------------------------

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  show: (i = 0) => ({
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// --------------------------------------------------
// MAIN
// --------------------------------------------------

export default function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // --------------------------------------------------
  // LOAD REAL API DATA
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    async function loadServices() {
      console.log(
        '[Services] Loading categories and services...'
      );

      setLoading(true);

      try {
        const [
          servicesData,
          categoriesData,
        ] = await Promise.all([
          getServices(),
          getCategories(),
        ]);

        if (!mounted) return;

        const rawCategories =
          Array.isArray(categoriesData)
            ? categoriesData
            : [];

        const rawServices =
          Array.isArray(servicesData)
            ? servicesData
            : [];

        const normalizedCategories =
          rawCategories.map(normalizeCategory);

        const normalizedServices =
          rawServices
            .filter(
              (service) =>
                Number(service.is_active) === 1
            )
            .map((service) =>
              normalizeService(
                service,
                normalizedCategories
              )
            );

        setCategories(normalizedCategories);
        setServices(normalizedServices);

        console.log(
          '[Services] Loaded successfully',
          {
            categories:
              normalizedCategories.length,
            services:
              normalizedServices.length,
          }
        );
      } catch (error) {
        if (!mounted) return;

        console.error(
          '[Services] Failed to load:',
          error
        );

        toast.error(
          error?.message ||
          'Unable to load services. Please try again.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredServices = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    return services.filter((service) => {
      const categoryMatches =
        activeCategory === 'all' ||
        String(service.category_id) ===
        String(activeCategory);

      if (!categoryMatches) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        service.title,
        service.tier,
        service.summary,
        service.description,
        service.category_name,
        service.duration,
        service.freebies,
        ...(service.features || []),
        ...(service.notes || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(
        normalizedQuery
      );
    });
  }, [
    services,
    query,
    activeCategory,
  ]);

  // --------------------------------------------------
  // CATEGORY COUNTS
  // --------------------------------------------------

  const counts = useMemo(() => {
    const result = {};

    categories.forEach((category) => {
      result[category.id] =
        services.filter(
          (service) =>
            String(service.category_id) ===
            String(category.id) &&
            (() => {
              const normalizedQuery =
                query.trim().toLowerCase();

              if (!normalizedQuery) {
                return true;
              }

              const searchableText = [
                service.title,
                service.tier,
                service.summary,
                service.description,
                service.category_name,
                ...(service.features || []),
                ...(service.notes || []),
              ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

              return searchableText.includes(
                normalizedQuery
              );
            })()
        ).length;
    });

    return result;
  }, [
    categories,
    services,
    query,
  ]);

  // --------------------------------------------------
  // GROUP SERVICES
  // --------------------------------------------------

  const visibleCategories = useMemo(() => {
    return categories.filter((category) => {
      if (
        activeCategory !== 'all' &&
        String(category.id) !==
        String(activeCategory)
      ) {
        return false;
      }

      return filteredServices.some(
        (service) =>
          String(service.category_id) ===
          String(category.id)
      );
    });
  }, [
    categories,
    activeCategory,
    filteredServices,
  ]);

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-canvas">
      <Seo
        title="Services & Packages"
        description="Explore Apple Hub's Facebook & Instagram marketing, AI video advertising, WhatsApp Business solutions and other professional digital services."
        path="/services"
      />

      <main>
        <ServicesHero />

        <div className="mx-auto max-w-7xl px-6">
          <FilterBar
            query={query}
            setQuery={setQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            categories={categories}
            counts={counts}
            services={services}
          />

          {loading ? (
            <LoadingState />
          ) : (
            <AnimatePresence mode="wait">
              {filteredServices.length === 0 ? (
                <EmptyState
                  query={query}
                  onClear={() => {
                    setQuery('');
                    setActiveCategory('all');
                  }}
                />
              ) : (
                <div className="divide-y divide-border">
                  {visibleCategories.map(
                    (category, categoryIndex) => {
                      const categoryServices =
                        filteredServices.filter(
                          (service) =>
                            String(
                              service.category_id
                            ) ===
                            String(category.id)
                        );

                      return (
                        <ServiceCategorySection
                          key={
                            category.id ||
                            category.slug
                          }
                          category={category}
                          services={categoryServices}
                          categoryIndex={
                            categoryIndex
                          }
                        />
                      );
                    }
                  )}
                </div>
              )}
            </AnimatePresence>
          )}
        </div>

        <div className="h-16" />
      </main>
    </div>
  );
}
