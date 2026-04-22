import { Link } from "wouter";
import { Logo, WordMark } from "./Logo";
import { Instagram, Youtube, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="hairline" />
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/">
              <a className="flex items-center gap-2.5">
                <Logo size={36} />
                <WordMark className="text-lg" />
              </a>
            </Link>
            <p className="mt-6 max-w-xs text-sm text-muted-foreground leading-relaxed">
              A members' house for serious traders. Crypto, forex, and options — taught by practitioners.
            </p>
          </div>
          <div>
            <div className="eyebrow-subtle mb-5">Navigate</div>
            <ul className="space-y-3 text-sm">
              <li><Link href="/"><a className="hover:text-accent transition-colors">Home</a></Link></li>
              <li><Link href="/academy"><a className="hover:text-accent transition-colors">The Academy</a></Link></li>
              <li><Link href="/pricing"><a className="hover:text-accent transition-colors">Membership</a></Link></li>
              <li><Link href="/login"><a className="hover:text-accent transition-colors">Member Login</a></Link></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow-subtle mb-5">The House</div>
            <ul className="space-y-3 text-sm">
              <li><Link href="/library"><a className="hover:text-accent transition-colors">Video Library</a></Link></li>
              <li><Link href="/webinars"><a className="hover:text-accent transition-colors">Live Sessions</a></Link></li>
              <li><Link href="/community"><a className="hover:text-accent transition-colors">Community</a></Link></li>
              <li><Link href="/shop"><a className="hover:text-accent transition-colors">The Collection</a></Link></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow-subtle mb-5">Contact</div>
            <ul className="space-y-3 text-sm">
              <li><a href="mailto:support@organicprofits.com" className="hover:text-accent transition-colors">support@organicprofits.com</a></li>
              <li className="text-muted-foreground">Houston, Texas</li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-accent transition-colors" data-testid="link-social-instagram"><Instagram size={16} strokeWidth={1.6} /></a>
              <a href="#" aria-label="YouTube" className="text-muted-foreground hover:text-accent transition-colors" data-testid="link-social-youtube"><Youtube size={16} strokeWidth={1.6} /></a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-accent transition-colors" data-testid="link-social-twitter"><Twitter size={16} strokeWidth={1.6} /></a>
            </div>
          </div>
        </div>

        <div className="hairline my-14" />

        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <p className="eyebrow-subtle">© 2026 Organic Profits Academy. Cultivated in Houston.</p>
          <p className="eyebrow-subtle max-w-md md:text-right">
            Trading involves risk of loss. Education, not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
