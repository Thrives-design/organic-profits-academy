import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { NicheBadge } from "@/components/NicheBadge";
import { useSession } from "@/context/SessionContext";
import { CalendarPlus, PlayCircle } from "lucide-react";
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
  return (
    <span className="mono text-[10px] uppercase tracking-[0.14em] text-accent">
      {days}d {hours}h {mins}m
    </span>
  );
}

export default function Webinars() {
  const { user } = useSession();
  const { data: webinars = [] } = useQuery<any[]>({ queryKey: ["/api/webinars"] });

  if (!user?.isMember) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-6 py-40 text-center">
          <p className="eyebrow mb-5">Private</p>
          <h1 className="serif text-4xl md:text-5xl font-normal leading-tight">
            Live sessions are <span className="italic text-accent font-light">members-only</span>.
          </h1>
          <p className="mt-4 text-muted-foreground">Replays are archived for lifetime access.</p>
          <Link href="/pricing">
            <a className="mt-10 inline-block bg-accent text-[hsl(var(--warm-black))] mono text-[11px] uppercase tracking-[0.22em] h-12 leading-[3rem] px-8 hover:bg-[hsl(var(--success))] hover:text-[hsl(var(--off-white))] transition-colors">
              Join for $1,100
            </a>
          </Link>
        </div>
      </Layout>
    );
  }

  const upcoming = webinars
    .filter((w) => w.status === "upcoming")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const past = webinars
    .filter((w) => w.status === "past")
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  return (
    <Layout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="eyebrow mb-5">Live sessions</p>
          <h1 className="display-xl">
            <span className="italic font-light text-accent">Live</span> at the desk.
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed">
            Weekly sessions across crypto, forex, and options. Join live or watch the replay.
          </p>
        </div>
      </section>

      <div className="hairline" />

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="eyebrow mb-8">01 — Upcoming</p>
          <div className="divide-y divide-[hsl(var(--accent)/0.15)] border-y border-[hsl(var(--accent)/0.15)] mb-20">
            {upcoming.map((w) => {
              const d = new Date(w.scheduledAt);
              return (
                <div
                  key={w.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-6 py-6"
                  data-testid={`webinar-upcoming-${w.id}`}
                >
                  <div className="w-20 text-center">
                    <div className="mono text-[10px] uppercase tracking-[0.15em] text-accent">
                      {d.toLocaleDateString("en-US", { month: "short" })}
                    </div>
                    <div className="serif text-4xl font-normal leading-none mt-1">{d.getDate()}</div>
                    <div className="mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/70 mt-1">
                      {d.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZone: "America/Chicago",
                      })}{" "}
                      CT
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <NicheBadge niche={w.niche} />
                      <span className="mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {w.durationMin}m
                      </span>
                      <Countdown iso={w.scheduledAt} />
                    </div>
                    <h3 className="serif text-xl md:text-2xl font-normal leading-tight">{w.title}</h3>
                    <p className="mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mt-1.5">
                      with {w.instructor}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <button
                      className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent inline-flex items-center gap-1.5"
                      data-testid={`button-add-cal-${w.id}`}
                    >
                      <CalendarPlus size={12} /> Add
                    </button>
                    <button
                      className="bg-accent text-[hsl(var(--warm-black))] mono text-[10px] uppercase tracking-[0.2em] h-10 px-5 hover:bg-[hsl(var(--success))] hover:text-[hsl(var(--off-white))] transition-colors"
                      data-testid={`button-register-${w.id}`}
                    >
                      Register
                    </button>
                  </div>
                </div>
              );
            })}
            {upcoming.length === 0 && (
              <p className="py-10 text-sm italic text-muted-foreground text-center">Nothing scheduled yet.</p>
            )}
          </div>

          <p className="eyebrow mb-8">02 — Replays</p>
          <div className="divide-y divide-[hsl(var(--accent)/0.15)] border-y border-[hsl(var(--accent)/0.15)]">
            {past.map((w) => {
              const d = new Date(w.scheduledAt);
              return (
                <div
                  key={w.id}
                  className="flex items-center gap-5 py-5"
                  data-testid={`webinar-past-${w.id}`}
                >
                  <PlayCircle size={28} className="text-accent shrink-0" strokeWidth={1.3} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <NicheBadge niche={w.niche} />
                      <span className="mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80">
                        {d.toLocaleDateString()} · {w.durationMin}m
                      </span>
                    </div>
                    <p className="serif text-lg font-normal leading-snug">{w.title}</p>
                    <p className="mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mt-0.5">
                      with {w.instructor}
                    </p>
                  </div>
                  <button
                    className="mono text-[10px] uppercase tracking-[0.18em] text-foreground hover:text-accent shrink-0"
                    data-testid={`button-watch-replay-${w.id}`}
                  >
                    Watch replay →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
