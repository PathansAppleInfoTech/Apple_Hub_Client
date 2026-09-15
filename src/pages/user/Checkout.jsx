import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getService,
  createPayment,
  verifyPayment,
} from '../../api/services';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  address: '',
};

export default function Checkout() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [status, setStatus] = useState('loading');
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadService() {
      setStatus('loading');

      try {
        const data = await getService(serviceId);

        if (!mounted) return;

        if (!data) {
          setStatus('error');
          return;
        }

        setService(data);
        setStatus('ready');
      } catch (error) {
        if (!mounted) return;

        console.error('[Checkout] Failed to load service:', error);
        setStatus('error');
      }
    }

    loadService();

    return () => {
      mounted = false;
    };
  }, [serviceId]);

  const price = useMemo(() => {
    if (!service) return 'Custom';

    if (
      service.price === null ||
      service.price === undefined ||
      service.price === ''
    ) {
      return service.price_suffix || 'Custom';
    }

    const amount = Number(service.price);

    if (Number.isNaN(amount)) {
      return String(service.price);
    }

    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

    return service.price_suffix
      ? `${formatted} ${service.price_suffix}`
      : formatted;
  }, [service]);

  const isPurchasable = useMemo(() => {
    if (!service) return false;

    const amount = Number(service.price);
    return Number.isFinite(amount) && amount > 0;
  }, [service]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: '',
      }));
    }
  }

  function validate() {
    const next = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();

    if (!name) {
      next.name = 'Please enter your full name';
    } else if (name.length < 2) {
      next.name = 'Name must be at least 2 characters';
    } else if (name.length > 120) {
      next.name = 'Name is too long';
    }

    if (!email) {
      next.email = 'Please enter your email address';
    } else if (!EMAIL_RE.test(email)) {
      next.email = 'Please enter a valid email address';
    }

    if (!phone) {
      next.phone = 'Please enter your phone number';
    } else if (!PHONE_RE.test(phone)) {
      next.phone = 'Please enter a valid phone number';
    }

    if (!address) {
      next.address = 'Please enter your address';
    } else if (address.length < 5) {
      next.address = 'Please enter a complete address';
    } else if (address.length > 500) {
      next.address = 'Address is too long';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    if (!validate()) {
      toast.error('Please check the highlighted fields.');
      return;
    }

    if (!service || !isPurchasable) {
      toast.error('This service is not available for online purchase.');
      return;
    }

    if (!window.Razorpay) {
      toast.error(
        'Payment gateway is unavailable. Please refresh the page and try again.'
      );
      return;
    }

    setSubmitting(true);

    const customer = {
      customer_name: form.name.trim(),
      customer_email: form.email.trim().toLowerCase(),
      customer_phone: form.phone.trim(),
      customer_address: form.address.trim(),
      service_id: service.id,
    };

    try {
      // Creates ONLY the Razorpay order. Our internal order is created
      // by the backend only after successful payment verification.
      const payment = await createPayment(customer);

      if (!payment?.gateway_order_id || !payment?.key_id) {
        throw new Error('Unable to initialize secure payment.');
      }

      const razorpay = new window.Razorpay({
        key: payment.key_id,
        amount: Math.round(Number(payment.amount) * 100),
        currency: payment.currency || 'INR',
        name: 'Apple Hub',
        description: service.title || 'Service Purchase',
        order_id: payment.gateway_order_id,

        prefill: {
          name: customer.customer_name,
          email: customer.customer_email,
          contact: customer.customer_phone,
        },

        notes: {
          service_id: String(service.id),
        },

        theme: {
          color: '#5B3DF0',
        },

        handler: async (response) => {
          try {
            const order = await verifyPayment({
              ...customer,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success('Payment successful! Your order is confirmed.');

            navigate(`/order-success/${order.order_number}`, {
              replace: true,
            });
          } catch (error) {
            console.error(
              '[Checkout] Payment verification failed:',
              error
            );

            toast.error(
              error?.message ||
                'Payment verification failed. Please contact support.'
            );

            setSubmitting(false);
          }
        },

        modal: {
          ondismiss: () => {
            setSubmitting(false);
            toast('Payment cancelled. You can try again when ready.');
          },
        },
      });

      razorpay.on('payment.failed', (response) => {
        console.error(
          '[Checkout] Razorpay payment failed:',
          response
        );

        setSubmitting(false);

        toast.error(
          response?.error?.description ||
            'Payment failed. Please try again.'
        );
      });

      razorpay.open();
    } catch (error) {
      console.error('[Checkout] Failed to start payment:', error);

      toast.error(
        error?.message ||
          'Unable to start payment. Please try again.'
      );

      setSubmitting(false);
    }
  }

  if (status === 'loading') {
    return <CheckoutLoading />;
  }

  if (status === 'error' || !service) {
    return <CheckoutError />;
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-coral/10 blur-[120px]" />
      </div>

      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-6xl px-5 py-7 sm:px-6 sm:py-8">
          <div className="flex items-center gap-1.5 overflow-hidden text-xs text-ink-faint">
            <Link
              to="/services"
              className="shrink-0 transition hover:text-ink"
            >
              Services
            </Link>

            <ChevronRightIcon />

            <Link
              to={`/services/${service.serviceId || service.id}`}
              className="min-w-0 truncate transition hover:text-ink"
            >
              {service.title}
            </Link>

            <ChevronRightIcon />

            <span className="shrink-0 text-ink-muted">Checkout</span>
          </div>

          <div className="mt-6 sm:mt-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Secure checkout
            </span>

            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Complete your order
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted sm:text-base">
              Enter your details and continue to Razorpay for secure payment.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_60px_-30px_rgba(21,22,43,0.18)] sm:rounded-[2rem] sm:p-8"
          >
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <UserIcon />
              </span>

              <div>
                <h2 className="font-display text-lg font-bold text-ink">
                  Your details
                </h2>
                <p className="mt-0.5 text-xs text-ink-faint">
                  We&apos;ll use these details to process your order.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field
                label="Full name"
                placeholder="Enter your full name"
                value={form.name}
                error={errors.name}
                autoComplete="name"
                onChange={(value) => updateField('name', value)}
              />

              <Field
                label="Phone number"
                type="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                error={errors.phone}
                autoComplete="tel"
                inputMode="tel"
                onChange={(value) => updateField('phone', value)}
              />

              <Field
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                error={errors.email}
                autoComplete="email"
                inputMode="email"
                onChange={(value) => updateField('email', value)}
              />

              <div className="hidden sm:block" />

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-ink">
                  Address
                </label>

                <textarea
                  rows={4}
                  value={form.address}
                  maxLength={500}
                  autoComplete="street-address"
                  onChange={(event) =>
                    updateField('address', event.target.value)
                  }
                  placeholder="Business address or location"
                  className={`mt-2 w-full resize-none rounded-2xl border bg-canvas-soft px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:bg-white focus:ring-4 ${
                    errors.address
                      ? 'border-coral/50 focus:border-coral focus:ring-coral/10'
                      : 'border-border focus:border-brand/40 focus:ring-brand/10'
                  }`}
                />

                {errors.address && (
                  <p className="mt-1.5 text-xs font-medium text-coral-deep">
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-brand/10 bg-brand-softer p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
                  <ShieldIcon />
                </span>

                <div>
                  <p className="text-xs font-bold text-ink">
                    Your information is secure
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
                    Your details are used only to process your order and
                    communicate with you about your purchase.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !isPurchasable}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-bold text-white shadow-lg shadow-ink/10 transition-all hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Spinner />
                  Opening secure payment...
                </>
              ) : (
                <>
                  Continue to payment
                  <ArrowRightIcon />
                </>
              )}
            </button>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-faint">
              You&apos;ll complete payment securely through Razorpay. Your
              order is confirmed only after payment verification.
            </p>
          </form>

          <OrderSummary service={service} price={price} />
        </div>
      </main>

      <section className="border-t border-border bg-white">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-7 sm:grid-cols-3 sm:divide-x sm:divide-border sm:px-6 sm:py-8">
          <TrustItem
            icon={<ShieldIcon />}
            title="Secure checkout"
            text="Your order details are protected."
          />
          <TrustItem
            icon={<MessageIcon />}
            title="Quick support"
            text="Our team is available to help."
          />
          <TrustItem
            icon={<CheckCircleIcon />}
            title="Clear pricing"
            text="No hidden package charges."
          />
        </div>
      </section>
    </div>
  );
}

