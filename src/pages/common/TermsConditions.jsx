import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
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
            Terms & Conditions
          </h1>

          <p className="mt-4 text-sm text-ink-muted">
            Last Updated: September 16, 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="space-y-10 text-[15px] leading-7 text-ink-muted">

          <PolicySection title="1. About Our Services">
            <p>
              Apple Hub by Pathans Apple Info Tech (“Apple Hub”, “we”, “us”,
              or “our”) provides digital and business-related services through
              this website.
            </p>

            <p>
              Our services may include Facebook and Instagram advertising,
              social media management, AI-generated videos, AI wishes videos,
              WhatsApp-related services, and other digital marketing and
              creative services.
            </p>

            <p>
              The exact scope, duration, features, deliverables, and pricing
              applicable to each service are displayed on the respective
              service page.
            </p>
          </PolicySection>

          <PolicySection title="2. Acceptance of Terms">
            <p>
              By accessing this website or purchasing any service through the
              website, you confirm that you have read, understood, and agreed
              to these Terms & Conditions.
            </p>
          </PolicySection>

          <PolicySection title="3. Eligibility">
            <p>By using our website or purchasing a service, you confirm that:</p>

            <PolicyList
              items={[
                'You are legally capable of entering into an agreement.',
                'The information provided by you is accurate and complete.',
                'You are authorized to use the payment method used for the transaction.',
                'You will use our services only for lawful purposes.',
              ]}
            />
          </PolicySection>

          <PolicySection title="4. Service Information">
            <p>
              We make reasonable efforts to ensure that service descriptions,
              prices, features, durations, and other information displayed on
              the website are accurate.
            </p>

            <p>
              Service availability, pricing, features, delivery timelines,
              and specifications may occasionally be changed or updated
              without prior notice.
            </p>
          </PolicySection>

          <PolicySection title="5. Orders and Purchases">
            <p>When you purchase a service:</p>

            <PolicyList
              items={[
                'You provide the required customer information.',
                'You proceed to the online payment gateway.',
                'Payment is processed through our authorized payment provider.',
                'The payment is verified by our system.',
                'Once payment is successfully verified, an order is created and confirmed.',
                'You receive the relevant order information and confirmation.',
              ]}
            />

            <p>
              An order is considered confirmed only after successful payment
              verification.
            </p>
          </PolicySection>

          <PolicySection title="6. Pricing and Payment">
            <p>
              All prices displayed on the website are in Indian Rupees (INR)
              unless otherwise stated.
            </p>

            <p>
              Online payments are processed through Razorpay. Payment methods
              available at checkout may include cards, UPI, net banking,
              wallets, or other methods supported by Razorpay.
            </p>

            <p>
              We do not store complete card numbers, CVV numbers, UPI PINs,
              or other payment credentials on our servers.
            </p>
          </PolicySection>

          <PolicySection title="7. Customer Information">
            <p>You are responsible for providing accurate:</p>

            <PolicyList
              items={[
                'Name',
                'Email address',
                'Phone number',
                'Address',
                'Service-related information',
                'Content, names, messages, images, or other information required to provide the service',
              ]}
            />

            <p>
              Incorrect or incomplete information may affect service delivery.
            </p>
          </PolicySection>

          <PolicySection title="8. Service Delivery">
            <p>
              Digital services will generally be delivered or initiated after
              successful payment verification and order confirmation.
            </p>

            <p>
              Delivery or completion time may vary depending on the service,
              customer requirements, required information, revisions,
              third-party platforms, and technical circumstances.
            </p>
          </PolicySection>

          <PolicySection title="9. Customer Responsibilities">
            <p>
              Customers must ensure that all information, content, images,
              logos, videos, text, claims, and other materials supplied to
              Apple Hub are legally permitted for use.
            </p>

            <p>Customers must not provide content that:</p>

            <PolicyList
              items={[
                'Violates applicable law.',
                'Infringes intellectual property rights.',
                'Contains fraudulent or misleading information.',
                'Promotes illegal activities.',
                'Violates third-party platform policies.',
                'Contains unauthorized copyrighted material.',
              ]}
            />
          </PolicySection>

          <PolicySection title="10. Third-Party Platforms">
            <p>
              Some services may depend on third-party platforms such as
              Meta, Facebook, Instagram, WhatsApp, Google, or other
              advertising and technology platforms.
            </p>

            <p>
              We do not guarantee uninterrupted availability, approval,
              reach, engagement, leads, sales, followers, views, or other
              results from third-party platforms.
            </p>
          </PolicySection>

          <PolicySection title="11. Advertising Services">
            <p>
              For advertising-related services, payment for our service does
              not necessarily include advertising or media spend unless the
              selected package explicitly states otherwise.
            </p>

            <p>
              Advertising budgets, platform charges, creative charges, or
              other third-party expenses may be charged separately where
              applicable.
            </p>
          </PolicySection>

          <PolicySection title="12. Revisions">
            <p>
              Where a service includes revisions, the number of included
              revisions will be based on the service description or agreed
              service scope.
            </p>

            <p>
              Additional revisions or changes beyond the included limit may
              incur additional charges.
            </p>
          </PolicySection>

          <PolicySection title="13. Intellectual Property">
            <p>
              Apple Hub retains ownership of its website, branding, templates,
              processes, systems, and proprietary materials unless otherwise
              agreed in writing.
            </p>

            <p>
              Customer-provided materials remain the property of the customer
              or their respective owners.
            </p>
          </PolicySection>

          <PolicySection title="14. Prohibited Use">
            <p>You must not use our website or services to:</p>

            <PolicyList
              items={[
                'Conduct fraudulent activities.',
                'Violate applicable laws.',
                'Infringe intellectual property rights.',
                'Misuse our payment system.',
                'Attempt unauthorized access to our systems.',
                'Introduce malware or malicious code.',
                'Interfere with website functionality.',
                'Provide false or misleading information.',
              ]}
            />
          </PolicySection>

          <PolicySection title="15. Order Assignment">
            <p>
              Orders may be automatically assigned to an available member of
              our service team.
            </p>

            <p>
              Assignment is an internal operational process and does not
              create a contractual right to select or change the assigned
              team member.
            </p>
          </PolicySection>

          <PolicySection title="16. Cancellation and Refunds">
            <p>
              Cancellation and refund requests are governed by our separate
              Cancellation and Refund Policy, which forms part of these Terms
              & Conditions.
            </p>

            <p>
              Please review the Cancellation and Refund Policy before
              purchasing a service.
            </p>
          </PolicySection>

          <PolicySection title="17. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, Apple Hub
              shall not be responsible for indirect, incidental, special, or
              consequential losses arising from third-party platform outages,
              changes to third-party policies, customer-provided incorrect
              information, or circumstances outside our reasonable control.
            </p>
          </PolicySection>

          <PolicySection title="18. Force Majeure">
            <p>
              We shall not be responsible for delays caused by circumstances
              beyond our reasonable control, including technical failures,
              internet outages, natural disasters, government restrictions,
              third-party service interruptions, or other unforeseen
              circumstances.
            </p>
          </PolicySection>

          <PolicySection title="19. Privacy">
            <p>
              Your use of our website is also governed by our Privacy Policy,
              which explains how we collect, use, store, and protect personal
              information.
            </p>
          </PolicySection>

          <PolicySection title="20. Changes to These Terms">
            <p>
              We may update these Terms & Conditions from time to time.
              The updated version will be published on this page with a
              revised “Last Updated” date.
            </p>
          </PolicySection>

          <PolicySection title="21. Governing Law and Jurisdiction">
            <p>
              These Terms shall be governed by the laws applicable in India.
            </p>

            <p>
              Subject to applicable consumer protection and other mandatory
              legal rights, disputes relating to these Terms or our services
              shall be subject to the jurisdiction of the competent courts
              having jurisdiction over [City, Kerala, India].
            </p>
          </PolicySection>

          <PolicySection title="22. Contact Us">
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
      <p>Phone: +91 79077 04987</p>
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
