import { Link } from "wouter";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/context/SessionContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Trash2 } from "lucide-react";

export default function Admin() {
  const { user } = useSession();
  const [tab, setTab] = useState("videos");

  if (!user?.isAdmin) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="serif text-4xl">Admin access required</h1>
          <p className="mt-3 text-muted-foreground">Sign in as admin@organicprofits.com / admin123.</p>
          <Link href="/login"><Button className="mt-6 bg-primary">Sign in</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8">
            <p className="eyebrow mb-2">Admin</p>
            <h1 className="serif text-4xl tracking-tight">Control panel</h1>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="videos" data-testid="admin-tab-videos">Videos</TabsTrigger>
              <TabsTrigger value="webinars" data-testid="admin-tab-webinars">Webinars</TabsTrigger>
              <TabsTrigger value="members" data-testid="admin-tab-members">Members</TabsTrigger>
              <TabsTrigger value="forum" data-testid="admin-tab-forum">Forum</TabsTrigger>
              <TabsTrigger value="products" data-testid="admin-tab-products">Products</TabsTrigger>
              <TabsTrigger value="orders" data-testid="admin-tab-orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="videos"><VideosTab /></TabsContent>
            <TabsContent value="webinars"><WebinarsTab /></TabsContent>
            <TabsContent value="members"><MembersTab /></TabsContent>
            <TabsContent value="forum"><ForumTab /></TabsContent>
            <TabsContent value="products"><ProductsTab /></TabsContent>
            <TabsContent value="orders"><OrdersTab /></TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}

