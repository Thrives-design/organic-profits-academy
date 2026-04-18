import logoSrc from "/opa-logo.jpeg";

export function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={logoSrc}
      alt="Organic Profits Academy"
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      style={{ boxShadow: "0 0 0 1px hsl(40 28% 55% / 0.4)" }}
      data-testid="img-logo"
    />
  );
}

export function WordMark({ className = "" }: { className?: string }) {
  return (
    <span className={`serif tracking-tight ${className}`}>
      Organic Profits <span className="text-accent">Academy</span>
    </span>
  );
}
