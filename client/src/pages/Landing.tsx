import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import {
  ArrowRight,
  Video,
  MessagesSquare,
  Radio,
  FolderDown,
  Check,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MARKETS = [
  {
    n: "01",
    key: "crypto",
    name: "Crypto Trading",
    desc: "Spot, perpetuals, and on-chain flow. Liquidity-driven setups across BTC, ETH, and majors.",
  },
  {
    n: "02",
    key: "forex",
    name: "Forex",
    desc: "London and New York sessions, macro flows, and smart-money concepts on the major pairs.",
  },
  {
    n: "03",
    key: "options",
    name: "Options",
    desc: "0DTE spreads to LEAPS. Greeks, volatility, and premium selling with defined risk.",
  },
];

const INSIDE = [
  {
    icon: Video,
    title: "37+ Webinars & Counting",
    desc: "Every webinar you've missed, replayable anytime. New sessions weekly.",
  },
  {
    icon: Radio,
    title: "Live Desk Sessions",
    desc: "Trade alongside Byron and the team in real time. Ask questions as they happen.",
  },
  {
    icon: MessagesSquare,
    title: "The Telegram House",
    desc: "11 active channels — Trade Ideas, Profits, Digital Downloads, OPA Events and more. 27+ traders. A community that actually shows up.",
  },
  {
    icon: FolderDown,
    title: "Digital Resources",
    desc: "PDFs, backtests, templates. Grow your toolkit as you grow your account.",
  },
];

const TESTIMONIALS = [
  {
    body:
      "I had $350 yesterday — turned it into $700+. Goal is to keep stacking this account. 💯",
    name: "Jacob A.",
    sub: "Funded account holder",
  },
  {
    body: "Passed my funded account certificate yesterday. My guy going crazy 🔥",
    name: "Jacob A.",
    sub: "Passed funded challenge, April 2026",
  },
  {
    body:
      "Starting to catch on more, now understanding more when you say paint the picture you see.",
    name: "Wyskii",
    sub: "Member since Jan 2026",
  },
  {
    body:
      "Small group, big accountability. We actually check in on each other's setups. Hadn't found that anywhere else.",
    name: "Marcus L.",
    sub: "Member since Feb 2026",
  },
];

const FAQ = [
  {
    q: "How does the Telegram community work?",
    a: "Once you join, you get a direct invite link to our private Telegram. 11 channels, real conversations, and you can message anyone — including Byron — directly.",
  },
  {
    q: "What's actually in the webinar library?",
    a: "37+ recorded webinars spanning crypto, forex, and options — from beginner breakdowns to advanced setups. New sessions added weekly.",
  },
  {
    q: "Do I need to be experienced to join?",
    a: "No. Members range from brand-new to funded account holders. The community is set up for everyone to grow.",
  },
  {
    q: "How do the payment plans work?",
    a: "Pick 2, 3, or 4 months at checkout. Same total — $1,100 — split into equal payments. No interest, no hidden fees.",
  },
  {
    q: "Is this financial advice?",
    a: "No. We teach discipline, setups, and risk management. Everything you learn is educational.",
  },
  {
    q: "What if I want a refund?",
    a: "We stand behind the Academy. If within 7 days you haven't found value, email support@organicprofitsacademy.com for a full refund.",
  },
];

const PLANS = [
  { id: "full", label: "Pay in full", price: "$1,100 today" },
  { id: "2mo", label: "2 months", price: "$550 × 2" },
  { id: "3mo", label: "3 months", price: "$367 × 3" },
  { id: "4mo", label: "4 months", price: "$275 × 4" },
];

function HeroAmbient() {
  // Slow rising hairlines — softer in light mode.
  const lines = Array.from({ length: 10 }).map((_, i) => ({
    left: (i * 9.7) % 100,
    delay: i * 1.8,
    dur: 22 + (i % 5) * 2,
    h: 60 + (i % 4) * 40,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {lines.map((l, i) => (
        <span
          key={i}
          className="ambient-line absolute bottom-0"
          style={{
            left: `${l.left}%`,
            width: "1px",
            height: `${l.h}px`,
            background:
              "linear-gradient(to top, transparent, hsl(var(--accent) / 0.35), transparent)",
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

function scrollToInside() {
  const el = document.getElementById("inside-academy");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Landing() {
  return (
    <Layout>
      {/* ==================== HERO — ~85vh, warm welcoming ==================== */}
      <section
        className="relative min-h-[85svh] flex items-center overflow-hidden"
        data-testid="section-hero"
      >
        <HeroAmbient />
        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10 py-14 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left — copy */}
            <div className="lg:col-span-7 fade-up">
              <p className="eyebrow mb-7 text-accent">
                ORGANIC PROFITS ACADEMY — HOUSTON, TX
              </p>
              <h1 className="display-hero">
                <span className="block" style={{ fontWeight: 500 }}>
                  A real traders'
                </span>
                <span className="block italic opacity-90">community.</span>
              </h1>
              <p className="mt-6 serif italic text-2xl md:text-[1.7rem] leading-snug text-foreground/80">
                Real wins. Real homies.
              </p>
              <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                A private academy for disciplined traders across crypto, forex, and
                options. Live sessions, a growing library of 37+ webinars, and a
                tight-knit Telegram community of 27+ members who actually show up
                for each other.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/pricing" data-testid="link-hero-join">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground h-12 px-8 rounded-none mono uppercase tracking-widest-editorial text-[11px] font-medium hover:bg-[hsl(var(--brand-deep-brown))] hover:text-[hsl(var(--brand-warm-white))] transition-colors"
                  >
                    Become a Member
                  </Button>
                </Link>
                <button
                  onClick={scrollToInside}
                  data-testid="link-hero-preview"
                  className="h-12 px-8 rounded-none border border-[hsl(var(--brand-brown))] bg-transparent hover:bg-[hsl(var(--brand-brown)/0.08)] mono uppercase tracking-widest-editorial text-[11px] font-medium text-foreground transition-colors"
                >
                  See What's Inside
                </button>
              </div>
            </div>

            {/* Right — logo, floating, kept on desktop */}
            <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
              <div className="relative aspect-square w-full max-w-[420px] flex items-center justify-center">
                <div className="absolute inset-6 border border-[hsl(var(--accent)/0.18)]" />
                <div className="absolute inset-16 border border-[hsl(var(--accent)/0.12)]" />
                <div className="absolute inset-28 border border-[hsl(var(--accent)/0.08)]" />
                <div className="relative z-10 opacity-95">
                  <Logo size={200} className="!rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Niche strip at bottom */}
        <div className="absolute bottom-0 left-0 right-0 hairline-top py-5 px-6 lg:px-10">
          <div className="mx-auto max-w-7xl flex items-center justify-center gap-6 md:gap-12 eyebrow flex-wrap">
            <span>Crypto Trading</span>
            <span className="text-[hsl(var(--accent)/0.5)]">—</span>
            <span>Forex</span>
            <span className="text-[hsl(var(--accent)/0.5)]">—</span>
            <span>Options</span>
          </div>
        </div>
      </section>

      {/* ==================== STATS STRIP ==================== */}
      <section
        className="py-14 lg:py-16 bg-[hsl(var(--brand-silver-cream))]"
        data-testid="section-stats"
      >
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="grid grid-cols-3 gap-6 md:gap-12 text-center">
            {[
              { stat: "27+", label: "Members" },
              { stat: "37+", label: "Webinars" },
              { stat: "1", label: "Private House" },
            ].map((s) => (
              <div key={s.label}>
                <div className="serif text-5xl md:text-6xl tracking-tight" style={{ fontWeight: 400 }}>
                  {s.stat}
                </div>
                <div className="mt-3 eyebrow text-[hsl(var(--brand-brown))]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== THE 3 MARKETS ==================== */}
      <section className="py-20 lg:py-24" data-testid="section-markets">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-14">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-5">01 — The 3 Markets</p>
              </div>
              <div className="lg:col-span-8">
                <h2 className="display-xl serif">
                  Three markets.<br />
                  <span className="italic">One standard.</span>
                </h2>
                <p className="mt-5 max-w-md text-muted-foreground text-[15px] leading-relaxed">
                  Each track is a complete curriculum — first principles through
                  advanced, desk-grade tactics.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-1 md:grid-cols-3">
            {MARKETS.map((m, i) => (
              <Reveal key={m.key} delay={i * 80}>
                <Link href="/library">
                  <a
                    className="group relative block overflow-hidden aspect-[3/4] md:aspect-[4/5] border border-border transition-all duration-500 hover:border-[hsl(var(--brand-brown))]"
                    data-testid={`market-${m.key}`}
                  >
                    {/* warm gradient placeholder using brown family */}
                    <div
                      className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
                      style={{
                        background:
                          i === 0
                            ? "linear-gradient(160deg, hsl(32 24% 22%) 0%, hsl(32 24% 32%) 65%, hsl(40 28% 50%))"
                            : i === 1
                            ? "linear-gradient(160deg, hsl(32 18% 38%) 0%, hsl(40 24% 52%) 65%, hsl(42 30% 80%))"
                            : "linear-gradient(160deg, hsl(32 24% 28%) 0%, hsl(207 30% 26%) 60%, hsl(40 28% 48%))",
                      }}
                    />
                    <svg
                      className="absolute inset-0 h-full w-full opacity-15"
                      viewBox="0 0 400 500"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M0,400 L60,360 L120,380 L180,320 L240,340 L300,260 L360,290 L400,240"
                        stroke="hsl(42 44% 97%)"
                        strokeWidth="1"
                      />
                      <path
                        d="M0,430 L70,400 L140,420 L210,360 L280,380 L360,320 L400,340"
                        stroke="hsl(42 44% 97%)"
                        strokeWidth="1"
                        opacity="0.55"
                      />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                    <div
                      className="absolute top-7 left-7 serif text-[4.5rem] leading-none text-[hsl(42_44%_97%)] opacity-90"
                      style={{ fontWeight: 300 }}
                    >
                      {m.n}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-7">
                      <h3 className="serif text-2xl md:text-3xl text-[hsl(42_44%_97%)]">
                        {m.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed max-w-xs text-[hsl(42_44%_97%)]/90">
                        {m.desc}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-2 eyebrow text-[hsl(40_28%_85%)]">
                        Explore track <ArrowRight size={12} />
                      </div>
                    </div>
                  </a>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== INSIDE THE ACADEMY ==================== */}
      <section
        id="inside-academy"
        className="py-20 lg:py-24 bg-[hsl(var(--brand-silver-cream))]"
        data-testid="section-inside"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-14">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-5">02 — Inside the Academy</p>
              </div>
              <div className="lg:col-span-8">
                <h2 className="display-xl serif">
                  Everything you need.<br />
                  <span className="italic">Nothing you don't.</span>
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {INSIDE.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div
                  className="bg-card border border-border p-8 lg:p-10 h-full transition-colors hover:border-[hsl(var(--brand-brown))]"
                  data-testid={`inside-${i}`}
                >
                  <item.icon
                    size={22}
                    strokeWidth={1.5}
                    className="text-[hsl(var(--brand-brown))]"
                  />
                  <h3
                    className="serif text-2xl md:text-[1.75rem] mt-5 leading-tight"
                    style={{ fontWeight: 400 }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                  <Link
                    href={i === 2 ? "/community" : "/library"}
                    data-testid={`inside-link-${i}`}
                  >
                    <a className="mt-6 inline-flex items-center gap-2 mono text-[11px] uppercase tracking-widest-editorial text-[hsl(var(--brand-brown))] hover:text-foreground transition-colors">
                      Learn more <ArrowRight size={12} />
                    </a>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== REAL WINS ==================== */}
      <section className="py-20 lg:py-24" data-testid="section-wins">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-14">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-5">03 — Real Wins</p>
              </div>
              <div className="lg:col-span-8">
                <h2 className="display-xl serif">
                  Members. <span className="italic">In their own words.</span>
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 60}>
                <figure
                  className="bg-card border border-border p-8 lg:p-10 h-full"
                  data-testid={`win-${i}`}
                >
                  <blockquote className="serif text-xl md:text-[1.4rem] leading-snug text-foreground">
                    &ldquo;{t.body}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6">
                    <div className="mono text-[11px] uppercase tracking-widest-editorial text-[hsl(var(--brand-brown))]">
                      {t.name}
                    </div>
                    <div className="mt-1 text-[12px] text-muted-foreground">{t.sub}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <p className="mt-10 text-center text-[12px] text-[hsl(var(--brand-brown)/0.75)]">
            Educational — not financial advice. Individual results vary.
          </p>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== MEMBERSHIP ==================== */}
      <section
        className="py-20 lg:py-24 bg-[hsl(var(--brand-silver-cream))]"
        data-testid="section-pricing"
      >
        <div className="mx-auto max-w-lg px-6 text-center">
          <Reveal>
            <p className="eyebrow mb-6">04 — Lifetime Membership</p>
            <div
              className="bg-card border border-[hsl(var(--brand-gold))] p-10 md:p-12"
              data-testid="card-pricing"
            >
              <div className="eyebrow mb-4">Lifetime Membership</div>
              <div
                className="serif text-6xl md:text-7xl tracking-tight"
                style={{ fontWeight: 400 }}
              >
                $1,100
              </div>
              <p className="mt-3 text-sm text-[hsl(var(--brand-brown))]">
                One payment. Or split it over 2, 3, or 4 months.
              </p>

              <div className="hairline my-10" />

              <div className="space-y-2 text-left">
                {PLANS.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-3 hairline-bottom last:border-b-0"
                    data-testid={`plan-${p.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full border border-[hsl(var(--brand-brown))]" />
                      <span className="mono uppercase tracking-wider-editorial text-[11px]">
                        {p.label}
                      </span>
                    </div>
                    <span className="mono text-[11px] text-muted-foreground uppercase tracking-wider-editorial">
                      {p.price}
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/pricing" data-testid="link-pricing-reserve">
                <Button
                  size="lg"
                  className="mt-10 w-full bg-primary text-primary-foreground hover:bg-[hsl(var(--brand-deep-brown))] hover:text-[hsl(var(--brand-warm-white))] transition-colors h-12 rounded-none mono uppercase tracking-widest-editorial text-[11px] font-medium"
                >
                  Reserve Your Spot
                </Button>
              </Link>
            </div>

            {/* Badge row */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {[
                "Lifetime access",
                "All future content",
                "Direct Telegram invite",
                "No recurring fees",
              ].map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-2 mono text-[11px] uppercase tracking-wider-editorial text-[hsl(var(--brand-brown))]"
                >
                  <Check size={12} className="text-[hsl(var(--brand-green))]" strokeWidth={2} />
                  {b}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== FAQ ==================== */}
      <section className="py-20 lg:py-24" data-testid="section-faq">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-10">
              <p className="eyebrow mb-5">05 — Frequently Asked</p>
              <h2 className="display-xl serif">
                Before <span className="italic">you join.</span>
              </h2>
            </div>
          </Reveal>
          <Accordion type="single" collapsible className="hairline-top">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="hairline-bottom border-0">
                <AccordionTrigger
                  className="text-left py-6 hover:no-underline"
                  data-testid={`faq-trigger-${i}`}
                >
                  <div className="flex items-baseline gap-5 w-full">
                    <span className="eyebrow shrink-0 pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="serif text-xl md:text-2xl tracking-tight"
                      style={{ fontWeight: 400 }}
                    >
                      {f.q}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pl-14 text-muted-foreground text-[15px] leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </Layout>
  );
}
