import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Check, Lock } from "lucide-react";
import { apiRequest, setAuthToken } from "@/lib/queryClient";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const search = typeof window !== "undefined" ? window.location.hash.split("?")[1] ?? "" : "";
  const qs = new URLSearchParams(search);
  const initialPlan = qs.get("plan") || "monthly";
  const stripeSession = qs.get("stripe_session");
  const canceled = qs.get("canceled") === "1";
  const { setSession } = useSession();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [planType] = useState(initialPlan);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(!!stripeSession);

  const plan = { id: "monthly", label: "Monthly Membership", amount: "$600", cadence: "/ month", installments: 1, installmentAmount: 600 };

  // If we returned from Stripe with a session ID, verify and log the user in
  useEffect(() => {
    if (!stripeSession) return;
    (async () => {
      try {
        const res = await apiRequest("POST", "/api/stripe/verify-session", { sessionId: stripeSession });
        const data = await res.json();
        setAuthToken(data.token);
        setSession(data.token, data.user);
        // Track the conversion — use the plan returned by the server (most accurate)
        try {
          const planLabel = data?.planType || planType || "unknown";
          (await import("@/lib/analytics")).trackPurchaseCompleted(planLabel);
        } catch {}
        toast({
          title: "Welcome to the Academy",
          description: "Your membership is active. Let's go.",
        });
        navigate("/dashboard");
      } catch (err: any) {
        toast({
          title: "Could not verify payment",
          description: err.message || "Please contact support.",
          variant: "destructive",
        });
        setVerifying(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripeSession]);

  // Show a friendly notice if user came back from a canceled checkout
  useEffect(() => {
    if (canceled) {
      toast({
        title: "Checkout canceled",
        description: "No worries — your spot is still here when you're ready.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({ title: "Missing info", description: "Fill in name, email, and password.", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/stripe/create-checkout-session", {
        name, email, password, planType,
      });
      const data = await res.json();
      if (!data.url) {
        throw new Error("No checkout URL returned");
      }
      // Track conversion event before redirect
      try { (await import("@/lib/analytics")).trackCheckoutStarted(planType); } catch {}
      // Redirect to Stripe-hosted checkout
      window.location.href = data.url;
    } catch (err: any) {
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
      setSubmitting(false);
    }
  }

  if (verifying) {
    return (
      <Layout hideFooter>
        <section className="py-32">
          <div className="mx-auto max-w-md px-6 text-center">
            <Logo size={64} className="mx-auto mb-8" />
            <p className="eyebrow mb-4">Confirming your payment</p>
            <h1 className="serif text-3xl mb-4">Just a moment...</h1>
            <p className="text-muted-foreground">
              We're verifying your purchase with Stripe and setting up your account.
            </p>
            <div className="mt-8 inline-block h-2 w-12 bg-accent/20 overflow-hidden">
              <div className="h-full w-1/3 bg-accent animate-[loading_1.2s_ease-in-out_infinite]" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mb-8">
            <p className="eyebrow mb-2">Checkout</p>
            <h1 className="serif text-4xl md:text-5xl tracking-tight">Join the Academy.</h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <form onSubmit={onSubmit} className="lg:col-span-2 space-y-8" data-testid="form-checkout">
              {/* Plan summary */}
              <div className="rounded-lg border border-[hsl(var(--brand-gold))] bg-card p-5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="eyebrow text-[11px] mb-1">Your plan</div>
                    <div className="serif text-xl">Monthly Membership</div>
                  </div>
                  <div className="text-right">
                    <div className="serif text-3xl">$600</div>
                    <div className="mono text-[11px] text-muted-foreground uppercase tracking-widest-editorial">/ month</div>
                  </div>
                </div>
                <p className="mt-3 text-[13px] text-muted-foreground">Cancel anytime before your next billing date.</p>
              </div>

              {/* Account */}
              <div>
                <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4">1. Create your account</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required data-testid="input-name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="input-email" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} data-testid="input-password" />
                    <p className="text-xs text-muted-foreground mt-1">At least 8 characters. You'll use this to log in.</p>
                  </div>
                </div>
              </div>

              {/* Payment info notice */}
              <div className="rounded-lg border border-card-border bg-card p-5">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                  2. Secure payment <Lock size={11} className="text-muted-foreground" />
                </h2>
                <p className="text-sm text-muted-foreground">
                  Click below to continue to Stripe, our PCI-compliant payment processor. Your card details never touch our servers.
                </p>
              </div>

              <Button type="submit" disabled={submitting} className="w-full h-12 bg-primary text-primary-foreground font-medium" data-testid="button-complete-purchase">
                {submitting ? "Redirecting to Stripe..." : `Continue to Payment — ${plan.amount}${plan.cadence}`}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Secured by Stripe · Cancel anytime · 7-day money-back guarantee
              </p>
            </form>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-[hsl(var(--brand-gold))] bg-card p-6">
                <div className="flex items-center gap-3">
                  <Logo size={36} />
                  <div>
                    <div className="eyebrow text-accent text-[10px]">Your order</div>
                    <div className="serif text-lg">Monthly Membership</div>
                  </div>
                </div>
                <div className="hairline my-5" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Billed monthly</span><span>$600.00</span></div>
                  <div className="flex justify-between font-medium"><span>Due today</span><span>$600.00</span></div>
                </div>
                <div className="hairline my-5" />
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2"><Check size={12} className="mt-0.5 text-primary" /> 40+ webinars included</li>
                  <li className="flex items-start gap-2"><Check size={12} className="mt-0.5 text-primary" /> Live desk access</li>
                  <li className="flex items-start gap-2"><Check size={12} className="mt-0.5 text-primary" /> Private Telegram house</li>
                  <li className="flex items-start gap-2"><Check size={12} className="mt-0.5 text-primary" /> Cancel anytime</li>
                  <li className="flex items-start gap-2"><Check size={12} className="mt-0.5 text-primary" /> 7-day guarantee</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
}
