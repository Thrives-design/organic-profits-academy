import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("POST", "/api/auth/forgot-password", { email });
      try { (await import("@/lib/analytics")).trackForgotPasswordRequested(); } catch {}
      setSent(true);
    } catch {
      // We intentionally show the same success state either way so we don't
      // leak whether an email is in our system.
      setSent(true);
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
            <h1 className="serif text-4xl tracking-tight">Forgot your password?</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Enter your email and we'll send you a link to reset it.
            </p>
          </div>

          {sent ? (
            <div
              className="rounded-xl border border-card-border bg-card p-8 gold-glow text-center space-y-4"
              data-testid="status-forgot-sent"
            >
              <h2 className="serif text-xl">Check your email.</h2>
              <p className="text-sm text-muted-foreground">
                If an account exists for <span className="text-foreground">{email}</span>, we just
                sent a reset link to it. The link is valid for 1 hour.
              </p>
              <p className="text-xs text-muted-foreground">
                Don't see it? Check your spam folder, or email us at{" "}
                <a href="mailto:support@organicprofitsacademy.com" className="text-accent hover:underline">
                  support@organicprofitsacademy.com
                </a>
                .
              </p>
              <div className="pt-2">
                <Link href="/login" data-testid="link-back-to-login">
                  <a className="text-accent hover:underline text-sm">Back to sign in</a>
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="space-y-4 rounded-xl border border-card-border bg-card p-8 gold-glow"
              data-testid="form-forgot-password"
            >
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  data-testid="input-forgot-email"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground h-11"
                data-testid="button-forgot-submit"
              >
                {loading ? "Sending..." : "Send reset link"}
              </Button>
              <p className="text-xs text-muted-foreground text-center pt-2">
                Remembered it?{" "}
                <Link href="/login" data-testid="link-login">
                  <a className="text-accent hover:underline">Back to sign in</a>
                </Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
