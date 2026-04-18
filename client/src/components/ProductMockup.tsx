import { Logo } from "./Logo";

const COLOR_HEX: Record<string, string> = {
  navy: "#0c1b28",
  green: "#7bac3f",
  gold: "#ae9b6c",
  cream: "#f5f3ec",
  black: "#111111",
  white: "#f8f8f5",
};

export function ProductMockup({
  category,
  color,
  baseColor,
  size = "md",
}: {
  category: string;
  color?: string;
  baseColor?: string;
  size?: "sm" | "md" | "lg";
}) {
  const hex = color ? COLOR_HEX[color] ?? baseColor ?? "#0c1b28" : baseColor ?? "#0c1b28";
  const isLight = ["cream", "white", "gold", "green"].includes(color ?? "") || (hex === "#f5f3ec" || hex === "#ae9b6c" || hex === "#7bac3f");
  const foreground = isLight ? "#0c1b28" : "#f5f3ec";
  return (
    <div
      className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-border/60"
      style={{ background: `radial-gradient(110% 80% at 30% 20%, ${hex} 0%, ${hex}dd 60%, ${hex}99 100%)` }}
    >
      <ProductSilhouette category={category} color={foreground} />
      {/* subtle logo watermark bottom corner */}
      <div className="absolute bottom-3 right-3 opacity-60">
        <Logo size={22} />
      </div>
    </div>
  );
}

function ProductSilhouette({ category, color }: { category: string; color: string }) {
  if (category === "tshirts") {
    return (
      <svg viewBox="0 0 200 200" className="h-[70%] w-[70%]" fill="none" stroke={color} strokeWidth="2">
        <path d="M50 50 L70 30 L90 35 Q100 50 110 35 L130 30 L150 50 L170 65 L155 90 L140 80 L140 170 L60 170 L60 80 L45 90 L30 65 Z" fill={color} fillOpacity="0.12" />
        <circle cx="100" cy="80" r="8" fill={color} fillOpacity="0.9" />
      </svg>
    );
  }
  if (category === "hoodies") {
    return (
      <svg viewBox="0 0 200 200" className="h-[72%] w-[72%]" fill="none" stroke={color} strokeWidth="2">
        <path d="M50 55 L70 30 Q85 25 100 30 Q115 25 130 30 L150 55 L170 72 L158 100 L145 90 L145 175 L55 175 L55 90 L42 100 L30 72 Z" fill={color} fillOpacity="0.14" />
        <path d="M85 25 Q100 20 115 25 Q120 45 115 60 Q100 65 85 60 Q80 45 85 25" fill={color} fillOpacity="0.22" />
        <rect x="85" y="110" width="30" height="25" rx="3" stroke={color} strokeOpacity="0.6" fill="none" />
        <circle cx="100" cy="78" r="6" fill={color} />
      </svg>
    );
  }
  if (category === "headwear") {
    return (
      <svg viewBox="0 0 200 160" className="h-[60%] w-[75%]" fill="none" stroke={color} strokeWidth="2">
        <path d="M40 100 Q40 55 100 50 Q160 55 160 100 L158 115 Q120 120 100 120 Q80 120 42 115 Z" fill={color} fillOpacity="0.15" />
        <path d="M42 115 L180 130 L158 120 Z" fill={color} fillOpacity="0.18" />
        <circle cx="100" cy="85" r="8" fill={color} />
      </svg>
    );
  }
  // sweatpants
  return (
    <svg viewBox="0 0 200 220" className="h-[78%] w-[60%]" fill="none" stroke={color} strokeWidth="2">
      <path d="M55 20 L145 20 L150 55 L140 210 L110 210 L102 100 L98 100 L90 210 L60 210 L50 55 Z" fill={color} fillOpacity="0.14" />
      <line x1="100" y1="22" x2="100" y2="100" strokeDasharray="3 4" opacity="0.5" />
      <circle cx="125" cy="130" r="5" fill={color} />
    </svg>
  );
}
