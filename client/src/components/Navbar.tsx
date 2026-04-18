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
    { href: "/community", label: "Community" },
    { href: "/shop", label: "Merch" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" data-testid="link-home">
          <a className="flex items-center gap-2.5">
            <Logo size={34} />
            <WordMark className="hidden text-[17px] font-medium sm:inline" />
          </a>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} data-testid={`link-nav-${l.label.toLowerCase()}`}>
              <a className={`text-sm font-medium transition-colors hover:text-accent ${location.startsWith(l.href) ? "text-accent" : "text-foreground/85"}`}>
                {l.label}
              </a>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="rounded-full p-2 text-muted-foreground hover-elevate"
            aria-label="Toggle theme"
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setOpen(true)}
            className="relative rounded-full p-2 text-muted-foreground hover-elevate"
            aria-label="Cart"
            data-testid="button-cart-open"
          >
            <ShoppingBag size={16} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </button>
          {user ? (
            <>
              <Link href={user.isAdmin ? "/admin" : "/dashboard"} data-testid="link-dashboard">
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                  {user.isAdmin ? "Admin" : "Dashboard"}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout} className="hidden md:inline-flex border-accent/40 text-foreground hover:bg-accent/10" data-testid="button-logout">
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" data-testid="link-login">
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">Login</Button>
              </Link>
              <Link href="/pricing" data-testid="link-join">
                <Button size="sm" className="bg-primary text-primary-foreground hover:opacity-90 font-medium">
                  Join Now
                </Button>
              </Link>
            </>
          )}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2 md:hidden hover-elevate"
            aria-label="Menu"
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
                <a className="py-2 text-sm font-medium">{l.label}</a>
              </Link>
            ))}
            {!user && (
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <a className="py-2 text-sm font-medium">Login</a>
              </Link>
            )}
            {user && (
              <button className="py-2 text-left text-sm font-medium" onClick={logout}>Sign out</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
