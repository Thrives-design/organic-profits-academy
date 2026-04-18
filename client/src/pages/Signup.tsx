import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const { signup } = useSession();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, name);
      toast({ title: "Account created", description: "Browse free previews or upgrade to lifetime." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  }

  return (
    <Layout hideFooter>
      <section className="py-20">
        <div className="mx-auto max-w-md px-6">
          <div className="text-center mb-8">
            <p className="eyebrow mb-3">Create a free account</p>
            <h1 className="serif text-4xl tracking-tight">Join the community.</h1>
            <p className="mt-2 text-sm text-muted-foreground">Browse free previews. Upgrade to lifetime anytime.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-card-border bg-card p-8 gold-glow" data-testid="form-signup">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required data-testid="input-signup-name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="input-signup-email" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="input-signup-password" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground h-11" data-testid="button-signup">
              {loading ? "Creating..." : "Create account"}
            </Button>
            <p className="text-xs text-muted-foreground text-center pt-2">
              Already a member? <Link href="/login"><a className="text-accent hover:underline">Sign in</a></Link>
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
}
