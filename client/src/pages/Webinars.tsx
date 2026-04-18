import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { NicheBadge } from "@/components/NicheBadge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import { CalendarPlus, PlayCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

function Countdown({ iso }: { iso: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(iso).getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return <span className="mono text-xs text-accent">{days}d {hours}h {mins}m</span>;
}

export default function Webinars() {
  const { user } = useSession();
  const { data: webinars = [] } = useQuery<any[]>({ queryKey: ["/api/webinars"] });

  if (!user?.isMember) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="serif text-4xl">Live sessions are members-only</h1>
          <p className="mt-3 text-muted-foreground">Replays are archived for lifetime access.</p>
          <Link href="/pricing"><Button className="mt-6 bg-primary">Join for $1,100</Button></Link>
        </div>
      </Layout>
    );
  }

  const upcoming = webinars.filter((w) => w.status === "upcoming").sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const past = webinars.filter((w) => w.status === "past").sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  return (
    <Layout>
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10">
            <p className="eyebrow mb-2">Live at the desk</p>
            <h1 className="serif text-4xl md:text-5xl tracking-tight">Webinars</h1>
          </div>

          <h2 className="serif text-2xl mb-4">Upcoming</h2>
          <div className="space-y-3 mb-14">
            {upcoming.map((w) => {
              const d = new Date(w.scheduledAt);
              return (
                <div key={w.id} className="rounded-lg border border-card-border bg-card p-5 flex flex-col md:flex-row md:items-center gap-4 gold-glow" data-testid={`webinar-upcoming-${w.id}`}>
                  <div className="md:w-28 text-center shrink-0">
                    <div className="text-[10px] uppercase tracking-wider text-accent">{d.toLocaleDateString("en-US", { month: "short" })}</div>
                    <div className="serif text-3xl">{d.getDate()}</div>
                    <div className="text-xs text-muted-foreground">{d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" })} CT</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <NicheBadge niche={w.niche} />
                      <span className="text-xs text-muted-foreground"><Clock size={10} className="inline -mt-0.5 mr-0.5" /> {w.durationMin}m</span>
                      <Countdown iso={w.scheduledAt} />
                    </div>
                    <h3 className="serif text-lg">{w.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">with {w.instructor}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-accent/40" data-testid={`button-add-cal-${w.id}`}>
                      <CalendarPlus size={14} className="mr-1" /> Add
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground" data-testid={`button-register-${w.id}`}>Register</Button>
                  </div>
                </div>
              );
            })}
            {upcoming.length === 0 && <p className="text-sm text-muted-foreground">Nothing scheduled yet.</p>}
          </div>

          <h2 className="serif text-2xl mb-4">Replays</h2>
          <div className="grid gap-3">
            {past.map((w) => {
              const d = new Date(w.scheduledAt);
              return (
                <div key={w.id} className="rounded-lg border border-card-border bg-card p-4 flex items-center gap-4" data-testid={`webinar-past-${w.id}`}>
                  <PlayCircle size={32} className="text-accent shrink-0" strokeWidth={1.3} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <NicheBadge niche={w.niche} />
                      <span className="text-[11px] text-muted-foreground">{d.toLocaleDateString()} · {w.durationMin}m</span>
                    </div>
                    <p className="font-medium text-sm">{w.title}</p>
                    <p className="text-xs text-muted-foreground">with {w.instructor}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-accent/40" data-testid={`button-watch-replay-${w.id}`}>Watch replay</Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
