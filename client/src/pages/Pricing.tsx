import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { Check } from "lucide-react";

// Single monthly plan — $600/month recurring
export const PLANS = [
  {
    id: "monthly",
    label: "Monthly Membership",
    sub: "Cancel anytime",
    amount: "$600",
    cadence: "/ month",
    installments: 1,
    installmentAmount: 600,
  },
];

const INCLUDES = [
  "Recorded webinars across crypto & forex — study anytime",
  "New webinars added every week",
  "Live desk sessions with Byron",
  "11-channel private Telegram house",
  "Trade Ideas, Profits & Events channels",
  "Digital resources: PDFs, backtests, templates",
  "Direct access to Byron via Telegram",
  "All future content included at no extra cost",
  "7-day money-back guarantee",
  "Cancel before your next billing date — no penalty",
];

const WHY = [
  {
    q: "Why $600/month?",
    a: "Most traders spend more on subscriptions, courses, and tools that never pay off. $600/month gets you everything — live sessions, the full webinar library, a real community, and direct mentor access — in one place. That's the edge serious traders pay for.",
  },
  {
    q: "What happens after I sign up?",
    a: "You get immediate access to your member dashboard, the full video library, and a direct Telegram invite to the private house. You're in the community within minutes.",
  },
  {
    q: "Is there a commitment?",
    a: "None. Cancel before your next billing date and you won't be charged again. But most members stay — because the community is where the real growth happens.",
  },
];

export default function Pricing() {
  const [, navigate] = useLocation();

  return (
    <Layout>
      {/* ==================== HERO ==================== */}
      <section className="py-28 lg:py-36" data-testid="section-pricing-hero">
        <div className="mx-auto max-w-xl px-6 lg:px-10 text-center">
          <p className="eyebrow mb-6">Monthly Membership</p>
          <h1 className="display-xl serif">
            $600/month.<br />
            <span className="italic">Everything included.</span>
          </h1>
          <p className="mt-8 text-muted-foreground leading-relaxed max-w-md mx-auto">
            One flat rate. All three markets. Live sessions, the full webinar library,
            and a community that holds you accountable. No tiers. No upsells.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="mx-auto max-w-lg px-6 mt-16">
          <Reveal>
            <div className="border border-[hsl(var(--brand-gold))] bg-card p-10 md:p-12">
              <div className="eyebrow mb-4">Organic Profits Academy</div>
              <div className="flex items-baseline gap-3">
                <div className="serif text-6xl md:text-7xl tracking-tight" style={{ fontWeight: 400 }}>
                  $600
                </div>
                <span className="mono text-[12px] uppercase tracking-widest-editorial text-muted-foreground">
                  / month
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Billed monthly. Cancel anytime before your next billing date.
              </p>

              <div className="hairline my-10" />

              <div className="space-y-3 text-left">
                {INCLUDES.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check
                      size={14}
                      className="text-[hsl(var(--brand-green))] shrink-0 mt-0.5"
                      strokeWidth={2.5}
                    />
                    <span className="text-[14px] leading-relaxed text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => navigate("/checkout?plan=monthly")}
                size="lg"
                className="mt-10 w-full bg-primary text-primary-foreground hover:bg-[hsl(var(--brand-deep-brown))] hover:text-[hsl(var(--brand-warm-white))] transition-colors h-12 rounded-none mono uppercase tracking-widest-editorial text-[11px] font-medium"
                data-testid="button-join"
              >
                Start Today — $600/month
              </Button>

              <p className="mt-4 text-center text-[12px] text-muted-foreground mono">
                Secure checkout. Cancel anytime. 7-day guarantee.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== WHY SECTION ==================== */}
      <section className="py-20 lg:py-24 bg-[hsl(var(--brand-silver-cream))]" data-testid="section-why">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Reveal>
            <p className="eyebrow mb-6">The honest answers</p>
            <h2 className="display-xl serif mb-14">
              Before you <span className="italic">decide.</span>
            </h2>
          </Reveal>

          <div className="space-y-10">
            {WHY.map((w, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="lg:grid lg:grid-cols-12 lg:gap-12" data-testid={`why-${i}`}>
                  <div className="lg:col-span-5 mb-3 lg:mb-0">
                    <h3 className="serif text-xl md:text-2xl" style={{ fontWeight: 400 }}>
                      {w.q}
                    </h3>
                  </div>
                  <div className="lg:col-span-7">
                    <p className="text-[15px] leading-relaxed text-muted-foreground">{w.a}</p>
                  </div>
                </div>
                {i < WHY.length - 1 && <div className="hairline mt-10" />}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-20 lg:py-24" data-testid="section-final-cta">
        <div className="mx-auto max-w-lg px-6 text-center">
          <Reveal>
            <h2 className="serif text-3xl md:text-4xl" style={{ fontWeight: 400 }}>
              Your edge is one month away.
            </h2>
            <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
              27+ traders are already inside OPA. Live sessions happen every week.
              The community is active every day.
            </p>
            <Button
              onClick={() => navigate("/checkout?plan=monthly")}
              size="lg"
              className="mt-10 bg-primary text-primary-foreground h-12 px-10 rounded-none mono uppercase tracking-widest-editorial text-[11px] font-medium hover:bg-[hsl(var(--brand-deep-brown))] hover:text-[hsl(var(--brand-warm-white))] transition-colors"
              data-testid="button-final-cta"
            >
              Join the Academy — $600/month
            </Button>
            <p className="mt-4 text-[12px] text-muted-foreground mono">
              Cancel anytime. 7-day money-back guarantee.
            </p>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
