import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn(
    "[stripe] STRIPE_SECRET_KEY not set — Stripe routes will return 500 until configured.",
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_missing", {
  apiVersion: "2024-06-20" as any,
  typescript: true,
});

export const STRIPE_PRICE_IDS = {
  full: process.env.STRIPE_PRICE_LIFETIME ?? "",
  "2mo": process.env.STRIPE_PRICE_2MO ?? "",
  "3mo": process.env.STRIPE_PRICE_3MO ?? "",
  "4mo": process.env.STRIPE_PRICE_4MO ?? "",
} as const;

export type PlanId = keyof typeof STRIPE_PRICE_IDS;

export const PLAN_CONFIG: Record<
  PlanId,
  {
    label: string;
    mode: "payment" | "subscription";
    iterations: number;
    installmentAmount: number;
    totalAmount: number;
  }
> = {
  full: { label: "Lifetime — Pay in full", mode: "payment",      iterations: 1, installmentAmount: 1100, totalAmount: 1100 },
  "2mo": { label: "Lifetime — 2-Month Plan", mode: "subscription", iterations: 2, installmentAmount: 550,  totalAmount: 1100 },
  "3mo": { label: "Lifetime — 3-Month Plan", mode: "subscription", iterations: 3, installmentAmount: 367,  totalAmount: 1100 },
  "4mo": { label: "Lifetime — 4-Month Plan", mode: "subscription", iterations: 4, installmentAmount: 275,  totalAmount: 1100 },
};
