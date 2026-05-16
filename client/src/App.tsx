import { useEffect } from "react";
import { Switch, Route, Router, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Academy from "@/pages/Academy";
import Pricing from "@/pages/Pricing";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Library from "@/pages/Library";
import VideoPlayer from "@/pages/VideoPlayer";
import Webinars from "@/pages/Webinars";
import Community from "@/pages/Community";
import ChatPage from "@/pages/community/ChatPage";
import ForumPost from "@/pages/community/ForumPost";
import Shop from "@/pages/Shop";
import Product from "@/pages/Product";
import ShopCheckout from "@/pages/ShopCheckout";
import Admin from "@/pages/Admin";
import Terms from "@/pages/legal/Terms";
import Privacy from "@/pages/legal/Privacy";
import RefundPolicy from "@/pages/legal/RefundPolicy";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProvider } from "@/context/SessionContext";
import { CartProvider } from "@/context/CartContext";

// Per-route document title + meta description.
// Centralized here so we don't have to touch every page component.
const PAGE_META: Record<string, { title: string; description: string }> = {
  "/":               { title: "",                       description: "A premium trading academy teaching crypto, forex, and options. Lifetime access, live webinars, on-demand library, and private community." },
  "/academy":        { title: "The Academy",            description: "Master crypto, forex, and options trading with our structured curriculum, live webinars, and on-demand video library." },
  "/pricing":        { title: "Pricing",                description: "Lifetime access for $1,100. Pay in full or split across 2, 3, or 4 months. One price, all niches, forever." },
  "/checkout":       { title: "Checkout",               description: "Secure your lifetime access to Organic Profits Academy." },
  "/login":          { title: "Log in",                 description: "Log in to your Organic Profits Academy account." },
  "/signup":         { title: "Create your account",    description: "Create your Organic Profits Academy account and start trading smarter." },
  "/forgot-password":{ title: "Forgot password",        description: "Reset your Organic Profits Academy password." },
  "/reset-password": { title: "Reset password",         description: "Choose a new password for your Organic Profits Academy account." },
  "/dashboard":      { title: "Dashboard",              description: "Your Organic Profits Academy dashboard." },
  "/library":        { title: "Video Library",          description: "On-demand trading lessons across crypto, forex, and options." },
  "/webinars":       { title: "Live Webinars",          description: "Weekly live trading sessions with our coaches." },
  "/community":      { title: "Community",              description: "Connect with fellow traders in our private community." },
  "/shop":           { title: "The Collection",         description: "Branded apparel and gear for Organic Profits Academy members." },
  "/admin":          { title: "Admin",                  description: "Organic Profits Academy admin panel." },
  "/terms":          { title: "Terms of Service",       description: "The terms governing your use of Organic Profits Academy." },
  "/privacy":        { title: "Privacy Policy",         description: "How Organic Profits Academy collects, uses, and protects your data." },
  "/refund-policy":  { title: "Refund Policy",          description: "Our 14-day money-back guarantee and refund terms." },
};

const DEFAULT_TITLE = "Organic Profits Academy — Grow your trading. Cultivate real profits.";
const DEFAULT_DESC  = "A premium trading academy teaching crypto, forex, and options. Lifetime access, live webinars, on-demand library, and private community.";

function matchMeta(path: string) {
  // exact match first
  if (PAGE_META[path]) return PAGE_META[path];
  // dynamic routes
  if (path.startsWith("/library/"))         return { title: "Watching",       description: "On-demand trading lesson." };
  if (path.startsWith("/shop/"))            return { title: "Product",        description: "Organic Profits Academy collection." };
  if (path.startsWith("/community/chat"))   return { title: "Community Chat", description: "Live discussion with fellow traders." };
  if (path.startsWith("/community/forum/")) return { title: "Forum",          description: "Community forum discussion." };
  return null;
}

function RouteHead() {
  const [location] = useLocation();
  useEffect(() => {
    const meta = matchMeta(location);
    const title = meta?.title ? `${meta.title} · Organic Profits Academy` : DEFAULT_TITLE;
    const desc  = meta?.description ?? DEFAULT_DESC;
    document.title = title;
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "description";
      document.head.appendChild(tag);
    }
    tag.content = desc;
  }, [location]);
  return null;
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/academy" component={Academy} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/library" component={Library} />
      <Route path="/library/:id" component={VideoPlayer} />
      <Route path="/webinars" component={Webinars} />
      <Route path="/community" component={Community} />
      <Route path="/community/chat" component={ChatPage} />
      <Route path="/community/forum/:id" component={ForumPost} />
      <Route path="/shop" component={Shop} />
      <Route path="/shop/checkout" component={ShopCheckout} />
      <Route path="/shop/:id" component={Product} />
      <Route path="/admin" component={Admin} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      {/* Wouter's hash router treats the query string as part of the path, so /reset-password?token=... won't match the bare /reset-password route. Add a wildcard catch so it works either way. */}
      <Route path="/reset-password/:rest*" component={ResetPassword} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SessionProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Router hook={useHashLocation}>
                <RouteHead />
                <AppRouter />
              </Router>
            </TooltipProvider>
          </CartProvider>
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
