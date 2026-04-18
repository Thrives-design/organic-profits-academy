import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { useSession } from "@/context/SessionContext";
import { NicheBadge } from "@/components/NicheBadge";
import { VideoThumbnail } from "@/components/VideoThumbnail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, ArrowRight, Video, Users, Shirt } from "lucide-react";

export default function Dashboard() {
  const { user, plan } = useSession();
  const videosQ = useQuery<any[]>({ queryKey: ["/api/videos"] });
  const webinarsQ = useQuery<any[]>({ queryKey: ["/api/webinars"] });

  if (!user) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="serif text-4xl">Members only</h1>
          <p className="mt-3 text-muted-foreground">Sign in to access your dashboard.</p>
          <Link href="/login"><Button className="mt-6 bg-primary">Sign in</Button></Link>
        </div>
      </Layout>
    );
  }

  const lastVideo = videosQ.data?.find((v) => v.id === user.lastWatchedVideoId) ?? videosQ.data?.[0];
  const upcomingWebinars = (webinarsQ.data ?? []).filter((w) => w.status === "upcoming").slice(0, 4);

  return (
    <Layout>
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Welcome card */}
          <div className="rounded-2xl border border-accent/30 bg-card p-6 md:p-8 gold-glow" data-testid="card-welcome">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="eyebrow mb-2">Welcome back</p>
                <h1 className="serif text-3xl md:text-4xl tracking-tight">{user.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {user.isMember && <Badge className="bg-primary text-primary-foreground border-transparent">Lifetime Member</Badge>}
                  {plan && plan.totalInstallments > 1 && (
                    <Badge variant="outline" className="border-accent/40 text-accent" data-testid="badge-plan-status">
                      Payment {plan.paidInstallments} of {plan.totalInstallments}
                      {plan.nextChargeDate && ` · Next ${new Date(plan.nextChargeDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                    </Badge>
                  )}
                  {plan && plan.totalInstallments === 1 && (
                    <Badge variant="outline" className="border-accent/40 text-accent">Paid in full</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {/* Continue learning */}
            <div className="lg:col-span-2">
              <h2 className="serif text-2xl mb-4">Continue learning</h2>
              {lastVideo && (
                <Link href={`/library/${lastVideo.id}`} data-testid="link-continue-learning">
                  <a className="block rounded-xl border border-card-border bg-card p-4 hover-elevate">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="sm:w-60 shrink-0">
                        <VideoThumbnail niche={lastVideo.niche} title={lastVideo.title} color={lastVideo.thumbnailColor} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <NicheBadge niche={lastVideo.niche} />
                          <span className="text-xs text-muted-foreground">{lastVideo.duration}</span>
                        </div>
                        <h3 className="serif text-xl">{lastVideo.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{lastVideo.description}</p>
                        <p className="mt-3 text-xs text-muted-foreground">Taught by {lastVideo.instructor}</p>
                      </div>
                    </div>
                  </a>
                </Link>
              )}

              <h2 className="serif text-2xl mb-4 mt-10">Upcoming live sessions</h2>
              <div className="space-y-3">
                {upcomingWebinars.map((w) => {
                  const d = new Date(w.scheduledAt);
                  return (
                    <div key={w.id} className="rounded-lg border border-card-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3" data-testid={`webinar-${w.id}`}>
                      <div className="text-center sm:w-20 shrink-0">
                        <div className="text-[10px] uppercase tracking-wider text-accent">{d.toLocaleDateString("en-US", { month: "short" })}</div>
                        <div className="serif text-2xl">{d.getDate()}</div>
                        <div className="text-xs text-muted-foreground">{d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" })} CT</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <NicheBadge niche={w.niche} />
                        </div>
                        <p className="font-medium text-sm">{w.title}</p>
                        <p className="text-xs text-muted-foreground">with {w.instructor} · {w.durationMin}m</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-accent/40" data-testid={`button-add-calendar-${w.id}`}>
                        <CalendarPlus size={14} className="mr-1" /> Add
                      </Button>
                    </div>
                  );
                })}
                {upcomingWebinars.length === 0 && <p className="text-sm text-muted-foreground">No webinars scheduled yet.</p>}
              </div>
            </div>

            <aside className="space-y-3">
              <h2 className="serif text-2xl mb-4">Quick links</h2>
              {[
                { href: "/library", label: "Video Library", icon: Video, sub: `${videosQ.data?.length ?? 0} sessions` },
                { href: "/community", label: "Community", icon: Users, sub: "Chat + Forum" },
                { href: "/shop", label: "Merch Store", icon: Shirt, sub: "Members 15% off" },
              ].map((q) => (
                <Link key={q.href} href={q.href} data-testid={`link-quick-${q.label.toLowerCase().replace(/ /g, "-")}`}>
                  <a className="block rounded-lg border border-card-border bg-card p-4 hover-elevate gold-glow">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md bg-accent/15 text-accent flex items-center justify-center">
                        <q.icon size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{q.label}</p>
                        <p className="text-xs text-muted-foreground">{q.sub}</p>
                      </div>
                      <ArrowRight size={14} className="text-muted-foreground" />
                    </div>
                  </a>
                </Link>
              ))}
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
}
