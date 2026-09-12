import { useState } from 'react';

// Looks for a real logo file at /assets/images/logo.png (drop yours in
// public/assets/images/logo.png). Until then — or if it fails to load —
// it falls back to a designed wordmark so the header never looks broken.
export default function Logo({ className = '' }) {
  const [imgFailed, setImgFailed] = useState(false);

  // if (!imgFailed) {
  //   return (
  //     <img
  //       src="/assets/images/logo.png"
  //       alt="Apple Hub"
  //       className={className || 'h-9 w-auto'}
  //       onError={() => setImgFailed(true)}
  //     />
  //   );
  // }

  return (
    <span className="flex items-center gap-2.5">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-coral text-white shadow-sm shadow-brand/30">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="5" r="2.4" fill="currentColor" />
          <circle cx="5" cy="17" r="2.4" fill="currentColor" />
          <circle cx="19" cy="17" r="2.4" fill="currentColor" />
          <path d="M12 7.4V13M12 13L6.4 15.6M12 13l5.6 2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-ink">
        Apple<span className="text-brand">Hub</span>
        <p className="mt-0.5 text-[8px] font-medium tracking-[0.08em] text-slate-400">
          BY PATHANS APPLE INFO TECH
        </p>
      </span>
    </span>
  );
}
