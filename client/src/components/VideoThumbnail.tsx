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
  // Chart-styled gradient with logo watermark feel
  const style = {
    background: `radial-gradient(120% 80% at 20% 10%, ${base}33 0%, transparent 60%), linear-gradient(135deg, #0c1b28 0%, #0c1b28 60%, ${base}22 100%)`,
  };
  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-lg border border-border/60 ${className}`}
      style={style}
    >
      {/* Simulated chart candles */}
      <svg viewBox="0 0 240 120" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <g stroke={base} strokeWidth="2" opacity="0.6">
          {Array.from({ length: 18 }).map((_, i) => {
            const x = 10 + i * 13;
            const h = 10 + Math.abs(Math.sin(i * 1.4) * 30) + (i % 3) * 5;
            const y = 60 - h / 2 + Math.sin(i * 0.9) * 10;
            const fill = i % 2 === 0 ? base : "#ae9b6c";
            return (
              <g key={i}>
                <line x1={x} y1={y - 6} x2={x} y2={y + h + 6} />
                <rect x={x - 3} y={y} width="6" height={h} fill={fill} opacity="0.85" stroke="none" />
              </g>
            );
          })}
        </g>
        {/* subtle trendline */}
        <path
          d="M0 90 Q 60 60 120 70 T 240 30"
          fill="none"
          stroke="#ae9b6c"
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>
      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm border border-white/10">
        <Icon size={11} />
        {meta.label}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        {locked ? (
          <div className="flex flex-col items-center gap-1.5 rounded-full bg-black/40 px-4 py-2 backdrop-blur-sm">
            <Lock size={20} className="text-[color:var(--tw-text-opacity)] text-white/90" />
          </div>
        ) : (
          <PlayCircle size={44} className="text-white/80 drop-shadow-lg" strokeWidth={1.3} />
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
        <p className="line-clamp-2 text-sm font-medium text-white">{title}</p>
      </div>
    </div>
  );
}
