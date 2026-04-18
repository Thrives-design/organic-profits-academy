import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ProductMockup } from "./ProductMockup";
import { Minus, Plus, X } from "lucide-react";
import { useLocation } from "wouter";

export function CartDrawer() {
  const { items, open, setOpen, updateQty, remove, subtotal } = useCart();
  const [, navigate] = useLocation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="serif text-2xl">Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto -mx-6 px-6 divide-y divide-border">
          {items.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted-foreground text-sm">Your cart is empty.</p>
            </div>
          )}
          {items.map((item, i) => (
            <div key={i} className="flex gap-4 py-4" data-testid={`cart-item-${i}`}>
              <div className="w-20 shrink-0">
                <ProductMockup category="tshirts" color={item.color} baseColor={item.baseColor} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                  <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive" data-testid={`button-cart-remove-${i}`}>
                    <X size={14} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">{item.color} · {item.size}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-border px-2 py-0.5">
                    <button onClick={() => updateQty(i, item.qty - 1)} className="text-muted-foreground" data-testid={`button-cart-dec-${i}`}><Minus size={12} /></button>
                    <span className="min-w-4 text-center text-xs font-medium">{item.qty}</span>
                    <button onClick={() => updateQty(i, item.qty + 1)} className="text-muted-foreground" data-testid={`button-cart-inc-${i}`}><Plus size={12} /></button>
                  </div>
                  <p className="text-sm font-medium">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="serif text-xl">${subtotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Shipping calculated at checkout.</p>
          <Button
            className="w-full mt-4 bg-primary text-primary-foreground"
            disabled={items.length === 0}
            onClick={() => { setOpen(false); navigate("/shop/checkout"); }}
            data-testid="button-cart-checkout"
          >
            Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
