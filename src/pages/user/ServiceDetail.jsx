import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import { motion } from 'framer-motion';
import { CATEGORIES, PACKAGES, formatPrice } from '../../data/servicesData';

const PHONE_DISPLAY = '+91 7510 666 333';
const PHONE_TEL = '+917510666333';
const WHATSAPP_NUMBER = '917510666333';

const COLOR_MAP = {
  brand: { iconBg: 'bg-brand text-white', tagBg: 'bg-brand-soft text-brand-deep', price: 'text-brand-deep' },
  teal: { iconBg: 'bg-teal text-white', tagBg: 'bg-teal-soft text-teal-deep', price: 'text-teal-deep' },
  whatsapp: { iconBg: 'bg-whatsapp text-white', tagBg: 'bg-whatsapp-soft text-whatsapp-deep', price: 'text-whatsapp-deep' },
};

function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-28 text-center">
      <p className="font-display text-2xl font-bold text-ink">Package not found</p>
      <p className="mt-2 text-sm text-ink-muted">
        This package may have been renamed or removed. Take a look at everything we currently offer.
      </p>
      <Link
        to="/services"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-deep"
      >
        Browse all services
      </Link>
    </div>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const pkg = PACKAGES.find((p) => p.slug === slug);
  const category = pkg ? CATEGORIES.find((c) => c.slug === pkg.category) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!pkg || !category) {
    return (
      <div className="min-h-screen bg-canvas">
        <Seo title="Package not found" description="This service package could not be found." path="/services" />
        <main>
          <NotFound />
        </main>
      </div>
    );
  }

  const colors = COLOR_MAP[category.color];
  const siblings = PACKAGES.filter((p) => p.category === category.slug && p.slug !== pkg.slug);
  const waMessage = `Hi, I'm interested in the ${pkg.title} (${category.name}) package.`;

  return (
    <div className="min-h-screen bg-canvas">
      <Seo
        title={`${pkg.title} — ${category.name}`}
        description={pkg.summary}
        path={`/services/${pkg.slug}`}
      />
      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-brand/15 blur-[90px]" />
          </div>

          <div className="mx-auto max-w-5xl px-6 pt-10 pb-4">
            <nav className="flex flex-wrap items-center gap-1.5 text-xs text-ink-faint">
              <Link to="/services" className="hover:text-ink-muted">Services</Link>
              <span>/</span>
              <Link to={`/services?category=${category.slug}`} className="hover:text-ink-muted">{category.name}</Link>
              <span>/</span>
              <span className="text-ink-muted">{pkg.title}</span>
            </nav>
          </div>

          <div className="mx-auto max-w-5xl px-6 pt-6 pb-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr]"
            >
              {/* Left: details */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors.tagBg}`}>
                    {category.name}
                  </span>
                  <span className="inline-flex rounded-full border border-border px-3 py-1 text-xs font-semibold text-ink-muted">
                    {pkg.tier}
                  </span>
                  {pkg.popular && (
                    <span className="inline-flex rounded-full bg-coral px-3 py-1 text-xs font-bold text-white">
                      Popular
                    </span>
                  )}
                </div>

                <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  {pkg.title}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">{pkg.summary}</p>

                <div className="mt-8">
                  <h2 className="font-display text-lg font-bold text-ink">What's included</h2>
                  <ul className="mt-4 space-y-3">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-ink-muted">
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${colors.iconBg}`}>
                          <CheckIcon />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {pkg.freebies && (
                  <div className="mt-6 rounded-2xl border border-gold/30 bg-gold-soft p-5">
                    <p className="text-sm font-bold text-ink">Included free: {pkg.freebies}</p>
                  </div>
                )}

                {pkg.notes.length > 0 && (
                  <div className="mt-6 space-y-1.5">
                    {pkg.notes.map((n) => (
                      <p key={n} className="text-xs text-ink-faint">* {n}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: purchase panel */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-fit rounded-[2rem] border border-border bg-white p-7 shadow-[0_30px_80px_-30px_rgba(91,61,240,0.2)]"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Price</p>
                <p className={`mt-1.5 font-display text-4xl font-bold ${colors.price}`}>{formatPrice(pkg)}</p>
                <p className="mt-1 text-sm text-ink-muted">{pkg.duration}</p>

                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-whatsapp-deep"
                  >
                    Buy via WhatsApp
                  </a>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30"
                  >
                    Call {PHONE_DISPLAY}
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold text-ink-muted hover:text-ink"
                  >
                    Or send a detailed enquiry →
                  </Link>
                </div>

                <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-ink-faint">
                  Enquiries get a reply the same business day.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {siblings.length > 0 && (
          <section className="border-t border-border bg-canvas-soft">
            <div className="mx-auto max-w-5xl px-6 py-16">
              <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                Other packages in {category.name}
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {siblings.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    className="group flex flex-col rounded-2xl border border-border bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${colors.tagBg}`}>
                      {s.tier}
                    </span>
                    <h3 className="mt-3 font-display text-sm font-bold text-ink">{s.title}</h3>
                    <p className={`mt-2 font-display text-lg font-bold ${colors.price}`}>{formatPrice(s)}</p>
                    <p className="text-xs text-ink-faint">{s.duration}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}