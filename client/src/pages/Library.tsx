import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { VideoThumbnail } from "@/components/VideoThumbnail";
import { NicheBadge } from "@/components/NicheBadge";
import { useSession } from "@/context/SessionContext";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "crypto", label: "Crypto" },
  { id: "futures", label: "Futures" },
  { id: "options", label: "Options" },
  { id: "forex", label: "Forex" },
  { id: "beginner", label: "Beginner" },
  { id: "advanced", label: "Advanced" },
];

export default function Library() {
  const { user } = useSession();
  const { data: videos = [] } = useQuery<any[]>({ queryKey: ["/api/videos"] });
  const [filter, setFilter] = useState("all");
  const isMember = !!user?.isMember;

  const filtered = videos.filter((v) => {
    if (filter === "all") return true;
    if (filter === "beginner" || filter === "advanced") return v.level === filter;
    return v.niche === filter;
  });

  return (
    <Layout>
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4 flex-col md:flex-row mb-8">
            <div>
              <p className="eyebrow mb-2">On-demand library</p>
              <h1 className="serif text-4xl md:text-5xl tracking-tight">{filtered.length} sessions</h1>
              <p className="mt-3 text-muted-foreground max-w-xl text-sm">
                Every session is archived with chapters and annotated charts. Filter by niche or level.
              </p>
            </div>
            {!isMember && (
              <Link href="/pricing" data-testid="link-library-unlock">
                <Button className="bg-primary text-primary-foreground">Unlock for $1,100</Button>
              </Link>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-10 border-b border-border pb-5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${filter === f.id ? "border-accent bg-accent/10 text-accent" : "border-border text-foreground/70 hover:border-accent/40"}`}
                data-testid={`filter-${f.id}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => {
              const locked = !isMember;
              const Card = (
                <div className={`relative gold-glow ${locked ? "opacity-85" : ""}`}>
                  <VideoThumbnail niche={v.niche} title={v.title} color={v.thumbnailColor} locked={locked} className={locked ? "blur-[2px]" : ""} />
                  <div className="mt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <NicheBadge niche={v.niche} />
                      <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{v.level}</span>
                      <span className="text-[11px] text-muted-foreground ml-auto">{v.duration}</span>
                    </div>
                    <h3 className="font-medium text-[15px] leading-snug">{v.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{v.instructor}</p>
                  </div>
                </div>
              );
              if (locked) {
                return (
                  <Link key={v.id} href="/pricing" data-testid={`video-locked-${v.id}`}>
                    <a className="block">{Card}</a>
                  </Link>
                );
              }
              return (
                <Link key={v.id} href={`/library/${v.id}`} data-testid={`video-card-${v.id}`}>
                  <a className="block">{Card}</a>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
