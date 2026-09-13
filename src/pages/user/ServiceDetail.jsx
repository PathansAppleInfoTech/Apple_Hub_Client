import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import {
  getAllServices,
  getAllCategories,
} from '../../api/admin';

const PHONE_DISPLAY = '+91 7510 666 333';
const PHONE_TEL = '+917510666333';
const WHATSAPP_NUMBER = '917510666333';

const COLOR_MAP = {
  brand: {
    iconBg: 'bg-brand text-white',
    iconSoft: 'bg-brand-soft text-brand',
    tagBg: 'bg-brand-soft text-brand-deep',
    price: 'text-brand-deep',
    border: 'hover:border-brand/30',
    glow: 'bg-brand/10',
  },

  teal: {
    iconBg: 'bg-teal text-white',
    iconSoft: 'bg-teal-soft text-teal',
    tagBg: 'bg-teal-soft text-teal-deep',
    price: 'text-teal-deep',
    border: 'hover:border-teal/30',
    glow: 'bg-teal/10',
  },

  whatsapp: {
    iconBg: 'bg-whatsapp text-white',
    iconSoft: 'bg-whatsapp-soft text-whatsapp',
    tagBg: 'bg-whatsapp-soft text-whatsapp-deep',
    price: 'text-whatsapp-deep',
    border: 'hover:border-whatsapp/30',
    glow: 'bg-whatsapp/10',
  },

  coral: {
    iconBg: 'bg-coral text-white',
    iconSoft: 'bg-coral-soft text-coral',
    tagBg: 'bg-coral-soft text-coral-deep',
    price: 'text-coral-deep',
    border: 'hover:border-coral/30',
    glow: 'bg-coral/10',
  },
};

const DEFAULT_COLORS = [
  'brand',
  'teal',
  'whatsapp',
  'coral',
];

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function parseJsonField(value, fallback = []) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);

      return Array.isArray(parsed)
        ? parsed
        : fallback;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

function getCategoryColor(category, index = 0) {
  if (
    category?.color &&
    COLOR_MAP[category.color]
  ) {
    return category.color;
  }

  return DEFAULT_COLORS[
    index % DEFAULT_COLORS.length
  ];
}

function normalizeCategory(category, index) {
  return {
    ...category,

    color: getCategoryColor(
      category,
      index
    ),

    tagline:
      category.tagline ||
      category.description ||
      'Professional solutions designed to help your business grow.',
  };
}

function normalizeService(
  service,
  categories
) {
  const category =
    categories.find(
      (item) =>
        String(item.id) ===
        String(service.category_id)
    ) || null;

  return {
    ...service,

    category_name:
      service.category_name ||
      category?.name ||
      'Services',

    category_slug:
      service.category_slug ||
      category?.slug ||
      '',

    tier:
      service.tier ||
      'Service Package',

    short_description:
      service.short_description ||
      '',

    description:
      service.description ||
      service.short_description ||
      '',

    features: parseJsonField(
      service.features,
      []
    ),

    notes: parseJsonField(
      service.notes,
      []
    ),

    popular:
      Number(service.popular) === 1,

    is_active:
      Number(service.is_active) === 1,
  };
}

function formatPrice(service) {
  if (
    service.price === null ||
    service.price === undefined ||
    service.price === ''
  ) {
    return service.price_suffix || 'Custom';
  }

  const numericPrice = Number(
    service.price
  );

  if (Number.isNaN(numericPrice)) {
    return String(service.price);
  }

  const formatted =
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numericPrice);

  return service.price_suffix
    ? `${formatted} ${service.price_suffix}`
    : formatted;
}

// --------------------------------------------------
// NOT FOUND
// --------------------------------------------------

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-28 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <PackageIcon />
      </div>

      <p className="mt-6 font-display text-2xl font-bold text-ink">
        Service not found
      </p>

      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
        This service may have been renamed, removed,
        or is currently unavailable. Browse our
        available services to find what you need.
      </p>

      <Link
        to="/services"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-deep"
      >
        Browse all services
        <ArrowRightIcon />
      </Link>
    </div>
  );
}

