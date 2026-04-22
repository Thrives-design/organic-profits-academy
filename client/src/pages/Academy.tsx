import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { ArrowRight } from "lucide-react";

export default function Academy() {
  const tracks = [
    { id: "crypto", n: "01", label: "Crypto Trading", blurb: "Spot, perpetuals, and on-chain flow. Liquidity-driven setups across BTC, ETH, and majors.", sessions: 24 },
    { id: "forex", n: "02", label: "Forex", blurb: "London and NY sessions, macro flows, smart-money concepts on the majors.", sessions: 21 },
    { id: "options", n: "03", label: "Options", blurb: "0DTE spreads to LEAPS. Greeks, volatility, and defined-risk premium selling.", sessions: 28 },
  ];

  return (
    <Layout>
      <section className="py-28 lg:py-36">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="mb-20">
            <p className="eyebrow mb-6">The Academy</p>
            <h1 className="display-xl serif">
              Three markets.<br />
              <span className="italic">One standard.</span>
            </h1>
            <p className="mt-8 max-w-xl text-muted-foreground leading-relaxed">
              Each track is structured from first principles through advanced desk-grade tactics. Pick your entry point or work through all three.
            </p>
          </div>

          <div className="space-y-1">
            {tracks.map((t) => (
              <Link key={t.id} href="/library" data-testid={`track-${t.id}`}>
                <a className="group block hairline-bottom hover:bg-accent/5 transition-colors">
                  <div className="grid grid-cols-12 gap-6 py-10 items-center">
                    <div className="col-span-2 md:col-span-1">
                      <span className="eyebrow text-accent">{t.n}</span>
                    </div>
                    <div className="col-span-10 md:col-span-5">
                      <h2 className="serif text-3xl md:text-4xl tracking-tight group-hover:italic transition-all">{t.label}</h2>
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">{t.blurb}</p>
                    </div>
                    <div className="col-span-12 md:col-span-2 flex md:justify-end items-center gap-3">
                      <span className="eyebrow-subtle">{t.sessions} sessions</span>
                      <ArrowRight size={16} strokeWidth={1.5} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
