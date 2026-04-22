import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductMockup } from "@/components/ProductMockup";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { Check, ArrowLeft } from "lucide-react";

const COLOR_HEX: Record<string, string> = {
  navy: "#0c1b28", green: "#7bac3f", gold: "#ae9b6c", cream: "#f5f3ec", black: "#1a1814", white: "#f0ebe1",
};

export default function Product() {
  const [, params] = useRoute("/shop/:id");
  const id = Number(params?.id);
  const { data: product } = useQuery<any>({ queryKey: ["/api/products", String(id)] });
  const { add } = useCart();
  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [added, setAdded] = useState(false);

  if (!product)
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-6 py-40 italic text-muted-foreground">Loading…</div>
      </Layout>
    );

  const colors: string[] = JSON.parse(product.colors);
  const sizes: string[] = JSON.parse(product.sizes);
  const effectiveColor = color || colors[0];
  const effectiveSize = size || (sizes.length === 1 ? sizes[0] : "");

  function addToCart() {
    if (!effectiveSize) {
      setSize("");
      return;
    }
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
      <section className="pt-10 pb-24 md:pt-14 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link href="/shop" data-testid="link-back-shop">
            <a className="mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent inline-flex items-center gap-2 mb-10">
              <ArrowLeft size={11} /> Back to collection
            </a>
          </Link>

          <div className="grid gap-10 lg:gap-20 lg:grid-cols-[1.3fr_1fr]">
            {/* Big image */}
            <div className="aspect-[4/5] bg-[hsl(var(--off-white))] overflow-hidden">
              <ProductMockup
                category={product.category}
                color={effectiveColor}
                baseColor={product.baseColor}
              />
            </div>

            {/* Minimal right column */}
            <div className="lg:pt-10">
              <p className="eyebrow mb-4">{product.category}</p>
              <h1 className="serif text-4xl md:text-5xl tracking-tight leading-[0.95] font-normal">
                {product.name}
              </h1>
              <p className="mt-6 mono text-sm tracking-[0.1em] text-accent">
                ${product.price.toFixed(2)} USD
              </p>

              <div className="hairline my-10" />

              <p className="text-[15px] text-foreground/80 leading-[1.7] max-w-md">
                {product.description}
              </p>

              {/* Color */}
              <div className="mt-12">
                <div className="flex items-center justify-between mb-4">
                  <span className="eyebrow-subtle text-[10px]">Colorway</span>
                  <span className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {effectiveColor}
                  </span>
                </div>
                <div className="flex gap-2.5">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-7 w-7 rounded-none border transition-all ${
                        effectiveColor === c
                          ? "border-accent ring-1 ring-accent ring-offset-[3px] ring-offset-background"
                          : "border-foreground/20"
                      }`}
                      style={{ background: COLOR_HEX[c] || "#888" }}
                      aria-label={c}
                      data-testid={`color-${c}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="eyebrow-subtle text-[10px]">Size</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-accent"
                        data-testid="button-size-chart"
                      >
                        Size chart →
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="serif text-2xl font-normal">Size chart</DialogTitle>
                      </DialogHeader>
                      <table className="w-full text-sm mt-4">
                        <thead className="text-left border-b border-accent/20">
                          <tr className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            <th className="py-2 font-normal">Size</th>
                            <th className="py-2 font-normal">Chest</th>
                            <th className="py-2 font-normal">Length</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-accent/10">
                          {[
                            ["S", "36-38", "28"],
                            ["M", "38-40", "29"],
                            ["L", "40-42", "30"],
                            ["XL", "42-44", "31"],
                            ["XXL", "44-46", "32"],
                          ].map(([s, c, l]) => (
                            <tr key={s} className="mono text-xs">
                              <td className="py-2.5">{s}</td>
                              <td className="py-2.5">{c}"</td>
                              <td className="py-2.5">{l}"</td>
                            </tr>
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
                      className={`mono text-[11px] uppercase tracking-[0.12em] min-w-12 h-11 px-3 border transition-colors ${
                        effectiveSize === s
                          ? "border-accent text-accent bg-accent/5"
                          : "border-foreground/15 text-foreground/70 hover:border-foreground/40"
                      }`}
                      data-testid={`size-${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA — square, mono uppercase */}
              <button
                onClick={addToCart}
                disabled={!effectiveSize}
                className="mt-12 w-full h-14 bg-accent text-[hsl(var(--warm-black))] mono text-[11px] uppercase tracking-[0.22em] transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[hsl(var(--success))] hover:text-[hsl(var(--off-white))]"
                data-testid="button-add-to-cart"
              >
                {added ? (
                  <span className="inline-flex items-center gap-2">
                    <Check size={13} /> Added to cart
                  </span>
                ) : (
                  "Add to cart"
                )}
              </button>

              <p className="mt-5 mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70">
                Free US shipping over $120 · Members 15% off
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
