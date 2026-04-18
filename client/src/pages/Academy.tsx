import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { NICHE_META } from "@/components/NicheBadge";
import { ArrowRight } from "lucide-react";

export default function Academy() {
  const tracks = [
    { id: "crypto", blurb: "Spot, perps, and on-chain flow. Liquidity-driven setups across BTC, ETH, and majors.", sessions: 24 },
    { id: "futures", blurb: "ES, NQ, CL, GC. Opening range, volume profile, and prop-firm ready risk frameworks.", sessions: 32 },
    { id: "options", blurb: "0DTE spreads to LEAPS. Greeks, vol, and defined-risk premium selling.", sessions: 28 },
    { id: "forex", blurb: "London and NY sessions, macro flows, smart-money concepts on the majors.", sessions: 21 },
  ];

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">The Academy</p>
            <h1 className="serif text-5xl md:text-6xl tracking-tight">Four markets. One curriculum.</h1>
            <p className="mt-5 max-w-xl mx-auto text-muted-foreground">
              Each track is structured from first principles through advanced desk-grade tactics.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {tracks.map((t) => {
              const meta = NICHE_META[t.id];
              const Icon = meta.icon;
              return (
                <Link key={t.id} href="/library" data-testid={`track-${t.id}`}>
                  <a className={`${meta.className} gold-glow block rounded-xl border bg-card p-8 h-full`}>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg" style={{ background: `hsl(var(--niche) / 0.15)`, color: `hsl(var(--niche))` }}>
                      <Icon size={22} strokeWidth={1.6} />
                    </div>
                    <h2 className="serif text-3xl mt-6">{meta.label}</h2>
                    <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{t.blurb}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{t.sessions} sessions</span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: `hsl(var(--niche))` }}>
                        Enter track <ArrowRight size={14} />
                      </span>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
