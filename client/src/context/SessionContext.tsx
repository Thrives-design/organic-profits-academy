import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiRequest, setAuthToken, getAuthToken } from "@/lib/queryClient";

type User = {
  id: number;
  email: string;
  name: string;
  isMember: boolean;
  isAdmin: boolean;
  lastWatchedVideoId: number | null;
};

type PaymentPlan = {
  planType: string;
  installmentAmount: number;
  totalInstallments: number;
  paidInstallments: number;
  nextChargeDate: string | null;
};

type SessionValue = {
  user: User | null;
  plan: PaymentPlan | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (token: string, user: User) => void;
  refresh: () => Promise<void>;
};

const Ctx = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<PaymentPlan | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    if (!getAuthToken()) { setUser(null); setPlan(null); return; }
    try {
      const res = await apiRequest("GET", "/api/auth/me");
      const data = await res.json();
      setUser(data.user);
      setPlan(data.plan ?? null);
    } catch {
      setAuthToken(null);
      setUser(null);
      setPlan(null);
    }
  }

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/login", { email, password });
      const data = await res.json();
      setAuthToken(data.token);
      setUser(data.user);
      await refresh();
    } finally { setLoading(false); }
  }

  async function signup(email: string, password: string, name: string) {
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/signup", { email, password, name });
      const data = await res.json();
      setAuthToken(data.token);
      setUser(data.user);
    } finally { setLoading(false); }
  }

  async function logout() {
    try { await apiRequest("POST", "/api/auth/logout"); } catch {}
    setAuthToken(null);
    setUser(null);
    setPlan(null);
  }

  function setSession(token: string, u: User) {
    setAuthToken(token);
    setUser(u);
    refresh();
  }

  return (
    <Ctx.Provider value={{ user, plan, loading, login, signup, logout, setSession, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSession() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSession must be inside SessionProvider");
  return v;
}
