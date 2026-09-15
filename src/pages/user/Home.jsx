import CTA from "../../components/user/CTA";
import Seo from "../../components/common/Seo";
import { motion } from 'framer-motion';


const COLOR_MAP = {
  itemOne: 'bg-brand-soft text-brand-deep',
  itemTwo: 'bg-teal-soft text-teal-deep',
  itemThree: 'bg-coral-soft text-coral-deep',
  itemFour: 'bg-whatsapp-soft text-whatsapp-deep',
  brand: {
    iconBg: 'bg-brand text-white',
    tagBg: 'bg-brand-soft text-brand-deep',
    ring: 'group-hover:border-brand/40',
    price: 'text-brand-deep',
  },
  teal: {
    iconBg: 'bg-teal text-white',
    tagBg: 'bg-teal-soft text-teal-deep',
    ring: 'group-hover:border-teal/40',
    price: 'text-teal-deep',
  },
  whatsapp: {
    iconBg: 'bg-whatsapp text-white',
    tagBg: 'bg-whatsapp-soft text-whatsapp-deep',
    ring: 'group-hover:border-whatsapp/40',
    price: 'text-whatsapp-deep',
  },
};


//HERO SECTION

const STATS = [
  { value: '250+', label: 'Campaigns launched' },
  { value: '3', label: 'Growth services' },
  { value: '4.9★', label: 'Client rating' },
];
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-brand/20 blur-[90px]" />
        <div className="absolute top-10 right-[-6rem] h-96 w-96 rounded-full bg-coral/20 blur-[100px]" />
        <div className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-teal/10 blur-[90px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial="hidden"
              animate="show"
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand-deep"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Kerala's Growth Partner for Modern Businesses
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              custom={1}
              variants={fadeUp}
              className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]"
            >
              Marketing, AI video &amp; WhatsApp tools —
              <span className="bg-gradient-to-r from-brand to-coral bg-clip-text text-transparent"> purchased online, delivered fast.</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              custom={2}
              variants={fadeUp}
              className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
            >
              Apple Hub bundles the services growing businesses actually need — Facebook &amp;
              Instagram lead campaigns, AI-generated video ads, and WhatsApp Business automation
              — into simple packages you can browse, pick, and pay for in minutes.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              custom={3}
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href="/services"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-ink/10 transition-all hover:-translate-y-0.5 hover:bg-brand-deep"
              >
                Explore Services
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand-deep"
              >
                Talk to Us
              </a>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              custom={4}
              variants={fadeUp}
              className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-bold text-ink">{s.value}</p>
                  <p className="mt-1 text-xs text-ink-faint">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-[2rem] border border-border bg-white p-6 shadow-[0_30px_80px_-30px_rgba(91,61,240,0.35)] sm:p-8">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Popular this week</p>
                <span className="rounded-full bg-whatsapp-soft px-3 py-1 text-xs font-semibold text-whatsapp-deep">Live</span>
              </div>

              <div className="mt-5 space-y-3">
                <PreviewRow
                  color="brand"
                  title="Facebook & Instagram Ads"
                  meta="7-day package"
                  price="₹3,350"
                />
                <PreviewRow
                  color="teal"
                  title="AI Video Ad — 30 sec"
                  meta="Festival / promo ready"
                  price="₹2,999"
                />
                <PreviewRow
                  color="whatsapp"
                  title="WhatsApp Business Setup"
                  meta="watichat.com automation"
                  price="Custom"
                />
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-canvas-soft px-4 py-3.5">
                <div className="flex -space-x-2">
                  {['#5B3DF0', '#FF6B4A', '#0EA5A8', '#22C55E'].map((c) => (
                    <span
                      key={c}
                      className="h-7 w-7 rounded-full border-2 border-white"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <p className="text-xs font-medium text-ink-muted">Trusted by local businesses across Kerala</p>
              </div>
            </div>

            {/* floating badge */}
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-white px-5 py-4 shadow-xl sm:block">
              <p className="font-display text-xl font-bold text-ink">Guaranteed</p>
              <p className="text-xs text-ink-faint">Reach &amp; engagement</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
function PreviewRow({ color, title, meta, price }) {
  const dot = {
    brand: 'bg-brand',
    teal: 'bg-teal',
    whatsapp: 'bg-whatsapp',
  }[color];

  return (
    <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="text-xs text-ink-faint">{meta}</p>
        </div>
      </div>
      <span className="text-sm font-bold text-ink">{price}</span>
    </div>
  );
}

//SERVICES OVERVIEW SECTION

const SERVICES = [
  {
    id: 'digital-marketing',
    color: 'brand',
    tag: 'Most popular',
    title: 'Facebook & Insta Marketing',
    description:
      'Lead-generation ad campaigns that put your business in front of the right audience — with leads, inbox messages, and direct WhatsApp replies.',
    bullets: [
      'Guaranteed leads, messages & reach',
      'Campaigns from 5 to 30 days',
      'Poster & video creatives available',
    ],
    priceLabel: 'Starting from',
    price: '₹2,350',
    priceNote: '5-day ad package',
    icon: MegaphoneIcon,
  },
  {
    id: 'ai-video',
    color: 'teal',
    tag: 'New',
    title: 'AI Video Ads',
    description:
      'Scroll-stopping AI-generated video ads for festivals, promotions, and product launches — ready to run in days, not weeks.',
    bullets: [
      'Festival ad videos',
      '20 & 30 second formats',
      'Fast turnaround, ad-ready output',
    ],
    priceLabel: 'Starting from',
    price: '₹999',
    priceNote: '+GST, festival ads',
    icon: VideoIcon,
  },
  {
    id: 'whatsapp-business',
    color: 'whatsapp',
    tag: 'Automation',
    title: 'WhatsApp Business Software',
    description:
      'Powered by watichat.com — turn WhatsApp into a full sales channel with official business tools, automation, and broadcast messaging.',
    bullets: [
      'Official WhatsApp Business API',
      'Automated replies & broadcasts',
      'Flexible plans for every business size',
    ],
    priceLabel: 'Plans from',
    price: '₹1180',
    priceNote: '+ GST, based on your needs',
    icon: ChatIcon,
  },
];
function ServicesOverview() {
  return (
    <section id="services" className="bg-canvas-soft">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-ink-muted">
            What we offer
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Growth services, packaged simply
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            Three ways to grow — pick one, combine them, or scale up as your business grows.
            Every package is priced upfront, no surprises.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const colors = COLOR_MAP[service.color];
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`group flex flex-col rounded-3xl border border-border bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${colors.ring}`}
              >
                <div className="flex items-start justify-between">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors.iconBg}`}>
                    <Icon />
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors.tagBg}`}>
                    {service.tag}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-xl font-bold text-ink">{service.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{service.description}</p>

                <ul className="mt-5 space-y-2.5">
                  {service.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-ink-muted">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-end justify-between border-t border-border pt-5">
                  <div>
                    <p className="text-xs text-ink-faint">{service.priceLabel}</p>
                    <p className={`font-display text-2xl font-bold ${colors.price}`}>{service.price}</p>
                    <p className="text-xs text-ink-faint">{service.priceNote}</p>
                  </div>
                  <a
                    href="/services"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white"
                  >
                    View Packages
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function MegaphoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 10v4a1 1 0 001 1h2l5 4V5L6 9H4a1 1 0 00-1 1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16 8.5c1 1 1 6 0 7M19 6c2 2.5 2 9.5 0 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function VideoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 10l5-3v10l-5-3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12a8 8 0 1114.3 4.9L20 21l-4.3-1.7A8 8 0 014 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8.5 11.5c.5 2 2 3 3.8 3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

//WHY CHOOSE US SECTION
const ITEMS = [
  {
    title: 'Real results, not vanity metrics',
    body: 'Every campaign is built around leads, messages, and direct WhatsApp reach — the numbers that actually grow your business.',
    color: 'itemOne',
    icon: TargetIcon,
  },
  {
    title: 'Everything under one roof',
    body: 'Ads, creatives, AI video, and WhatsApp automation — no juggling five different vendors for one growth plan.',
    color: 'itemTwo',
    icon: LayersIcon,
  },
  {
    title: 'Transparent, upfront pricing',
    body: 'Every package is listed with its price and inclusions. What you see is what you pay — no hidden charges.',
    color: 'itemThree',
    icon: TagIcon,
  },
  {
    title: 'A team that answers',
    body: "Based in Alappuzha, Kerala — reachable directly, with a team that understands the local market you're selling to.",
    color: 'itemFour',
    icon: PeopleIcon,
  },
];
function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-canvas-soft px-4 py-1.5 text-xs font-semibold text-ink-muted">
              Why Apple Hub
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Built for businesses that want results, not reports
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
              We keep it simple: clear packages, honest pricing, and campaigns built to bring
              real customers to your door — online and off.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-2xl border border-border p-6 transition-colors hover:border-ink/15"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${COLOR_MAP[item.color]}`}>
                    <Icon />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
function TargetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l8 4.5-8 4.5-8-4.5L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 12l8 4.5 8-4.5M4 16.5L12 21l8-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12.5 3.5H6a1 1 0 00-1 1v6.5l10 10 7.5-7.5-10-10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" />
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 14.2c2.6.3 4.5 2.5 4.5 5.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

//PROCESS SECTION

const STEPS = [
  {
    step: '01',
    title: 'Pick your service',
    body: 'Browse marketing, AI video, or WhatsApp automation packages and choose what fits.',
  },
  {
    step: '02',
    title: 'Choose a package',
    body: 'Every plan lists what’s included and what it costs — pick the duration or tier that suits you.',
  },
  {
    step: '03',
    title: 'Confirm & pay',
    body: 'Share your details and pay securely online. You’ll get confirmation right away.',
  },
  {
    step: '04',
    title: 'We’ll contact you shortly',
    body: 'Once your order is confirmed, our team will contact you shortly to discuss the services or items you selected and take things forward.',
  },
];
function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-ink">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-brand/25 blur-[110px]" />
        <div className="absolute bottom-[-6rem] left-0 h-80 w-80 rounded-full bg-coral/20 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80">
            How it works
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From browsing to a live campaign in four steps
          </h2>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <span className="font-display text-4xl font-bold text-white/15">{s.step}</span>
              <h3 className="mt-3 font-display text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/60">{s.body}</p>
              {i < STEPS.length - 1 && (
                <span className="absolute right-[-1.25rem] top-2 hidden text-white/20 lg:block">→</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      <Seo
        title="Digital & Technology Services"
        description="Apple Hub by Pathans Apple Info Tech offers professional digital and technology services including web development, software solutions, digital marketing, AI video advertising, design and IT services for businesses."
        path="/"
      />
      <main>
        <Hero />
        <ServicesOverview />
        <WhyChooseUs />
        <Process />
        <CTA />
      </main>
    </div>
  );
}
