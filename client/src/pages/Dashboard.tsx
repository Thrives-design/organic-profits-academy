import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { useSession } from "@/context/SessionContext";
import { NicheBadge } from "@/components/NicheBadge";
import { VideoThumbnail } from "@/components/VideoThumbnail";
import { Button } from "@/components/ui/button";
import { CalendarPlus, ArrowRight, Video, Users, Shirt } from "lucide-react";

export default function Dashboard() {
  const { user, plan } = useSession();
  const videosQ = useQuery<any[]>({ queryKey: ["/api/videos"] });
  const webinarsQ = useQuery<any[]>({ queryKey: ["/api/webinars"] });

  if (!user) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-6 py-40 text-center">
          <p className="eyebrow mb-4">Private area</p>
          <h1 className="serif text-4xl md:text-5xl font-normal">Members only</h1>
          <p className="mt-4 text-muted-foreground">Sign in to access your dashboard.</p>
          <Link href="/login">
            <Button className="mt-8 bg-accent text-[hsl(var(--warm-black))] rounded-none mono text-[11px] uppercase tracking-[0.2em] h-12 px-8 hover:bg-[hsl(var(--success))] hover:text-[hsl(var(--off-white))]">
              Sign in
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const lastVideo = videosQ.data?.find((v) => v.id === user.lastWatchedVideoId) ?? videosQ.data?.[0];
  const upcomingWebinars = (webinarsQ.data ?? []).filter((w) => w.status === "upcoming").slice(0, 4);

  return (
    <Layout>
      {/* Welcome — editorial, no boxed card */}
      <section className="pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="eyebrow mb-5">Welcome back</p>
          <h1 className="display-xl">
            <span className="italic text-accent font-light">{user.name.split(" ")[0]}.</span>
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 mono text-[11px] uppercase tracking-[0.16em]">
            {user.isMember && <span className="text-accent">Lifetime member</span>}
            {plan && plan.totalInstallments > 1 && (
              <span className="text-muted-foreground" data-testid="badge-plan-status">
                Payment {plan.paidInstallments} / {plan.totalInstallments}
                {plan.nextChargeDate &&
                  ` · Next ${new Date(plan.nextChargeDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}`}
              </span>
            )}
            {plan && plan.totalInstallments === 1 && (
              <span className="text-muted-foreground">Paid in full</span>
            )}
          </div>

          {/* Telegram invite note */}
          {user.isMember && (
            <div
              className="mt-8 max-w-xl bg-card border border-[hsl(var(--brand-gold))] p-5 lg:p-6"
              data-testid="card-telegram-note"
            >
              <p className="eyebrow mb-2">Welcome to the House</p>
              <p className="text-[14.5px] leading-relaxed text-foreground/85">
                Message the admin for your invite link after purchase — that's how
                you get into the private Telegram and all 11 channels.
              </p>
              <Link href="/community" data-testid="link-telegram-from-dashboard">
                <a className="mt-3 inline-flex items-center gap-2 mono text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--brand-brown))] hover:text-foreground">
                  See the channels →
                </a>
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="hairline" />

      {/* Main grid */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[2fr_1fr] lg:gap-20">
            {/* Left: continue learning + upcoming */}
            <div>
              <div className="flex items-baseline justify-between mb-8">
                <p className="eyebrow">01 — Continue learning</p>
                <Link href="/library">
                  <a className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent">
                    All sessions →
                  </a>
                </Link>
              </div>

              {lastVideo && (
                <Link href={`/library/${lastVideo.id}`} data-testid="link-continue-learning">
                  <a className="block group">
                    <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_1.4fr] sm:gap-8">
                      <div className="aspect-video overflow-hidden">
                        <VideoThumbnail
                          niche={lastVideo.niche}
                          title={lastVideo.title}
                          color={lastVideo.thumbnailColor}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <NicheBadge niche={lastVideo.niche} />
                          <span className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            {lastVideo.duration}
                          </span>
                        </div>
                        <h3 className="serif text-2xl md:text-3xl tracking-tight font-normal leading-[1.1] group-hover:text-accent transition-colors">
                          {lastVideo.title}
                        </h3>
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {lastVideo.description}
                        </p>
                        <p className="mt-5 mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
                          Taught by {lastVideo.instructor}
                        </p>
                      </div>
                    </div>
                  </a>
                </Link>
              )}

              <div className="hairline mt-16 mb-12" />

              <p className="eyebrow mb-8">02 — Upcoming at the desk</p>
              <div className="divide-y divide-[hsl(var(--accent)/0.15)] border-y border-[hsl(var(--accent)/0.15)]">
                {upcomingWebinars.map((w) => {
                  const d = new Date(w.scheduledAt);
                  return (
                    <div
                      key={w.id}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-6 py-5"
                      data-testid={`webinar-${w.id}`}
                    >
                      <div className="w-16 text-center">
                        <div className="mono text-[10px] uppercase tracking-[0.15em] text-accent">
                          {d.toLocaleDateString("en-US", { month: "short" })}
                        </div>
                        <div className="serif text-3xl font-normal leading-none mt-1">{d.getDate()}</div>
                        <div className="mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/70 mt-1">
                          {d.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            timeZone: "America/Chicago",
                          })} CT
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <NicheBadge niche={w.niche} />
                        </div>
                        <p className="serif text-lg font-normal leading-snug">{w.title}</p>
                        <p className="mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mt-1">
                          with {w.instructor} · {w.durationMin}m
                        </p>
                      </div>
                      <button
                        className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent inline-flex items-center gap-1.5 shrink-0"
                        data-testid={`button-add-calendar-${w.id}`}
                      >
                        <CalendarPlus size={12} /> Add
                      </button>
                    </div>
                  );
                })}
                {upcomingWebinars.length === 0 && (
                  <p className="py-8 text-sm italic text-muted-foreground">Nothing scheduled yet.</p>
                )}
              </div>
            </div>

            {/* Right: quick links */}
            <aside>
              <p className="eyebrow mb-8">03 — The House</p>
              <div className="divide-y divide-[hsl(var(--accent)/0.15)] border-y border-[hsl(var(--accent)/0.15)]">
                {[
                  { href: "/library", label: "Video Library", icon: Video, sub: `${videosQ.data?.length ?? 0} sessions` },
                  { href: "/community", label: "Community", icon: Users, sub: "11 Telegram channels" },
                  { href: "/shop", label: "The Collection", icon: Shirt, sub: "Members 15% off" },
                ].map((q) => (
                  <Link key={q.href} href={q.href} data-testid={`link-quick-${q.label.toLowerCase().replace(/ /g, "-")}`}>
                    <a className="group flex items-center gap-4 py-5">
                      <q.icon size={16} className="text-accent shrink-0" strokeWidth={1.3} />
                      <div className="flex-1 min-w-0">
                        <p className="serif text-lg font-normal leading-tight group-hover:text-accent transition-colors">
                          {q.label}
                        </p>
                        <p className="mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mt-0.5">
                          {q.sub}
                        </p>
                      </div>
                      <ArrowRight size={14} className="text-muted-foreground/50 group-hover:text-accent transition-colors" />
                    </a>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
}
