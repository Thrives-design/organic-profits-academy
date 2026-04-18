import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

export const PLANS = [
  { id: "full", label: "Pay in full", sub: "Best value", amount: "$1,100", cadence: "today", installments: 1, installmentAmount: 1100 },
  { id: "2mo", label: "2 months", sub: "Split in two", amount: "$550", cadence: "/mo × 2", installments: 2, installmentAmount: 550 },
  { id: "3mo", label: "3 months", sub: "Most flexible", amount: "$367", cadence: "/mo × 3", installments: 3, installmentAmount: 367 },
  { id: "4mo", label: "4 months", sub: "Lowest monthly", amount: "$275", cadence: "/mo × 4", installments: 4, installmentAmount: 275 },
];

export default function Pricing() {
  const [, navigate] = useLocation();
  return (
    <Layout>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="text-center">
            <p className="eyebrow mb-4">Lifetime membership</p>
            <h1 className="serif text-5xl md:text-6xl tracking-tight">$1,100. Once. Forever.</h1>
            <p className="mt-6 max-w-xl mx-auto text-muted-foreground">
              Pick the payment cadence that suits you. Each plan totals the same $1,100 — no interest, no credit check.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-4">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/checkout?plan=${p.id}`)}
                className="gold-glow text-left rounded-xl border border-card-border bg-card p-6 transition-all hover:border-accent"
                data-testid={`plan-${p.id}`}
              >
                <div className="eyebrow text-accent">{p.sub}</div>
                <div className="serif text-2xl mt-2">{p.label}</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="serif text-3xl">{p.amount}</span>
                  <span className="text-xs text-muted-foreground">{p.cadence}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Total $1,100</div>
                <div className="mt-6 flex items-center gap-1 text-xs font-medium text-accent">
                  Continue <ArrowRight size={12} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-card-border bg-card p-8 md:p-10 gold-glow">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="serif text-3xl">What's included</h2>
                <p className="mt-2 text-sm text-muted-foreground">Every membership tier includes every feature. No upsells.</p>
              </div>
              <ul className="space-y-2.5 text-sm">
                {[
                  "Full video library across crypto, futures, options, forex",
                  "Weekday live desk sessions + weekly deep-dives",
                  "Private community chat + forum access",
                  "Priority feature requests + instructor AMAs",
                  "14-day money-back guarantee",
                  "Members-only 15% off merch",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 text-primary shrink-0" strokeWidth={2.4} />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
