import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, PACKAGES, formatPrice } from '../../data/servicesData';

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
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

//HERO

function ServicesHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-brand/20 blur-[90px]" />
        <div className="absolute top-10 right-[-6rem] h-96 w-96 rounded-full bg-coral/20 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 pt-16 pb-10 text-center md:pt-24 md:pb-14">
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
          Every package, priced upfront —
          <span className="bg-gradient-to-r from-brand to-coral bg-clip-text text-transparent"> pick what fits and go.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          custom={2}
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg"
        >
          Search or filter by category to find the right plan, then open any package for full
          details before you buy.
        </motion.p>
      </div>
    </section>
  );
}

//SEARCH + FILTER BAR

function FilterBar({ query, setQuery, activeCategory, setActiveCategory, counts, total }) {
  return (
    <div className="sticky top-0 z-10 -mx-6 border-y border-border bg-white/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search packages…"
            className="w-full rounded-full border border-border bg-canvas-soft py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterPill
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            colorClass="bg-ink text-white border-ink"
          >
            All ({total})
          </FilterPill>
          {CATEGORIES.map((c) => (
            <FilterPill
              key={c.slug}
              active={activeCategory === c.slug}
              onClick={() => setActiveCategory(c.slug)}
              colorClass={COLOR_MAP[c.color].pillActive}
            >
              {c.name} ({counts[c.slug] || 0})
            </FilterPill>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, colorClass, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${active ? colorClass : 'border-border bg-white text-ink-muted hover:border-ink/20'
        }`}
    >
      {children}
    </button>
  );
}

//PACKAGE CARD

function PackageCard({ pkg, color, index }) {
  const colors = COLOR_MAP[color];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link
        to={`/services/${pkg.slug}`}
        className={`group relative flex h-full flex-col rounded-3xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${colors.ring}`}
      >
        {pkg.popular && (
          <span className="absolute -top-3 right-6 rounded-full bg-coral px-3 py-1 text-[11px] font-bold text-white shadow-sm">
            Popular
          </span>
        )}

        <span className={`inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold ${colors.tagBg}`}>
          {pkg.tier}
        </span>

        <h3 className="mt-4 font-display text-lg font-bold text-ink">{pkg.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{pkg.summary}</p>

        <ul className="mt-4 space-y-2">
          {pkg.features.slice(0, 2).map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs text-ink-muted">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {pkg.freebies && (
          <p className="mt-3 text-xs font-semibold text-gold">{pkg.freebies}</p>
        )}

        <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className={`font-display text-xl font-bold ${colors.price}`}>{formatPrice(pkg)}</p>
            <p className="text-xs text-ink-faint">{pkg.duration}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white">
            View details
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

//MAIN LIST (grouped by category)

function ServiceCategorySection({ category, packages }) {
  if (packages.length === 0) return null;
  const colors = COLOR_MAP[category.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="py-10"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${colors.iconBg}`}>
          <DotIcon />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{category.name}</h2>
          <p className="text-sm text-ink-muted">{category.tagline}</p>
        </div>
      </div>

      <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg, i) => (
          <PackageCard key={pkg.slug} pkg={pkg} color={category.color} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

function EmptyState({ query, onClear }) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="font-display text-lg font-bold text-ink">No packages match "{query}"</p>
      <p className="mt-2 text-sm text-ink-muted">Try a different keyword, or clear your search to see everything.</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink hover:border-ink/30"
      >
        Clear search
      </button>
    </div>
  );
}

//ICONS

function SearchIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function DotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
    </svg>
  );
}

export default function Services() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const normalizedQuery = query.trim().toLowerCase();

  const matches = (pkg) => {
    if (!normalizedQuery) return true;
    const haystack = [pkg.title, pkg.tier, pkg.summary, ...pkg.features].join(' ').toLowerCase();
    return haystack.includes(normalizedQuery);
  };

  const counts = useMemo(() => {
    const c = {};
    CATEGORIES.forEach((cat) => {
      c[cat.slug] = PACKAGES.filter((p) => p.category === cat.slug && matches(p)).length;
    });
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedQuery]);

  const visibleCategories = activeCategory === 'all' ? CATEGORIES : CATEGORIES.filter((c) => c.slug === activeCategory);

  const totalVisible = visibleCategories.reduce(
    (sum, cat) => sum + PACKAGES.filter((p) => p.category === cat.slug && matches(p)).length,
    0
  );

  return (
    <div className="min-h-screen bg-canvas">
      <Seo
        title="Services & Packages"
        description="Browse Apple Hub's Facebook & Instagram marketing packages, AI video ad rates, and WhatsApp Business automation plans. Transparent pricing, no hidden charges."
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
            counts={counts}
            total={PACKAGES.filter(matches).length}
          />

          <AnimatePresence mode="wait">
            {totalVisible === 0 ? (
              <EmptyState query={query} onClear={() => setQuery('')} />
            ) : (
              <div className="divide-y divide-border">
                {visibleCategories.map((cat) => (
                  <ServiceCategorySection
                    key={cat.slug}
                    category={cat}
                    packages={PACKAGES.filter((p) => p.category === cat.slug && matches(p))}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-16" />
      </main>
    </div>
  );
}