// --------------------------------------------------
// LOADING
// --------------------------------------------------

function LoadingState() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="animate-pulse">
        <div className="h-4 w-36 rounded bg-canvas-soft" />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="h-7 w-48 rounded-full bg-canvas-soft" />
            <div className="mt-5 h-12 w-3/4 rounded-xl bg-canvas-soft" />
            <div className="mt-5 h-4 w-full rounded bg-canvas-soft" />
            <div className="mt-2 h-4 w-5/6 rounded bg-canvas-soft" />

            <div className="mt-10 h-6 w-40 rounded bg-canvas-soft" />

            <div className="mt-5 space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-5 w-4/5 rounded bg-canvas-soft"
                />
              ))}
            </div>
          </div>

          <div className="h-80 rounded-[2rem] bg-canvas-soft" />
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------
// ERROR
// --------------------------------------------------

function ErrorState({ onRetry }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-28 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-coral-soft text-coral">
        <AlertIcon />
      </div>

      <h2 className="mt-6 font-display text-2xl font-bold text-ink">
        Unable to load service
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        We couldn't retrieve this service right now.
        Please try again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-deep"
      >
        Try again
        <RefreshIcon />
      </button>
    </div>
  );
}

// --------------------------------------------------
// DETAIL FEATURE
// --------------------------------------------------

