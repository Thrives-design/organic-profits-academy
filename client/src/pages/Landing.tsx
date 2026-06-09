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
  TrendingUp,
  Shield,
  Zap,
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
    title: "Recorded Webinars for Study",
    desc: "Every session is recorded and available on demand. Watch at your own pace, rewatch setups as many times as you need.",
  },
  {
    icon: Radio,
    title: "Live Desk Sessions",
    desc: "Trade alongside Byron and the team in real time. Watch the setups form, ask questions as they happen.",
  },
  {
    icon: MessagesSquare,
    title: "The Telegram House",
    desc: "11 active channels — Trade Ideas, Profits, Digital Downloads, OPA Events and more. A community that actually shows up.",
  },
  {
    icon: FolderDown,
    title: "Digital Resources",
    desc: "PDFs, backtests, templates. Everything to grow your toolkit as you grow your account.",
  },
];

const PILLARS = [
  {
    icon: TrendingUp,
    title: "Consistent Edge",
    desc: "We don't teach theory. We teach repeatable setups that work on USD/JPY, BTC, and the majors — the same ones Byron trades every week.",
  },
  {
    icon: Shield,
    title: "Risk-First Mindset",
    desc: "Before a single entry, you learn to protect capital. Risk management is the curriculum, not a footnote.",
  },
  {
    icon: Zap,
    title: "Real-Time Access",
    desc: "When the market moves, you're not watching from the sidelines. You're in the live desk, in the chat, in the session.",
  },
];

const TESTIMONIALS = [
  {
    body:
      "I had $350 yesterday — turned it into $700+. Goal is to keep stacking this account.",
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
    q: "What do I get for $600/month?",
    a: "Full access to every live desk session, the complete recorded webinar library, all 11 Telegram channels, weekly deep-dives, and every digital resource we publish — for as long as you're a member.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel before your next billing date and you won't be charged again. No contracts, no lock-in.",
  },
  {
    q: "Do I need trading experience to join?",
    a: "No. Members range from brand-new to funded account holders. The curriculum meets you where you are.",
  },
  {
    q: "What markets does the academy cover?",
    a: "Crypto (BTC, ETH, majors), Forex (USD/JPY, EUR/USD, and more), and Options (0DTE through LEAPS). One membership, three complete tracks.",
  },
  {
    q: "How does the Telegram community work?",
    a: "You get a direct invite to our private Telegram house — 11 channels, real conversations, and direct access to Byron and every active member.",
  },
  {
    q: "Is this financial advice?",
    a: "No. OPA is an education platform. We teach discipline, setups, and risk management. Everything is for educational purposes only.",
  },
  {
    q: "What is your refund policy?",
    a: "If within 7 days you haven't found value, email support@organicprofitsacademy.com for a full refund. We stand behind the academy.",
  },
];

