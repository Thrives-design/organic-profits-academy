import { LegalPage } from "./LegalPage";

export default function Privacy() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" lastUpdated="April 28, 2026">
      <p>
        This Privacy Policy describes how <strong>Organic Profits Academy LLC</strong> ("OPA", "we",
        "us", or "our") collects, uses, and shares information when you use our website at{" "}
        <a href="https://organicprofitsacademy.com">organicprofitsacademy.com</a> (the "Service").
        We respect your privacy and are committed to protecting your personal information.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect the following categories of information:</p>

      <h3>Information You Provide</h3>
      <ul>
        <li>
          <strong>Account information:</strong> Your name, email address, and password (stored as a
          one-way hashed value, never in plain text) when you create an account.
        </li>
        <li>
          <strong>Payment information:</strong> When you purchase a membership, your card details
          are submitted directly to our payment processor, Stripe. We never see or store your full
          card number. We receive a payment confirmation, the last 4 digits of your card, and your
          billing name/address from Stripe.
        </li>
        <li>
          <strong>Community content:</strong> Messages, forum posts, and replies you submit to the
          on-site community spaces.
        </li>
        <li>
          <strong>Support correspondence:</strong> Emails you send to us and any information
          contained in them.
        </li>
      </ul>

      <h3>Information We Collect Automatically</h3>
      <ul>
        <li>
          <strong>Log data:</strong> IP address, browser type, operating system, referring URLs,
          pages visited, and timestamps. This is standard web-server data.
        </li>
        <li>
          <strong>Cookies and session tokens:</strong> We set a session cookie or token to keep you
          logged in. We do not currently use third-party advertising cookies.
        </li>
        <li>
          <strong>Watch progress:</strong> Which videos you've started or completed, so we can
          show your progress in your dashboard.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Provide, maintain, and improve the Service</li>
        <li>Process payments and send purchase confirmations</li>
        <li>Authenticate you and keep your account secure</li>
        <li>Respond to support requests and communicate with you</li>
        <li>Send transactional emails (purchase receipts, payment reminders, security alerts)</li>
        <li>Detect, prevent, and address fraud or abuse</li>
        <li>Comply with legal obligations</li>
      </ul>
      <p>
        We do <strong>not</strong> sell or rent your personal information to third parties. We do
        not use your information for behavioral advertising.
      </p>

      <h2>3. Service Providers We Share Data With</h2>
      <p>
        We share information with the following third-party service providers solely to operate the
        Service:
      </p>
      <ul>
        <li>
          <strong>Stripe</strong> — payment processing. Subject to{" "}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
            Stripe's Privacy Policy
          </a>.
        </li>
        <li>
          <strong>Neon</strong> — database hosting (PostgreSQL).
        </li>
        <li>
          <strong>Vercel</strong> — web application hosting.
        </li>
        <li>
          <strong>Google Workspace</strong> — email infrastructure for our support address.
        </li>
        <li>
          <strong>Telegram</strong> — community chat platform (members opt in by clicking the
          invite link). Subject to{" "}
          <a href="https://telegram.org/privacy" target="_blank" rel="noopener noreferrer">
            Telegram's Privacy Policy
          </a>.
        </li>
      </ul>
      <p>
        We may also disclose information when required by law, valid legal process, or to protect
        the rights, property, or safety of OPA, our members, or the public.
      </p>

      <h2>4. Data Retention</h2>
      <p>
        We retain account information for as long as your account is active or as needed to provide
        the Service, comply with legal obligations, resolve disputes, and enforce our agreements.
        Payment records are retained for tax and audit purposes per applicable law (typically 7
        years in the United States).
      </p>
      <p>
        You may request deletion of your account at any time by emailing{" "}
        <a href="mailto:support@organicprofitsacademy.com">support@organicprofitsacademy.com</a>.
        We will delete your personal information within 30 days, except information we are
        required to retain for legal, tax, or accounting purposes.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        Depending on where you live, you may have rights regarding your personal information,
        including:
      </p>
      <ul>
        <li>The right to access the personal information we hold about you</li>
        <li>The right to correct inaccurate information</li>
        <li>The right to request deletion ("right to be forgotten")</li>
        <li>The right to a copy of your information in a portable format</li>
        <li>The right to opt out of marketing emails (transactional emails are required)</li>
        <li>
          The right to lodge a complaint with a data protection authority (for residents of the
          European Economic Area, the United Kingdom, or jurisdictions with similar protections)
        </li>
      </ul>
      <p>
        To exercise any of these rights, email{" "}
        <a href="mailto:support@organicprofitsacademy.com">support@organicprofitsacademy.com</a>.
        We will respond within 30 days.
      </p>

      <h3>California Residents (CCPA / CPRA)</h3>
      <p>
        Under the California Consumer Privacy Act, California residents have additional rights
        including the right to know what personal information is collected, the right to delete
        personal information, and the right to opt out of the "sale" of personal information. We
        do not sell personal information.
      </p>

      <h2>6. Security</h2>
      <p>
        We use industry-standard technical and organizational safeguards to protect your
        information, including HTTPS encryption in transit, encrypted-at-rest database storage,
        bcrypt password hashing, and tokenized payment processing through Stripe. No system is
        100% secure, however, and we cannot guarantee absolute security.
      </p>

      <h2>7. Children's Privacy</h2>
      <p>
        The Service is not directed to children under 18, and we do not knowingly collect personal
        information from children. If we learn that we have collected information from a child
        under 18, we will delete it.
      </p>

      <h2>8. International Users</h2>
      <p>
        OPA is operated from the United States. If you access the Service from outside the U.S.,
        your information will be transferred to and processed in the United States, where data
        protection laws may differ from those in your country. By using the Service, you consent
        to this transfer.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The updated version will be posted on
        this page with a new "Last updated" date. Material changes will be communicated by email
        or in-product notice where reasonable.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        Questions about this Privacy Policy or our data practices can be sent to{" "}
        <a href="mailto:support@organicprofitsacademy.com">support@organicprofitsacademy.com</a>.
      </p>

      <p className="text-sm text-muted-foreground mt-12 pt-6 border-t border-card-border">
        Organic Profits Academy LLC · Texas, United States
      </p>
    </LegalPage>
  );
}