function OrderSummary({ service, price }) {
  const features = Array.isArray(service.features)
    ? service.features.slice(0, 5)
    : [];

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-[0_20px_60px_-30px_rgba(21,22,43,0.18)] sm:rounded-[2rem]">
        <div className="h-1.5 bg-gradient-to-r from-brand via-coral to-teal" />

        <div className="p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
              Order summary
            </p>

            {service.popular && (
              <span className="rounded-full bg-coral-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-coral-deep">
                Popular
              </span>
            )}
          </div>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <PackageIcon />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                {service.tier || 'Service Package'}
              </p>

              <h2 className="mt-1 font-display text-lg font-bold leading-snug text-ink">
                {service.title}
              </h2>
            </div>
          </div>

          {service.short_description && (
            <p className="mt-5 text-xs leading-6 text-ink-muted">
              {service.short_description}
            </p>
          )}

          {service.duration && (
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-canvas-soft px-3.5 py-3 text-xs font-semibold text-ink-muted">
              <ClockIcon />
              {service.duration}
            </div>
          )}

          {features.length > 0 && (
            <div className="mt-6 border-t border-border pt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
                Included
              </p>

              <ul className="mt-3 space-y-2.5">
                {features.map((feature, index) => (
                  <li
                    key={`${feature}-${index}`}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-muted"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                      <CheckIcon />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.freebies && (
            <div className="mt-5 rounded-2xl border border-gold/30 bg-gold-soft p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg" aria-hidden="true">
                  🎁
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gold">
                    Freebie included
                  </p>
                  <p className="mt-1 text-xs font-bold leading-relaxed text-ink">
                    {service.freebies}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="my-6 h-px bg-border" />

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-ink-faint">Total</p>
              <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-brand-deep">
                {price}
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-soft px-3 py-1.5 text-[10px] font-bold text-teal-deep">
              <ShieldIcon />
              Secure
            </span>
          </div>

          <div className="mt-6 flex items-start gap-2.5 text-[11px] leading-relaxed text-ink-faint">
            <ShieldIcon />
            <span>
              Secure ordering with direct support from Apple Hub by Pathans
              Apple Info Tech.
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  autoComplete,
  inputMode,
}) {
  return (
    <div>
      <label className="text-xs font-bold text-ink">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`mt-2 w-full rounded-2xl border bg-canvas-soft px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:bg-white focus:ring-4 ${
          error
            ? 'border-coral/50 focus:border-coral focus:ring-coral/10'
            : 'border-border focus:border-brand/40 focus:ring-brand/10'
        }`}
      />

      {error && (
        <p className="mt-1.5 text-xs font-medium text-coral-deep">
          {error}
        </p>
      )}
    </div>
  );
}

function TrustItem({ icon, title, text }) {
  return (
    <div className="flex items-center gap-3 sm:px-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
        {icon}
      </span>

      <div>
        <p className="text-xs font-bold text-ink">{title}</p>
        <p className="mt-0.5 text-[11px] text-ink-faint">{text}</p>
      </div>
    </div>
  );
}

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        <div className="animate-pulse">
          <div className="h-4 w-40 rounded bg-canvas-soft" />
          <div className="mt-8 h-10 w-72 max-w-full rounded-xl bg-canvas-soft" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-canvas-soft" />

          <div className="mt-10 grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="rounded-[2rem] border border-border bg-white p-6 sm:p-8">
              <div className="h-8 w-40 rounded bg-canvas-soft" />
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="h-14 rounded-2xl bg-canvas-soft" />
                <div className="h-14 rounded-2xl bg-canvas-soft" />
                <div className="h-14 rounded-2xl bg-canvas-soft" />
                <div className="h-14 rounded-2xl bg-canvas-soft" />
              </div>
              <div className="mt-5 h-28 rounded-2xl bg-canvas-soft" />
              <div className="mt-7 h-14 rounded-full bg-canvas-soft" />
            </div>

            <div className="h-[500px] rounded-[2rem] bg-canvas-soft" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutError() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-xl px-5 py-20 text-center sm:px-6 sm:py-24">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-coral-soft text-coral">
          <AlertIcon />
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold text-ink">
          Unable to load checkout
        </h1>

        <p className="mt-3 text-sm leading-7 text-ink-muted">
          We couldn&apos;t retrieve this service right now. Please go back and
          try again.
        </p>

        <Link
          to="/services"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-deep"
        >
          Browse services
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
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
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
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

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
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

function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5 20c.8-3.3 3.1-5 7-5s6.2 1.7 7 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
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
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
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

function AlertIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
  );
}
