/**
 * Transactional email sender for Organic Profits Academy.
 * Uses Resend. All sends are best-effort — failures are logged but do NOT
 * throw, so they never break the user-facing flow (signup, purchase, etc.).
 */
import { Resend } from "resend";

const FROM = "Organic Profits Academy <support@organicprofitsacademy.com>";
const REPLY_TO = "support@organicprofitsacademy.com";
const BRAND = {
  navy: "#0c1b28",
  green: "#7bac3f",
  gold: "#ae9b6c",
  cream: "#faf8f3",
  deepBrown: "#2b2419",
};

let resend: Resend | null = null;
function client(): Resend | null {
  if (resend) return resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY not set — emails will be skipped.");
    return null;
  }
  resend = new Resend(key);
  return resend;
}

/** Shared HTML wrapper. All emails inherit the same look. */
function wrap(opts: {
  preheader: string;
  eyebrow: string;
  headline: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}): string {
  const cta = opts.ctaLabel && opts.ctaUrl
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 8px 0;">
         <tr>
           <td style="background:${BRAND.green};border-radius:6px;">
             <a href="${opts.ctaUrl}" style="display:inline-block;padding:14px 28px;color:${BRAND.cream};font-family:Helvetica,Arial,sans-serif;font-weight:600;font-size:14px;letter-spacing:0.5px;text-decoration:none;">${opts.ctaLabel}</a>
           </td>
         </tr>
       </table>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(opts.headline)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f1ea;font-family:Helvetica,Arial,sans-serif;color:${BRAND.deepBrown};">
    <!-- Preheader (hidden, shows in inbox preview) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(opts.preheader)}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f1ea;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:${BRAND.cream};border-radius:8px;overflow:hidden;border:1px solid #e9e3d4;">
            <!-- Header -->
            <tr>
              <td style="padding:32px 40px 0 40px;">
                <div style="display:inline-block;border-top:2px solid ${BRAND.gold};width:48px;margin-bottom:18px;"></div>
                <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${BRAND.gold};font-weight:600;">
                  Organic Profits Academy
                </div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:24px 40px 8px 40px;">
                <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.deepBrown};opacity:0.6;margin-bottom:12px;">
                  ${escapeHtml(opts.eyebrow)}
                </div>
                <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;color:${BRAND.navy};margin:0 0 20px 0;font-weight:500;">
                  ${escapeHtml(opts.headline)}
                </h1>
                <div style="font-size:15px;line-height:1.65;color:${BRAND.deepBrown};">
                  ${opts.body}
                </div>
                ${cta}
              </td>
            </tr>

            <!-- Footer note -->
            ${opts.footerNote ? `<tr>
              <td style="padding:24px 40px 0 40px;">
                <div style="border-top:1px solid #e9e3d4;padding-top:20px;font-size:13px;line-height:1.55;color:${BRAND.deepBrown};opacity:0.7;">
                  ${opts.footerNote}
                </div>
              </td>
            </tr>` : ""}

            <!-- Tagline + footer -->
            <tr>
              <td style="padding:32px 40px 32px 40px;">
                <div style="border-top:1px solid #e9e3d4;padding-top:20px;">
                  <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:14px;color:${BRAND.gold};margin-bottom:10px;">
                    Real wins. Real people.
                  </div>
                  <div style="font-size:11px;line-height:1.6;color:${BRAND.deepBrown};opacity:0.55;">
                    Organic Profits Academy LLC · Texas, USA<br/>
                    Questions? Reply to this email or write
                    <a href="mailto:support@organicprofitsacademy.com" style="color:${BRAND.navy};text-decoration:underline;">support@organicprofitsacademy.com</a>
                  </div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Outside the card -->
          <div style="max-width:600px;width:100%;padding:16px 8px 0 8px;text-align:center;font-size:11px;color:#8a8170;">
            <a href="https://organicprofitsacademy.com" style="color:#8a8170;text-decoration:none;">organicprofitsacademy.com</a>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function send(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  tag?: string;
}): Promise<void> {
  const r = client();
  if (!r) return; // No key configured — silent no-op.
  try {
    const result = await r.emails.send({
      from: FROM,
      to: opts.to,
      replyTo: REPLY_TO,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      ...(opts.tag ? { tags: [{ name: "category", value: opts.tag }] } : {}),
    });
    if ((result as any)?.error) {
      console.error(`[email] send failed (${opts.tag ?? "untagged"}):`, (result as any).error);
    } else {
      console.log(`[email] sent ${opts.tag ?? ""} to ${opts.to}`);
    }
  } catch (err) {
    console.error(`[email] exception sending ${opts.tag ?? ""}:`, err);
  }
}

