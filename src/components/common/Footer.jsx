import Logo from './Logo';

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-canvas-soft">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              Digital marketing, AI video ads, and WhatsApp Business automation — packaged
              simply for growing businesses.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold text-ink">Get in touch</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
              <li>Pathans Apple Infotech Pvt. Ltd.</li>
              <li>AMC 19/305, First Floor</li>
              <li>Alappuzha 688013, Kerala, India</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold text-ink">Websites</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
              <li>
                <a href="https://www.pathansapple.com" className="hover:text-brand" target="_blank" rel="noreferrer">
                  pathansapple.com
                </a>
              </li>
              <li>
                <a href="https://www.appleinfotech.org" className="hover:text-brand" target="_blank" rel="noreferrer">
                  appleinfotech.org
                </a>
              </li>
              <li>
                <a href="https://www.watichat.com" className="hover:text-brand" target="_blank" rel="noreferrer">
                  watichat.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-ink-faint md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Apple Hub — a product by Pathans Apple Infotech Pvt. Ltd.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
