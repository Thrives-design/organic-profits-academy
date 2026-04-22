import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductMockup } from "@/components/ProductMockup";

const CATS = [
  { id: "all", label: "All" },
  { id: "tshirts", label: "T-Shirts" },
  { id: "hoodies", label: "Hoodies" },
  { id: "headwear", label: "Headwear" },
  { id: "sweatpants", label: "Sweatpants" },
];

export default function Shop() {
  const { data: products = [] } = useQuery<any[]>({ queryKey: ["/api/products"] });
  const [cat, setCat] = useState("all");
  const filtered = cat === "all" ? products : products.filter((p) => p.category === cat);

  return (
    <Layout>
      {/* Editorial header */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="eyebrow mb-5">03 — The Collection</p>
          <h1 className="display-xl">
            <span className="italic font-light text-accent">Heavy-weight</span> basics,
            <br />made in small runs.
          </h1>
          <p className="mt-8 max-w-xl text-base text-muted-foreground leading-relaxed">
            Worn at the desk. Worn at the gym. Worn to dinner. Members get 15% off at checkout.
          </p>
        </div>
      </section>

      {/* Filter rail — mono labels */}
      <section className="hairline-top hairline-bottom py-5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="eyebrow-subtle text-[10px]">Filter</span>
          {CATS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                cat === c.id ? "text-accent" : "text-foreground/50 hover:text-foreground"
              }`}
              data-testid={`shop-filter-${c.id}`}
            >
              {c.label}
            </button>
          ))}
          <span className="ml-auto mono text-[11px] text-muted-foreground/70">
            {filtered.length.toString().padStart(2, "0")} items
          </span>
        </div>
      </section>

      {/* Lookbook grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14 md:gap-x-10 md:gap-y-20">
            {filtered.map((p, idx) => (
              <Link key={p.id} href={`/shop/${p.id}`} data-testid={`product-${p.id}`}>
                <a className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[hsl(var(--off-white))]">
                    <div className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.02]">
                      <ProductMockup category={p.category} baseColor={p.baseColor} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 mb-1">
                        {String(idx + 1).padStart(2, "0")} / {p.category}
                      </p>
                      <h3 className="mono text-[12px] uppercase tracking-[0.1em] text-foreground">
                        {p.name} — ${p.price.toFixed(0)}
                      </h3>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center py-20 text-muted-foreground italic">Nothing in this category yet.</p>
          )}
        </div>
      </section>
    </Layout>
  );
}
