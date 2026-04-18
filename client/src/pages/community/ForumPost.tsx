import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowBigUp, ArrowLeft, MessageSquare } from "lucide-react";
import { useSession } from "@/context/SessionContext";

export default function ForumPost() {
  const [, params] = useRoute("/community/forum/:id");
  const id = Number(params?.id);
  const { user } = useSession();
  const [reply, setReply] = useState("");

  const { data } = useQuery<{ post: any; replies: any[] }>({
    queryKey: ["/api/forum/posts", String(id)],
  });

  const upvoteM = useMutation({
    mutationFn: async () => { await apiRequest("POST", `/api/forum/posts/${id}/upvote`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", String(id)] }),
  });
  const replyM = useMutation({
    mutationFn: async () => { await apiRequest("POST", `/api/forum/posts/${id}/reply`, { body: reply }); },
    onSuccess: () => { setReply(""); queryClient.invalidateQueries({ queryKey: ["/api/forum/posts", String(id)] }); },
  });

  if (!data?.post) return <Layout><div className="mx-auto max-w-3xl px-6 py-20 text-muted-foreground">Loading…</div></Layout>;
  const { post, replies } = data;

  return (
    <Layout>
      <section className="py-10">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/community" data-testid="link-back-forum">
            <a className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent mb-6">
              <ArrowLeft size={12} /> Back to community
            </a>
          </Link>

          <article className="rounded-xl border border-card-border bg-card p-7 gold-glow">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full border border-accent/40 bg-accent/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-accent">{post.category}</span>
              <span className="text-xs text-muted-foreground">· by {post.authorName}</span>
            </div>
            <h1 className="serif text-3xl md:text-4xl tracking-tight">{post.title}</h1>
            <p className="mt-5 text-foreground/90 leading-relaxed whitespace-pre-wrap">{post.body}</p>
            <div className="mt-6 flex items-center gap-4 text-sm">
              <button
                onClick={() => upvoteM.mutate()}
                className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/5 px-3 py-1 text-accent hover:bg-accent/10"
                data-testid="button-upvote-post"
              >
                <ArrowBigUp size={16} /> {post.upvotes}
              </button>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MessageSquare size={13} /> {replies.length} replies
              </span>
            </div>
          </article>

          <div className="mt-8">
            <h2 className="serif text-xl mb-4">{replies.length} {replies.length === 1 ? "reply" : "replies"}</h2>
            <div className="space-y-3">
              {replies.map((r: any) => (
                <div key={r.id} className="rounded-lg border border-border bg-card p-4" data-testid={`reply-${r.id}`}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="font-medium">{r.authorName}</span>
                    <span className="text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>

            {user?.isMember && (
              <form onSubmit={(e) => { e.preventDefault(); if (reply.trim()) replyM.mutate(); }} className="mt-6 rounded-lg border border-card-border bg-card p-4" data-testid="form-reply">
                <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={4} placeholder="Add your reply…" data-testid="textarea-reply" />
                <div className="flex justify-end mt-2">
                  <Button type="submit" size="sm" className="bg-primary text-primary-foreground" disabled={replyM.isPending} data-testid="button-submit-reply">
                    {replyM.isPending ? "Posting..." : "Post reply"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