// ============================================================
// Welcome email — sent on signup (before purchase)
// ============================================================
export async function sendWelcomeEmail(args: {
  to: string;
  name: string;
}): Promise<void> {
  const firstName = args.name.split(" ")[0] || "there";
  const body = `
    <p>${escapeHtml(firstName)}, welcome to the academy.</p>
    <p>You've taken the first real step — most people read three threads about trading and call it a day. You showed up.</p>
    <p>Here's what's waiting for you:</p>
    <ul style="padding-left:20px;line-height:1.8;">
      <li><strong>Crypto, forex, and options</strong> — three niches, one curriculum</li>
      <li><strong>Live webinars</strong> — trade alongside our coaches in real time</li>
      <li><strong>On-demand library</strong> — every lesson, recorded and searchable</li>
      <li><strong>Private Telegram</strong> — 11 channels of real trades, real talk</li>
    </ul>
    <p>If you haven't yet, the next move is locking in lifetime access. One price, all niches, forever.</p>
  `;
  await send({
    to: args.to,
    subject: `Welcome to Organic Profits Academy, ${firstName}`,
    tag: "welcome",
    html: wrap({
      preheader: "Real wins. Real people. Here's what's next.",
      eyebrow: "Welcome aboard",
      headline: `Welcome, ${firstName}.`,
      body,
      ctaLabel: "See pricing",
      ctaUrl: "https://organicprofitsacademy.com/#/pricing",
    }),
    text: `${firstName}, welcome to Organic Profits Academy.

You've taken the first real step. Here's what's waiting for you:

- Crypto, forex, and options — three niches, one curriculum
- Live webinars — trade alongside our coaches in real time
- On-demand library — every lesson, recorded and searchable
- Private Telegram — 11 channels of real trades, real talk

Lock in lifetime access here: https://organicprofitsacademy.com/#/pricing

Real wins. Real people.

— Organic Profits Academy
support@organicprofitsacademy.com`,
  });
}

// ============================================================
// Password reset email
// ============================================================
export async function sendPasswordResetEmail(args: {
  to: string;
  name: string;
  resetUrl: string;
}): Promise<void> {
  const firstName = args.name.split(" ")[0] || "there";
  const body = `
    <p>Hi ${escapeHtml(firstName)},</p>
    <p>We got a request to reset the password on your Organic Profits Academy account. Click the button below to choose a new one. This link is good for <strong>one hour</strong>.</p>
  `;
  const footerNote = `
    If you didn't request this, you can safely ignore this email — your password won't change.
    For security, never share this link with anyone.
  `;
  await send({
    to: args.to,
    subject: "Reset your Organic Profits Academy password",
    tag: "password-reset",
    html: wrap({
      preheader: "Reset your password — link valid for one hour.",
      eyebrow: "Account security",
      headline: "Reset your password",
      body,
      ctaLabel: "Choose a new password",
      ctaUrl: args.resetUrl,
      footerNote,
    }),
    text: `Hi ${firstName},

We got a request to reset the password on your Organic Profits Academy account. Use this link to choose a new one — it's good for one hour:

${args.resetUrl}

If you didn't request this, you can safely ignore this email. Your password won't change.

— Organic Profits Academy
support@organicprofitsacademy.com`,
  });
}

