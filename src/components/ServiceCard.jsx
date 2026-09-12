import { Link } from 'react-router-dom';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export default function ServiceCard({ service }) {
  return (
    <Link
      to={`/services/${service.slug}`}
      className="group flex flex-col justify-between rounded-xl border border-navy-border bg-navy-surface p-6 transition-colors hover:border-brass/50"
    >
      <div>
        {service.category_name && (
          <span className="text-xs uppercase tracking-wide text-paper-muted">
            {service.category_name}
          </span>
        )}
        <h3 className="mt-2 font-display text-xl text-paper group-hover:text-brass">
          {service.title}
        </h3>
        {service.short_description && (
          <p className="mt-2 text-sm leading-relaxed text-paper-muted">
            {service.short_description}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-navy-border pt-4">
        <span className="font-display text-lg text-paper">{formatPrice(service.price)}</span>
        <span className="text-sm text-brass">View details →</span>
      </div>
    </Link>
  );
}

export { formatPrice };
