import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import { Reveal } from "@/components/Reveal";
import { Send, MessageSquare, ArrowRight } from "lucide-react";

export const TELEGRAM_CHANNELS: { emoji: string; name: string; desc: string }[] = [
  { emoji: "#", name: "General", desc: "Daily check-ins, community chat, and the room's pulse." },
  { emoji: "📈", name: "Trade Ideas", desc: "Real-time setups members are watching across all three markets." },
  { emoji: "💰", name: "Profits", desc: "Wins, screenshots, and the receipts behind the work." },
  { emoji: "🔒", name: "Digital Downloads", desc: "PDFs, templates, backtests, and member-only resources." },
  { emoji: "⭕", name: "Organic Conversations", desc: "Off-topic, life talk, mindset — the human side of the desk." },
  { emoji: "✅", name: "Tips/Tricks", desc: "Bite-size lessons that pay back the membership all on their own." },
  { emoji: "🏆", name: "Credit Building / Repair", desc: "Personal finance plays beyond the markets — building real wealth." },
  { emoji: "🎯", name: "OPA Events", desc: "Live event invites, meetups, and house gatherings." },
  { emoji: "📚", name: "Backtesting", desc: "Strategy backtests, journal entries, and post-mortems." },
  { emoji: "📣", name: "Webinar Feedback", desc: "Reactions and questions from every webinar — keep the convo going." },
  { emoji: "📢", name: "Crypto Investing", desc: "Long-term crypto positioning, narratives, and on-chain reads." },
];

export default function Community() {
  const { user } = useSession();
  const isMember = user?.isMember || user?.isAdmin;

  return (
    <Layout>
      {/* ==================== HEADER ==================== */}
      <section className="pt-20 pb-10 lg:pt-24 lg:pb-14">
        <div className="mx-auto max-w-5xl px-6 lg:px-10 text-center">
          <p className="eyebrow mb-5">The Community</p>
          <h1 className="display-xl serif">
            Where the <span className="italic">desk</span> meets the room.
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            The community lives on Telegram. 27+ members and growing — across 11
            active channels covering everything from live trade ideas to credit
            repair.
          </p>

          {!isMember && (
            <div className="mt-8 inline-flex items-center gap-3 mono text-[11px] uppercase tracking-widest-editorial text-[hsl(var(--brand-brown))]">
              <span className="h-px w-10 bg-[hsl(var(--brand-brown))]/40" />
              Members-only
              <span className="h-px w-10 bg-[hsl(var(--brand-brown))]/40" />
            </div>
          )}
        </div>
      </section>

      {/* ==================== CTA — JOIN TELEGRAM ==================== */}
      <section className="pb-12">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="bg-card border border-[hsl(var(--brand-gold))] p-8 lg:p-10 text-center">
              <Send
                size={28}
                strokeWidth={1.4}
                className="mx-auto text-[hsl(var(--brand-brown))]"
              />
              <h2
                className="serif text-3xl md:text-4xl mt-5 leading-tight"
                style={{ fontWeight: 400 }}
              >
                Join the private Telegram.
              </h2>
              <p className="mt-4 text-muted-foreground text-[15px] leading-relaxed max-w-xl mx-auto">
                {isMember
                  ? "You're a member. Tap below to head into the house — and message the admin if you need a fresh invite link."
                  : "Lifetime members get a direct invite link after checkout. Message the admin to get yours."}
              </p>

              {isMember ? (
                <a
                  href="#telegram-link"
                  data-telegram-cta="primary"
                  data-testid="link-join-telegram"
                  className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-[hsl(var(--brand-deep-brown))] hover:text-[hsl(var(--brand-warm-white))] transition-colors h-12 px-8 rounded-none mono uppercase tracking-widest-editorial text-[11px] font-medium"
                >
                  Join the Telegram <ArrowRight size={14} />
                </a>
              ) : (
                <Link href="/pricing" data-testid="link-pricing-from-community">
                  <Button
                    size="lg"
                    className="mt-8 bg-primary text-primary-foreground hover:bg-[hsl(var(--brand-deep-brown))] hover:text-[hsl(var(--brand-warm-white))] transition-colors h-12 px-8 rounded-none mono uppercase tracking-widest-editorial text-[11px] font-medium"
                  >
                    Become a Member
                  </Button>
                </Link>
              )}
              <p className="mt-5 text-[12px] text-[hsl(var(--brand-brown)/0.75)]">
                Message the admin for your invite link after purchase.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== 11 CHANNELS ==================== */}
      <section className="py-16 lg:py-20 bg-[hsl(var(--brand-silver-cream))]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="eyebrow mb-5">Inside the House</p>
              <h2 className="display-xl serif">
                11 channels. <span className="italic">One community.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TELEGRAM_CHANNELS.map((c, i) => (
              <Reveal key={c.name} delay={(i % 3) * 50}>
                <div
                  className="bg-card border border-border p-6 h-full transition-colors hover:border-[hsl(var(--brand-brown))]"
                  data-testid={`tg-channel-${i}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl leading-none shrink-0 select-none" aria-hidden>
                      {c.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="serif text-lg leading-tight" style={{ fontWeight: 500 }}>
                        {c.name}
                      </div>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* ==================== Legacy in-app spaces (demoted) ==================== */}
      {isMember && (
        <section className="py-14">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="eyebrow mb-4">Also available</p>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-xl mx-auto">
              We still keep an in-app archive of older conversations and the
              long-form forum — both available to members below.
            </p>
            <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
              <Link href="/community/chat" data-testid="link-legacy-chat">
                <a className="mono text-[11px] uppercase tracking-widest-editorial text-[hsl(var(--brand-brown))] hover:text-foreground inline-flex items-center gap-2">
                  <MessageSquare size={12} /> In-app archive
                </a>
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