// ============================================================
// Purchase confirmation — sent after successful checkout
// ============================================================
export async function sendPurchaseConfirmationEmail(args: {
  to: string;
  name: string;
  planLabel: string;        // "Lifetime — Pay in full" etc.
  amountPaid: number;       // 1100, 550, etc.
  totalAmount: number;      // 1100 always
  installmentNum?: number;  // for plans, "1 of 3"
  totalInstallments?: number;
  nextChargeDate?: string | null;
}): Promise<void> {
  const firstName = args.name.split(" ")[0] || "there";
  const isInstallment = (args.totalInstallments ?? 1) > 1;
  const isFirstInstallment = isInstallment && args.installmentNum === 1;

  let body: string;
  let subject: string;
  let footerNote: string;

  if (!isInstallment) {
    subject = "Welcome to the House — your lifetime access is active";
    body = `
      <p>${escapeHtml(firstName)}, you're in.</p>
      <p>Your lifetime membership to Organic Profits Academy is active. Every video, every webinar, every channel — yours, forever.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;background:#ffffff;border:1px solid #e9e3d4;border-radius:6px;width:100%;">
        <tr>
          <td style="padding:18px 22px;">
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#ae9b6c;margin-bottom:8px;">Order summary</div>
            <div style="font-size:15px;color:#0c1b28;"><strong>${escapeHtml(args.planLabel)}</strong></div>
            <div style="font-size:14px;color:#2b2419;opacity:0.75;margin-top:4px;">Amount paid: <strong>$${args.amountPaid.toLocaleString()}</strong></div>
          </td>
        </tr>
      </table>
      <p><strong>Next step:</strong> Message the admin in the Community area for your private Telegram invite link — that's where the daily action happens.</p>
    `;
    footerNote = `A formal receipt has also been sent by Stripe to this email address. Keep it for your records.`;
  } else if (isFirstInstallment) {
    subject = `You're in — first payment received (1 of ${args.totalInstallments})`;
    body = `
      <p>${escapeHtml(firstName)}, you're officially a member.</p>
      <p>Your first installment came through and your lifetime access is now active. You have full run of the academy — every video, every webinar, every Telegram channel — exactly the same as a pay-in-full member.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;background:#ffffff;border:1px solid #e9e3d4;border-radius:6px;width:100%;">
        <tr>
          <td style="padding:18px 22px;">
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#ae9b6c;margin-bottom:8px;">Order summary</div>
            <div style="font-size:15px;color:#0c1b28;"><strong>${escapeHtml(args.planLabel)}</strong></div>
            <div style="font-size:14px;color:#2b2419;opacity:0.75;margin-top:6px;">
              Payment 1 of ${args.totalInstallments} — <strong>$${args.amountPaid.toLocaleString()}</strong><br/>
              ${args.nextChargeDate ? `Next charge: <strong>${formatDate(args.nextChargeDate)}</strong>` : ""}
            </div>
          </td>
        </tr>
      </table>
      <p><strong>Next step:</strong> Message the admin in the Community area for your private Telegram invite link.</p>
    `;
    footerNote = `You can update your payment method or view receipts anytime from your Dashboard → Manage billing.`;
  } else {
    // Installment 2+
    subject = `Payment received — ${args.installmentNum} of ${args.totalInstallments}`;
    body = `
      <p>${escapeHtml(firstName)}, your installment came through. Thanks.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;background:#ffffff;border:1px solid #e9e3d4;border-radius:6px;width:100%;">
        <tr>
          <td style="padding:18px 22px;">
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#ae9b6c;margin-bottom:8px;">Payment summary</div>
            <div style="font-size:15px;color:#0c1b28;"><strong>${escapeHtml(args.planLabel)}</strong></div>
            <div style="font-size:14px;color:#2b2419;opacity:0.75;margin-top:6px;">
              Payment ${args.installmentNum} of ${args.totalInstallments} — <strong>$${args.amountPaid.toLocaleString()}</strong><br/>
              ${args.installmentNum === args.totalInstallments
                ? `<strong style="color:${BRAND.green};">This was your final payment. Your plan is paid in full.</strong>`
                : `Next charge: <strong>${args.nextChargeDate ? formatDate(args.nextChargeDate) : "soon"}</strong>`}
            </div>
          </td>
        </tr>
      </table>
    `;
    footerNote = `Manage billing anytime from your Dashboard → Manage billing.`;
  }

  await send({
    to: args.to,
    subject,
    tag: "purchase",
    html: wrap({
      preheader: isInstallment
        ? `Payment ${args.installmentNum} of ${args.totalInstallments} confirmed.`
        : "Your lifetime access is active.",
      eyebrow: isFirstInstallment || !isInstallment ? "Order confirmation" : "Payment received",
      headline: isFirstInstallment || !isInstallment ? "You're in." : "Payment received.",
      body,
      ctaLabel: "Open your dashboard",
      ctaUrl: "https://organicprofitsacademy.com/#/dashboard",
      footerNote,
    }),
    text: `${firstName},

${!isInstallment
  ? "Your lifetime membership to Organic Profits Academy is active."
  : isFirstInstallment
    ? `Your first installment came through. You're now a member.`
    : `Payment ${args.installmentNum} of ${args.totalInstallments} received.`}

Order: ${args.planLabel}
Amount: $${args.amountPaid.toLocaleString()}
${isInstallment && args.installmentNum !== args.totalInstallments && args.nextChargeDate
  ? `Next charge: ${formatDate(args.nextChargeDate)}\n` : ""}
${isFirstInstallment || !isInstallment ? "Next step: message the admin in the Community area for your private Telegram invite link.\n" : ""}
Dashboard: https://organicprofitsacademy.com/#/dashboard

— Organic Profits Academy
support@organicprofitsacademy.com`,
  });
}

// ============================================================
// Payment failed — sent when Stripe retries an installment unsuccessfully
// ============================================================
export async function sendPaymentFailedEmail(args: {
  to: string;
  name: string;
  installmentNum: number;
  totalInstallments: number;
}): Promise<void> {
  const firstName = args.name.split(" ")[0] || "there";
  const body = `
    <p>Hi ${escapeHtml(firstName)},</p>
    <p>We couldn't process your installment payment (${args.installmentNum} of ${args.totalInstallments}). This usually means your card expired, was replaced, or hit a limit.</p>
    <p><strong>What happens next:</strong> Stripe will automatically retry the charge over the next few days. To avoid losing access, please update your card before the final retry.</p>
  `;
  const footerNote = `If we can't successfully charge after the retry window, your membership access will be paused until billing is resolved. Update your card from your Dashboard → Manage billing, or reply to this email and we'll help.`;
  await send({
    to: args.to,
    subject: "Action needed: your installment payment didn't go through",
    tag: "payment-failed",
    html: wrap({
      preheader: "Update your card to keep your access active.",
      eyebrow: "Billing issue",
      headline: "Your payment didn't go through",
      body,
      ctaLabel: "Update payment method",
      ctaUrl: "https://organicprofitsacademy.com/#/dashboard",
      footerNote,
    }),
    text: `Hi ${firstName},

We couldn't process your installment payment (${args.installmentNum} of ${args.totalInstallments}). This usually means your card expired, was replaced, or hit a limit.

Stripe will automatically retry over the next few days. To avoid losing access, please update your card before the final retry.

Update your card: https://organicprofitsacademy.com/#/dashboard

If we can't successfully charge, your access will be paused until billing is resolved. Reply to this email if you need help.

— Organic Profits Academy
support@organicprofitsacademy.com`,
  });
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}
