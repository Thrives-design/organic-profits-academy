import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowBigUp, Plus } from "lucide-react";

const CATEGORIES = ["Strategy", "Psychology", "Tools", "Wins", "Ask a Question"];

export function Forum() {
  const { data: posts = [] } = useQuery<any[]>({ queryKey: ["/api/forum/posts"] });
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState(false);

  const filtered = category === "All" ? posts : posts.filter((p) => p.category === category);

  return (
    <div>
      {/* Filter rail */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
          <span className="eyebrow-subtle text-[10px]">Filter</span>
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                category === c ? "text-accent" : "text-foreground/50 hover:text-foreground"
              }`}
              data-testid={`forum-filter-${c}`}
            >
              {c}
            </button>
          ))}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="bg-accent text-[hsl(var(--warm-black))] mono text-[10px] uppercase tracking-[0.2em] h-10 px-5 inline-flex items-center gap-2 hover:bg-[hsl(var(--success))] hover:text-[hsl(var(--off-white))] transition-colors"
              data-testid="button-new-post"
            >
              <Plus size={13} /> New post
            </button>
          </DialogTrigger>
          <NewPostDialog onClose={() => setOpen(false)} />
        </Dialog>
      </div>

      {/* Threads — hairline separated list, no boxed card */}
      <div className="divide-y divide-[hsl(var(--accent)/0.15)] border-y border-[hsl(var(--accent)/0.15)]">
        {filtered.map((p) => (
          <Link key={p.id} href={`/community/forum/${p.id}`} data-testid={`forum-post-${p.id}`}>
            <a className="group block py-6">
              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-0.5 shrink-0 w-10">
                  <ArrowBigUp size={16} className="text-accent" strokeWidth={1.5} />
                  <span className="mono text-[11px] text-foreground/80">{p.upvotes}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2 mono text-[10px] uppercase tracking-[0.15em]">
                    <span className="text-accent">{p.category}</span>
                    <span className="text-muted-foreground/70">/ by {p.authorName}</span>
                  </div>
                  <h3 className="serif text-xl md:text-2xl font-normal leading-[1.15] group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl">
                    {p.body}
                  </p>
                </div>
              </div>
            </a>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="py-14 text-sm italic text-muted-foreground text-center">No posts in this category yet.</p>
        )}
      </div>
    </div>
  );
}

function NewPostDialog({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const m = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/forum/posts", { title, body, category });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setTitle("");
      setBody("");
      onClose();
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="serif text-2xl font-normal">New post</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          m.mutate();
        }}
        className="space-y-5 mt-2"
        data-testid="form-new-post"
      >
        <div>
          <Label htmlFor="post-cat" className="mono text-[10px] uppercase tracking-[0.15em]">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="post-cat" className="mt-2" data-testid="select-post-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="post-title" className="mono text-[10px] uppercase tracking-[0.15em]">Title</Label>
          <Input
            id="post-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2"
            data-testid="input-post-title"
          />
        </div>
        <div>
          <Label htmlFor="post-body" className="mono text-[10px] uppercase tracking-[0.15em]">Body</Label>
          <Textarea
            id="post-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            required
            className="mt-2"
            data-testid="textarea-post-body"
          />
        </div>
        <Button
          type="submit"
          className="bg-accent text-[hsl(var(--warm-black))] mono text-[11px] uppercase tracking-[0.22em] h-12 w-full rounded-none hover:bg-[hsl(var(--success))] hover:text-[hsl(var(--off-white))]"
          disabled={m.isPending}
          data-testid="button-submit-post"
        >
          {m.isPending ? "Posting..." : "Publish post"}
        </Button>
      </form>
    </DialogContent>
  );
}
