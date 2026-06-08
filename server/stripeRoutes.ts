import type { Express, Request, Response } from "express";
import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { stripe, STRIPE_PRICE_IDS, PLAN_CONFIG, type PlanId } from "./stripe";
import { storage } from "./storage";
import {
  sendPurchaseConfirmationEmail,
  sendPaymentFailedEmail,
} from "./email";

function genToken() {
  return crypto.randomBytes(32).toString("hex");
}

function publicUser(u: any) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

/**
 * Get the public origin for redirect URLs.
 * Uses PUBLIC_BASE_URL env var if set, otherwise falls back to the live domain.
 * Never trusts the request Origin header to prevent open-redirect abuse.
 */
function getOrigin(_req: Request): string {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL;
  return "https://organicprofitsacademy.com";
}

/**
 * Register the Stripe webhook handler.
 * MUST be called BEFORE express.json() middleware so we get the raw body
 * needed to verify Stripe's signature.
 */
export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.header("stripe-signature");
      const secret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!sig || !secret) {
        console.error("[stripe webhook] missing signature or secret");
        return res.status(400).send("Webhook config error");
      }

      let event: any;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, secret);
      } catch (err: any) {
        console.error("[stripe webhook] signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      try {
        await handleStripeEvent(event);
      } catch (err: any) {
        console.error("[stripe webhook] handler error:", err);
        return res.status(500).send(`Handler Error: ${err.message}`);
      }

      res.json({ received: true });
    },
  );
}

/**
 * Register the rest of the Stripe routes (checkout session creation + status check).
 * Called AFTER express.json() middleware — these endpoints take JSON bodies.
 */
