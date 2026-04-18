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
import { ArrowBigUp, MessageSquare, Plus } from "lucide-react";

const CATEGORIES = ["Strategy", "Psychology", "Tools", "Wins", "Ask a Question"];

export function Forum() {
  const { data: posts = [] } = useQuery<any[]>({ queryKey: ["/api/forum/posts"] });
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState(false);

  const filtered = category === "All" ? posts : posts.filter((p) => p.category === category);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3.5 py-1 text-xs font-medium ${category === c ? "border-accent bg-accent/10 text-accent" : "border-border text-foreground/70 hover:border-accent/40"}`}
              data-testid={`forum-filter-${c}`}
            >{c}</button>
          ))}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground" data-testid="button-new-post">
              <Plus size={14} className="mr-1" /> New post
            </Button>
          </DialogTrigger>
          <NewPostDialog onClose={() => setOpen(false)} />
        </Dialog>
      </div>

      <div className="divide-y divide-border border border-card-border rounded-xl bg-card overflow-hidden">
        {filtered.map((p) => (
          <Link key={p.id} href={`/community/forum/${p.id}`} data-testid={`forum-post-${p.id}`}>
            <a className="block hover-elevate p-5">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-0.5 shrink-0 w-10">
                  <ArrowBigUp size={18} className="text-accent" />
                  <span className="serif text-lg leading-none">{p.upvotes}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="rounded-full border border-accent/40 bg-accent/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-accent">{p.category}</span>
                    <span className="text-xs text-muted-foreground">· by {p.authorName}</span>
                  </div>
                  <h3 className="serif text-lg leading-snug">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.body}</p>
                </div>
              </div>
            </a>
          </Link>
        ))}
        {filtered.length === 0 && <p className="p-8 text-sm text-muted-foreground text-center">No posts in this category yet.</p>}
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
      setTitle(""); setBody("");
      onClose();
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="serif text-2xl">New post</DialogTitle>
      </DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="space-y-4" data-testid="form-new-post">
        <div>
          <Label htmlFor="post-cat">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="post-cat" data-testid="select-post-category"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="post-title">Title</Label>
          <Input id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} required data-testid="input-post-title" />
        </div>
        <div>
          <Label htmlFor="post-body">Body</Label>
          <Textarea id="post-body" value={body} onChange={(e) => setBody(e.target.value)} rows={6} required data-testid="textarea-post-body" />
        </div>
        <Button type="submit" className="bg-primary text-primary-foreground w-full" disabled={m.isPending} data-testid="button-submit-post">
          {m.isPending ? "Posting..." : "Publish post"}
        </Button>
      </form>
    </DialogContent>
  );
}
