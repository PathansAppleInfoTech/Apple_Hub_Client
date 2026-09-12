import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../../api/services';
import { formatPrice } from '../../components/ServiceCard';
import { LoadingState, ErrorState } from '../../components/StateViews';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    getOrder(orderNumber)
      .then((data) => {
        setOrder(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [orderNumber]);

  if (status === 'loading') return <LoadingState label="Loading your order…" />;
  if (status === 'error' || !order) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <ErrorState message="We couldn't find that order." />
      </div>
    );
  }

  const isPaid = order.payment_status === 'paid';

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border ${
          isPaid ? 'border-status-completed/40 text-status-completed' : 'border-brass/40 text-brass'
        }`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="mt-6 font-display text-3xl text-paper">
        {isPaid ? 'Payment Successful' : 'Order Received'}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-paper-muted">
        {isPaid
          ? 'Thank you for your purchase. Our team will contact you shortly.'
          : 'Your order has been created and is awaiting payment confirmation.'}
      </p>

      <div className="mt-10 rounded-2xl border border-navy-border bg-navy-surface p-6 text-left">
        <div className="flex items-center justify-between">
          <span className="text-sm text-paper-muted">Order Number</span>
          <span className="font-display text-lg text-paper">{order.order_number}</span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-navy-border pt-4">
          <span className="text-sm text-paper-muted">Service</span>
          <span className="text-sm text-paper">{order.service_title}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-paper-muted">Amount</span>
          <span className="text-sm text-paper">{formatPrice(order.amount)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-paper-muted">Payment Status</span>
          <span className="text-sm capitalize text-paper">{order.payment_status}</span>
        </div>
      </div>

      <Link
        to="/services"
        className="mt-10 inline-block rounded-full border border-navy-border px-6 py-3 text-sm text-paper hover:border-brass/50 hover:text-brass"
      >
        Browse more services
      </Link>
    </div>
  );
}
