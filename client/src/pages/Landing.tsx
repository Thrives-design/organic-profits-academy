import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const MARKETS = [
  {
    n: "01",
    key: "crypto",
    name: "Crypto Trading",
    desc: "Spot, perpetuals, and on-chain flow. Liquidity-driven setups across BTC, ETH, and major alts.",
  },
  {
    n: "02",
    key: "forex",
    name: "Forex",
    desc: "London and New York sessions, macro flows, and smart-money concepts applied to the majors.",
  },
  {
    n: "03",
    key: "options",
    name: "Options",
    desc: "0DTE spreads to LEAPS. Greeks, volatility, and premium selling with defined risk.",
  },
];

const CURRICULUM = [
  { n: "01", total: "24", title: "Market Structure 101", niche: "Crypto" },
  { n: "02", total: "24", title: "The Greeks for Directional Traders", niche: "Options" },
  { n: "03", total: "24", title: "EUR/USD London Session Playbook", niche: "Forex" },
  { n: "04", total: "24", title: "BTC Liquidity Sweeps & Order Blocks", niche: "Crypto" },
  { n: "05", total: "24", title: "Selling Premium in High IV Environments", niche: "Options" },
  { n: "06", total: "24", title: "Smart Money Concepts in FX", niche: "Forex" },
  { n: "07", total: "24", title: "LEAPS: Long-Dated Calls", niche: "Options" },
  { n: "08", total: "24", title: "On-Chain Flow for Swing Trades", niche: "Crypto" },
];

const TESTIMONIALS = [
  {
    body: "I'd bounced between Discord servers for two years. The Academy is the first place I've felt treated like a professional — clear curriculum, real practitioners.",
    name: "Jordan H.",
    city: "Chicago, IL",
  },
  {
    body: "I came in for options and stayed for the community. My 0DTE risk framework got tighter in two weeks than it did in the prior year on my own.",
    name: "Priya K.",
    city: "Austin, TX",
  },
  {
    body: "Paid for my lifetime membership in my first full month back on a funded account. The risk discipline alone is worth it.",
    name: "Marcus T.",
    city: "Toronto, ON",
  },
];

const FAQ = [
  { q: "Do you offer refunds?", a: "Yes — 14-day money back, no questions asked. After 14 days your lifetime access is non-refundable because you retain perpetual access to all content." },
  { q: "Is financing available?", a: "Yes. You can choose 2-, 3-, or 4-month installment plans at checkout, all totaling $1,100. No interest, no credit check. Payments are split evenly on the same day each month." },
  { q: "Is this for beginners?", a: "Yes. We have beginner-tagged curriculum for all three markets, plus a structured onboarding path that starts with Market Structure 101 and Risk Management." },
  { q: "How long do I have access?", a: "Lifetime. One payment unlocks everything forever: the library, live webinars, the community, and every future addition we build." },
  { q: "When are live sessions?", a: "Weekdays at 9:15am CT (pre-market desk), weekly market open playbooks on Monday, and at least one niche deep-dive per week. Replays are archived in the library." },
  { q: "How fast does merch ship?", a: "Orders ship within 3 business days from our US warehouse. Standard shipping is 4-6 business days in North America, 7-14 internationally." },
];