export function registerStripeRoutes(app: Express) {
  // ----- Create Checkout Session -----
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const { name, email, password, planType } = req.body ?? {};
      if (!name || !email || !password || !planType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const plan = PLAN_CONFIG[planType as PlanId];
      const priceId = STRIPE_PRICE_IDS[planType as PlanId];
      if (!plan || !priceId) {
        return res.status(400).json({ error: "Invalid plan" });
      }

      // Find or create user (don't grant member access yet — wait for payment)
      let user = await storage.getUserByEmail(email);
      if (!user) {
        const hashed = await bcrypt.hash(password, 10);
        user = await storage.createUser({ name, email, password: hashed } as any);
      }

      // Create Stripe customer if needed
      let customerId = user!.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email,
          name,
          metadata: { userId: String(user!.id) },
        });
        customerId = customer.id;
        await storage.updateUser(user!.id, { stripeCustomerId: customerId });
      }

      const origin = getOrigin(req);
      // Send users back to /checkout which has the verify-and-login flow built in.
      // After verification it redirects them to /dashboard.
      const successUrl = `${origin}/#/checkout?stripe_session={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/#/checkout?plan=${planType}&canceled=1`;

      const sessionParams: any = {
        mode: plan.mode,
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: String(user!.id),
        metadata: {
          userId: String(user!.id),
          planType,
          iterations: String(plan.iterations),
        },
        allow_promotion_codes: true,
      };

      // For subscriptions, pass metadata to the subscription itself
      // so we can track iterations on invoice events
      if (plan.mode === "subscription") {
        sessionParams.subscription_data = {
          metadata: {
            userId: String(user!.id),
            planType,
            iterations: String(plan.iterations),
          },
        };
      } else {
        // For one-time payments — let the product's statement descriptor apply
        sessionParams.payment_intent_data = {
          metadata: {
            userId: String(user!.id),
            planType,
          },
        };
      }

      const session = await stripe.checkout.sessions.create(sessionParams);

      // Pre-create a pending payment plan record so we can match the webhook
      // (paid_installments stays at 0 until first invoice/payment confirms)
      await storage.createPaymentPlan({
        userId: user!.id,
        planType,
        totalAmount: plan.totalAmount,
        installmentAmount: plan.installmentAmount,
        totalInstallments: plan.iterations,
        paidInstallments: 0,
        nextChargeDate: null,
        stripeSessionId: session.id,
        status: "pending",
      } as any);

      return res.json({ url: session.url, sessionId: session.id });
    } catch (e: any) {
      console.error("[stripe] create-checkout-session error:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  // ----- Verify checkout completed and issue auth token -----
  // Called from the success page after Stripe redirects back.
  app.post("/api/stripe/verify-session", async (req, res) => {
    try {
      const { sessionId } = req.body ?? {};
      if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // Determine if payment is good
      const isPaid =
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required";

      if (!isPaid) {
        return res
          .status(402)
          .json({ error: "Payment not completed", paymentStatus: session.payment_status });
      }

      const userId = Number(session.client_reference_id || session.metadata?.userId);
      if (!userId) return res.status(400).json({ error: "No user reference" });

      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      // Webhook should have already activated membership; do it here too as a safety net
      if (!user.isMember) {
        await storage.updateUser(user.id, { isMember: true });
      }

      // Issue session token
      const token = genToken();
      await storage.createSession(token, user.id);
      const fresh = await storage.getUser(user.id);

      return res.json({ token, user: publicUser(fresh) });
    } catch (e: any) {
      console.error("[stripe] verify-session error:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  // ----- Public publishable key -----
  app.get("/api/stripe/config", (_req, res) => {
    res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? "" });
  });

  // ----- Customer Portal -----
  // Creates a Stripe Customer Portal session for the authed user so they can
  // manage payment methods, view invoices, and (for installment subscriptions)
  // cancel future installments themselves.
  app.post("/api/stripe/portal", async (req, res) => {
    try {
      // Authenticate via the same Bearer token scheme used elsewhere.
      const auth = req.header("authorization");
      const token = auth ? auth.replace(/^Bearer\s+/i, "").trim() : "";
      if (!token) return res.status(401).json({ error: "Not authenticated" });
      const userId = await storage.getSessionUserId(token);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      if (!user.stripeCustomerId) {
        return res
          .status(400)
          .json({ error: "No Stripe customer on file. Contact support if you believe this is an error." });
      }

      const origin = getOrigin(req);
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${origin}/#/dashboard`,
      });

      return res.json({ url: session.url });
    } catch (e: any) {
      console.error("[stripe] portal error:", e);
      // Common cause: portal not configured in Stripe dashboard yet.
      const msg = e?.raw?.message || e?.message || "Could not open billing portal";
      return res.status(500).json({ error: msg });
    }
  });
}

/**
 * Webhook event router.
 * Lifetime (one-time): checkout.session.completed → grant access.
 * Subscriptions (2/3/4-mo): checkout.session.completed (first payment) → grant access,
 *   then invoice.paid increments paidInstallments; when count == iterations,
 *   cancel the subscription.
 */
async function handleStripeEvent(event: any): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = Number(session.client_reference_id || session.metadata?.userId);
      const planType = session.metadata?.planType;

      if (!userId) {
        console.warn("[stripe webhook] checkout.session.completed without userId");
        return;
      }

      // Grant lifetime access
      await storage.updateUser(userId, { isMember: true });

      // Find the pre-created payment plan
      const plan = await storage.getPaymentPlanBySessionId(session.id);
      if (plan) {
        const isFullPay = planType === "full" || session.mode === "payment";
        await storage.updatePaymentPlan(plan.id, {
          paidInstallments: isFullPay ? 1 : 1, // first invoice paid
          stripeSubscriptionId:
            typeof session.subscription === "string" ? session.subscription : null,
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
          status: isFullPay ? "completed" : "active",
        });
      }

      // Create order record
      const user = await storage.getUser(userId);
      if (user) {
        await storage.createOrder({
          orderNumber: "OP-" + Date.now().toString(36).toUpperCase(),
          userId: user.id,
          email: user.email,
          type: "membership",
          items: [
            {
              name: "Organic Profits Academy — Lifetime Membership",
              planType,
              amount: (session.amount_total ?? 0) / 100,
            },
          ] as any,
          subtotal: (session.amount_total ?? 0) / 100,
          shipping: null as any,
          status: "paid",
        } as any);

        // Send purchase confirmation email (fire-and-forget; never throws)
        const planCfg = PLAN_CONFIG[planType as PlanId];
        const amountPaid = (session.amount_total ?? 0) / 100;
        const totalInstallments = planCfg?.iterations ?? 1;
        const isInstallment = totalInstallments > 1;

        // For installment plans, compute the next charge date (~1 month out)
        // by looking up the subscription's current_period_end if available.
        let nextChargeDate: string | null = null;
        if (isInstallment && typeof session.subscription === "string") {
          try {
            const sub = await stripe.subscriptions.retrieve(session.subscription);
            if (sub.current_period_end) {
              nextChargeDate = new Date(sub.current_period_end * 1000).toISOString();
            }
          } catch (err) {
            console.error("[stripe webhook] failed to fetch sub for nextChargeDate:", err);
          }
        }

        await sendPurchaseConfirmationEmail({
          to: user.email,
          name: user.name || user.email,
          planLabel: planCfg?.label ?? "Organic Profits Academy — Lifetime",
          amountPaid,
          totalAmount: planCfg?.totalAmount ?? amountPaid,
          installmentNum: isInstallment ? 1 : undefined,
          totalInstallments: isInstallment ? totalInstallments : undefined,
          nextChargeDate,
        });
      }

      console.log(`[stripe webhook] checkout completed for user ${userId} (${planType})`);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      if (!subscriptionId || typeof subscriptionId !== "string") return;

      const plan = await storage.getPaymentPlanBySubscriptionId(subscriptionId);
      if (!plan) {
        console.warn(`[stripe webhook] invoice.paid for unknown subscription ${subscriptionId}`);
        return;
      }

      // First invoice is already counted by checkout.session.completed.
      // Skip if this is the very first invoice for this subscription.
      // We detect by billing_reason: "subscription_create" is the first one.
      if (invoice.billing_reason === "subscription_create") {
        console.log(`[stripe webhook] skipping first invoice (${invoice.id}) — counted at checkout`);
        return;
      }

      const newCount = (plan.paidInstallments ?? 0) + 1;
      const isFinal = newCount >= plan.totalInstallments;

      await storage.updatePaymentPlan(plan.id, {
        paidInstallments: newCount,
        status: isFinal ? "completed" : "active",
      });

      console.log(
        `[stripe webhook] invoice.paid for plan ${plan.id}: ${newCount}/${plan.totalInstallments}`,
      );

      // Send installment-paid confirmation email
      const installmentUser = await storage.getUser(plan.userId);
      if (installmentUser) {
        const planCfg = PLAN_CONFIG[plan.planType as PlanId];
        const amountPaid = (invoice.amount_paid ?? 0) / 100;
        let nextChargeDate: string | null = null;
        if (!isFinal && invoice.lines?.data?.[0]?.period?.end) {
          // Stripe sets the next charge ~1 month after this period ends
          const periodEnd = invoice.lines.data[0].period.end;
          if (typeof periodEnd === "number") {
            nextChargeDate = new Date(periodEnd * 1000).toISOString();
          }
        }
        await sendPurchaseConfirmationEmail({
          to: installmentUser.email,
          name: installmentUser.name || installmentUser.email,
          planLabel: planCfg?.label ?? "Organic Profits Academy — Installment",
          amountPaid: amountPaid || (planCfg?.installmentAmount ?? 0),
          totalAmount: planCfg?.totalAmount ?? 1100,
          installmentNum: newCount,
          totalInstallments: plan.totalInstallments,
          nextChargeDate,
        });
      }

      if (isFinal) {
        // Cancel the subscription so they aren't billed again
        try {
          await stripe.subscriptions.cancel(subscriptionId);
          console.log(`[stripe webhook] canceled subscription ${subscriptionId} (final payment)`);
        } catch (err: any) {
          console.error(
            `[stripe webhook] failed to cancel subscription ${subscriptionId}:`,
            err.message,
          );
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      if (!subscriptionId || typeof subscriptionId !== "string") return;
      console.warn(`[stripe webhook] payment failed for subscription ${subscriptionId}`);

      // Notify the customer so they can update their card before Stripe gives up
      const plan = await storage.getPaymentPlanBySubscriptionId(subscriptionId);
      if (plan) {
        const user = await storage.getUser(plan.userId);
        if (user) {
          // The failed attempt is for the next unpaid installment
          const failedNum = Math.min(
            (plan.paidInstallments ?? 0) + 1,
            plan.totalInstallments,
          );
          await sendPaymentFailedEmail({
            to: user.email,
            name: user.name || user.email,
            installmentNum: failedNum,
            totalInstallments: plan.totalInstallments,
          });
        }
      }
      // Stripe will retry automatically per dunning settings.
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const plan = await storage.getPaymentPlanBySubscriptionId(sub.id);
      if (plan && plan.status !== "completed") {
        // Subscription canceled before all installments paid — revoke membership
        await storage.updatePaymentPlan(plan.id, { status: "canceled" });
        console.warn(
          `[stripe webhook] subscription ${sub.id} canceled early; plan ${plan.id} marked canceled`,
        );
      }
      break;
    }

    default:
      // Ignore other events
      break;
  }
}
