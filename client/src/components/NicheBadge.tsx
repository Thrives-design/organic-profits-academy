import { Bitcoin, Globe, Target } from "lucide-react";

// Premium restraint: drop flashy per-niche color washes. Use gold hairline styling universally.
export const NICHE_META: Record<string, { label: string; icon: any; className: string; hex: string; order: number }> = {
  crypto:  { label: "Crypto Trading", icon: Bitcoin, className: "niche-crypto",  hex: "#ae9b6c", order: 1 },
  forex:   { label: "Forex",          icon: Globe,   className: "niche-forex",   hex: "#ae9b6c", order: 2 },
  options: { label: "Options",        icon: Target,  className: "niche-options", hex: "#ae9b6c", order: 3 },
};

export const NICHE_ORDER = ["crypto", "forex", "options"] as const;

export function NicheBadge({ niche, size = "sm" }: { niche: string; size?: "sm" | "md" }) {
  const m = NICHE_META[niche] ?? NICHE_META.crypto;
  const Icon = m.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/5 px-2.5 py-0.5 font-mono uppercase tracking-[0.14em] text-accent ${size === "md" ? "text-[11px]" : "text-[10px]"}`}
      data-testid={`badge-niche-${niche}`}
    >
      <Icon size={size === "md" ? 12 : 10} strokeWidth={1.8} />
      {m.label}
    </span>
  );
}
