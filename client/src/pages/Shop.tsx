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
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10">
            <p className="eyebrow mb-2">Apparel & accessories</p>
            <h1 className="serif text-4xl md:text-5xl tracking-tight">Merch Store</h1>
            <p className="mt-3 text-muted-foreground max-w-xl text-sm">
              Heavy-weight, considered basics. Made in small runs. Members get 15% off at checkout.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-10 border-b border-border pb-5">
            {CATS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium ${cat === c.id ? "border-accent bg-accent/10 text-accent" : "border-border text-foreground/70 hover:border-accent/40"}`}
                data-testid={`shop-filter-${c.id}`}
              >{c.label}</button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <Link key={p.id} href={`/shop/${p.id}`} data-testid={`product-${p.id}`}>
                <a className="group block">
                  <div className="gold-glow rounded-lg border border-border/60 overflow-hidden">
                    <ProductMockup category={p.category} baseColor={p.baseColor} />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-medium text-sm">{p.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 serif">${p.price.toFixed(2)}</p>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
