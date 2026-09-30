import Seo from "../../components/common/Seo";
import CTA from "../../components/user/CTA";
import { motion } from "framer-motion";

/* =========================================================
   COLORS
========================================================= */

const COLOR_MAP = {
  brand: "bg-brand-soft text-brand-deep",
  teal: "bg-teal-soft text-teal-deep",
  coral: "bg-coral-soft text-coral-deep",
};

/* =========================================================
   UNSPLASH IMAGES
========================================================= */

const IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85",

  story:
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=85",

  technology:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",

  marketing:
    "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1000&q=85",

  purchase:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85",

  communication:
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=85",

  execution:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",

  vision:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",

  mission:
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85",

  kerala:
    "https://images.unsplash.com/photo-1600688582018-5a5c8cda0fcb?auto=format&fit=crop&w=1000&q=85",

  global:
    "https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=1000&q=85",

  middleEast:
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=85",
};

/* =========================================================
   ANIMATION
========================================================= */

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

/* =========================================================
   ABOUT HERO
========================================================= */

function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand/20 blur-[90px]" />

        <div className="absolute right-[-6rem] top-10 h-96 w-96 rounded-full bg-coral/20 blur-[100px]" />

        <div className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-teal/10 blur-[90px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          {/* TEXT */}
          <div>
            <motion.div
              initial="hidden"
              animate="show"
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand-deep"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />

              About Apple Hub
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              custom={1}
              variants={fadeUp}
              className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.7rem]"
            >
              Three decades of IT experience,
              <span className="bg-gradient-to-r from-brand to-coral bg-clip-text text-transparent">
                {" "}
                now available in a few clicks.
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              custom={2}
              variants={fadeUp}
              className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
            >
              Apple Hub is the online storefront of Pathans Apple Infotech
              Pvt. Ltd. — built so you can browse our marketing, video, and
              automation services, purchase the package that fits, and let our
              team take it from there.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              custom={3}
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-3"
            >
              <span className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-ink-muted shadow-sm">
                30+ Years Experience
              </span>

              <span className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-ink-muted shadow-sm">
                9+ Countries
              </span>

              <span className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-ink-muted shadow-sm">
                Technology & Growth
              </span>
            </motion.div>
          </div>

          {/* HERO IMAGE */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-30px_rgba(91,61,240,0.35)]">
              <img
                src={IMAGES.hero}
                alt="Business team working together"
                className="h-[480px] w-full object-cover sm:h-[560px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />

              {/* Bottom glass card */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Since 1994
                  </p>

                  <p className="mt-2 font-display text-2xl font-bold text-white">
                    Experience that understands business.
                  </p>

                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
                    Technology, marketing and hands-on execution — brought
                    together under one roof.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-7 -left-5 hidden rounded-2xl border border-border bg-white px-5 py-4 shadow-2xl sm:block">
              <p className="font-display text-xl font-bold text-ink">
                30+
              </p>

              <p className="text-xs text-ink-faint">
                Years of experience
              </p>
            </div>

            <div className="absolute -right-4 -top-4 hidden h-20 w-20 rounded-full border border-brand/20 bg-brand-soft sm:block" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   OUR STORY
========================================================= */

const MILESTONES = [
  {
    year: "1994",
    title: "Started as Titanium Computers",
    body: "Our journey began in Kerala as one of the state’s earliest computer and IT services companies — long before \"digital marketing\" was even a phrase.",
  },

  {
    year: "2000s",
    title: "Became Apple Infotech",
    body: "As the industry grew, so did we. The company rebranded to reflect a wider range of services and a bigger vision for what we could offer clients.",
  },

  {
    year: "2024",
    title: "Pathans Apple Infotech Pvt. Ltd.",
    body: "We became a private limited company, marking a new chapter while staying true to the same hands-on, client-first way of working.",
  },

  {
    year: "2026",
    title: "Apple Hub is born",
    body: "The next step — taking our most popular services online, so businesses anywhere can browse, purchase, and get started without a single phone call.",
  },
];

function OurStory() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* LEFT STORY */}
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              margin: "-60px",
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-canvas-soft px-4 py-1.5 text-xs font-semibold text-ink-muted">
              Our story
            </span>

            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Built in Kerala, trusted across borders
            </h2>

            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Pathans Apple Infotech Pvt. Ltd. has spent over 30 years helping
              businesses grow through technology — from our earliest days as a
              small computer services outfit in Alappuzha to a company now
              serving clients across 9+ countries, including the UAE, Saudi
              Arabia, Qatar, Oman, Bahrain, Kuwait, the UK, and the US.
            </p>

            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Our guiding idea has always been the same:{" "}
              <em>generating ideas</em> that actually move a business forward,
              then following through on them. Apple Hub is that same
              philosophy, made easier to reach.
            </p>

            {/* Story image */}
            <div className="relative mt-8 overflow-hidden rounded-[2rem]">
              <img
                src={IMAGES.story}
                alt="Modern office and business team"
                className="h-[340px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                  From local roots to global reach
                </span>
              </div>
            </div>
          </motion.div>

          {/* TIMELINE */}
          <div className="relative">
            <div className="absolute bottom-0 left-[15px] top-2 w-px bg-border sm:left-[19px]" />

            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{
                    opacity: 0,
                    x: 16,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    margin: "-60px",
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                  }}
                  className="relative flex gap-5 pl-0"
                >
                  <span className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-white sm:h-10 sm:w-10">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                  </span>

                  <div className="flex-1 rounded-2xl border border-border bg-canvas-soft p-5 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
                    <span className="text-xs font-bold uppercase tracking-wide text-brand-deep">
                      {m.year}
                    </span>

                    <h3 className="mt-1 font-display text-base font-bold text-ink">
                      {m.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                      {m.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Technology visual strip */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-60px",
          }}
          transition={{
            duration: 0.6,
          }}
          className="mt-16 overflow-hidden rounded-[2rem] bg-ink"
        >
          <div className="grid items-center lg:grid-cols-[1fr_0.8fr]">
            <div className="p-8 md:p-12">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Three decades of change
              </span>

              <h3 className="mt-4 max-w-lg font-display text-2xl font-bold text-white sm:text-3xl">
                From computers and IT services to digital growth and automation.
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
                Technology keeps changing. Our approach has evolved with it —
                while our focus on practical solutions and long-term client
                relationships has remained the same.
              </p>
            </div>

            <div className="relative h-64 lg:h-full">
              <img
                src={IMAGES.technology}
                alt="Modern technology"
                className="h-full w-full object-cover opacity-80"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-ink via-transparent to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================
   PURCHASE JOURNEY
