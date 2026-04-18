import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { NicheBadge } from "@/components/NicheBadge";
import { Button } from "@/components/ui/button";
import { Check, FileText, MessageSquare, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useSession } from "@/context/SessionContext";

export default function VideoPlayer() {
  const [, params] = useRoute("/library/:id");
  const id = Number(params?.id);
  const { user } = useSession();
  const { data: video } = useQuery<any>({ queryKey: ["/api/videos", String(id)] });
  const [completed, setCompleted] = useState(false);
  const [comments, setComments] = useState<{ name: string; body: string; time: string }[]>([
    { name: "Jordan H.", body: "The annotated chart at 14:22 is gold. Rewatched that three times.", time: "2h ago" },
    { name: "Priya K.", body: "Saving this one for my weekly review.", time: "1d ago" },
    { name: "Marcus T.", body: "Tried this on ES Monday morning — worked cleanly.", time: "3d ago" },
  ]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (user?.isMember && id) {
      apiRequest("POST", `/api/videos/${id}/view`).catch(() => {});
    }
  }, [id, user?.isMember]);

  async function markComplete() {
    setCompleted(true);
    if (user?.isMember) {
      await apiRequest("POST", `/api/videos/${id}/complete`).catch(() => {});
    }
  }

  function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !user) return;
    setComments((c) => [{ name: user.name, body: draft.trim(), time: "just now" }, ...c]);
    setDraft("");
  }

  if (!video) return <Layout><div className="mx-auto max-w-7xl px-6 py-20">Loading…</div></Layout>;

  if (!user?.isMember) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="serif text-4xl">Lifetime members only</h1>
          <p className="mt-3 text-muted-foreground">Unlock the full library for $1,100.</p>
          <Link href="/pricing"><Button className="mt-6 bg-primary">Join the Academy</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/library" data-testid="link-back-library">
            <a className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent mb-4">
              <ArrowLeft size={12} /> Back to library
            </a>
          </Link>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-xl overflow-hidden border border-card-border bg-black">
                <video
                  src={video.videoUrl}
                  controls
                  className="aspect-video w-full"
                  poster=""
                  data-testid="video-player"
                />
              </div>
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-2">
                  <NicheBadge niche={video.niche} />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{video.level}</span>
                  <span className="text-xs text-muted-foreground">· {video.duration}</span>
                </div>
                <h1 className="serif text-3xl md:text-4xl tracking-tight">{video.title}</h1>
                <p className="mt-4 text-muted-foreground leading-relaxed">{video.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">Taught by <span className="text-foreground">{video.instructor}</span></p>
                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={markComplete}
                    variant={completed ? "outline" : "default"}
                    className={completed ? "border-primary text-primary" : "bg-primary text-primary-foreground"}
                    data-testid="button-mark-complete"
                  >
                    <Check size={14} className="mr-1.5" /> {completed ? "Completed" : "Mark complete"}
                  </Button>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="serif text-xl mb-4 flex items-center gap-2"><FileText size={16} /> Notes & resources</h2>
                <ul className="space-y-2 rounded-lg border border-card-border bg-card p-5 text-sm">
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Chart template (TradingView export)</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> PDF: Annotated checklist for the setup</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Spreadsheet: Position sizing calculator</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-primary" /> Further reading: Two links in description</li>
                </ul>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <h2 className="serif text-xl mb-4 flex items-center gap-2"><MessageSquare size={16} /> Discussion</h2>
              <form onSubmit={postComment} className="rounded-lg border border-card-border bg-card p-4">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Share a thought or ask a question…"
                  className="w-full bg-transparent resize-none text-sm placeholder:text-muted-foreground focus:outline-none"
                  rows={3}
                  data-testid="textarea-comment"
                />
                <div className="flex justify-end mt-2">
                  <Button type="submit" size="sm" className="bg-primary text-primary-foreground" data-testid="button-post-comment">Post</Button>
                </div>
              </form>
              <div className="mt-4 space-y-4">
                {comments.map((c, i) => (
                  <div key={i} className="rounded-lg border border-border p-3 text-sm" data-testid={`comment-${i}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-[11px] text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{c.body}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
}
