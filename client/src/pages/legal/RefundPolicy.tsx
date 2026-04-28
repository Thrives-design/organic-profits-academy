import { Link } from "wouter";
import { LegalPage } from "./LegalPage";

export default function RefundPolicy() {
  return (
    <LegalPage eyebrow="Legal" title="Refund Policy" lastUpdated="April 28, 2026">
      <p>
        We want you to feel confident in your decision to join Organic Profits Academy. This Refund
        Policy explains when and how you can request a refund of your membership purchase. It forms
        part of, and should be read alongside, our{" "}
        <Link href="/terms"><a>Terms of Service</a></Link>.
      </p>

      <h2>1. 14-Day Money-Back Guarantee</h2>
      <p>
        We offer a <strong>14-day money-back guarantee</strong> on all new lifetime memberships,
        whether paid in full or on an installment plan. If you are not satisfied with the Service for
        any reason, you may request a full refund within 14 calendar days of your initial purchase
        date.
      </p>
      <p>
        The 14-day window begins on the date your first successful charge is processed by Stripe
        (the "Purchase Date"), regardless of how often you log in or how much of the content you
        consume during that period.
      </p>

      <h2>2. How to Request a Refund</h2>
      <p>To request a refund within the 14-day window, email us at{" "}
        <a href="mailto:support@organicprofitsacademy.com">support@organicprofitsacademy.com</a>{" "}
        from the email address associated with your OPA account and include:
      </p>
      <ul>
        <li>The full name on the account</li>
        <li>The date of purchase</li>
        <li>A brief reason for the refund (optional but appreciated — it helps us improve)</li>
      </ul>
      <p>
        We will confirm receipt within 1–2 business days and, once approved, issue the refund through
        Stripe to your original payment method. Refunds typically appear on your statement within{" "}
        <strong>5–10 business days</strong>, though the exact timing depends on your bank or card
        issuer.
      </p>

      <h2>3. Effect of a Refund</h2>
      <p>
        When a refund is issued, your access to the Service — including the dashboard, course
        library, community channels, and Telegram group — will be revoked. Any future scheduled
        installments will be cancelled automatically. You will no longer be able to log in to your
        OPA account.
      </p>

      <h2>4. Installment Plans After the 14-Day Window</h2>
      <p>
        If you purchased on a 2-, 3-, or 4-month installment plan and the 14-day window has passed,
        we are <strong>unable to refund payments already made</strong>. However, you may cancel any
        remaining future installments at any time by emailing{" "}
        <a href="mailto:support@organicprofitsacademy.com">support@organicprofitsacademy.com</a>.
      </p>
      <p>
        Please note: cancelling future installments before the plan is paid in full will result in{" "}
        <strong>loss of access to the Service</strong>, because lifetime access is granted in
        exchange for the full $1,100 membership price. If you later wish to regain access, you may
        purchase a new membership at the then-current price.
      </p>

      <h2>5. Refunds Outside the 14-Day Window</h2>
      <p>
        After the 14-day money-back window has expired, all sales are final. We do not offer
        partial refunds, prorated refunds, or refunds based on non-use of the Service. By purchasing
        a membership, you acknowledge that you have had the opportunity to review the Service
        offering and that the 14-day guarantee provides a sufficient evaluation period.
      </p>

      <h2>6. Refunds and Terms of Service Violations</h2>
      <p>
        Consistent with Section 12 of our{" "}
        <Link href="/terms"><a>Terms of Service</a></Link>, we do{" "}
        <strong>not issue refunds</strong> if your account is terminated due to a violation of the
        Terms — including but not limited to content piracy, sharing your login credentials,
        redistributing course materials, harassment, or other prohibited conduct. This applies
        regardless of whether the termination occurs inside or outside the 14-day window.
      </p>

      <h2>7. Chargebacks</h2>
      <p>
        We ask that you contact us first before initiating a chargeback or payment dispute with your
        bank or card issuer. In nearly all cases we can resolve the issue faster than a chargeback
        process. Initiating a chargeback without first contacting us may result in immediate
        termination of your account, and we reserve the right to dispute fraudulent or bad-faith
        chargebacks.
      </p>

      <h2>8. Promotional or Discounted Purchases</h2>
      <p>
        Memberships purchased at a promotional or discounted price are eligible for the same 14-day
        money-back guarantee, but the refund amount will equal the actual amount paid — not the
        regular list price.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Refund Policy from time to time. The "Last updated" date at the top of
        this page will reflect any changes. Refund requests will be evaluated under the policy that
        was in effect on your Purchase Date.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about a refund or this policy? Email us at{" "}
        <a href="mailto:support@organicprofitsacademy.com">support@organicprofitsacademy.com</a>.
        We typically respond within 1–2 business days.
      </p>
    </LegalPage>
  );
}