function FeatureItem({
  feature,
  colors,
  index,
}) {
  return (
    <motion.li
      initial={{
        opacity: 0,
        x: -8,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
      }}
      className="flex items-start gap-3"
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${colors.iconBg}`}
      >
        <CheckIcon />
      </span>

      <span className="pt-0.5 text-sm leading-relaxed text-ink-muted">
        {feature}
      </span>
    </motion.li>
  );
}

// --------------------------------------------------
// PRICE PANEL
// --------------------------------------------------

function PurchasePanel({
  service,
  category,
  colors,
}) {
  const waMessage =
    `Hi, I'm interested in the ${service.title} ` +
    `(${category.name}) package.`;

  const isCustom =
    service.price === null ||
    service.price === undefined ||
    service.price === '';

  return (
    <motion.aside
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.55,
        delay: 0.1,
      }}
      className="relative h-fit lg:sticky lg:top-24"
    >
      <div className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-brand/5 blur-2xl" />

      <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-[0_25px_70px_-25px_rgba(21,22,43,0.18)]">
        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-brand via-coral to-teal" />

        <div className="p-7 sm:p-8">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-faint">
              Package Price
            </p>

            {service.popular && (
              <span className="rounded-full bg-coral-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-coral-deep">
                Popular
              </span>
            )}
          </div>

          <div className="mt-5">
            <p
              className={`font-display text-4xl font-extrabold tracking-tight ${
                colors.price
              } sm:text-5xl`}
            >
              {formatPrice(service)}
            </p>

            {service.duration && (
              <div className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
                <ClockIcon />
                <span>{service.duration}</span>
              </div>
            )}
          </div>

          <div className="my-7 h-px bg-border" />

          <div className="space-y-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                waMessage
              )}`}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-whatsapp-deep hover:shadow-lg"
            >
              <WhatsAppIcon />
              {isCustom
                ? 'Enquire on WhatsApp'
                : 'Buy via WhatsApp'}

              <ArrowUpRightIcon className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-sm font-bold text-ink transition-all hover:border-ink/30 hover:bg-canvas-soft"
            >
              <PhoneIcon />
              Call {PHONE_DISPLAY}
            </a>

            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-xs font-semibold text-ink-muted transition-colors hover:text-ink"
            >
              Send a detailed enquiry
              <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="mt-6 rounded-2xl bg-canvas-soft p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm">
                <ShieldIcon />
              </span>

              <div>
                <p className="text-xs font-bold text-ink">
                  Need help choosing?
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                  Talk to our team and we'll help you
                  choose the right package for your
                  business.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-ink-faint">
            Enquiries are usually answered the same
            business day.
          </p>
        </div>
      </div>
    </motion.aside>
  );
}

// --------------------------------------------------
// RELATED SERVICES
// --------------------------------------------------

function RelatedServices({
  services,
  category,
  colors,
}) {
  if (!services.length) {
    return null;
  }

  return (
    <section className="border-t border-border bg-canvas-soft">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
              Explore more
            </p>

            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
              More from {category.name}
            </h2>
          </div>

          <Link
            to="/services"
            className="hidden items-center gap-1 text-xs font-bold text-brand hover:text-brand-deep sm:inline-flex"
          >
            View all
            <ArrowRightIcon />
          </Link>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={
                service.id ||
                service.slug
              }
              initial={{
                opacity: 0,
                y: 12,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
              }}
            >
              <Link
                to={`/services/${service.slug || service.id}`}
                className={`group flex h-full flex-col rounded-2xl border border-border bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-xl ${colors.border}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${colors.tagBg}`}
                  >
                    {service.tier}
                  </span>

                  {service.popular && (
                    <span className="text-[10px] font-bold text-coral">
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-base font-bold text-ink">
                  {service.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                  {service.short_description ||
                    service.description}
                </p>

                <div className="mt-auto pt-5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p
                        className={`font-display text-lg font-bold ${colors.price}`}
                      >
                        {formatPrice(service)}
                      </p>

                      {service.duration && (
                        <p className="mt-0.5 text-[10px] text-ink-faint">
                          {service.duration}
                        </p>
                      )}
                    </div>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink-muted transition-all group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                      <ArrowRightIcon />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <Link
          to="/services"
          className="mt-7 inline-flex items-center gap-1 text-xs font-bold text-brand sm:hidden"
        >
          View all services
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function ServiceDetail() {
  const { slug } = useParams();

  const [services, setServices] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [slug]);

  async function loadData() {
    console.log(
      '[ServiceDetail] Loading service:',
      slug
    );

    setLoading(true);
    setError(false);

    try {
      const [
        servicesData,
        categoriesData,
      ] = await Promise.all([
        getAllServices(),
        getAllCategories(),
      ]);

      const rawCategories =
        Array.isArray(categoriesData)
          ? categoriesData
          : [];

      const rawServices =
        Array.isArray(servicesData)
          ? servicesData
          : [];

      const normalizedCategories =
        rawCategories.map(
          normalizeCategory
        );

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

      setCategories(
        normalizedCategories
      );

      setServices(
        normalizedServices
      );

      console.log(
        '[ServiceDetail] Data loaded:',
        {
          services:
            normalizedServices.length,
          categories:
            normalizedCategories.length,
        }
      );
    } catch (err) {
      console.error(
        '[ServiceDetail] API error:',
        err
      );

      setError(true);

      toast.error(
        err?.message ||
          'Unable to load service details.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [slug]);

  // --------------------------------------------------
  // FIND SERVICE
  // --------------------------------------------------

  const service = useMemo(() => {
    return services.find(
      (item) =>
        String(item.slug) ===
        String(slug)
    );
  }, [services, slug]);

  // --------------------------------------------------
  // FIND CATEGORY
  // --------------------------------------------------

  const category = useMemo(() => {
    if (!service) {
      return null;
    }

    return (
      categories.find(
        (item) =>
          String(item.id) ===
          String(service.category_id)
      ) ||
      categories.find(
        (item) =>
          item.slug ===
          service.category_slug
      ) ||
      null
    );
  }, [
    service,
    categories,
  ]);

  // --------------------------------------------------
  // RELATED SERVICES
  // --------------------------------------------------

  const siblings = useMemo(() => {
    if (!service) {
      return [];
    }

    return services
      .filter(
        (item) =>
          String(item.id) !==
            String(service.id) &&
          String(item.category_id) ===
            String(service.category_id)
      )
      .slice(0, 3);
  }, [
    services,
    service,
  ]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas">
        <Seo
          title="Loading Service"
          description="Loading service details."
          path={`/services/${slug}`}
        />

        <main>
          <LoadingState />
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-canvas">
        <Seo
          title="Unable to Load Service"
          description="Unable to load this service."
          path={`/services/${slug}`}
        />

        <main>
          <ErrorState
            onRetry={loadData}
          />
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // NOT FOUND
  // --------------------------------------------------

  if (!service || !category) {
    return (
      <div className="min-h-screen bg-canvas">
        <Seo
          title="Service Not Found"
          description="This service could not be found."
          path="/services"
        />

        <main>
          <NotFound />
        </main>
      </div>
    );
  }

  const categoryIndex =
    categories.findIndex(
      (item) =>
        String(item.id) ===
        String(category.id)
    );

  const color =
    getCategoryColor(
      category,
      categoryIndex
    );

  const colors =
    COLOR_MAP[color] ||
    COLOR_MAP.brand;

  return (
    <div className="min-h-screen bg-canvas">
      <Seo
        title={`${service.title} — ${category.name}`}
        description={
          service.short_description ||
          service.description
        }
        path={`/services/${service.slug}`}
      />

      <main>
        {/* =========================================
            HERO / DETAILS
        ========================================= */}

        <section className="relative overflow-hidden">
          {/* Decorative background */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div
              className={`absolute -left-32 -top-32 h-96 w-96 rounded-full blur-[110px] ${colors.glow}`}
            />

            <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-coral/10 blur-[120px]" />

            <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/5 blur-[100px]" />
          </div>

          {/* Breadcrumb */}
          <div className="mx-auto max-w-5xl px-6 pt-8 sm:pt-10">
            <nav className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
              <Link
                to="/services"
                className="transition-colors hover:text-ink"
              >
                Services
              </Link>

              <ChevronRightIcon />

              <Link
                to={`/services?category=${category.slug}`}
                className="transition-colors hover:text-ink"
              >
                {category.name}
              </Link>

              <ChevronRightIcon />

              <span className="max-w-[220px] truncate text-ink-muted">
                {service.title}
              </span>
            </nav>
          </div>

          <div className="mx-auto max-w-5xl px-6 pb-16 pt-8 sm:pb-20 sm:pt-12">
            <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
              {/* =====================================
                  LEFT CONTENT
              ===================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.55,
                }}
              >
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold ${colors.tagBg}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${colors.iconBg.split(' ')[0]}`}
                    />

                    {category.name}
                  </span>

                  {service.tier && (
                    <span className="inline-flex rounded-full border border-border bg-white px-3.5 py-1.5 text-[11px] font-bold text-ink-muted">
                      {service.tier}
                    </span>
                  )}

                  {service.popular && (
                    <span className="inline-flex rounded-full bg-coral px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm">
                      Popular choice
                    </span>
                  )}
                </div>

                {/* Heading */}
                <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                  {service.title}
                </h1>

                {/* Short description */}
                {service.short_description && (
                  <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
                    {service.short_description}
                  </p>
                )}

                {/* Duration */}
                {service.duration && (
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-ink-muted shadow-sm">
                    <ClockIcon />
                    {service.duration}
                  </div>
                )}

                {/* Description */}
                {service.description && (
                  <div className="mt-10">
                    <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                      About this service
                    </h2>

                    <div className="mt-4 max-w-2xl whitespace-pre-line text-sm leading-7 text-ink-muted">
                      {service.description}
                    </div>
                  </div>
                )}

                {/* Features */}
                {service.features.length > 0 && (
                  <div className="mt-10">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors.iconSoft}`}
                      >
                        <CheckIcon
                          className="text-current"
                        />
                      </span>

                      <div>
                        <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                          What's included
                        </h2>

                        <p className="mt-0.5 text-xs text-ink-faint">
                          Everything included in this package
                        </p>
                      </div>
                    </div>

                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {service.features.map(
                        (feature, index) => (
                          <FeatureItem
                            key={`${feature}-${index}`}
                            feature={feature}
                            colors={colors}
                            index={index}
                          />
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Freebie */}
                {service.freebies && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.98,
                    }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    className="mt-9 overflow-hidden rounded-2xl border border-gold/30 bg-gold-soft"
                  >
                    <div className="flex items-start gap-4 p-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                        🎁
                      </span>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gold">
                          Included free
                        </p>

                        <p className="mt-1.5 text-sm font-bold leading-relaxed text-ink">
                          {service.freebies}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Notes */}
                {service.notes.length > 0 && (
                  <div className="mt-8 rounded-2xl border border-border bg-canvas-soft p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">
                      Important note
                    </p>

                    <div className="mt-3 space-y-2">
                      {service.notes.map(
                        (note, index) => (
                          <p
                            key={`${note}-${index}`}
                            className="flex items-start gap-2 text-xs leading-relaxed text-ink-muted"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" />
                            {note}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* =====================================
                  RIGHT PURCHASE PANEL
              ===================================== */}

              <PurchasePanel
                service={service}
                category={category}
                colors={colors}
              />
            </div>
          </div>
        </section>

        {/* =========================================
            TRUST STRIP
        ========================================= */}

        <section className="border-y border-border bg-white">
          <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-border px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <TrustItem
              icon={<ShieldIcon />}
              title="Professional service"
              text="Built for real business needs"
            />

            <TrustItem
              icon={<MessageIcon />}
              title="Quick response"
              text="Talk directly with our team"
            />

            <TrustItem
              icon={<CheckCircleIcon />}
              title="Clear packages"
              text="Know what you're getting"
            />
          </div>
        </section>

        {/* =========================================
            RELATED SERVICES
        ========================================= */}

        <RelatedServices
          services={siblings}
          category={category}
          colors={colors}
        />

        {/* =========================================
            FINAL CTA
        ========================================= */}

        <section className="relative overflow-hidden bg-ink">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand/30 blur-[100px]" />
            <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-coral/20 blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
              Ready to get started?
            </span>

            <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Let's grow your business together.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60">
              Have questions about this package?
              Contact our team and we'll help you
              get started.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hi, I'm interested in the ${service.title} (${category.name}) package.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-whatsapp-deep"
              >
                <WhatsAppIcon />
                Enquire on WhatsApp
              </a>

              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                <PhoneIcon />
                Call us
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// --------------------------------------------------
// TRUST ITEM
// --------------------------------------------------

function TrustItem({
  icon,
  title,
  text,
}) {
  return (
    <div className="flex items-center gap-4 px-2 py-6 sm:px-6 sm:py-7">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
        {icon}
      </span>

      <div>
        <p className="text-xs font-bold text-ink">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] text-ink-faint">
          {text}
        </p>
      </div>
    </div>
  );
}

// --------------------------------------------------
// ICONS
// --------------------------------------------------

function CheckIcon({ className = '' }) {
  return (
    <svg
      className={className}
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M3 8.5l3 3 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
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

function ArrowUpRightIcon({
  className = '',
}) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M7 17L17 7M8 7h9v9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="15"
      height="15"
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
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M6.5 3.5h2.3l1.4 4-1.8 1.8a15.5 15.5 0 0 0 6.3 6.3l1.8-1.8 4 1.4v2.3c0 1.1-.9 2-2 2C11.3 19.5 4.5 12.7 4.5 5.5c0-1.1.9-2 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 11.7A8 8 0 0 1 8.1 19L4 20l1.1-3.9A8 8 0 1 1 20 11.7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M9 8.5c.3-.4.6-.4.9-.1l1.1 1.2c.2.2.2.5 0 .8l-.5.7c.6 1.1 1.5 2 2.6 2.6l.7-.5c.3-.2.6-.2.8 0l1.2 1.1c.3.3.3.6-.1.9-.4.4-1 .6-1.6.4-2.8-.8-5.1-3.1-5.9-5.9-.2-.6 0-1.2.4-1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 3l7 3v5c0 4.4-2.8 8.2-7 10-4.2-1.8-7-5.6-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="m8.5 12 2.2 2.2 4.8-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 5.5h14v10H9l-4 3v-13Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M8 9.5h8M8 12.5h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="16"
      height="16"
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
        d="m8.5 12 2.2 2.2 4.8-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="m4.5 7.5 7.5 4 7.5-4M12 12v9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 4 21 20H3L12 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M12 9v5M12 17.5v.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 11a8 8 0 0 0-14.7-3M4 5v4h4M4 13a8 8 0 0 0 14.7 3M20 19v-4h-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}