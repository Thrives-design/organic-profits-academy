import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProductMockup } from "@/components/ProductMockup";
import { useCart } from "@/context/CartContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Lock, Check } from "lucide-react";

export default function ShopCheckout() {
  const { items, subtotal, clear } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("United States");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal >= 75 ? 0 : 9;
  const total = subtotal + shipping;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/checkout/merch", {
        items,
        email,
        subtotal,
        shipping: { name, address, city, state, zip, country },
      });
      const order = await res.json();
      setOrderNumber(order.orderNumber);
      clear();
    } catch (err: any) {
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
    } finally { setSubmitting(false); }
  }

  if (orderNumber) {
    return (
      <Layout>
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
            <Check size={28} strokeWidth={2.4} />
          </div>
          <h1 className="serif text-4xl">Order confirmed</h1>
          <p className="mt-3 text-muted-foreground">Thank you for supporting the academy.</p>
          <p className="mt-6 mono text-sm text-accent">{orderNumber}</p>
          <p className="mt-1 text-xs text-muted-foreground">A receipt will arrive in your inbox. Shipping in 3 business days.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/shop"><Button variant="outline" className="border-accent/40">Continue shopping</Button></Link>
            <Link href="/"><Button className="bg-primary text-primary-foreground">Home</Button></Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <h1 className="serif text-4xl">Your cart is empty</h1>
          <Link href="/shop"><Button className="mt-6 bg-primary text-primary-foreground">Browse the shop</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-8">
            <p className="eyebrow mb-2">Checkout</p>
            <h1 className="serif text-4xl tracking-tight">Complete your order.</h1>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            <form onSubmit={onSubmit} className="lg:col-span-2 space-y-8" data-testid="form-shop-checkout">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">1. Contact</h2>
                <Label htmlFor="co-email">Email</Label>
                <Input id="co-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="input-shop-email" />
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">2. Shipping address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="co-name">Full name</Label>
                    <Input id="co-name" value={name} onChange={(e) => setName(e.target.value)} required data-testid="input-shop-name" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="co-address">Address</Label>
                    <Input id="co-address" value={address} onChange={(e) => setAddress(e.target.value)} required data-testid="input-shop-address" />
                  </div>
                  <div>
                    <Label htmlFor="co-city">City</Label>
                    <Input id="co-city" value={city} onChange={(e) => setCity(e.target.value)} required data-testid="input-shop-city" />
                  </div>
                  <div>
                    <Label htmlFor="co-state">State</Label>
                    <Input id="co-state" value={state} onChange={(e) => setState(e.target.value)} required data-testid="input-shop-state" />
                  </div>
                  <div>
                    <Label htmlFor="co-zip">ZIP</Label>
                    <Input id="co-zip" value={zip} onChange={(e) => setZip(e.target.value)} required data-testid="input-shop-zip" />
                  </div>
                  <div>
                    <Label htmlFor="co-country">Country</Label>
                    <Input id="co-country" value={country} onChange={(e) => setCountry(e.target.value)} required data-testid="input-shop-country" />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4 inline-flex items-center gap-1.5">3. Payment <Lock size={11} /></h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="co-card">Card number</Label>
                    <Input id="co-card" placeholder="4242 4242 4242 4242" value={card} onChange={(e) => setCard(e.target.value)} required data-testid="input-shop-card" />
                  </div>
                  <div>
                    <Label htmlFor="co-exp">Expiration</Label>
                    <Input id="co-exp" placeholder="MM / YY" value={exp} onChange={(e) => setExp(e.target.value)} required data-testid="input-shop-exp" />
                  </div>
                  <div>
                    <Label htmlFor="co-cvc">CVC</Label>
                    <Input id="co-cvc" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} required data-testid="input-shop-cvc" />
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="w-full h-12 bg-primary text-primary-foreground font-medium" data-testid="button-place-order">
                {submitting ? "Placing..." : `Place order — $${total.toFixed(2)}`}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Payments are simulated in this demo.</p>
            </form>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-card-border bg-card p-6">
                <h2 className="serif text-xl mb-4">Order summary</h2>
                <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                  {items.map((it, i) => (
                    <div key={i} className="flex items-center gap-3" data-testid={`summary-item-${i}`}>
                      <div className="w-14 shrink-0"><ProductMockup category="tshirts" color={it.color} baseColor={it.baseColor} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-1">{it.name}</p>
                        <p className="text-[11px] text-muted-foreground capitalize">{it.color} · {it.size} · qty {it.qty}</p>
                      </div>
                      <p className="text-sm font-medium">${(it.price * it.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="hairline my-4" />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between pt-1 border-t border-border mt-2 font-medium"><span>Total</span><span className="serif text-xl">${total.toFixed(2)}</span></div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
}
