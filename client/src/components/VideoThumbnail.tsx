import { NICHE_META } from "./NicheBadge";
import { PlayCircle, Lock } from "lucide-react";

export function VideoThumbnail({
  niche,
  title,
  color,
  locked = false,
  className = "",
}: {
  niche: string;
  title: string;
  color?: string;
  locked?: boolean;
  className?: string;
}) {
  const meta = NICHE_META[niche] ?? NICHE_META.crypto;
  const Icon = meta.icon;
  const base = color || meta.hex;

  // Restrained navy field with a single gold hairline and quiet chart-line.
  // No neon, no glow, no blur.
  const style = {
    background: `linear-gradient(180deg, #0c1b28 0%, #0c1b28 60%, #0a1621 100%)`,
  };

  return (
    <div
      className={`relative aspect-video overflow-hidden ${className}`}
      style={style}
    >
      {/* Single thin trendline in gold — editorial, not noisy */}
      <svg
        viewBox="0 0 240 120"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* faint baseline */}
        <line x1="0" y1="80" x2="240" y2="80" stroke="#ae9b6c" strokeWidth="0.5" opacity="0.18" />
        {/* editorial trendline */}
        <path
          d="M0 95 C 40 80, 80 85, 120 65 S 200 35, 240 25"
          fill="none"
          stroke="#ae9b6c"
          strokeWidth="1"
          opacity="0.55"
        />
        {/* subtle markers */}
        <circle cx="120" cy="65" r="1.5" fill="#ae9b6c" opacity="0.7" />
        <circle cx="240" cy="25" r="1.5" fill="#ae9b6c" opacity="0.7" />
      </svg>

      {/* Top-left niche label — mono, uppercase */}
      <div className="absolute left-4 top-4 flex items-center gap-1.5">
        <Icon size={10} className="text-[#ae9b6c]" strokeWidth={1.5} />
        <span className="mono text-[9px] uppercase tracking-[0.2em] text-[#ae9b6c]">
          {meta.label}
        </span>
      </div>

      {/* Center play affordance */}
      <div className="absolute inset-0 flex items-center justify-center">
        {locked ? (
          <Lock size={22} className="text-[#f5f3ec]/70" strokeWidth={1.3} />
        ) : (
          <PlayCircle size={40} className="text-[#f5f3ec]/75" strokeWidth={1} />
        )}
      </div>

      {/* Bottom title — no gradient, just hairline */}
      <div className="absolute inset-x-0 bottom-0 px-4 py-3 border-t border-[#ae9b6c]/20">
        <p className="line-clamp-2 text-[12px] tracking-tight text-[#f5f3ec]/90 serif leading-snug">
          {title}
        </p>
      </div>
    </div>
  );
}
