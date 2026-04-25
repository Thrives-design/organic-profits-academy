import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";
const Ctx = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Light is the default. We respect system preference only if it is explicitly dark on first load.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    try {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
      return prefersDark ? "dark" : "light";
    } catch {
      return "light";
    }
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);
  return (
    <Ctx.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </Ctx.Provider>
  );
}
export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be inside ThemeProvider");
  return v;
}
