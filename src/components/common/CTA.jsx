import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-coral px-8 py-14 text-center sm:px-16"
      >
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -top-10 left-10 h-40 w-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-[-4rem] right-10 h-48 w-48 rounded-full bg-white blur-3xl" />
        </div>

        <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl">
          Ready to grow your business?
        </h2>
        <p className="relative mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
          Start with a single campaign or go all-in with a full creative package — either way,
          we'll have you live within days.
        </p>
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/contact"
            className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            Get Started Today
          </a>
          <a
            href="/services"
            className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            View Services
          </a>
        </div>
      </motion.div>
    </section>
  );
}