function HeroAmbient() {
  // Soft diagonal rising lines at 5% opacity. Slow. No parallax.
  const lines = Array.from({ length: 14 }).map((_, i) => ({
    left: (i * 7.7) % 100,
    delay: i * 1.6,
    dur: 18 + (i % 5) * 2,
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
            background: "linear-gradient(to top, transparent, hsl(var(--accent) / 0.5), transparent)",
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  const next = () => setI((v) => (v + 1) % TESTIMONIALS.length);
  const prev = () => setI((v) => (v - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  return (
    <div className="mx-auto max-w-4xl px-6 text-center">
      <blockquote key={i} className="fade-up serif italic text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight text-foreground/90">
        &ldquo;{t.body}&rdquo;
      </blockquote>
      <div className="mt-10 eyebrow text-accent">
        {t.name} &nbsp;·&nbsp; {t.city}
      </div>
      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          onClick={prev}
          className="p-2 text-muted-foreground hover:text-accent transition-colors"
          aria-label="Previous testimonial"
          data-testid="testimonial-prev"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <div className="flex gap-2">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1 transition-all ${idx === i ? "w-8 bg-accent" : "w-4 bg-border"}`}
              aria-label={`Testimonial ${idx + 1}`}
              data-testid={`testimonial-dot-${idx}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="p-2 text-muted-foreground hover:text-accent transition-colors"
          aria-label="Next testimonial"
          data-testid="testimonial-next"
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

function CurriculumRow() {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };
  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 400, behavior: "smooth" });

  // tall editorial gradient thumbnails
  const grads = [
    "linear-gradient(135deg, hsl(207 54% 10%), hsl(207 54% 16%) 60%, hsl(40 28% 30%))",
    "linear-gradient(135deg, hsl(47 33% 94%), hsl(46 26% 86%) 60%, hsl(40 28% 70%))",
    "linear-gradient(135deg, hsl(40 28% 55%), hsl(40 28% 35%) 60%, hsl(207 54% 10%))",
    "linear-gradient(135deg, hsl(207 54% 10%), hsl(40 28% 25%))",
  ];

  return (
    <div className="relative">
      <div
        ref={ref}
        className="scroll-x-snap flex gap-6 overflow-x-auto pb-8 -mx-6 px-6 lg:-mx-10 lg:px-10"
        data-testid="curriculum-scroll"
      >
        {CURRICULUM.map((c, idx) => (
          <Link key={c.title} href="/library" data-testid={`curriculum-card-${idx}`}>
            <a className="group shrink-0 block w-[260px] md:w-[300px]">
              <div
                className="relative aspect-[3/4] overflow-hidden border border-border/60 transition-all duration-500 group-hover:border-accent/60"
                style={{ background: grads[idx % grads.length] }}
              >
                {/* subtle abstract chart lines overlay */}
                <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 300 400" fill="none">
                  <path d="M0,300 L40,260 L80,280 L120,220 L160,240 L200,180 L240,200 L300,140" stroke="hsl(40 28% 85%)" strokeWidth="1" fill="none" />
                  <path d="M0,340 L50,310 L100,320 L150,270 L200,290 L260,230 L300,250" stroke="hsl(40 28% 85%)" strokeWidth="1" fill="none" opacity="0.6" />
                </svg>
                <div className="absolute top-5 left-5 eyebrow text-[hsl(47_33%_94%)]">
                  {c.n} / {c.total}
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="eyebrow-subtle text-[hsl(47_33%_94%)] opacity-70 mb-2">{c.niche}</div>
                  <div className="serif text-[hsl(47_33%_94%)] text-xl leading-tight">{c.title}</div>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
      {canLeft && (
        <button onClick={() => scroll(-1)} className="absolute left-2 top-[45%] hidden md:flex h-10 w-10 items-center justify-center border border-accent/40 bg-background/90 text-accent hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Scroll left" data-testid="curriculum-prev">
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
      )}
      {canRight && (
        <button onClick={() => scroll(1)} className="absolute right-2 top-[45%] hidden md:flex h-10 w-10 items-center justify-center border border-accent/40 bg-background/90 text-accent hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Scroll right" data-testid="curriculum-next">
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

export default function Landing() {
  return (
    <Layout>
      {/* ==================== HERO — 100vh, full-bleed ==================== */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden" data-testid="section-hero">
        <HeroAmbient />
        <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-10 py-16 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left column — 40% */}
            <div className="lg:col-span-5 fade-up">
              <p className="eyebrow mb-8 text-accent">EST. 2026 — Houston, TX</p>
              <h1 className="display-hero">
                <span className="italic opacity-90 block">Grow your</span>
                <span className="block" style={{ fontWeight: 500 }}>trading.</span>
                <span className="block italic text-accent text-[0.6em] leading-none mt-4">Cultivate profits.</span>
              </h1>
              <p className="mt-10 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                A members' house for disciplined operators. Live desk sessions, an editorial library, and a private community across crypto, forex, and options.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/pricing" data-testid="link-hero-join">
                  <Button size="lg" className="bg-primary text-primary-foreground h-12 px-8 rounded-none mono uppercase tracking-widest-editorial text-[11px] font-medium hover:bg-[hsl(89_48%_46%)] hover:text-[hsl(207_54%_8%)] transition-colors">
                    Become a Member
                  </Button>
                </Link>
                <Link href="/academy" data-testid="link-hero-preview">
                  <Button variant="outline" size="lg" className="h-12 px-8 rounded-none border border-accent/60 bg-transparent hover:bg-accent/10 mono uppercase tracking-widest-editorial text-[11px] font-medium text-foreground">
                    View the Academy
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right column — 60% — logo mark large, subtle */}
            <div className="lg:col-span-7 hidden lg:flex justify-center items-center">
              <div className="relative aspect-square w-full max-w-[520px] flex items-center justify-center">
                {/* concentric gold hairline rings */}
                <div className="absolute inset-6 border border-accent/15" />
                <div className="absolute inset-20 border border-accent/10" />
                <div className="absolute inset-36 border border-accent/8" />
                <div className="relative z-10 opacity-90">
                  <Logo size={240} className="!rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Niche strip at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 hairline-top py-6 px-6 lg:px-10">
          <div className="mx-auto max-w-7xl flex items-center justify-center gap-6 md:gap-12 eyebrow flex-wrap">
            <span>Crypto Trading</span>
            <span className="text-accent/40">—</span>
            <span>Forex</span>
            <span className="text-accent/40">—</span>
            <span>Options</span>
          </div>
        </div>
      </section>

      {/* ==================== MANIFESTO ==================== */}
      <section className="py-32 lg:py-40" data-testid="section-manifesto">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <Reveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-3">
                <p className="eyebrow mb-6">01 — The Manifesto</p>
              </div>
              <div className="lg:col-span-9">
                <p className="serif italic text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.25] tracking-tight text-foreground/90">
                  We don't chase green candles. We build systems, develop intuition, and trade with the discipline of craftspeople. Organic Profits Academy is a members' house for serious traders across crypto, forex, and options — a place to practice, refine, and stay sharp.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== THE 3 MARKETS ==================== */}
      <section className="py-32" data-testid="section-markets">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-20">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-6">02 — The 3 Markets</p>
              </div>
              <div className="lg:col-span-8">
                <h2 className="display-xl serif">
                  Three markets.<br />
                  <span className="italic">One standard.</span>
                </h2>
                <p className="mt-6 max-w-md text-muted-foreground text-[15px] leading-relaxed">
                  Each track is a complete curriculum — first principles through advanced, desk-grade tactics.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-1 md:grid-cols-3">
            {MARKETS.map((m, i) => (
              <Reveal key={m.key} delay={i * 80}>
                <Link href="/library">
                  <a className="group relative block overflow-hidden aspect-[3/4] md:aspect-[4/5] border border-border/60 transition-all duration-500 hover:border-accent/60" data-testid={`market-${m.key}`}>
                    {/* gradient placeholder */}
                    <div
                      className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
                      style={{
                        background: i === 0
                          ? "linear-gradient(160deg, hsl(207 54% 8%) 0%, hsl(207 50% 14%) 70%, hsl(40 28% 25%))"
                          : i === 1
                          ? "linear-gradient(160deg, hsl(40 28% 30%) 0%, hsl(40 28% 45%) 70%, hsl(40 28% 60%))"
                          : "linear-gradient(160deg, hsl(207 54% 14%) 0%, hsl(207 45% 22%) 60%, hsl(40 28% 40%))",
                      }}
                    />
                    {/* subtle chart overlay */}
                    <svg className="absolute inset-0 h-full w-full opacity-15" viewBox="0 0 400 500" fill="none" aria-hidden>
                      <path d="M0,400 L60,360 L120,380 L180,320 L240,340 L300,260 L360,290 L400,240" stroke="hsl(47 33% 94%)" strokeWidth="1" />
                      <path d="M0,430 L70,400 L140,420 L210,360 L280,380 L360,320 L400,340" stroke="hsl(47 33% 94%)" strokeWidth="1" opacity="0.55" />
                    </svg>
                    {/* dark scrim for consistent text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    {/* number top-left */}
                    <div className="absolute top-8 left-8 serif text-[5rem] leading-none text-[hsl(47_33%_94%)] opacity-90" style={{ fontWeight: 300 }}>
                      {m.n}
                    </div>
                    {/* content bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="serif text-3xl md:text-4xl text-[hsl(47_33%_94%)]">
                        {m.name}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed max-w-xs text-[hsl(47_33%_94%)]/90">
                        {m.desc}
                      </p>
                      <div className="mt-6 inline-flex items-center gap-2 eyebrow text-[hsl(40_28%_80%)]">
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

      {/* ==================== CURRICULUM PREVIEW — horizontal scroll ==================== */}
      <section className="py-32" data-testid="section-curriculum">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-16">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-6">03 — Curriculum Preview</p>
              </div>
              <div className="lg:col-span-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <h2 className="display-xl serif">
                  A small taste of<br />
                  <span className="italic">what's inside.</span>
                </h2>
                <Link href="/pricing" data-testid="link-curriculum-join">
                  <span className="eyebrow inline-flex items-center gap-2 hover:text-accent transition-colors cursor-pointer">
                    Unlock the library <ArrowRight size={12} />
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>

          <CurriculumRow />
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== THE HOUSE — community ==================== */}
      <section className="py-32" data-testid="section-house">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-12 items-center">
              <div className="lg:col-span-6">
                <p className="eyebrow mb-8">04 — The House</p>
                <blockquote className="serif italic text-3xl md:text-4xl lg:text-[2.5rem] leading-[1.2] tracking-tight text-foreground/90">
                  A private room above the market. Members share setups in the morning, track each other's wins at noon, and decompress in the evening — curated, not crowded.
                </blockquote>
                <p className="mt-8 text-muted-foreground leading-relaxed max-w-md">
                  Not a Discord. A members' house. Seven focused channels, a forum for deeper work, and a desk that answers.
                </p>
              </div>
              {/* stylized chat mockup */}
              <div className="lg:col-span-6">
                <div className="border border-accent/25 bg-card">
                  <div className="hairline-bottom px-6 py-4 flex items-center justify-between">
                    <span className="eyebrow">The House · 7 channels</span>
                    <span className="flex gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/40" />
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/40" />
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/40" />
                    </span>
                  </div>
                  <div className="grid grid-cols-12 min-h-[360px]">
                    <ul className="col-span-5 border-r border-border/60 p-6 space-y-3">
                      {["general", "crypto", "forex", "options", "wins", "setups", "ask-the-pros"].map((c, i) => (
                        <li key={c} className={`mono uppercase tracking-wider-editorial text-xs flex items-center gap-2 ${i === 1 ? "text-accent" : "text-muted-foreground"}`}>
                          <span className="opacity-60">#</span>{c}
                          {i === 1 && <span className="ml-auto h-px w-4 bg-accent" />}
                        </li>
                      ))}
                    </ul>
                    <div className="col-span-7 p-6 space-y-5">
                      <div>
                        <div className="eyebrow mb-1">Marcus · 9:14 AM</div>
                        <p className="text-sm leading-relaxed">BTC tagged prev week high. Waiting for the sweep before taking size.</p>
                      </div>
                      <div>
                        <div className="eyebrow mb-1">Sara · 9:18 AM</div>
                        <p className="text-sm leading-relaxed">Funding rates turned negative. Contrarian tell — confluence with your level.</p>
                      </div>
                      <div>
                        <div className="eyebrow mb-1">Priya · 9:22 AM</div>
                        <p className="text-sm leading-relaxed">For options folks: 0DTE iron condor 5390/5395/5450/5455 at 14Δ. Risk $85 to make $15.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== FOUNDER ==================== */}
      <section className="py-32" data-testid="section-founder">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Reveal>
            <p className="eyebrow mb-8">05 — The Founder</p>
            <blockquote className="serif italic text-2xl md:text-3xl leading-[1.3] text-foreground/90 mb-14">
              &ldquo;I built the Academy I wish I'd had ten years ago — one where craft, not noise, is the standard.&rdquo;
            </blockquote>
            <div className="mx-auto w-40 h-40 border border-accent/50 flex items-center justify-center bg-card overflow-hidden">
              <Logo size={110} />
            </div>
            <p className="eyebrow mt-6">Marcus Hale — Founder & Head of Desk</p>
            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-foreground/85">
              <p>
                Fifteen years running risk at prop desks in Chicago and Houston. Former institutional FX trader. Still trades every session the Academy is live.
              </p>
              <p>
                Organic Profits Academy opened in 2026 as a response to the noise — a quiet room built on the discipline that produced the only traders worth learning from.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== THE COLLECTION (MERCH) ==================== */}
      <section className="py-32" data-testid="section-collection">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 mb-16">
              <div className="lg:col-span-4">
                <p className="eyebrow mb-6">06 — The Collection</p>
              </div>
              <div className="lg:col-span-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <h2 className="display-xl serif">
                  Considered<br />
                  <span className="italic">basics.</span>
                </h2>
                <Link href="/shop" data-testid="link-shop-collection">
                  <span className="eyebrow inline-flex items-center gap-2 hover:text-accent transition-colors cursor-pointer">
                    Shop the Academy <ArrowRight size={12} />
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-1 grid-cols-2 md:grid-cols-4">
            {[
              { bg: "hsl(207 54% 10%)", fg: "hsl(47 33% 94%)", label: "Leaf Tee · Navy" },
              { bg: "hsl(47 33% 94%)", fg: "hsl(207 54% 10%)", label: "Academy Hoodie · Cream" },
              { bg: "hsl(40 28% 55%)", fg: "hsl(207 54% 10%)", label: "Signet Cap · Gold" },
              { bg: "hsl(37 13% 12%)", fg: "hsl(47 33% 94%)", label: "Desk Sweats · Black" },
            ].map((m, idx) => (
              <Reveal key={m.label} delay={idx * 60}>
                <Link href="/shop">
                  <a className="group block relative aspect-[3/4] overflow-hidden border border-border/60 transition-all duration-500 hover:border-accent/60" data-testid={`collection-${idx}`}>
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]" style={{ background: m.bg }} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-75 transition-opacity">
                      <Logo size={80} />
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="eyebrow" style={{ color: m.fg, opacity: 0.8 }}>0{idx + 1}</div>
                      <div className="mt-1 mono text-[11px] uppercase tracking-wider-editorial" style={{ color: m.fg }}>
                        {m.label}
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

      {/* ==================== PRICING — membership card ==================== */}
      <section className="py-32" data-testid="section-pricing">
        <div className="mx-auto max-w-lg px-6 text-center">
          <Reveal>
            <p className="eyebrow mb-6">07 — Membership</p>
            <div className="border border-accent bg-card p-10 md:p-12">
              <div className="eyebrow mb-4">Lifetime Membership</div>
              <div className="serif text-6xl md:text-7xl tracking-tight" style={{ fontWeight: 400 }}>$1,100</div>
              <p className="mt-3 text-sm text-muted-foreground">One payment. Perpetual access.</p>

              <div className="hairline my-10" />

              <div className="space-y-3 text-left">
                {[
                  { id: "full", label: "Pay in full", price: "$1,100 today" },
                  { id: "2mo", label: "2 months", price: "$550 × 2" },
                  { id: "3mo", label: "3 months", price: "$367 × 3" },
                  { id: "4mo", label: "4 months", price: "$275 × 4" },
                ].map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-3 hairline-bottom last:border-b-0">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 border border-accent/50" />
                      <span className="mono uppercase tracking-wider-editorial text-[11px]">{p.label}</span>
                    </div>
                    <span className="mono text-[11px] text-muted-foreground uppercase tracking-wider-editorial">{p.price}</span>
                  </div>
                ))}
              </div>

              <Link href="/pricing" data-testid="link-pricing-reserve">
                <Button size="lg" className="mt-10 w-full bg-primary text-primary-foreground hover:bg-[hsl(89_48%_46%)] hover:text-[hsl(207_54%_8%)] transition-colors h-12 rounded-none mono uppercase tracking-widest-editorial text-[11px] font-medium">
                  Reserve Your Spot
                </Button>
              </Link>

              <p className="eyebrow-subtle mt-6">14-day money-back guarantee</p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== TESTIMONIALS — pull quote ==================== */}
      <section className="py-40" data-testid="section-testimonials">
        <div className="mb-14 text-center">
          <p className="eyebrow">08 — Member Voices</p>
        </div>
        <Testimonials />
      </section>

      <div className="hairline" />

      {/* ==================== FAQ ==================== */}
      <section className="py-32" data-testid="section-faq">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-12">
              <p className="eyebrow mb-6">09 — Frequently Asked</p>
              <h2 className="display-xl serif">
                Before <span className="italic">you join.</span>
              </h2>
            </div>
          </Reveal>
          <Accordion type="single" collapsible className="hairline-top">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="hairline-bottom border-0">
                <AccordionTrigger className="text-left py-6 hover:no-underline" data-testid={`faq-trigger-${i}`}>
                  <div className="flex items-baseline gap-5 w-full">
                    <span className="eyebrow shrink-0 pt-1">{String(i + 1).padStart(2, "0")}</span>
                    <span className="serif text-xl md:text-2xl tracking-tight" style={{ fontWeight: 400 }}>{f.q}</span>
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
