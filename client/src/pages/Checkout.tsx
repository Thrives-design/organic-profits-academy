import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Logo } from "@/components/Logo";
import { Check, Lock } from "lucide-react";
import { apiRequest, setAuthToken } from "@/lib/queryClient";
import { useSession } from "@/context/SessionContext";
import { PLANS } from "./Pricing";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const search = typeof window !== "undefined" ? window.location.hash.split("?")[1] ?? "" : "";
  const qs = new URLSearchParams(search);
  const initialPlan = qs.get("plan") || "full";
  const stripeSession = qs.get("stripe_session");
  const canceled = qs.get("canceled") === "1";
  const { setSession } = useSession();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [planType, setPlanType] = useState(initialPlan);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(!!stripeSession);

  const plan = useMemo(() => PLANS.find((p) => p.id === planType)!, [planType]);

  // If we returned from Stripe with a session ID, verify and log the user in
  useEffect(() => {
    if (!stripeSession) return;
    (async () => {
      try {
        const res = await apiRequest("POST", "/api/stripe/verify-session", { sessionId: stripeSession });
        const data = await res.json();
        setAuthToken(data.token);
        setSession(data.token, data.user);
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
              {/* Plan selector */}
              <div>
                <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4">1. Payment plan</h2>
                <RadioGroup value={planType} onValueChange={setPlanType} className="grid sm:grid-cols-2 gap-3">
                  {PLANS.map((p) => (
                    <label
                      key={p.id}
                      htmlFor={`plan-opt-${p.id}`}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${planType === p.id ? "border-accent bg-accent/5" : "border-card-border bg-card"}`}
                    >
                      <RadioGroupItem value={p.id} id={`plan-opt-${p.id}`} className="mt-0.5" data-testid={`radio-plan-${p.id}`} />
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <span className="font-medium">{p.label}</span>
                          <span className="serif text-lg">{p.amount}<span className="text-xs text-muted-foreground font-sans">{p.cadence}</span></span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{p.sub} · Total $1,100</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Account */}
              <div>
                <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4">2. Create your account</h2>
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
                  3. Secure payment <Lock size={11} className="text-muted-foreground" />
                </h2>
                <p className="text-sm text-muted-foreground">
                  Click below to continue to Stripe, our PCI-compliant payment processor. Your card details never touch our servers.
                </p>
              </div>

              <Button type="submit" disabled={submitting} className="w-full h-12 bg-primary text-primary-foreground font-medium" data-testid="button-complete-purchase">
                {submitting ? "Redirecting to Stripe..." : `Continue to Payment — ${plan.amount}${plan.cadence}`}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Secured by Stripe · 14-day money-back guarantee
              </p>
            </form>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-accent/30 bg-card p-6 gold-glow">
                <div className="flex items-center gap-3">
                  <Logo size={36} />
                  <div>
                    <div className="eyebrow text-accent text-[10px]">Your order</div>
                    <div className="serif text-lg">Lifetime Access</div>
                  </div>
                </div>
                <div className="hairline my-5" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Plan total</span><span>$1,100.00</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Installments</span><span>{plan.installments}</span></div>
                  <div className="flex justify-between font-medium"><span>Due today</span><span>{plan.installmentAmount === 1100 ? "$1,100.00" : `$${plan.installmentAmount}.00`}</span></div>
                </div>
                <div className="hairline my-5" />
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2"><Check size={12} className="mt-0.5 text-primary" /> Full curriculum forever</li>
                  <li className="flex items-start gap-2"><Check size={12} className="mt-0.5 text-primary" /> Live desk access</li>
                  <li className="flex items-start gap-2"><Check size={12} className="mt-0.5 text-primary" /> Community + forum</li>
                  <li className="flex items-start gap-2"><Check size={12} className="mt-0.5 text-primary" /> 14-day refund</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
}
