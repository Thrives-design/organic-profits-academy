import { useState, useMemo } from "react";
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
  const { setSession } = useSession();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [planType, setPlanType] = useState(initialPlan);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const plan = useMemo(() => PLANS.find((p) => p.id === planType)!, [planType]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({ title: "Missing info", description: "Fill in name, email, and password.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/checkout/membership", {
        name, email, password, planType,
      });
      const data = await res.json();
      setAuthToken(data.token);
      setSession(data.token, data.user);
      toast({ title: "Welcome to the Academy", description: "Your lifetime membership is active." });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
    } finally { setSubmitting(false); }
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
                <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4">2. Create account</h2>
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
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="input-password" />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4 flex items-center gap-1.5">
                  3. Payment <Lock size={11} className="text-muted-foreground" />
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="card">Card number</Label>
                    <Input id="card" inputMode="numeric" placeholder="4242 4242 4242 4242" value={card} onChange={(e) => setCard(e.target.value)} required data-testid="input-card" />
                  </div>
                  <div>
                    <Label htmlFor="exp">Expiration</Label>
                    <Input id="exp" placeholder="MM / YY" value={exp} onChange={(e) => setExp(e.target.value)} required data-testid="input-exp" />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" inputMode="numeric" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} required data-testid="input-cvc" />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP</Label>
                    <Input id="zip" inputMode="numeric" placeholder="90210" value={zip} onChange={(e) => setZip(e.target.value)} required data-testid="input-zip" />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full h-12 bg-primary text-primary-foreground font-medium" data-testid="button-complete-purchase">
                {submitting ? "Processing..." : `Complete Purchase — ${plan.amount}${plan.cadence}`}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Secured checkout · 14-day money-back guarantee · Payments are simulated in this demo
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
