import { Bitcoin, TrendingUp, Target, Globe } from "lucide-react";

export const NICHE_META: Record<string, { label: string; icon: any; className: string; hex: string }> = {
  crypto: { label: "Crypto", icon: Bitcoin, className: "niche-crypto", hex: "#f59e0b" },
  futures: { label: "Futures", icon: TrendingUp, className: "niche-futures", hex: "#3b82f6" },
  options: { label: "Options", icon: Target, className: "niche-options", hex: "#a855f7" },
  forex: { label: "Forex", icon: Globe, className: "niche-forex", hex: "#14b8a6" },
};

export function NicheBadge({ niche, size = "sm" }: { niche: string; size?: "sm" | "md" }) {
  const m = NICHE_META[niche] ?? NICHE_META.crypto;
  const Icon = m.icon;
  return (
    <span
      className={`${m.className} niche-tint inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 ${size === "md" ? "text-sm" : "text-xs"} font-medium`}
      data-testid={`badge-niche-${niche}`}
    >
      <Icon size={size === "md" ? 14 : 12} strokeWidth={2} />
      {m.label}
    </span>
  );
}
