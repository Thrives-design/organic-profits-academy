import { Link } from "wouter";
import { Logo, WordMark } from "./Logo";
import { Instagram, Youtube, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <Link href="/">
              <a className="flex items-center gap-2.5">
                <Logo size={36} />
                <WordMark className="text-lg font-medium" />
              </a>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A premium trading academy for patient operators. Crypto, futures, options, and forex — taught by practitioners.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" aria-label="Instagram" className="rounded-full p-2 border border-border hover:border-accent transition-colors" data-testid="link-social-instagram"><Instagram size={16} /></a>
              <a href="#" aria-label="YouTube" className="rounded-full p-2 border border-border hover:border-accent transition-colors" data-testid="link-social-youtube"><Youtube size={16} /></a>
              <a href="#" aria-label="Twitter" className="rounded-full p-2 border border-border hover:border-accent transition-colors" data-testid="link-social-twitter"><Twitter size={16} /></a>
            </div>
          </div>
          <div>
            <div className="eyebrow mb-4 text-foreground/60">Academy</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/library"><a className="hover:text-accent">Video Library</a></Link></li>
              <li><Link href="/webinars"><a className="hover:text-accent">Live Webinars</a></Link></li>
              <li><Link href="/community"><a className="hover:text-accent">Community</a></Link></li>
              <li><Link href="/pricing"><a className="hover:text-accent">Pricing</a></Link></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow mb-4 text-foreground/60">More</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop"><a className="hover:text-accent">Merch Store</a></Link></li>
              <li><Link href="/login"><a className="hover:text-accent">Member Login</a></Link></li>
              <li><a href="mailto:support@organicprofits.com" className="hover:text-accent">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Organic Profits Academy. All rights reserved.</p>
          <p className="max-w-md md:text-right">
            Trading involves risk of loss. Organic Profits Academy provides education, not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
