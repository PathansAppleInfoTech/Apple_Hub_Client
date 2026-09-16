import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
export default function CancellationRefundPolicy() {
    return (
        <main className="min-h-screen bg-canvas text-ink">
            <section className="border-b border-border bg-surface">
                <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
                    <Link
                        to="/"
                        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition hover:text-brand"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>

                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
                        Legal
                    </p>

                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                        Cancellation & Refund Policy
                    </h1>

                    <p className="mt-4 text-sm text-ink-muted">
                        Last Updated: September 16, 2026
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
                <div className="space-y-10 text-[15px] leading-7 text-ink-muted">

                    <PolicySection title="1. Nature of Our Services">
                        <p>
                            Apple Hub primarily provides digital, creative, marketing,
                            advertising, social media, AI video, and related services.
                        </p>

                        <p>
                            Because many of our services involve customized work, resources
                            may be allocated immediately after an order is confirmed.
                        </p>

                        <p>
                            Cancellation and refund eligibility may therefore depend on
                            whether work on the purchased service has started.
                        </p>
                    </PolicySection>

                    <PolicySection title="2. Order Confirmation">
                        <p>
                            An order is considered confirmed only after the payment is
                            successfully completed, verified by our system, and an order
                            confirmation is generated.
                        </p>
                    </PolicySection>

                    <PolicySection title="3. Cancellation Before Work Begins">
                        <p>
                            A customer may request cancellation before work on the
                            purchased service has started.
                        </p>

                        <p>
                            Cancellation requests should be submitted as soon as possible.
                        </p>

                        <div className="rounded-2xl border border-border bg-surface p-6">
                            <p>
                                <strong className="text-ink">Email:</strong>{' '}
                                info@pathansapple.com
                            </p>

                            <p>
                                <strong className="text-ink">Phone / WhatsApp:</strong>{' '}
                                +91 79077 04987
                            </p>
                        </div>

                        <p>The customer should provide:</p>

                        <PolicyList
                            items={[
                                'Order number',
                                'Name',
                                'Registered email address',
                                'Phone number',
                                'Reason for cancellation',
                            ]}
                        />

                        <p>
                            If the cancellation is accepted before service work begins,
                            the eligible amount may be refunded to the original payment
                            method.
                        </p>
                    </PolicySection>

                    <PolicySection title="4. Cancellation After Work Has Started">
                        <p>
                            Once work has started, cancellation may not qualify for a full
                            refund.
                        </p>

                        <p>
                            This is because resources, time, creative work, advertising
                            setup, campaign management, or other service activities may
                            already have been performed.
                        </p>

                        <p>
                            Where appropriate, Apple Hub may review the order and determine
                            whether a partial refund or alternative resolution is
                            appropriate.
                        </p>
                    </PolicySection>

                    <PolicySection title="5. Completed or Delivered Services">
                        <p>
                            Once a digital service has been substantially completed or
                            delivered according to the purchased service scope, the payment
                            will generally be non-refundable.
                        </p>

                        <p>Examples may include:</p>

                        <PolicyList
                            items={[
                                'Completed AI videos.',
                                'Delivered creative materials.',
                                'Completed social media work.',
                                'Advertising campaigns that have already been initiated.',
                                'Services where agreed deliverables have already been provided.',
                            ]}
                        />
                    </PolicySection>

                    <PolicySection title="6. Customer-Provided Information">
                        <p>
                            Customers are responsible for providing accurate information,
                            content, images, names, messages, contact details, and other
                            materials required for service delivery.
                        </p>

                        <p>
                            Refunds may not be available where service delivery is delayed
                            or prevented because:
                        </p>

                        <PolicyList
                            items={[
                                'Required information was not provided.',
                                'Incorrect information was provided.',
                                'The customer failed to respond to required communications.',
                                'Customer-provided content was unusable.',
                                'The customer changed requirements after work had started.',
                            ]}
                        />
                    </PolicySection>

                    <PolicySection title="7. Advertising and Campaign Services">
                        <p>
                            For advertising-related services, cancellation eligibility may
                            depend on whether campaign setup, creative preparation,
                            targeting, campaign management, or advertising activity has
                            already begun.
                        </p>

                        <p>
                            Once advertising activity or campaign management has started,
                            the service fee may become non-refundable to the extent that the
                            service has already been performed.
                        </p>

                        <p>
                            Advertising or media spend paid to third-party platforms may
                            be subject to the respective platform's policies.
                        </p>
                    </PolicySection>

                    <PolicySection title="8. Freebies and Promotional Deliverables">
                        <p>
                            Some packages may include complimentary deliverables, such as a
                            free poster, revision, or other promotional item.
                        </p>

                        <p>
                            If a customer cancels after a complimentary deliverable has
                            already been created or used as part of the service process,
                            the refund amount may take into account the work already
                            performed.
                        </p>
                    </PolicySection>

                    <PolicySection title="9. Failed or Unsuccessful Payments">
                        <p>
                            If a payment fails and no successful payment is received by
                            Apple Hub, no order will be treated as successfully paid.
                        </p>

                        <p>
                            If money has been debited from your account but the payment has
                            not been successfully completed, the transaction may be handled
                            through the payment processor and banking system.
                        </p>
                    </PolicySection>

                    <PolicySection title="10. Duplicate Payments">
                        <p>
                            If you accidentally make multiple successful payments for the
                            same service or order, please contact us immediately.
                        </p>

                        <p>
                            After verification, eligible duplicate payments may be refunded
                            to the applicable original payment method.
                        </p>
                    </PolicySection>

                    <PolicySection title="11. Unauthorized Transactions">
                        <p>
                            If you believe a payment was made without your authorization,
                            contact us immediately with the relevant transaction details.
                        </p>

                        <p>
                            You should also contact your bank or payment provider where
                            appropriate.
                        </p>
                    </PolicySection>

                    <PolicySection title="12. Refund Approval">
                        <p>
                            All refund requests are subject to verification.
                        </p>

                        <p>We may consider:</p>

                        <PolicyList
                            items={[
                                'Whether service work has started.',
                                'The amount of work already completed.',
                                'Whether deliverables have been provided.',
                                'Whether advertising activity has started.',
                                'Whether the cancellation request is valid.',
                                'Whether the issue was caused by Apple Hub or the customer.',
                                'Applicable legal requirements.',
                            ]}
                        />
                    </PolicySection>

                    <PolicySection title="13. Refund Method">
                        <p>
                            Where a refund is approved, it will generally be initiated to
                            the original payment method used for the transaction.
                        </p>

                        <p>
                            We do not normally provide cash refunds for online
                            transactions.
                        </p>
                    </PolicySection>

                    <PolicySection title="14. Refund Processing Time">
                        <p>
                            Once a refund has been approved and initiated, the amount may
                            take approximately <strong className="text-ink">5–7 working days</strong>{' '}
                            to reflect in the customer's account, depending on the payment
                            method, bank, card issuer, or payment provider.
                        </p>

                        <p>
                            The actual crediting time may vary and is outside our direct
                            control.
                        </p>
                    </PolicySection>

                    <PolicySection title="15. Service Issues">
                        <p>
                            If you believe that a purchased service has not been delivered
                            according to the agreed service scope, contact us as soon as
                            possible.
                        </p>

                        <p>Please provide:</p>

                        <PolicyList
                            items={[
                                'Order number',
                                'Service name',
                                'Description of the issue',
                                'Relevant supporting information',
                                'Screenshots or other evidence where applicable',
                            ]}
                        />

                        <p>
                            We will review the issue and, where appropriate, attempt to
                            correct the service before considering other remedies.
                        </p>
                    </PolicySection>

                    <PolicySection title="16. Non-Refundable Situations">
                        <p>A refund may generally not be available where:</p>

                        <PolicyList
                            items={[
                                'The service has already been substantially completed.',
                                'The agreed digital deliverables have already been delivered.',
                                'The customer has used or approved the deliverables.',
                                'The customer provided incorrect or incomplete information.',
                                'The customer failed to provide required information.',
                                'Work was delayed because of the customer’s lack of response.',
                                'The customer changed requirements after work started.',
                                'A third-party platform rejected content or advertising for reasons outside our control.',
                                'The service was used or substantially consumed.',
                                'The cancellation request is made after substantial work has been completed.',
                                'Fraudulent or abusive activity is identified.',
                            ]}
                        />

                        <p>
                            This section does not limit any rights that cannot legally be
                            excluded under applicable law.
                        </p>
                    </PolicySection>

                    <PolicySection title="17. Service Corrections">
                        <p>
                            Where a service has a genuine defect or does not substantially
                            match the agreed service scope, Apple Hub may, where reasonably
                            possible:
                        </p>

                        <PolicyList
                            items={[
                                'Correct the issue.',
                                'Provide a revision.',
                                'Reperform the affected portion.',
                                'Provide another reasonable resolution.',
                            ]}
                        />
                    </PolicySection>

                    <PolicySection title="18. How to Request a Cancellation or Refund">
                        <div className="rounded-2xl border border-border bg-surface p-6">
                            <p>
                                <strong className="text-ink">Email:</strong>{' '}
                                info@pathansapple.com
                            </p>

                            <p>
                                <strong className="text-ink">Phone / WhatsApp:</strong>{' '}
                                +91 79077 04987
                            </p>
                        </div>

                        <p>Please include:</p>

                        <PolicyList
                            items={[
                                'Order Number',
                                'Customer Name',
                                'Registered Email',
                                'Phone Number',
                                'Service Purchased',
                                'Reason for Request',
                            ]}
                        />
                    </PolicySection>

                    <PolicySection title="19. Refund Fraud and Abuse">
                        <p>
                            We reserve the right to investigate refund requests where there
                            is suspected fraud, misuse, duplicate claims, payment
                            manipulation, false information, or abuse of the refund
                            process.
                        </p>
                    </PolicySection>

                    <PolicySection title="20. Policy Changes">
                        <p>
                            We may update this Cancellation and Refund Policy from time to
                            time.
                        </p>

                        <p>
                            The latest version will be published on this page with the
                            applicable “Last Updated” date.
                        </p>
                    </PolicySection>

                    <PolicySection title="21. Contact Us">
                        <ContactDetails />
                    </PolicySection>

                </div>
            </section>
        </main>
    );
}

function PolicySection({ title, children }) {
    return (
        <section>
            <h2 className="mb-4 text-xl font-extrabold tracking-tight text-ink">
                {title}
            </h2>

            <div className="space-y-4">
                {children}
            </div>
        </section>
    );
}

function PolicyList({ items }) {
    return (
        <ul className="list-disc space-y-2 pl-6">
            {items.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    );
}

function ContactDetails() {
    return (
        <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="font-bold text-ink">
                Pathans Apple Info Tech Pvt. Ltd.
            </p>

            <p>Apple Hub</p>
            <p>Email: info@pathansapple.com</p>
            <p>Phone / WhatsApp: +91 79077 04987</p>
            <p>Website: https://ecom.pathansapple.com/</p>
            <p>Address: [Registered Address]</p>

            <p className="mt-4">
                <span className="font-semibold text-ink">
                    Grievance Contact:
                </span>{' '}
                info@pathansapple.com
            </p>
        </div>
    );
}
