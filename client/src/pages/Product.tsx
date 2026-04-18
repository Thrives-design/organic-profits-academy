import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductMockup } from "@/components/ProductMockup";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { Check, Ruler, ArrowLeft } from "lucide-react";

const COLOR_HEX: Record<string, string> = {
  navy: "#0c1b28", green: "#7bac3f", gold: "#ae9b6c", cream: "#f5f3ec", black: "#111111", white: "#f8f8f5",
};

export default function Product() {
  const [, params] = useRoute("/shop/:id");
  const id = Number(params?.id);
  const { data: product } = useQuery<any>({ queryKey: ["/api/products", String(id)] });
  const { add } = useCart();
  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [added, setAdded] = useState(false);

  if (!product) return <Layout><div className="mx-auto max-w-7xl px-6 py-20">Loading…</div></Layout>;

  const colors: string[] = JSON.parse(product.colors);
  const sizes: string[] = JSON.parse(product.sizes);
  const effectiveColor = color || colors[0];
  const effectiveSize = size || (sizes.length === 1 ? sizes[0] : "");

  function addToCart() {
    if (!effectiveSize) { setSize(""); return; }
    add({
      productId: product.id,
      name: product.name,
      price: product.price,
      color: effectiveColor,
      size: effectiveSize,
      qty: 1,
      baseColor: product.baseColor,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Layout>
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-6">
          <Link href="/shop" data-testid="link-back-shop">
            <a className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent mb-6">
              <ArrowLeft size={12} /> Back to shop
            </a>
          </Link>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="gold-glow rounded-xl border border-border/60 overflow-hidden">
              <ProductMockup category={product.category} color={effectiveColor} baseColor={product.baseColor} />
            </div>
            <div>
              <p className="eyebrow mb-2 capitalize">{product.category}</p>
              <h1 className="serif text-4xl md:text-5xl tracking-tight">{product.name}</h1>
              <p className="mt-4 serif text-3xl">${product.price.toFixed(2)}</p>
              <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="eyebrow text-foreground/70 text-[10px]">Color</span>
                  <span className="text-xs text-muted-foreground capitalize">{effectiveColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-9 w-9 rounded-full border-2 transition-all ${effectiveColor === c ? "border-accent scale-110" : "border-border"}`}
                      style={{ background: COLOR_HEX[c] || "#888" }}
                      aria-label={c}
                      data-testid={`color-${c}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="eyebrow text-foreground/70 text-[10px]">Size</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-xs text-muted-foreground hover:text-accent inline-flex items-center gap-1" data-testid="button-size-chart">
                        <Ruler size={11} /> Size chart
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="serif text-2xl">Size chart</DialogTitle>
                      </DialogHeader>
                      <table className="w-full text-sm">
                        <thead className="text-left border-b border-border">
                          <tr><th className="py-2 font-medium">Size</th><th className="py-2 font-medium">Chest</th><th className="py-2 font-medium">Length</th></tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {[["S", "36-38", "28"], ["M", "38-40", "29"], ["L", "40-42", "30"], ["XL", "42-44", "31"], ["XXL", "44-46", "32"]].map(([s, c, l]) => (
                            <tr key={s}><td className="py-2">{s}</td><td className="py-2">{c}"</td><td className="py-2">{l}"</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-12 rounded-md border px-3 py-2 text-sm font-medium ${effectiveSize === s ? "border-accent bg-accent/10 text-accent" : "border-border"}`}
                      data-testid={`size-${s}`}
                    >{s}</button>
                  ))}
                </div>
              </div>

              <Button
                onClick={addToCart}
                className="mt-8 w-full h-12 bg-primary text-primary-foreground font-medium"
                disabled={!effectiveSize}
                data-testid="button-add-to-cart"
              >
                {added ? <><Check size={14} className="mr-1.5" /> Added to cart</> : "Add to cart"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
