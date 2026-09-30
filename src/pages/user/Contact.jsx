import { useState } from "react";
import Seo from "../../components/common/Seo";
import { motion } from "framer-motion";

/* =========================================================
   CONTACT DETAILS
========================================================= */

const HQ_ADDRESS =
  "AMC 19/305, First Floor, Alappuzha 688013, Kerala, India";

const PHONE_DISPLAY = "+91 79077 04987";
const PHONE_TEL = "+917907704987";
const EMAIL = "info@pathansapple.com";
const WHATSAPP_NUMBER = "917907704987";

/* =========================================================
   UNSPLASH IMAGES
========================================================= */

const IMAGES = {
  hero:
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85",

  phone:
    "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1000&q=85",

  whatsapp:
    "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=1000&q=85",

  email:
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=85",

  office:
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85",

  meeting:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=85",

  support:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
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
   CONTACT HERO
========================================================= */

function ContactHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand/20 blur-[90px]" />

        <div className="absolute right-[-6rem] top-10 h-96 w-96 rounded-full bg-whatsapp/15 blur-[100px]" />

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
              Get in Touch
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              custom={1}
              variants={fadeUp}
              className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.7rem]"
            >
              Tell us what you're building,
              <span className="bg-gradient-to-r from-brand to-whatsapp-deep bg-clip-text text-transparent">
                {" "}
                we'll take it from there.
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              custom={2}
              variants={fadeUp}
              className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
            >
              Already purchased a package? We'll reach out shortly. Still
              deciding, or need something custom? Call, message, or write to
              us directly — a real person on our Alappuzha team replies.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              custom={3}
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href={`tel:${PHONE_TEL}`}
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-ink/10 transition-all hover:-translate-y-0.5 hover:bg-brand-deep"
              >
                Call {PHONE_DISPLAY}

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-whatsapp/30 bg-whatsapp-soft px-7 py-3.5 text-sm font-semibold text-whatsapp-deep transition-all hover:-translate-y-0.5 hover:border-whatsapp/60"
              >
                Message on WhatsApp
              </a>
            </motion.div>

            {/* Mini trust points */}
            <motion.div
              initial="hidden"
              animate="show"
              custom={4}
              variants={fadeUp}
              className="mt-10 flex flex-wrap gap-3"
            >
              <span className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-ink-muted shadow-sm">
                Real people
              </span>

              <span className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-ink-muted shadow-sm">
                Alappuzha team
              </span>

              <span className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-ink-muted shadow-sm">
                Fast response
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
                alt="Business team discussing a project"
                className="h-[480px] w-full object-cover sm:h-[550px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />

              {/* Bottom glass card */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-whatsapp" />

                    <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      Let's talk
                    </span>
                  </div>

                  <p className="mt-2 font-display text-2xl font-bold text-white">
                    Your next idea starts with a conversation.
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Tell us what you need. We'll help you figure out the next
                    step.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-7 -left-5 hidden rounded-2xl border border-border bg-white px-5 py-4 shadow-2xl sm:block">
              <p className="font-display text-xl font-bold text-ink">
                Mon – Sat
              </p>

              <p className="text-xs text-ink-faint">
                10 AM – 6 PM IST
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CONTACT CHANNELS
========================================================= */

const CHANNELS = [
  {
    title: "Call us",
    body: "Speak directly with our team about a package or a custom request.",
    action: PHONE_DISPLAY,
    href: `tel:${PHONE_TEL}`,
    color: "brand",
    icon: PhoneIcon,
    image: IMAGES.phone,
  },

  {
    title: "WhatsApp us",
    body: "The fastest way to reach us — and a preview of the automation we build for clients.",
    action: "Start a chat",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    external: true,
    color: "whatsapp",
    icon: WhatsAppIcon,
    image: IMAGES.whatsapp,
  },

  {
    title: "Email us",
    body: "For detailed briefs, invoices, or anything you'd rather put in writing.",
    action: EMAIL,
    href: `mailto:${EMAIL}`,
    color: "teal",
    icon: MailIcon,
    image: IMAGES.email,
  },
];

const CHANNEL_COLORS = {
  brand: {
    iconBg: "bg-brand text-white",
    ring: "hover:border-brand/40",
  },

  whatsapp: {
    iconBg: "bg-whatsapp text-white",
    ring: "hover:border-whatsapp/40",
  },

  teal: {
    iconBg: "bg-teal text-white",
    ring: "hover:border-teal/40",
  },
};

function ContactChannels() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex rounded-full border border-border bg-canvas-soft px-4 py-1.5 text-xs font-semibold text-ink-muted">
            Choose how you want to reach us
          </span>

          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            We're easy to reach
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Pick whichever channel works best for you. Our team is ready to
            understand what you need.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CHANNELS.map((c, i) => {
            const colors = CHANNEL_COLORS[c.color];
            const Icon = c.icon;

            return (
              <motion.a
                key={c.title}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noreferrer" : undefined}
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
                className={`group overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${colors.ring}`}
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />

                  <span
                    className={`absolute bottom-4 left-5 flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg ${colors.iconBg}`}
                  >
                    <Icon />
                  </span>
                </div>

                <div className="p-7">
                  <h3 className="font-display text-lg font-bold text-ink">
                    {c.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {c.body}
                  </p>

                  <span className="mt-5 inline-flex text-sm font-semibold text-ink transition-colors group-hover:text-brand-deep">
                    {c.action}
                    <span className="ml-1 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FORM
========================================================= */

const SERVICE_OPTIONS = [
  "Facebook & Instagram Marketing",
  "Social Media Management",
  "AI Video Ads",
  "WhatsApp Business Software",
  "Something else",
];

function ContactFormSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: SERVICE_OPTIONS[0],
    message: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const message = [
      "NEW WEBSITE ENQUIRY",
      "────────────────────────",
      `Name: ${form.name || "Not provided"}`,
      `Email: ${form.email || "Not provided"}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Service: ${form.service || "Not selected"}`,
      "────────────────────────",
      "Message:",
      form.message || "No message provided",
      "────────────────────────",
      "Received via Apple Hub By Pathans Apple Info Tech",
      "https://ecom.pathansapple.com",
    ].join("\n");

    const whatsappUrl = `https://wa.me/${PHONE_TEL.replace(
      /\D/g,
      ""
    )}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="bg-canvas-soft">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* FORM */}
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
              duration: 0.55,
            }}
            className="rounded-[2rem] border border-border bg-white p-6 shadow-[0_30px_80px_-30px_rgba(91,61,240,0.15)] sm:p-9"
          >
            <span className="inline-flex rounded-full border border-brand/20 bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand-deep">
              Start a conversation
            </span>

            <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink">
              Tell us what you need
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Share a few details and we'll take it forward with you.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name">
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Anjali Menon"
                    className="w-full rounded-xl border border-border bg-canvas-soft px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </Field>

                <Field label="Phone number">
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 98470 12345"
                    className="w-full rounded-xl border border-border bg-canvas-soft px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </Field>
              </div>

              <Field label="Email address">
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@business.com"
                  className="w-full rounded-xl border border-border bg-canvas-soft px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </Field>

              <Field label="Which service are you interested in?">
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-canvas-soft px-4 py-3 text-sm text-ink focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Your message">
                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us a bit about your business and what you need"
                  className="w-full resize-none rounded-xl border border-border bg-canvas-soft px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </Field>

              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-ink/10 transition-all hover:-translate-y-0.5 hover:bg-brand-deep sm:w-auto"
              >
                Send message

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </form>
          </motion.div>

          {/* OFFICE PANEL */}
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
              duration: 0.55,
              delay: 0.1,
            }}
            className="flex flex-col gap-5"
          >
            {/* Office image */}
            <div className="group relative overflow-hidden rounded-[2rem]">
              <img
                src={IMAGES.office}
                alt="Apple Hub office"
                className="h-[310px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Apple Hub
                </span>

                <h3 className="mt-1 font-display text-2xl font-bold text-white">
                  Our team is based in Alappuzha.
                </h3>

                <p className="mt-2 text-sm text-white/65">
                  Rooted in Kerala, working with businesses across markets.
                </p>
              </div>
            </div>

            {/* Headquarters */}
            <div className="rounded-3xl border border-border bg-white p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-deep">
                <PinIcon />
              </span>

              <h3 className="mt-4 font-display text-base font-bold text-ink">
                Our Headquarters
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {HQ_ADDRESS}
              </p>

              <div className="mt-4 rounded-xl border border-border bg-canvas-soft px-4 py-3">
                <p className="text-xs font-semibold text-ink-muted">
                  GSTIN
                </p>

                <p className="mt-1 text-sm font-semibold tracking-wide text-ink">
                  32AAOCP4547L1ZZ
                </p>
              </div>

              <a
                href="/about"
                className="mt-3 inline-block text-xs font-semibold text-brand-deep hover:underline"
              >
                See all our global offices →
              </a>

              <div className="mt-5 overflow-hidden rounded-2xl border border-border">
                <iframe
                  title="Apple Hub office location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d882.5744621012162!2d76.33804828736739!3d9.517849967765285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d9566c4a8d1%3A0x6d169d4a8285c93e!2sPathans%20Apple%20Infotech%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1789113714110!5m2!1sen!2sin"
                  className="h-52 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Hours */}
            <div className="rounded-3xl border border-border bg-white p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-soft text-teal-deep">
                <ClockIcon />
              </span>

              <h3 className="mt-4 font-display text-base font-bold text-ink">
                Business hours
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Monday – Saturday, 10:00 AM – 6:00 PM IST
              </p>

              <p className="mt-1 text-xs text-ink-faint">
                Reach out anytime — WhatsApp and email are checked outside
                these hours too.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink-muted">
        {label}
      </span>

      {children}
    </label>
  );
}

/* =========================================================
   FAQ
========================================================= */

const FAQS = [
  {
    q: "How quickly will someone get back to me?",
    a: "Most enquiries get a reply the same business day. If you've already purchased a package, our team reaches out to confirm details shortly after, as outlined in our purchase process.",
  },

  {
    q: "What payment methods do you accept?",
    a: "Packages listed on our services pages can be paid for securely online. For custom or larger engagements, we can also arrange bank transfer — just mention it when you contact us.",
  },

  {
    q: "Can a package be customized for my business?",
    a: "Yes. The listed packages cover the most common needs, but tell us your goals and budget and we'll put together something that fits.",
  },

  {
    q: "Do you work with businesses outside Kerala or India?",
    a: "We do — alongside our Alappuzha headquarters, we support clients through offices in the UK and UAE, and have delivered work across the Gulf, the UK, and the US.",
  },

  {
    q: "What if I need to cancel or reschedule a campaign?",
    a: "Let us know as early as possible through any of the channels on this page. Since campaigns are scheduled per package, timing affects what's possible, so early notice helps us adjust smoothly.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          {/* FAQ IMAGE */}
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
            className="relative hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                src={IMAGES.support}
                alt="Team discussing customer support"
                className="h-[560px] w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Need help?
                  </p>

                  <p className="mt-2 font-display text-xl font-bold text-white">
                    We're only a message away.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <div>
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-canvas-soft px-4 py-1.5 text-xs font-semibold text-ink-muted">
                Before you write in
              </span>

              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Common questions
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-muted lg:mx-0">
                A few quick answers before you get in touch.
              </p>
            </div>

            <div className="mt-10 space-y-3">
              {FAQS.map((item, i) => {
                const isOpen = open === i;

                return (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-border bg-canvas-soft transition-colors hover:border-ink/10"
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-4.5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display text-sm font-bold text-ink sm:text-base">
                        {item.q}
                      </span>

                      <span
                        className={`shrink-0 text-ink-faint transition-transform ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        <PlusIcon />
                      </span>
                    </button>

                    {isOpen && (
                      <motion.p
                        initial={{
                          opacity: 0,
                          y: -5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="px-6 pb-5 text-sm leading-relaxed text-ink-muted"
                      >
                        {item.a}
                      </motion.p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   ICONS
========================================================= */

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

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12a8 8 0 1114.3 4.9L20 21l-4.3-1.7A8 8 0 014 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="M8.5 11.5c.5 2 2 3 3.8 3.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="5.5"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

function ClockIcon() {
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
        d="M12 7v5.5l3.5 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function Contact() {
  return (
    <div className="min-h-screen bg-canvas">
      <Seo
        title="Contact Apple Hub"
        description="Get in touch with Apple Hub by Pathans Apple Info Tech — call, WhatsApp, or email our Alappuzha, Kerala team about digital marketing, AI video ads, and WhatsApp Business automation packages."
        path="/contact"
      />

      <main>
        <ContactHero />

        <ContactChannels />

        <ContactFormSection />

        <FAQ />
      </main>
    </div>
  );
}
