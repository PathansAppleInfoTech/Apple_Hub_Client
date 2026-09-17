import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../../api/services';
import { formatPrice } from '../../components/user/ServiceCard';
import { LoadingState, ErrorState } from '../../components/admin/StateViews';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let mounted = true;

    getOrder(orderNumber)
      .then((data) => {
        if (!mounted) return;

        setOrder(data);
        setStatus('ready');

        requestAnimationFrame(() => {
          setTimeout(() => {
            if (mounted) setShowContent(true);
          }, 100);
        });
      })
      .catch(() => {
        if (mounted) setStatus('error');
      });

    return () => {
      mounted = false;
    };
  }, [orderNumber]);

  if (status === 'loading') {
    return <LoadingState label="Loading your order…" />;
  }

  if (status === 'error' || !order) {
    return (
      <div className="min-h-[70vh] bg-canvas px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <ErrorState message="We couldn't find that order." />

          <div className="mt-6 text-center">
            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-deep"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = order.payment_status === 'paid';

  const paymentMethod = order.payment_method
    ? formatPaymentMethod(order.payment_method)
    : 'Razorpay';

  // order.amount is the final amount charged to the customer.
  // If GST is included, the pre-tax amount is derived from the final price.
  const totalAmount = Number(order.amount || 0);
  const taxType = order.tax_type === 'included' ? 'included' : 'not_applicable';
  const taxRate =
    taxType === 'included' && Number.isFinite(Number(order.tax_rate))
      ? Number(order.tax_rate)
      : null;

  let taxableAmount = Number(order.taxable_amount);
  let taxAmount = Number(order.tax_amount);

  if (
    taxType === 'included' &&
    taxRate !== null &&
    (!Number.isFinite(taxableAmount) || !Number.isFinite(taxAmount))
  ) {
    taxableAmount = totalAmount / (1 + taxRate / 100);
    taxableAmount = Math.round(taxableAmount * 100) / 100;
    taxAmount = Math.round((totalAmount - taxableAmount) * 100) / 100;
  }

  if (taxType === 'not_applicable') {
    taxableAmount = totalAmount;
    taxAmount = 0;
  }

  const taxLabel =
    taxType === 'included'
      ? `GST included${taxRate !== null ? ` (${taxRate}%)` : ''}`
      : 'GST not applicable';

  return (
    <main className="relative min-h-screen overflow-hidden bg-canvas px-4 py-12 sm:px-6 lg:py-20">

      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-brand/[0.035] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[38%] h-72 w-72 rounded-full bg-brand/[0.025] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-[55%] h-80 w-80 rounded-full bg-gold/[0.025] blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl">

        {/* =========================================================
            SUCCESS HEADER
        ========================================================= */}

        <section className="text-center">

          <div className="relative mx-auto h-32 w-32">

            {/* Outer ring */}
            <div
              className={`absolute inset-0 rounded-full border border-brand/10 ${showContent
                  ? 'animate-[successRing_1.8s_ease-out_0.3s_both]'
                  : 'opacity-0'
                }`}
            />

            {/* Inner ring */}
            <div
              className={`absolute inset-3 rounded-full border border-brand/15 ${showContent
                  ? 'animate-[successRing_1.4s_ease-out_0.2s_both]'
                  : 'opacity-0'
                }`}
            />

            {/* Glow */}
            <div
              className={`absolute inset-5 rounded-full bg-brand/10 blur-md ${showContent
                  ? 'animate-[successGlow_1s_ease-out_both]'
                  : 'opacity-0'
                }`}
            />

            {/* Main circle */}
            <div
              className={`absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_15px_45px_rgba(91,61,240,0.16)] ${showContent
                  ? 'animate-[successPop_0.65s_cubic-bezier(0.34,1.56,0.64,1)_both]'
                  : 'opacity-0'
                }`}
            >
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-brand">

                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  className="overflow-visible"
                >
                  <path
                    d="M8 17.5L14.2 23.5L26 10.5"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="32"
                    strokeDashoffset="32"
                    className={
                      showContent
                        ? 'animate-[drawTick_0.65s_ease-out_0.45s_forwards]'
                        : ''
                    }
                  />
                </svg>

              </div>
            </div>

            {/* Particles */}
            <span
              className={`absolute left-2 top-9 h-1.5 w-1.5 rounded-full bg-brand ${showContent
                  ? 'animate-[particleOne_1.5s_ease-out_0.4s_both]'
                  : 'opacity-0'
                }`}
            />

            <span
              className={`absolute right-3 top-5 h-2 w-2 rounded-full bg-gold ${showContent
                  ? 'animate-[particleTwo_1.6s_ease-out_0.5s_both]'
                  : 'opacity-0'
                }`}
            />

            <span
              className={`absolute bottom-5 right-1 h-1.5 w-1.5 rounded-full bg-brand ${showContent
                  ? 'animate-[particleThree_1.4s_ease-out_0.6s_both]'
                  : 'opacity-0'
                }`}
            />

            <span
              className={`absolute bottom-2 left-7 h-2 w-2 rounded-full bg-whatsapp ${showContent
                  ? 'animate-[particleFour_1.5s_ease-out_0.55s_both]'
                  : 'opacity-0'
                }`}
            />

          </div>

          {/* Status */}
          <div
            className={`mt-5 transition-all duration-700 ${showContent
                ? 'translate-y-0 opacity-100'
                : 'translate-y-3 opacity-0'
              }`}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-whatsapp/20 bg-whatsapp-soft px-4 py-2 text-[11px] font-extrabold tracking-[0.15em] text-whatsapp-deep">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-whatsapp" />
              </span>

              PAYMENT CONFIRMED

            </span>
          </div>

          {/* Heading */}
          <div
            className={`mt-5 transition-all delay-150 duration-700 ${showContent
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
              }`}
          >
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[42px]">
              Payment successful!
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink-muted sm:text-base">
              Thank you for choosing Apple Hub. Your payment has been
              securely verified and your order is now confirmed.
            </p>
          </div>

        </section>

        {/* =========================================================
            EMAIL CONFIRMATION / GSTIN NOTICE
        ========================================================= */}

        <div
          className={`mt-10 transition-all delay-300 duration-700 ${showContent
              ? 'translate-y-0 opacity-100'
              : 'translate-y-5 opacity-0'
            }`}
        >
          <div className="relative overflow-hidden rounded-2xl border border-brand/15 bg-gradient-to-r from-brand-softer via-white to-brand-softer p-5 shadow-[0_12px_35px_rgba(91,61,240,0.06)] sm:p-6">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 h-40 w-40 rounded-full bg-brand/[0.05] blur-2xl"
            />

            <div className="relative flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand shadow-sm">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="m4 7 8 6 8-6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-sm font-bold text-ink">
                    Confirmation email sent
                  </p>

                  <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-brand">
                    Important
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-ink-muted sm:text-sm">
                  A confirmation email with your order and payment details has
                  been sent to{' '}
                  <span className="font-bold text-ink">
                    {order.customer_email || 'the email address provided at checkout'}
                  </span>
                  .
                </p>

                {taxType === 'included' && (
                  <div className="mt-3 rounded-xl border border-brand/10 bg-white/80 px-4 py-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-faint">
                      GSTIN
                    </p>
                    <p className="mt-1 font-mono text-sm font-bold tracking-wide text-ink">
                      32AAOCP4547L1ZZ
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-ink-muted">
                      GST applicable to this service. The GST amount is already
                      included in the total amount shown below.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            ORDER RECEIPT
        ========================================================= */}

        <section
          className={`mt-6 overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_25px_80px_rgba(21,22,43,0.08)] transition-all delay-[450ms] duration-700 ${showContent
              ? 'translate-y-0 opacity-100'
              : 'translate-y-6 opacity-0'
            }`}
        >

          {/* Receipt header */}
          <div className="relative border-b border-border bg-canvas-soft px-6 py-6 sm:px-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink-faint">
                  Order Confirmation
                </p>

                <div className="mt-1.5 flex items-center gap-2">
                  <p className="font-display text-xl font-extrabold tracking-tight text-ink">
                    #{order.order_number}
                  </p>

                  <span className="h-1 w-1 rounded-full bg-border" />

                  <span className="text-xs text-ink-muted">
                    Apple Hub
                  </span>
                </div>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-full border border-whatsapp/20 bg-whatsapp-soft px-3.5 py-2">

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12.5l4.2 4.2L19 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-whatsapp-deep"
                  />
                </svg>

                <span className="text-[11px] font-extrabold uppercase tracking-wide text-whatsapp-deep">
                  Paid
                </span>

              </div>

            </div>
          </div>

          {/* Receipt body */}
          <div className="p-6 sm:p-8">

            {/* Service */}
            <div className="rounded-2xl border border-border bg-canvas-soft p-5 sm:p-6">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-ink-faint">
                    Service Purchased
                  </p>

                  <h2 className="mt-2 font-display text-lg font-bold text-ink sm:text-xl">
                    {order.service_title}
                  </h2>

                  <p className="mt-1.5 text-xs text-ink-muted">
                    Apple Hub by Pathans Apple Info Tech
                  </p>
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-ink-faint">
                    Total Paid
                  </p>
                  <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-brand">
                    {formatPrice(totalAmount)}
                  </p>
                </div>

              </div>
            </div>

            {/* Customer Details */}
            <div className="mt-6">

              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.17em] text-ink-faint">
                Customer Details
              </p>

              <div className="grid gap-3 sm:grid-cols-2">

                <DetailCard
                  icon={<UserIcon />}
                  label="Customer"
                  value={order.customer_name}
                />

                <DetailCard
                  icon={<PhoneIcon />}
                  label="Phone"
                  value={order.customer_phone || '—'}
                />

                <DetailCard
                  icon={<EmailIcon />}
                  label="Email"
                  value={order.customer_email || '—'}
                  breakValue
                />

                <DetailCard
                  icon={<LocationIcon />}
                  label="Address"
                  value={order.customer_address || 'Not provided'}
                  breakValue
                />

              </div>
            </div>

            {/* =====================================================
                PAYMENT DETAILS
            ===================================================== */}

            <div className="mt-7">

              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-ink-faint">
                  Payment Details
                </p>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp-soft px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-whatsapp-deep">
                  <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" />
                  Verified
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                <DetailCard
                  icon={<PaymentIcon />}
                  label="Payment Status"
                  value={isPaid ? 'Paid & Verified' : 'Payment Pending'}
                  success={isPaid}
                />

                <DetailCard
                  icon={<CreditCardIcon />}
                  label="Payment Method"
                  value={paymentMethod}
                />

                <DetailCard
                  icon={<ReceiptIcon />}
                  label="Payment ID"
                  value={order.razorpay_payment_id || '—'}
                  breakValue
                  mono
                />

                <DetailCard
                  icon={<ReceiptIcon />}
                  label="Razorpay Order ID"
                  value={order.razorpay_order_id || '—'}
                  breakValue
                  mono
                />

              </div>

              {/* TAX & AMOUNT BREAKDOWN */}
              <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-canvas-soft">
                <div className="border-b border-border px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-ink-faint">
                        Amount Breakdown
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        Final amount paid through Razorpay
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wide ${taxType === 'included'
                          ? 'bg-brand-soft text-brand'
                          : 'border border-border bg-white text-ink-muted'
                        }`}
                    >
                      {taxLabel}
                    </span>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="space-y-3">
                    <AmountRow
                      label={
                        taxType === 'included'
                          ? 'Taxable Amount'
                          : 'Service Amount'
                      }
                      value={formatPrice(taxableAmount)}
                    />

                    {taxType === 'included' ? (
                      <AmountRow
                        label={`GST${taxRate !== null ? ` (${taxRate}%)` : ''}`}
                        value={formatPrice(taxAmount)}
                      />
                    ) : (
                      <AmountRow
                        label="GST"
                        value="Not applicable"
                        muted
                      />
                    )}

                    <div className="border-t border-dashed border-border pt-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-extrabold text-ink">
                            Total Amount
                          </p>
                          <p className="mt-0.5 text-[10px] text-ink-faint">
                            Amount charged to your payment method
                          </p>
                        </div>

                        <p className="font-display text-xl font-extrabold tracking-tight text-brand">
                          {formatPrice(totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`mt-4 rounded-xl px-4 py-3 ${taxType === 'included'
                        ? 'bg-brand-soft'
                        : 'border border-border bg-white'
                      }`}
                  >
                    {taxType === 'included' ? (
                      <p className="text-[11px] leading-5 text-brand-deep">
                        <span className="font-extrabold">
                          GST is included in the price.
                        </span>{' '}
                        The displayed total already includes
                        {taxRate !== null ? ` ${taxRate}% GST` : ' GST'}.
                        No additional GST has been charged at checkout.
                      </p>
                    ) : (
                      <p className="text-[11px] leading-5 text-ink-muted">
                        <span className="font-extrabold text-ink">
                          GST is not applicable to this service.
                        </span>{' '}
                        The total shown above is the complete amount paid.
                        No additional GST has been charged at checkout.
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Total */}
            <div className="my-7 border-t border-dashed border-border" />

            <div className="flex items-end justify-between gap-4">

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-ink-faint">
                  Total Amount Paid
                </p>

                <p className="mt-1 text-xs text-whatsapp-deep">
                  Payment successfully verified
                </p>
              </div>

              <div className="text-right">
                <p className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                  {formatPrice(totalAmount)}
                </p>
                <p className="mt-1 text-[10px] font-semibold text-ink-faint">
                  {taxType === 'included'
                    ? 'Including applicable GST'
                    : 'GST not applicable'}
                </p>
              </div>

            </div>

          </div>

          {/* Receipt footer */}
          <div className="border-t border-border bg-canvas-soft px-6 py-4 sm:px-8">

            <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">

              <p className="text-[10px] font-semibold text-ink-faint">
                Keep your order number and payment ID for future reference.
              </p>

              <p className="font-display text-[10px] font-bold tracking-wide text-brand">
                #{order.order_number}
              </p>

            </div>

          </div>

        </section>

        {/* =========================================================
            WHAT HAPPENS NEXT
        ========================================================= */}

        <section
          className={`mt-5 rounded-2xl border border-border bg-surface p-6 transition-all delay-[600ms] duration-700 sm:p-7 ${showContent
              ? 'translate-y-0 opacity-100'
              : 'translate-y-5 opacity-0'
            }`}
        >

          <div className="flex gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />

                <path
                  d="M12 7v5l3 2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <h3 className="font-display text-sm font-bold text-ink">
                What happens next?
              </h3>

              <p className="mt-1.5 text-xs leading-6 text-ink-muted sm:text-sm">
                Your payment has been verified successfully and your
                order is confirmed. Our team will review your order and
                contact you using the details you provided.
              </p>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">

                <NextStep
                  number="01"
                  text="Payment Verified"
                  active
                />

                <NextStep
                  number="02"
                  text="Order Assigned"
                />
                
                <NextStep
                  number="03"
                  text="We’ll Take Care From Here"
                />

              </div>
            </div>

          </div>

        </section>

        {/* =========================================================
            ACTIONS
        ========================================================= */}

        <div
          className={`mt-7 flex flex-col gap-3 transition-all delay-[700ms] duration-700 sm:flex-row sm:justify-center ${showContent
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
            }`}
        >

          <Link
            to="/services"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(91,61,240,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-[0_15px_35px_rgba(91,61,240,0.24)]"
          >
            Browse More Services

            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-border bg-white px-7 py-3.5 text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:bg-brand-softer hover:text-brand"
          >
            Back to Home
          </Link>

        </div>

        {/* =========================================================
            TRUST FOOTER
        ========================================================= */}

        <div
          className={`mt-9 text-center transition-all delay-[800ms] duration-700 ${showContent ? 'opacity-100' : 'opacity-0'
            }`}
        >

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-faint">

            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" />
              Secure Payment
            </span>

            <span className="text-border">•</span>

            <span>Razorpay Verified</span>

            <span className="text-border">•</span>

            <span>Order Confirmed</span>

            <span className="text-border">•</span>

            <span>Apple Hub</span>

          </div>

          <p className="mt-3 text-[10px] text-ink-faint">
            Thank you for choosing Apple Hub by Pathans Apple Info Tech.
          </p>

        </div>

      </div>

      {/* =========================================================
          ANIMATIONS
      ========================================================= */}

      <style>{`
        @keyframes drawTick {
          from {
            stroke-dashoffset: 32;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes successPop {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }

          65% {
            transform: translate(-50%, -50%) scale(1.12);
            opacity: 1;
          }

          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes successGlow {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes successRing {
          0% {
            transform: scale(0.55);
            opacity: 0;
          }

          35% {
            opacity: 1;
          }

          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        @keyframes particleOne {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          100% {
            transform: translate(-12px, -18px) scale(1);
            opacity: 0;
          }
        }

        @keyframes particleTwo {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          100% {
            transform: translate(15px, -16px) scale(1);
            opacity: 0;
          }
        }

        @keyframes particleThree {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          100% {
            transform: translate(16px, 14px) scale(1);
            opacity: 0;
          }
        }

        @keyframes particleFour {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          100% {
            transform: translate(-14px, 15px) scale(1);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

    </main>
  );
}


/* ===============================================================
   DETAIL CARD
=============================================================== */

function DetailCard({
  icon,
  label,
  value,
  success = false,
  breakValue = false,
  mono = false,
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 transition-all duration-300 hover:border-brand/15 hover:shadow-[0_8px_25px_rgba(21,22,43,0.04)]">

      <div className="flex items-center gap-3">

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${success
              ? 'bg-whatsapp-soft text-whatsapp-deep'
              : 'bg-brand-soft text-brand'
            }`}
        >
          {icon}
        </div>

        <span className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-ink-faint">
          {label}
        </span>

      </div>

      <p
        className={`mt-3 text-sm font-bold ${success ? 'text-whatsapp-deep' : 'text-ink'
          } ${breakValue ? 'break-all' : ''} ${mono ? 'font-mono text-[11px] leading-5' : ''
          }`}
      >
        {value}
      </p>

    </div>
  );
}


/* ===============================================================
   AMOUNT ROW
=============================================================== */

function AmountRow({ label, value, muted = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs font-semibold text-ink-muted">
        {label}
      </span>

      <span
        className={`text-sm font-bold ${muted ? 'text-ink-faint' : 'text-ink'
          }`}
      >
        {value}
      </span>
    </div>
  );
}


/* ===============================================================
   NEXT STEP
=============================================================== */

function NextStep({ number, text, active = false }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${active
          ? 'border-whatsapp/20 bg-whatsapp-soft'
          : 'border-border bg-canvas-soft'
        }`}
    >
      <span
        className={`font-display text-[9px] font-extrabold ${active ? 'text-whatsapp-deep' : 'text-brand'
          }`}
      >
        {number}
      </span>

      <span
        className={`text-[10px] font-bold ${active ? 'text-whatsapp-deep' : 'text-ink-muted'
          }`}
      >
        {text}
      </span>
    </div>
  );
}


/* ===============================================================
   PAYMENT METHOD
=============================================================== */

function formatPaymentMethod(method) {
  const value = String(method).toLowerCase();

  const methods = {
    card: 'Card',
    upi: 'UPI',
    netbanking: 'Net Banking',
    wallet: 'Wallet',
    emi: 'EMI',
    bank_transfer: 'Bank Transfer',
  };

  return methods[value] || method;
}


/* ===============================================================
   ICONS
=============================================================== */

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="7"
        r="4"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4 21a8 8 0 0 1 16 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.5 3.5h3l1.5 4-2 1.5a14 14 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2C11 19.5 4.5 13 4.5 5.5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3 10h18"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M7 15h3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3 9h18"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M7 14h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3.5h12v17l-3-2-3 2-3-2-3 2v-17Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 8h6M9 12h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}