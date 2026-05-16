import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ResetPassword() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Token can arrive in two places depending on whether the email client
    // preserved the URL fragment:
    //   1. Hash route:  /#/reset-password?token=...  -> read from window.location.hash
    //   2. Bare path:   /reset-password?token=...    -> read from window.location.search
    //                                                  (handled by the static
    //                                                  reset-password.html which
    //                                                  forwards into the SPA)
    const tryGetToken = () => {
      // Check standard query string first.
      const searchParams = new URLSearchParams(window.location.search || "");
      let t = searchParams.get("token");
      if (t) return t;
      // Fall back to the hash portion.
      const hash = window.location.hash || "";
      const queryStart = hash.indexOf("?");
      if (queryStart >= 0) {
        const params = new URLSearchParams(hash.slice(queryStart + 1));
        t = params.get("token");
        if (t) return t;
      }
      return null;
    };
    const t = tryGetToken();
    if (t) setToken(t);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await apiRequest("POST", "/api/auth/reset-password", { token, password });
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: any) {
      const msg = (err?.message || "").replace(/^\d+:\s*/, "");
      toast({
        title: "Couldn't reset password",
        description: msg || "Please request a new reset link.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout hideFooter>
      <section className="py-20">
        <div className="mx-auto max-w-md px-6">
          <div className="text-center mb-8">
            <p className="eyebrow mb-3">Account recovery</p>
            <h1 className="serif text-4xl tracking-tight">Choose a new password.</h1>
          </div>

          {!token ? (
            <div className="rounded-xl border border-card-border bg-card p-8 text-center space-y-3">
              <h2 className="serif text-xl">Missing reset token.</h2>
              <p className="text-sm text-muted-foreground">
                This page needs a valid reset link. Request a new one below.
              </p>
              <div className="pt-2">
                <Link href="/forgot-password" data-testid="link-request-reset">
                  <a className="text-accent hover:underline text-sm">Request a reset link</a>
                </Link>
              </div>
            </div>
          ) : done ? (
            <div
              className="rounded-xl border border-card-border bg-card p-8 gold-glow text-center space-y-3"
              data-testid="status-reset-done"
            >
              <h2 className="serif text-xl">Password updated.</h2>
              <p className="text-sm text-muted-foreground">
                Redirecting you to sign in...
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="space-y-4 rounded-xl border border-card-border bg-card p-8 gold-glow"
              data-testid="form-reset-password"
            >
              <div>
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoFocus
                  data-testid="input-reset-password"
                />
                <p className="mt-1 text-xs text-muted-foreground">At least 8 characters.</p>
              </div>
              <div>
                <Label htmlFor="confirm">Confirm new password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  data-testid="input-reset-confirm"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground h-11"
                data-testid="button-reset-submit"
              >
                {loading ? "Updating..." : "Update password"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
