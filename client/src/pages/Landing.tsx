import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Logo, WordMark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { NicheBadge, NICHE_META } from "@/components/NicheBadge";
import { VideoThumbnail } from "@/components/VideoThumbnail";
import {
  PlayCircle, Users, Video, Shirt, ArrowRight, Bitcoin, TrendingUp, Target, Globe, Check,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const FEATURED = [
  { name: "TradingView" }, { name: "CoinDesk" }, { name: "Benzinga" }, { name: "Bloomberg" }, { name: "MarketWatch" },
];

const SAMPLE_COURSES = [
  { title: "Market Structure 101", niche: "crypto", locked: false },
  { title: "ES Opening Range Breakout", niche: "futures", locked: true },
  { title: "0DTE SPX: Iron Condors", niche: "options", locked: true },
  { title: "EUR/USD London Session", niche: "forex", locked: true },
  { title: "Risk Management Masterclass", niche: "futures", locked: true },
  { title: "Reading Volume Profile", niche: "futures", locked: true },
];

const TESTIMONIALS = [
  { name: "Jordan H.", city: "Chicago, IL", body: "I'd bounced between Discord servers for two years. The Academy is the first place I've felt treated like a professional — clear curriculum, real practitioners." },
  { name: "Priya K.", city: "Austin, TX", body: "I came in for options and stayed for the community. My 0DTE risk framework got tighter in two weeks than it did in the prior year on my own." },
  { name: "Marcus T.", city: "Toronto, ON", body: "Paid for my lifetime membership in my first full month back on a funded account. The risk discipline alone is worth it." },
];

const FAQ = [
  { q: "Do you offer refunds?", a: "Yes — 14-day money back, no questions asked. After 14 days your lifetime access is non-refundable because you retain perpetual access to all content." },
  { q: "Is financing available?", a: "Yes. You can choose 2-, 3-, or 4-month installment plans at checkout, all totaling $1,100. No interest, no credit check. Payments are split evenly on the same day each month." },
  { q: "Is this for beginners?", a: "Yes. We have beginner-tagged curriculum for all four markets, plus a structured onboarding path that starts with Market Structure 101 and Risk Management." },
  { q: "How long do I have access?", a: "Lifetime. One payment unlocks everything forever: the library, live webinars, the community, and every future addition we build." },
  { q: "When are live sessions?", a: "Weekdays at 9:15am CT (pre-market desk), weekly market open playbooks on Monday, and at least one niche deep-dive per week. Replays are archived in the library." },
  { q: "How fast does merch ship?", a: "Orders ship within 3 business days from our US warehouse. Standard shipping is 4-6 business days in North America, 7-14 internationally." },
];

export default function Landing() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Animated candle particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {Array.from({ length: 14 }).map((_, i) => {
            const left = (i * 7.3) % 100;
            const delay = i * 0.9;
            const hue = i % 2 === 0 ? "89 48% 46%" : "40 28% 55%";
            const up = i % 3 === 0;
            return (
              <span
                key={i}
                className="candle-particle absolute bottom-0 block rounded-sm"
                style={{
                  left: `${left}%`,
                  width: "3px",
                  height: `${20 + (i % 4) * 12}px`,
                  background: `hsl(${hue} / ${up ? 0.35 : 0.20})`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${10 + (i % 5) * 2}s`,
                }}
              />
            );
          })}
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 fade-up">
              <div className="eyebrow mb-5">A TRADING ACADEMY · EST. 2024</div>
              <h1 className="serif text-[2.5rem] leading-[1.05] tracking-tight md:text-[3.75rem] lg:text-[4.25rem]">
                Grow your trading.{" "}
                <span className="italic" style={{ color: "hsl(var(--accent))" }}>Cultivate</span> real profits.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                A premium academy for serious operators. Live desk sessions, an on-demand library, a private community, and a disciplined curriculum across crypto, futures, options, and forex.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/pricing" data-testid="link-hero-join">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 h-12 px-6 text-[15px] font-medium">
                    Become a Member <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
                <Link href="/library" data-testid="link-hero-preview">
                  <Button variant="outline" size="lg" className="h-12 px-6 text-[15px] font-medium border-accent/40 hover:bg-accent/10">
                    <PlayCircle size={16} className="mr-1" />
                    Watch Free Preview
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-2">
                {(["crypto", "futures", "options", "forex"] as const).map((n) => (
                  <NicheBadge key={n} niche={n} size="md" />
                ))}
              </div>
            </div>

            {/* Right: floating logo with ring */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto flex aspect-square max-w-md items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-accent/20" />
                <div className="absolute inset-8 rounded-full border border-accent/15" />
                <div className="absolute inset-16 rounded-full border border-accent/10" />
                {/* floating logo */}
                <div className="relative z-10 animate-[float_6s_ease-in-out_infinite]">
                  <div className="rounded-full" style={{ boxShadow: "0 0 80px 20px hsl(40 28% 55% / 0.18), 0 0 0 1px hsl(40 28% 55% / 0.5)" }}>
                    <Logo size={240} className="!rounded-full" />
                  </div>
                </div>
                {/* decorative candles around */}
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" fill="none">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i / 24) * Math.PI * 2;
                    const r = 185;
                    const x = 200 + Math.cos(angle) * r;
                    const y = 200 + Math.sin(angle) * r;
                    const h = 10 + (i % 5) * 4;
                    const color = i % 3 === 0 ? "#7bac3f" : "#ae9b6c";
                    return <rect key={i} x={x - 1.5} y={y - h / 2} width="3" height={h} fill={color} opacity="0.6" />;
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`@keyframes float { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-10px) } }`}</style>

      {/* SOCIAL PROOF */}
      <section className="border-y border-border/60 bg-muted/40 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="eyebrow mb-6 text-center text-foreground/60">As referenced in</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-foreground/50">
            {FEATURED.map((f) => (
              <span key={f.name} className="serif text-xl md:text-2xl italic opacity-80 hover:opacity-100 transition-opacity">
                {f.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow mb-4">Membership includes</p>
              <h2 className="serif text-4xl md:text-5xl tracking-tight">Everything you need to build a disciplined practice.</h2>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Video, t: "Live Webinars", d: "Weekly market open sessions and niche deep-dives. Replays archived in full." },
              { icon: PlayCircle, t: "On-Demand Library", d: "Hundreds of hours of curriculum across crypto, futures, options, and forex." },
              { icon: Users, t: "Private Community", d: "Real-time chat with the desk plus a focused forum for strategy and review." },
              { icon: Shirt, t: "Merchandise", d: "Members-only discount on the full apparel line. Shipped from our US warehouse." },
            ].map((b, i) => (
              <Reveal key={b.t} delay={i * 80}>
                <div className="gold-glow rounded-xl border border-card-border bg-card p-6 h-full">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/15 text-accent">
                    <b.icon size={18} strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 text-xl font-medium">{b.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4 MARKETS */}
      <section className="border-y border-border/60 bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div className="max-w-xl">
                <p className="eyebrow mb-4">The Four Markets</p>
                <h2 className="serif text-4xl md:text-5xl tracking-tight">Master every environment.</h2>
              </div>
              <p className="max-w-md text-muted-foreground text-sm leading-relaxed">
                Each track is a complete curriculum, not a one-off video series. Structured from first principles to advanced desk-grade tactics.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(["crypto", "futures", "options", "forex"] as const).map((n, i) => {
              const meta = NICHE_META[n];
              const Icon = meta.icon;
              const blurbs: Record<string, string> = {
                crypto: "Spot, perps, and on-chain flow. Liquidity-driven setups across BTC, ETH, and major alts.",
                futures: "ES, NQ, CL, GC. Opening range, volume profile, and prop-firm ready risk frameworks.",
                options: "0DTE spreads to LEAPS. Greeks, vol, and premium selling with defined risk.",
                forex: "London and NY sessions, macro flows, and smart-money concepts applied to the majors.",
              };
              return (
                <Reveal key={n} delay={i * 100}>
                  <div className={`${meta.className} gold-glow rounded-xl border p-6 h-full bg-card`}>
                    <div
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md"
                      style={{ background: `hsl(var(--niche) / 0.18)`, color: `hsl(var(--niche))` }}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                    </div>
                    <h3 className="mt-5 text-xl font-medium serif">{meta.label}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{blurbs[n]}</p>
                    <Link href="/library" data-testid={`link-market-${n}`}>
                      <a className="mt-4 inline-flex items-center gap-1 text-xs font-medium hover:text-accent" style={{ color: "hsl(var(--niche))" }}>
                        Explore track <ArrowRight size={12} />
                      </a>
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CURRICULUM PREVIEW */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="eyebrow mb-4">Curriculum preview</p>
                <h2 className="serif text-4xl md:text-5xl tracking-tight">A small taste of what's inside.</h2>
              </div>
              <Link href="/pricing" data-testid="link-curriculum-join"><Button variant="outline" className="border-accent/40 hover:bg-accent/10">Unlock the library</Button></Link>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_COURSES.map((c, i) => (
              <Reveal key={c.title} delay={i * 60}>
                <VideoThumbnail niche={c.niche} title={c.title} locked={c.locked} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTOR / FOUNDER */}
      <section className="border-y border-border/60 bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-5 items-center">
            <Reveal className="md:col-span-2">
              <div className="relative mx-auto w-full max-w-xs aspect-square rounded-2xl border border-accent/30 bg-gradient-to-br from-brand-navy to-brand-navy/60 flex items-center justify-center overflow-hidden">
                <Logo size={160} />
                <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 80px rgba(174,155,108,0.15)" }} />
              </div>
            </Reveal>
            <div className="md:col-span-3">
              <Reveal>
                <p className="eyebrow mb-4">The desk</p>
                <h2 className="serif text-4xl md:text-5xl tracking-tight">Taught by practitioners, not influencers.</h2>
                <p className="mt-5 text-muted-foreground text-[15px] leading-relaxed max-w-xl">
                  Our instructors are former prop and institutional traders who still run risk daily. You'll learn from people whose P&L has a cost basis — not from content creators chasing a hook.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
                  {[
                    "15+ years combined desk experience",
                    "Funded across 4 prop firms",
                    "Published curriculum since 2018",
                    "No affiliate marketing, ever",
                  ].map((p) => (
                    <div key={p} className="flex items-start gap-2 text-sm text-foreground/85">
                      <Check size={14} className="mt-0.5 text-primary shrink-0" strokeWidth={2.4} />
                      {p}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="max-w-xl mb-14">
              <p className="eyebrow mb-4">Member voices</p>
              <h2 className="serif text-4xl md:text-5xl tracking-tight">Real results, from people doing the work.</h2>
            </div>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <figure className="gold-glow rounded-xl border border-card-border bg-card p-7 h-full flex flex-col">
                  <blockquote className="text-[15px] leading-relaxed text-foreground/90 flex-1 serif italic">
                    "{t.body}"
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{t.city}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="border-y border-border/60 bg-muted/40 py-24" id="pricing">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow mb-4">Lifetime membership</p>
              <h2 className="serif text-4xl md:text-5xl tracking-tight">One payment. Forever access.</h2>
              <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
                No subscriptions. No upsells. Choose your payment cadence — it all totals the same $1,100.
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-14">
            <div className="rounded-2xl border border-accent/40 bg-card p-8 md:p-12 gold-glow">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="eyebrow text-accent">Organic Profits Academy</div>
                  <h3 className="serif text-4xl mt-3">Lifetime Access</h3>
                  <p className="mt-2 text-muted-foreground text-sm">One-time payment. Perpetual membership.</p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="serif text-6xl">$1,100</span>
                    <span className="text-muted-foreground text-sm">one-time</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Or split into 2, 3, or 4 monthly payments.</p>
                  <Link href="/pricing" data-testid="link-pricing-join">
                    <Button size="lg" className="mt-8 w-full bg-primary text-primary-foreground font-medium h-12">
                      Join the Academy
                    </Button>
                  </Link>
                </div>
                <ul className="space-y-3">
                  {[
                    "Full on-demand video library across all 4 markets",
                    "Live daily pre-market desk sessions",
                    "Weekly niche deep-dive webinars with replays",
                    "Private community: real-time chat + forum",
                    "15% off the full merchandise line",
                    "14-day money-back guarantee",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm">
                      <Check size={16} className="mt-0.5 text-primary shrink-0" strokeWidth={2.4} />
                      <span className="text-foreground/90">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <p className="eyebrow mb-4">Frequently asked</p>
              <h2 className="serif text-4xl md:text-5xl tracking-tight">Before you join.</h2>
            </div>
          </Reveal>
          <Accordion type="single" collapsible className="border-t border-border">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border">
                <AccordionTrigger className="text-left serif text-lg py-5" data-testid={`faq-trigger-${i}`}>{f.q}</AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground text-[15px] leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </Layout>
  );
}
