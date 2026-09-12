import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getService, createOrder, createPayment, simulateTestPayment } from '../../api/services';
import { formatPrice } from '../../components/ServiceCard';
import { LoadingState, ErrorState } from '../../components/StateViews';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

export default function Checkout() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [status, setStatus] = useState('loading');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentStage, setPaymentStage] = useState(null); // null | { order, payment }

  useEffect(() => {
    getService(serviceId)
      .then((data) => {
        setService(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [serviceId]);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email address';
    if (!PHONE_RE.test(form.phone)) next.phone = 'Enter a valid phone number';
    if (!form.address.trim()) next.address = 'Please enter an address';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const order = await createOrder({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        customer_address: form.address,
        service_id: service.id,
      });
      const payment = await createPayment(order.id);
      setPaymentStage({ order, payment });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePay() {
    setSubmitting(true);
    try {
      if (paymentStage.payment.test_mode) {
        // No live gateway configured yet — simulate the server-side
        // confirmation a real gateway webhook would trigger.
        await simulateTestPayment(paymentStage.payment.gateway_order_id);
      } else {
        // TODO (live gateway): open the Razorpay checkout widget here using
        // paymentStage.payment.key_id and gateway_order_id, then let the
        // webhook confirm payment server-side as usual.
        toast.error('Live payment gateway is not configured yet.');
        setSubmitting(false);
        return;
      }
      navigate(`/order-success/${paymentStage.order.order_number}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (status === 'loading') return <LoadingState label="Loading checkout…" />;
  if (status === 'error' || !service) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <ErrorState message="We couldn't load this service for checkout." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm text-brass">Checkout</p>
      <h1 className="mt-2 font-display text-3xl text-paper">Complete your order</h1>

      <div className="mt-10 grid gap-10 md:grid-cols-[1.3fr_1fr]">
        {!paymentStage ? (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <Field
              label="Full name"
              value={form.name}
              error={errors.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            />
            <Field
              label="Email address"
              type="email"
              value={form.email}
              error={errors.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            />
            <Field
              label="Phone number"
              type="tel"
              value={form.phone}
              error={errors.phone}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
            />
            <div>
              <label className="text-sm text-paper">Address</label>
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-navy-border bg-navy-surface px-4 py-2.5 text-sm text-paper placeholder:text-paper-muted focus:border-brass"
                placeholder="Business address or location"
              />
              {errors.address && <p className="mt-1 text-xs text-status-cancelled">{errors.address}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink hover:bg-brass-soft disabled:opacity-60"
            >
              {submitting ? 'Please wait…' : 'Proceed to Payment'}
            </button>
          </form>
        ) : (
          <div className="rounded-2xl border border-navy-border bg-navy-surface p-6">
            <h2 className="font-display text-xl text-paper">Payment</h2>
            <p className="mt-2 text-sm text-paper-muted">
              Order <span className="text-paper">{paymentStage.order.order_number}</span> has been
              created. Confirm payment to finalize your purchase.
            </p>
            {paymentStage.payment.test_mode && (
              <p className="mt-3 rounded-md border border-brass/30 bg-brass/5 px-3 py-2 text-xs text-brass">
                Test mode: no live payment gateway is configured yet. This will simulate a
                successful payment.
              </p>
            )}
            <button
              type="button"
              onClick={handlePay}
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink hover:bg-brass-soft disabled:opacity-60"
            >
              {submitting ? 'Processing…' : `Pay ${formatPrice(paymentStage.payment.amount)}`}
            </button>
          </div>
        )}

        <div className="h-fit rounded-2xl border border-navy-border bg-navy-surface p-6">
          <p className="text-xs uppercase tracking-wide text-paper-muted">Selected service</p>
          <h3 className="mt-2 font-display text-lg text-paper">{service.title}</h3>
          <div className="mt-4 flex items-center justify-between border-t border-navy-border pt-4">
            <span className="text-sm text-paper-muted">Price</span>
            <span className="font-display text-xl text-paper">{formatPrice(service.price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, error, type = 'text' }) {
  return (
    <div>
      <label className="text-sm text-paper">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-navy-border bg-navy-surface px-4 py-2.5 text-sm text-paper placeholder:text-paper-muted focus:border-brass"
      />
      {error && <p className="mt-1 text-xs text-status-cancelled">{error}</p>}
    </div>
  );
}
