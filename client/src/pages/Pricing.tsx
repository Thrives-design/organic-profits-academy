import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

export const PLANS = [
  { id: "full", label: "Pay in full", sub: "Best value",      amount: "$1,100", cadence: "today",      installments: 1, installmentAmount: 1100 },
  { id: "2mo",  label: "2 months",    sub: "Split in two",    amount: "$550",   cadence: "× 2 months", installments: 2, installmentAmount: 550 },
  { id: "3mo",  label: "3 months",    sub: "Most flexible",   amount: "$367",   cadence: "× 3 months", installments: 3, installmentAmount: 367 },
  { id: "4mo",  label: "4 months",    sub: "Lowest monthly",  amount: "$275",   cadence: "× 4 months", installments: 4, installmentAmount: 275 },
];

export default function Pricing() {
  const [, navigate] = useLocation();
  const [planId, setPlanId] = useState("full");
  const current = PLANS.find((p) => p.id === planId)!;
  return (
    <Layout>
      <section className="py-28 lg:py-36">
        <div className="mx-auto max-w-xl px-6 lg:px-10 text-center">
          <p className="eyebrow mb-6">Lifetime Membership</p>
          <h1 className="display-xl serif">
            $1,100.<br />
            <span className="italic">Once. Forever.</span>
          </h1>
          <p className="mt-8 text-muted-foreground leading-relaxed">
            Pick the payment cadence that suits you. Each plan totals the same $1,100 — no interest, no credit check.
          </p>
        </div>

        <div className="mx-auto max-w-lg px-6 mt-16">
          <div className="border border-accent bg-card p-10 md:p-12">
            <div className="eyebrow mb-4">Lifetime Membership</div>
            <div className="serif text-6xl md:text-7xl tracking-tight" style={{ fontWeight: 400 }}>$1,100</div>
            <p className="mt-3 text-sm text-muted-foreground">One payment. Perpetual access.</p>

            <div className="hairline my-10" />

            <div className="space-y-1 text-left">
              {PLANS.map((p) => {
                const active = planId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlanId(p.id)}
                    className={`w-full flex items-center justify-between py-4 px-2 transition-colors ${active ? "bg-accent/5" : ""}`}
                    data-testid={`plan-${p.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 border transition-colors ${active ? "bg-accent border-accent" : "border-accent/50"}`} />
                      <span className="mono uppercase tracking-wider-editorial text-[11px]">{p.label}</span>
                    </div>
                    <span className="mono text-[11px] text-muted-foreground uppercase tracking-wider-editorial">
                      {p.amount} {p.cadence}
                    </span>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => navigate(`/checkout?plan=${current.id}`)}
              size="lg"
              className="mt-10 w-full bg-primary text-primary-foreground hover:bg-[hsl(89_48%_46%)] hover:text-[hsl(207_54%_8%)] transition-colors h-12 rounded-none mono uppercase tracking-widest-editorial text-[11px] font-medium"
              data-testid="button-reserve"
            >
              Reserve Your Spot
            </Button>

            <p className="eyebrow-subtle mt-6">14-day money-back guarantee</p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 mt-24">
          <div className="hairline mb-12" />
          <p className="eyebrow mb-6">What's included</p>
          <ul className="grid gap-x-10 gap-y-3 md:grid-cols-2 text-[15px]">
            {[
              "Full video library across crypto, forex, options",
              "Weekday live desk sessions + weekly deep-dives",
              "Private community chat + forum access",
              "Priority feature requests + instructor AMAs",
              "15% off the full merchandise line",
              "14-day money-back guarantee",
            ].map((i) => (
              <li key={i} className="flex items-start gap-3 py-2 hairline-bottom">
                <span className="eyebrow text-accent mt-1">—</span>
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
}