========================================================= */

const STEPS = [
  {
    title: "Purchase your service online",
    body: "Browse our packages, pick the one that fits your business, and complete your purchase securely — right from this website.",
    color: "brand",
    icon: CartIcon,
    image: IMAGES.purchase,
  },

  {
    title: "We'll reach out shortly",
    body: "Once your order is placed, a member of our team contacts you to confirm details and understand exactly what you need.",
    color: "teal",
    icon: PhoneIcon,
    image: IMAGES.communication,
  },

  {
    title: "We follow up and deliver",
    body: "From there, we handle it — running your campaign, producing your creatives, or setting up your automation, based on what you purchased.",
    color: "coral",
    icon: CheckIcon,
    image: IMAGES.execution,
  },
];

function PurchaseJourney() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-canvas-soft px-4 py-1.5 text-xs font-semibold text-ink-muted">
            How Apple Hub works
          </span>

          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Purchase online. We take it from there.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            Apple Hub exists to make working with us as simple as buying
            anything else online — without losing the personal follow-up a
            growing business actually needs.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;

            const colors = {
              brand: {
                bg: "bg-brand-soft text-brand-deep",
                badge: "bg-brand text-white",
              },

              teal: {
                bg: "bg-teal-soft text-teal-deep",
                badge: "bg-teal text-white",
              },

              coral: {
                bg: "bg-coral-soft text-coral-deep",
                badge: "bg-coral text-white",
              },
            }[s.color];

            return (
              <motion.div
                key={s.title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: "-60px",
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Step image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

                  <span
                    className={`absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold shadow-lg ${colors.badge}`}
                  >
                    {i + 1}
                  </span>
                </div>

                <div className="p-7">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors.bg}`}
                  >
                    <Icon />
                  </span>

                  <h3 className="mt-5 font-display text-lg font-bold text-ink">
                    {s.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                    {s.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Direct contact fallback */}
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-60px",
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
          className="mt-10 flex flex-col items-start gap-6 overflow-hidden rounded-3xl border border-gold/30 bg-gold-soft p-7 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-gold">
              <BellIcon />
            </span>

            <div>
              <h3 className="font-display text-base font-bold text-ink">
                Running late on your follow-up?
              </h3>

              <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-ink-muted">
                We aim to reach every customer promptly, but if a follow-up is
                delayed or you'd rather speak to someone directly, our office
                is always reachable — no need to wait.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 text-sm font-semibold text-ink">
            <a
              href="tel:+917510666333"
              className="transition-colors hover:text-brand-deep"
            >
              +91 7510 666 333
            </a>

            <a
              href="mailto:info@pathansapple.com"
              className="transition-colors hover:text-brand-deep"
            >
              info@pathansapple.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================
   ICONS
========================================================= */

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 4h2l2.4 12.2a1.5 1.5 0 001.5 1.3h8.2a1.5 1.5 0 001.5-1.2L20 8H6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="9.5" cy="20.5" r="1.3" fill="currentColor" />
      <circle cx="17.5" cy="20.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 4h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 013 6.2 2 2 0 015 4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 10a6 6 0 1112 0c0 3.5 1 5 2 6H4c1-1 2-2.5 2-6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="M10 19a2 2 0 004 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   VISION & REACH
========================================================= */

const STATS = [
  {
    value: "30+",
    label: "Years in IT & marketing",
  },
  {
    value: "9+",
    label: "Countries served",
  },
  {
    value: "3",
    label: "Global offices",
  },
  {
    value: "3",
    label: "Growth services online",
  },
];

const OFFICES = [
  {
    place: "Kerala, India",
    detail:
      "AMC 19/305, First Floor, Alappuzha 688013 — our headquarters and main team.",
    color: "brand",
    image: IMAGES.kerala,
  },

  {
    place: "Norwich, United Kingdom",
    detail:
      "Supporting clients and partners across the UK and Europe.",
    color: "teal",
    image: IMAGES.global,
  },

  {
    place: "Ras Al Khaimah, UAE",
    detail:
      "Apple Infotech FZ-LLC, serving the Middle East market.",
    color: "coral",
    image: IMAGES.middleEast,
  },
];

function VisionAndReach() {
  return (
    <section className="bg-canvas-soft">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        {/* Vision & Mission */}
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: "-60px",
            }}
            transition={{
              duration: 0.5,
            }}
            className="group overflow-hidden rounded-3xl border border-border bg-white"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={IMAGES.vision}
                alt="Modern business workspace"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />

              <span className="absolute bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-deep">
                <EyeIcon />
              </span>
            </div>

            <div className="p-8">
              <h3 className="font-display text-xl font-bold text-ink">
                Our Vision
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                Making effective marketing and IT tools affordable and
                accessible for every business — from local shops to growing
                enterprises.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: "-60px",
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            className="group overflow-hidden rounded-3xl border border-border bg-white"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={IMAGES.mission}
                alt="Business team collaborating"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />

              <span className="absolute bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-xl bg-coral-soft text-coral-deep">
                <CompassIcon />
              </span>
            </div>

            <div className="p-8">
              <h3 className="font-display text-xl font-bold text-ink">
                Our Mission
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                To be a consultancy our clients can genuinely rely on —
                combining honest advice with hands-on execution that empowers
                real business growth.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-60px",
          }}
          transition={{
            duration: 0.5,
          }}
          className="mt-14 grid grid-cols-2 gap-6 rounded-3xl border border-border bg-white p-8 sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-ink sm:text-4xl">
                {s.value}
              </p>

              <p className="mt-1.5 text-xs text-ink-faint sm:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Offices */}
        <div className="mt-14">
          <div className="mx-auto max-w-xl text-center">
            <span className="inline-flex rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-ink-muted">
              Global presence
            </span>

            <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Where you'll find us
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Rooted in Kerala, with a presence supporting clients across
              different markets.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {OFFICES.map((o, i) => (
              <motion.div
                key={o.place}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: "-60px",
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                }}
                className="group overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={o.image}
                    alt={o.place}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />

                  <span
                    className={`absolute bottom-4 left-4 inline-flex h-9 w-9 items-center justify-center rounded-lg ${COLOR_MAP[o.color]}`}
                  >
                    <PinIcon />
                  </span>
                </div>

                <div className="p-6">
                  <h4 className="font-display text-base font-bold text-ink">
                    {o.place}
                  </h4>

                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {o.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   VISION ICONS
========================================================= */

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="12"
        r="2.6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M15 9l-2 6-6 2 2-6 6-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s7-6.6 7-12a7 7 0 10-14 0c0 5.4 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="9"
        r="2.4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function About() {
  return (
    <div className="min-h-screen bg-canvas">
      <Seo
        title="About Apple Hub"
        description="Learn about Apple Hub by Pathans Apple Info Tech, a trusted technology and digital services company helping businesses with web development, software solutions, digital marketing, AI video advertising, design and IT services."
        path="/about"
      />

      <main>
        <AboutHero />

        <OurStory />

        <VisionAndReach />

        <PurchaseJourney />

        <CTA />
      </main>
    </div>
  );
}