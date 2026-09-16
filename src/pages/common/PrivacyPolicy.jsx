import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-ink-muted">
            Last Updated: September 16, 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="space-y-10 text-[15px] leading-7 text-ink-muted">

          <PolicySection title="1. Introduction">
            <p>
              Apple Hub by Pathans Apple Info Tech (“Apple Hub”, “we”, “us”,
              or “our”) respects your privacy and is committed to protecting
              the personal information you provide while using our website.
            </p>

            <p>
              This Privacy Policy explains what information we collect, why
              we collect it, how we use it, and how we protect it when you use
              our website.
            </p>
          </PolicySection>

          <PolicySection title="2. Information We Collect">
            <p>Depending on how you use our website, we may collect:</p>

            <h3 className="font-bold text-ink">
              Personal Information
            </h3>

            <PolicyList
              items={[
                'Full name',
                'Email address',
                'Phone number',
                'Address',
                'Service selected',
                'Information included in enquiry messages',
                'Information necessary to provide purchased services',
              ]}
            />

            <h3 className="font-bold text-ink">
              Transaction Information
            </h3>

            <PolicyList
              items={[
                'Order number',
                'Service purchased',
                'Amount paid',
                'Payment status',
                'Payment method',
                'Razorpay order ID',
                'Razorpay payment ID',
                'Transaction date and time',
              ]}
            />

            <p>
              We do not intentionally store complete card numbers, CVV
              numbers, UPI PINs, passwords, or other payment credentials on
              our servers.
            </p>
          </PolicySection>

          <PolicySection title="3. Information You Provide Voluntarily">
            <p>You may voluntarily provide information when:</p>

            <PolicyList
              items={[
                'Submitting a contact or enquiry form.',
                'Purchasing a service.',
                'Requesting support.',
                'Communicating with us through WhatsApp, email, or telephone.',
                'Providing content required to deliver a service.',
              ]}
            />
          </PolicySection>

          <PolicySection title="4. How We Use Your Information">
            <p>We may use collected information to:</p>

            <PolicyList
              items={[
                'Process service purchases.',
                'Verify payments.',
                'Create and manage orders.',
                'Deliver purchased services.',
                'Contact you regarding your order.',
                'Respond to enquiries.',
                'Provide customer support.',
                'Send order confirmations.',
                'Send service-related communications.',
                'Maintain business and transaction records.',
                'Prevent fraud and unauthorized transactions.',
                'Improve our website and services.',
                'Maintain website security.',
                'Comply with applicable legal requirements.',
              ]}
            />
          </PolicySection>

          <PolicySection title="5. Communications">
            <p>
              We may contact you using the information you provide for
              legitimate service-related purposes, including order
              confirmations, payment confirmations, service updates,
              delivery-related communication, and customer support.
            </p>

            <p>
              Communications may be sent through email, telephone, WhatsApp,
              or other available communication channels.
            </p>
          </PolicySection>

          <PolicySection title="6. WhatsApp Communication">
            <p>
              If you choose to contact us or submit an enquiry through a
              WhatsApp-enabled feature, the information you provide may be
              transmitted to WhatsApp.
            </p>

            <p>
              WhatsApp's own privacy practices and terms may apply to
              information processed through its platform.
            </p>
          </PolicySection>

          <PolicySection title="7. Payment Processing">
            <p>
              Payments on our website are processed through Razorpay.
            </p>

            <p>
              During payment processing, information required to complete the
              transaction may be processed by Razorpay and relevant payment
              partners.
            </p>

            <p>
              We receive payment-related information necessary to identify and
              reconcile your order, such as payment status and payment
              references.
            </p>
          </PolicySection>

          <PolicySection title="8. Cookies and Technical Information">
            <p>
              Our website may use cookies or similar technologies where
              required for functionality, security, preferences, analytics,
              or improving the website experience.
            </p>

            <p>We may receive technical information such as:</p>

            <PolicyList
              items={[
                'Browser type',
                'Device information',
                'IP address',
                'Operating system',
                'Pages visited',
                'Approximate usage information',
                'Website interaction information',
              ]}
            />
          </PolicySection>

          <PolicySection title="9. Sharing of Information">
            <p>
              We may share information where reasonably necessary with:
            </p>

            <PolicyList
              items={[
                'Payment processors such as Razorpay.',
                'Technology and hosting service providers.',
                'Email service providers.',
                'Communication platforms.',
                'Service providers working on your requested service.',
                'Advertising or social media platforms where required to provide a purchased service.',
                'Government authorities or law enforcement where legally required.',
              ]}
            />

            <p>
              We do not sell your personal information as a business asset or
              for unrelated third-party marketing purposes.
            </p>
          </PolicySection>

          <PolicySection title="10. Data Security">
            <p>
              We take reasonable technical and organizational measures to
              protect personal information against unauthorized access,
              misuse, alteration, disclosure, or destruction.
            </p>

            <p>
              However, no internet-based system can be guaranteed to be
              completely secure.
            </p>
          </PolicySection>

          <PolicySection title="11. Data Retention">
            <p>
              We may retain personal and transaction information for as long
              as reasonably necessary for:
            </p>

            <PolicyList
              items={[
                'Providing services.',
                'Customer support.',
                'Maintaining business records.',
                'Accounting and financial requirements.',
                'Resolving disputes.',
                'Fraud prevention.',
                'Legal and regulatory compliance.',
              ]}
            />
          </PolicySection>

          <PolicySection title="12. Third-Party Services">
            <p>
              Our website may use third-party services for payment processing,
              hosting, communication, analytics, advertising, or other
              functionality.
            </p>

            <p>
              These third parties may process information according to their
              own terms and privacy policies.
            </p>
          </PolicySection>

          <PolicySection title="13. Children's Privacy">
            <p>
              Our website and services are intended for general users and
              businesses. We do not knowingly request personal information
              from children for the purpose of independently providing
              services to them.
            </p>
          </PolicySection>

          <PolicySection title="14. Your Privacy Rights">
            <p>
              Subject to applicable law, you may contact us regarding your
              personal information and request:
            </p>

            <PolicyList
              items={[
                'Information about personal data we hold about you.',
                'Correction of inaccurate information.',
                'Deletion of information where legally permissible.',
                'Withdrawal of consent where applicable.',
                'Assistance regarding privacy-related concerns.',
              ]}
            />
          </PolicySection>

          <PolicySection title="15. Accuracy of Information">
            <p>
              You are responsible for ensuring that the personal information
              you provide is accurate and up to date.
            </p>
          </PolicySection>

          <PolicySection title="16. Changes to This Privacy Policy">
            <p>
              We may update this Privacy Policy periodically to reflect
              changes in our services, technology, legal requirements, or
              business practices.
            </p>
          </PolicySection>

          <PolicySection title="17. Contact and Grievance">
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
