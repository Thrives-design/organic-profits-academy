import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  color: string;
  size: string;
  qty: number;
  baseColor: string;
};

type CartValue = {
  items: CartItem[];
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (i: CartItem) => void;
  updateQty: (idx: number, qty: number) => void;
  remove: (idx: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const Ctx = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  function add(i: CartItem) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.productId === i.productId && p.color === i.color && p.size === i.size);
      if (idx >= 0) {
        const c = [...prev];
        c[idx] = { ...c[idx], qty: c[idx].qty + i.qty };
        return c;
      }
      return [...prev, i];
    });
    setOpen(true);
  }
  function updateQty(idx: number, qty: number) {
    setItems((prev) => prev.map((p, i) => (i === idx ? { ...p, qty: Math.max(1, qty) } : p)));
  }
  function remove(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }
  function clear() { setItems([]); }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <Ctx.Provider value={{ items, open, setOpen, add, updateQty, remove, clear, subtotal, count }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be inside CartProvider");
  return v;
}
