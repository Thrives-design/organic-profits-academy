import { Link, useLocation } from "wouter";
import { Logo, WordMark } from "./Logo";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { Sun, Moon, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useSession();
  const { theme, toggle } = useTheme();
  const { count, setOpen } = useCart();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/academy", label: "Academy" },
    { href: "/community", label: "The House" },
    { href: "/shop", label: "Collection" },
    { href: "/pricing", label: "Membership" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" data-testid="link-home">
          <a className="flex items-center gap-3">
            <Logo size={32} />
            <WordMark className="hidden text-[16px] sm:inline" />
          </a>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} data-testid={`link-nav-${l.label.toLowerCase().replace(/ /g, '-')}`}>
              <a className={`eyebrow-subtle transition-colors hover:text-accent ${location.startsWith(l.href) ? "text-accent" : ""}`}>
                {l.label}
              </a>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 text-muted-foreground hover:text-accent transition-colors"
            aria-label="Toggle theme"
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun size={15} strokeWidth={1.6} /> : <Moon size={15} strokeWidth={1.6} />}
          </button>
          <button
            onClick={() => setOpen(true)}
            className="relative p-2 text-muted-foreground hover:text-accent transition-colors"
            aria-label="Cart"
            data-testid="button-cart-open"
          >
            <ShoppingBag size={15} strokeWidth={1.6} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-accent-foreground mono">
                {count}
              </span>
            )}
          </button>
          {user ? (
            <>
              <Link href={user.isAdmin ? "/admin" : "/dashboard"} data-testid="link-dashboard">
                <button className="hidden md:inline-flex eyebrow-subtle hover:text-accent px-3">
                  {user.isAdmin ? "Admin" : "Dashboard"}
                </button>
              </Link>
              <button onClick={logout} className="hidden md:inline-flex eyebrow-subtle hover:text-accent px-3" data-testid="button-logout">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" data-testid="link-login">
                <button className="hidden md:inline-flex eyebrow-subtle hover:text-accent px-3">Login</button>
              </Link>
              <Link href="/pricing" data-testid="link-join">
                <Button size="sm" className="bg-primary text-primary-foreground hover:opacity-95 font-medium rounded-none tracking-wider-editorial mono uppercase text-[11px] h-9 px-4">
                  Become a Member
                </Button>
              </Link>
            </>
          )}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 md:hidden text-foreground/80"
            aria-label="Menu"
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="hairline-top bg-background md:hidden">
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
                <a className="eyebrow-subtle py-2">{l.label}</a>
              </Link>
            ))}
            {!user && (
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <a className="eyebrow-subtle py-2">Login</a>
              </Link>
            )}
            {user && (
              <button className="eyebrow-subtle py-2 text-left" onClick={logout}>Sign out</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
