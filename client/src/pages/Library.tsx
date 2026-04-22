import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { VideoThumbnail } from "@/components/VideoThumbnail";
import { NicheBadge } from "@/components/NicheBadge";
import { useSession } from "@/context/SessionContext";
import { Button } from "@/components/ui/button";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "crypto", label: "Crypto" },
  { id: "forex", label: "Forex" },
  { id: "options", label: "Options" },
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
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row mb-16">
            <div className="md:max-w-xl">
              <p className="eyebrow mb-5">01 — On-demand library</p>
              <h1 className="display-xl serif italic">{filtered.length} <span className="not-italic">sessions.</span></h1>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
                Every session is archived with chapters and annotated charts. Filter by niche or level.
              </p>
            </div>
            {!isMember && (
              <Link href="/pricing" data-testid="link-library-unlock">
                <Button className="bg-primary text-primary-foreground font-medium h-11 px-6 rounded-none">
                  Unlock for $1,100
                </Button>
              </Link>
            )}
          </div>

          <div className="flex flex-wrap gap-6 mb-14 hairline-bottom pb-6">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`eyebrow-subtle transition-colors ${filter === f.id ? "text-accent" : "text-muted-foreground hover:text-accent"}`}
                data-testid={`filter-${f.id}`}
              >
                {f.label}
                {filter === f.id && <span className="ml-2 inline-block h-px w-4 align-middle bg-accent" />}
              </button>
            ))}
          </div>

          <div className="grid gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => {
              const locked = !isMember;
              const Card = (
                <div className={`group relative ${locked ? "opacity-85" : ""}`}>
                  <div className="overflow-hidden border border-border/60 transition-all duration-500 group-hover:border-accent/50">
                    <VideoThumbnail niche={v.niche} title={v.title} color={v.thumbnailColor} locked={locked} className={`${locked ? "blur-[2px]" : ""} transition-transform duration-700 group-hover:scale-[1.02]`} />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <NicheBadge niche={v.niche} />
                      <span className="eyebrow-subtle">{v.level}</span>
                      <span className="eyebrow-subtle ml-auto">{v.duration}</span>
                    </div>
                    <h3 className="serif text-xl leading-tight tracking-tight">{v.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 mono">{v.instructor.toUpperCase()}</p>
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
