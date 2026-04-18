import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { login } = useSession();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  }

  return (
    <Layout hideFooter>
      <section className="py-20">
        <div className="mx-auto max-w-md px-6">
          <div className="text-center mb-8">
            <p className="eyebrow mb-3">Member portal</p>
            <h1 className="serif text-4xl tracking-tight">Welcome back.</h1>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-card-border bg-card p-8 gold-glow" data-testid="form-login">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="input-login-email" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="input-login-password" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground h-11" data-testid="button-login">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-xs text-muted-foreground text-center pt-2">
              New here? <Link href="/signup" data-testid="link-signup"><a className="text-accent hover:underline">Create an account</a></Link>
            </p>
          </form>

          <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1.5">Demo accounts</p>
            <p><span className="mono">admin@organicprofits.com</span> / admin123</p>
            <p><span className="mono">demo@organicprofits.com</span> / demo1234</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