function Table({ head, children }: { head: string[]; children: any }) {
  return (
    <div className="rounded-xl border border-card-border bg-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border">
          <tr>{head.map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

function VideosTab() {
  const { data: videos = [] } = useQuery<any[]>({ queryKey: ["/api/videos"] });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", niche: "crypto", level: "advanced",
    duration: "", instructor: "", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailColor: "#f59e0b",
  });

  const createM = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/videos", form);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setOpen(false);
      setForm({ ...form, title: "", description: "", duration: "", instructor: "" });
    },
  });
  const deleteM = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/videos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/videos"] }),
  });

  return (
    <div>
      <div className="flex justify-between mb-4">
        <p className="text-sm text-muted-foreground">{videos.length} videos</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary text-primary-foreground" data-testid="button-add-video">
              <Plus size={14} className="mr-1" /> Add video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="serif text-2xl">Add video</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createM.mutate(); }} className="space-y-3" data-testid="form-add-video">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required data-testid="input-video-title" /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required data-testid="input-video-description" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Niche</Label>
                  <Select value={form.niche} onValueChange={(v) => setForm({ ...form, niche: v })}>
                    <SelectTrigger data-testid="select-video-niche"><SelectValue /></SelectTrigger>
                    <SelectContent>{["crypto", "futures", "options", "forex"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Level</Label>
                  <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                    <SelectTrigger data-testid="select-video-level"><SelectValue /></SelectTrigger>
                    <SelectContent>{["beginner", "advanced"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Duration</Label><Input placeholder="42:18" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required data-testid="input-video-duration" /></div>
                <div><Label>Instructor</Label><Input value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} required data-testid="input-video-instructor" /></div>
                <div className="col-span-2"><Label>Video URL</Label><Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} required data-testid="input-video-url" /></div>
                <div className="col-span-2"><Label>Thumbnail color (hex)</Label><Input value={form.thumbnailColor} onChange={(e) => setForm({ ...form, thumbnailColor: e.target.value })} required data-testid="input-video-color" /></div>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={createM.isPending} data-testid="button-submit-video">
                {createM.isPending ? "Adding..." : "Add video"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table head={["Title", "Niche", "Level", "Duration", "Instructor", ""]}>
        {videos.map((v: any) => (
          <tr key={v.id} className="hover-elevate" data-testid={`admin-video-${v.id}`}>
            <td className="px-4 py-3"><p className="font-medium line-clamp-1">{v.title}</p></td>
            <td className="px-4 py-3 capitalize"><Badge variant="outline" className="border-accent/40">{v.niche}</Badge></td>
            <td className="px-4 py-3 capitalize text-xs">{v.level}</td>
            <td className="px-4 py-3 mono text-xs">{v.duration}</td>
            <td className="px-4 py-3 text-xs">{v.instructor}</td>
            <td className="px-4 py-3 text-right">
              <button onClick={() => deleteM.mutate(v.id)} className="text-destructive hover:opacity-80" data-testid={`button-delete-video-${v.id}`}>
                <Trash2 size={14} />
              </button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function WebinarsTab() {
  const { data: webinars = [] } = useQuery<any[]>({ queryKey: ["/api/webinars"] });
  return (
    <Table head={["Title", "Niche", "When", "Instructor", "Status"]}>
      {webinars.map((w: any) => (
        <tr key={w.id} data-testid={`admin-webinar-${w.id}`}>
          <td className="px-4 py-3"><p className="font-medium">{w.title}</p></td>
          <td className="px-4 py-3 capitalize"><Badge variant="outline" className="border-accent/40">{w.niche}</Badge></td>
          <td className="px-4 py-3 text-xs mono">{new Date(w.scheduledAt).toLocaleString()}</td>
          <td className="px-4 py-3 text-xs">{w.instructor}</td>
          <td className="px-4 py-3"><Badge className={w.status === "upcoming" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}>{w.status}</Badge></td>
        </tr>
      ))}
    </Table>
  );
}

function MembersTab() {
  const { data: members = [] } = useQuery<any[]>({ queryKey: ["/api/admin/members"] });
  return (
    <Table head={["Name", "Email", "Plan", "Status", "Joined"]}>
      {members.map((m: any) => (
        <tr key={m.id} data-testid={`admin-member-${m.id}`}>
          <td className="px-4 py-3">
            <p className="font-medium">{m.name}</p>
            <p className="text-xs text-muted-foreground">{m.isAdmin ? "Admin" : m.isMember ? "Member" : "Free"}</p>
          </td>
          <td className="px-4 py-3 text-xs mono">{m.email}</td>
          <td className="px-4 py-3 text-xs">
            {m.plan ? <span>{m.plan.planType}</span> : <span className="text-muted-foreground">—</span>}
          </td>
          <td className="px-4 py-3 text-xs">
            {m.plan ? `${m.plan.paidInstallments}/${m.plan.totalInstallments} · $${m.plan.installmentAmount}` : "—"}
          </td>
          <td className="px-4 py-3 text-xs mono text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</td>
        </tr>
      ))}
    </Table>
  );
}

function ForumTab() {
  const { data: posts = [] } = useQuery<any[]>({ queryKey: ["/api/forum/posts"] });
  return (
    <Table head={["Title", "Category", "Author", "Upvotes", "Date"]}>
      {posts.map((p: any) => (
        <tr key={p.id} data-testid={`admin-post-${p.id}`}>
          <td className="px-4 py-3"><p className="font-medium line-clamp-1">{p.title}</p></td>
          <td className="px-4 py-3"><Badge variant="outline" className="border-accent/40 text-xs">{p.category}</Badge></td>
          <td className="px-4 py-3 text-xs">{p.authorName}</td>
          <td className="px-4 py-3 text-xs">{p.upvotes}</td>
          <td className="px-4 py-3 text-xs mono text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
        </tr>
      ))}
    </Table>
  );
}

function ProductsTab() {
  const { data: products = [] } = useQuery<any[]>({ queryKey: ["/api/products"] });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "tshirts", price: 42, description: "",
    colors: "navy,black,cream", sizes: "S,M,L,XL,XXL", baseColor: "#0c1b28",
  });
  const createM = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/products", {
        ...form,
        price: Number(form.price),
        colors: JSON.stringify(form.colors.split(",").map((s) => s.trim())),
        sizes: JSON.stringify(form.sizes.split(",").map((s) => s.trim())),
      });
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/products"] }); setOpen(false); },
  });
  return (
    <div>
      <div className="flex justify-between mb-4">
        <p className="text-sm text-muted-foreground">{products.length} products</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm" className="bg-primary text-primary-foreground" data-testid="button-add-product"><Plus size={14} className="mr-1" /> Add product</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="serif text-2xl">Add product</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createM.mutate(); }} className="space-y-3" data-testid="form-add-product">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["tshirts", "hoodies", "headwear", "sweatpants"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Price</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required /></div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
              <div><Label>Colors (comma)</Label><Input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} /></div>
              <div><Label>Sizes (comma)</Label><Input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} /></div>
              <div><Label>Base color (hex)</Label><Input value={form.baseColor} onChange={(e) => setForm({ ...form, baseColor: e.target.value })} /></div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={createM.isPending}>Add product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table head={["Name", "Category", "Price", "Colors", "Sizes"]}>
        {products.map((p: any) => (
          <tr key={p.id} data-testid={`admin-product-${p.id}`}>
            <td className="px-4 py-3"><p className="font-medium">{p.name}</p></td>
            <td className="px-4 py-3 text-xs capitalize">{p.category}</td>
            <td className="px-4 py-3 serif">${p.price}</td>
            <td className="px-4 py-3 text-xs">{JSON.parse(p.colors).join(", ")}</td>
            <td className="px-4 py-3 text-xs">{JSON.parse(p.sizes).join(", ")}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function OrdersTab() {
  const { data: orders = [] } = useQuery<any[]>({ queryKey: ["/api/orders"] });
  return (
    <Table head={["Order #", "Type", "Email", "Subtotal", "Status", "Date"]}>
      {orders.map((o: any) => (
        <tr key={o.id} data-testid={`admin-order-${o.id}`}>
          <td className="px-4 py-3 mono text-xs">{o.orderNumber}</td>
          <td className="px-4 py-3"><Badge className={o.type === "membership" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}>{o.type}</Badge></td>
          <td className="px-4 py-3 text-xs mono">{o.email}</td>
          <td className="px-4 py-3 serif">${o.subtotal.toFixed(2)}</td>
          <td className="px-4 py-3 text-xs">{o.status}</td>
          <td className="px-4 py-3 text-xs mono text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
        </tr>
      ))}
      {orders.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No orders yet.</td></tr>}
    </Table>
  );
}
