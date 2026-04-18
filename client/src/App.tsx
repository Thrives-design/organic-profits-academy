import { Switch, Route, Router } from "wouter";
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
import ForumPost from "@/pages/community/ForumPost";
import Shop from "@/pages/Shop";
import Product from "@/pages/Product";
import ShopCheckout from "@/pages/ShopCheckout";
import Admin from "@/pages/Admin";

import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProvider } from "@/context/SessionContext";
import { CartProvider } from "@/context/CartContext";

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
      <Route path="/community/forum/:id" component={ForumPost} />
      <Route path="/shop" component={Shop} />
      <Route path="/shop/checkout" component={ShopCheckout} />
      <Route path="/shop/:id" component={Product} />
      <Route path="/admin" component={Admin} />
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