function HeroAmbient() {
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
      {/* ==================== HERO ==================== */}
      <section
        className="relative min-h-[90svh] flex items-center overflow-hidden"
        data-testid="section-hero"
      >
        <HeroAmbient />
        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10 py-14 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left — copy */}
            <div className="lg:col-span-7 fade-up">
              <p className="eyebrow mb-7 text-accent">
                ORGANIC PROFITS ACADEMY — PREMIUM MEMBERSHIP
              </p>
              <h1 className="display-hero">
                <span className="block" style={{ fontWeight: 500 }}>
                  Trade with an edge.
                </span>
                <span className="block italic opacity-90">Not a guess.</span>
              </h1>
              <p className="mt-6 serif italic text-2xl md:text-[1.7rem] leading-snug text-foreground/80">
                Live sessions. Real setups. A community that wins together.
              </p>
              <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                Join a private trading academy led by Byron — a full-time trader with years
                of experience in crypto, forex, and options. Get live desk access, 40+
                on-demand webinars, and a tight-knit Telegram community for one flat rate.
              </p>

              {/* Price callout */}
              <div className="mt-10 inline-flex items-baseline gap-3 bg-[hsl(var(--brand-deep-brown))] border border-[hsl(var(--brand-gold))] px-8 py-5">
                <span className="serif text-5xl tracking-tight text-[hsl(var(--brand-warm-white))]" style={{ fontWeight: 400 }}>$600</span>
                <span className="mono text-[12px] uppercase tracking-widest-editorial text-[hsl(var(--brand-gold))]">/&nbsp;month</span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/pricing" data-testid="link-hero-join">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground h-12 px-8 rounded-none mono uppercase tracking-widest-editorial text-[11px] font-medium hover:bg-[hsl(var(--brand-deep-brown))] hover:text-[hsl(var(--brand-warm-white))] transition-colors"
                  >
                    Join the Academy — $600/mo
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

              <p className="mt-5 text-[12px] text-muted-foreground mono">
                Cancel anytime. No contracts. 7-day money-back guarantee.
              </p>
            </div>

            {/* Right — logo */}
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

        {/* Niche strip */}
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
              { stat: "27+", label: "Active Members" },
              { stat: "100%", label: "Recorded Webinars" },
              { stat: "$600", label: "Per Month, All-In" },
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

      {/* ==================== WHY OPA ==================== */}
      <section className="py-20 lg:py-24" data-testid="section-why">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-14">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-5">01 — Why OPA</p>
              </div>
              <div className="lg:col-span-8">
                <h2 className="display-xl serif">
                  Most traders fail<br />
                  <span className="italic">because they trade alone.</span>
                </h2>
                <p className="mt-5 max-w-lg text-muted-foreground text-[15px] leading-relaxed">
                  OPA exists to change that. Real mentorship, real-time sessions, and a
                  community of traders who hold each other accountable — not a course you
                  buy and forget.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div
                  className="bg-card border border-border p-8 lg:p-10 h-full transition-colors hover:border-[hsl(var(--brand-brown))]"
                  data-testid={`pillar-${i}`}
                >
                  <p.icon
                    size={22}
                    strokeWidth={1.5}
                    className="text-[hsl(var(--brand-brown))]"
                  />
                  <h3 className="serif text-2xl mt-5 leading-tight" style={{ fontWeight: 400 }}>
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== THE 3 MARKETS ==================== */}
      <section className="py-20 lg:py-24 bg-[hsl(var(--brand-silver-cream))]" data-testid="section-markets">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-14">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-5">02 — The 3 Markets</p>
              </div>
              <div className="lg:col-span-8">
                <h2 className="display-xl serif">
                  Three markets.<br />
                  <span className="italic">One standard.</span>
                </h2>
                <p className="mt-5 max-w-md text-muted-foreground text-[15px] leading-relaxed">
                  Each track is a complete curriculum — first principles through
                  advanced, desk-grade tactics. One membership covers all three.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-1 md:grid-cols-3">
            {MARKETS.map((m, i) => (
              <Reveal key={m.key} delay={i * 80}>
                <Link href="/pricing">
                  <a
                    className="group relative block overflow-hidden aspect-[3/4] md:aspect-[4/5] border border-border transition-all duration-500 hover:border-[hsl(var(--brand-brown))]"
                    data-testid={`market-${m.key}`}
                  >
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
                        Join now <ArrowRight size={12} />
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
        className="py-20 lg:py-24"
        data-testid="section-inside"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-14">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-5">03 — Inside the Academy</p>
              </div>
              <div className="lg:col-span-8">
                <h2 className="display-xl serif">
                  Everything you need.<br />
                  <span className="italic">Nothing you don't.</span>
                </h2>
                <p className="mt-5 max-w-md text-muted-foreground text-[15px] leading-relaxed">
                  Every tool, session, and resource is included in your $600/month membership.
                  No upsells. No tiers.
                </p>
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
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== REAL WINS ==================== */}
      <section className="py-20 lg:py-24 bg-[hsl(var(--brand-silver-cream))]" data-testid="section-wins">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-14">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-5">04 — Real Wins</p>
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

      {/* ==================== VIDEO TESTIMONIALS ==================== */}
      <section className="py-20 lg:py-24" data-testid="section-video-testimonials">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-14">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-5">05 — Member Stories</p>
              </div>
              <div className="lg:col-span-8">
                <h2 className="display-xl serif">
                  Hear it from<br />
                  <span className="italic">the members.</span>
                </h2>
                <p className="mt-5 max-w-md text-muted-foreground text-[15px] leading-relaxed">
                  Real traders. Real results. Watch what OPA members have to say about their experience.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                label: "Jacob A. — Passed His Funded Challenge",
                sub: "From $350 to $700+ in one session",
                placeholder: true,
                n: "01",
              },
              {
                label: "Wyskii — Catching On",
                sub: "Starting to understand the full picture",
                placeholder: true,
                n: "02",
              },
              {
                label: "Marcus L. — Accountability",
                sub: "Found the community he couldn't find elsewhere",
                placeholder: true,
                n: "03",
              },
            ].map((v, i) => (
              <Reveal key={i} delay={i * 80}>
                <div
                  className="group border border-border bg-card overflow-hidden transition-colors hover:border-[hsl(var(--brand-brown))]"
                  data-testid={`video-${i}`}
                >
                  {/* Video embed placeholder — replace src with real YouTube/Loom embed URLs */}
                  <div className="relative aspect-video bg-[hsl(var(--brand-deep-brown))] flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20"
                      style={{
                        background: `linear-gradient(135deg, hsl(32 24% 22%) 0%, hsl(40 28% 40%) 100%)`,
                      }}
                    />
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-[hsl(var(--brand-gold)/0.9)] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="hsl(var(--brand-deep-brown))" className="w-6 h-6 ml-1">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                      <span className="serif text-[hsl(var(--brand-warm-white))] text-sm opacity-80">Member Story {v.n}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="eyebrow text-[11px] text-[hsl(var(--brand-brown))] mb-2">{v.label}</div>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">{v.sub}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-[12px] text-muted-foreground">
            Add your video URLs in the member dashboard to display real testimonial embeds here.
          </p>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== PROFIT GALLERY ==================== */}
      <section className="py-20 lg:py-24 bg-[hsl(var(--brand-silver-cream))]" data-testid="section-profits">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-14">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-5">06 — Proof of Profits</p>
              </div>
              <div className="lg:col-span-8">
                <h2 className="display-xl serif">
                  The trades<br />
                  <span className="italic">speak for themselves.</span>
                </h2>
                <p className="mt-5 max-w-md text-muted-foreground text-[15px] leading-relaxed">
                  Screenshots from live sessions and member accounts. These are real trades, real results.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Masonry-style profit gallery — replace bg placeholders with <img src="..."> tags */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {[
              { h: "aspect-[3/4]", label: "USD/JPY Long" },
              { h: "aspect-square", label: "BTC Breakout" },
              { h: "aspect-[4/3]", label: "EUR/USD Short" },
              { h: "aspect-[3/4]", label: "Funded Challenge Pass" },
              { h: "aspect-square", label: "Crypto Scalp" },
              { h: "aspect-[4/5]", label: "Options Premium" },
              { h: "aspect-[3/4]", label: "Weekly P&L" },
              { h: "aspect-square", label: "Member Win" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 50}>
                <div
                  className={`relative ${item.h} w-full mb-4 break-inside-avoid border border-border overflow-hidden group cursor-pointer`}
                  data-testid={`profit-${i}`}
                >
                  {/* Replace this div with: <img src="/your-screenshot.png" alt={item.label} className="w-full h-full object-cover" /> */}
                  <div
                    className="absolute inset-0 flex items-end"
                    style={{
                      background: i % 2 === 0
                        ? "linear-gradient(160deg, hsl(32 24% 20%) 0%, hsl(40 28% 38%) 100%)"
                        : "linear-gradient(160deg, hsl(200 36% 14%) 0%, hsl(32 24% 28%) 100%)",
                    }}
                  >
                    <div className="w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <span className="eyebrow text-[10px] text-[hsl(var(--brand-gold))]">{item.label}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="mono text-[10px] uppercase tracking-widest-editorial text-white">View</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-10 text-center text-[12px] text-[hsl(var(--brand-brown)/0.75)]">
            Educational only. Past results do not guarantee future performance.
          </p>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== MEMBERSHIP CTA ==================== */}
      <section
        className="py-20 lg:py-24"
        data-testid="section-pricing"
      >
        <div className="mx-auto max-w-lg px-6 text-center">
          <Reveal>
            <p className="eyebrow mb-6">07 — Join the Academy</p>
            <div
              className="bg-card border border-[hsl(var(--brand-gold))] p-10 md:p-12"
              data-testid="card-pricing"
            >
              <div className="eyebrow mb-4">Monthly Membership</div>
              <div className="flex items-baseline justify-center gap-3">
                <div
                  className="serif text-6xl md:text-7xl tracking-tight"
                  style={{ fontWeight: 400 }}
                >
                  $600
                </div>
                <span className="mono text-[12px] uppercase tracking-widest-editorial text-muted-foreground">/ month</span>
              </div>
              <p className="mt-3 text-sm text-[hsl(var(--brand-brown))]">
                Cancel anytime. No contracts. No hidden fees.
              </p>

              <div className="hairline my-10" />

              <div className="space-y-2 text-left">
                {[
                  "Recorded webinars across all 3 markets — study anytime",
                  "Live desk sessions every week",
                  "11-channel private Telegram house",
                  "Digital resources, PDFs & backtests",
                  "Direct access to Byron",
                  "All future content included",
                  "7-day money-back guarantee",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 py-2"
                  >
                    <Check size={14} className="text-[hsl(var(--brand-green))] shrink-0" strokeWidth={2.5} />
                    <span className="text-[14px] leading-relaxed text-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/pricing" data-testid="link-pricing-reserve">
                <Button
                  size="lg"
                  className="mt-10 w-full bg-primary text-primary-foreground hover:bg-[hsl(var(--brand-deep-brown))] hover:text-[hsl(var(--brand-warm-white))] transition-colors h-12 rounded-none mono uppercase tracking-widest-editorial text-[11px] font-medium"
                >
                  Start Today — $600/month
                </Button>
              </Link>
              <p className="mt-4 text-[12px] text-muted-foreground mono">
                Billed monthly. Cancel before next billing date.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== FAQ ==================== */}
      <section className="py-20 lg:py-24 bg-[hsl(var(--brand-silver-cream))]" data-testid="section-faq">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-10">
              <p className="eyebrow mb-5">08 — Frequently Asked</p>
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

          {/* Final CTA */}
          <Reveal>
            <div className="mt-20 text-center">
              <h2 className="serif text-3xl md:text-4xl" style={{ fontWeight: 400 }}>
                Ready to trade with a real edge?
              </h2>
              <p className="mt-4 text-muted-foreground text-[15px]">
                Join 27+ traders who are actively building their accounts inside OPA.
              </p>
              <Link href="/pricing">
                <Button
                  size="lg"
                  className="mt-8 bg-primary text-primary-foreground h-12 px-10 rounded-none mono uppercase tracking-widest-editorial text-[11px] font-medium hover:bg-[hsl(var(--brand-deep-brown))] hover:text-[hsl(var(--brand-warm-white))] transition-colors"
                >
                  Join the Academy — $600/mo
                </Button>
              </Link>
              <p className="mt-4 text-[12px] text-muted-foreground mono">
                Cancel anytime. 7-day money-back guarantee.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
