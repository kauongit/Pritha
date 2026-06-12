import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { storage } from "@/src/utils/storage";
import { api } from "@/src/api";

type User = {
  id: string; email: string; name: string; role: "user" | "admin";
  is_student: boolean; picture?: string | null; created_at: string;
};
type Ctx = {
  user: User | null; token: string | null; ready: boolean;
  signIn: (e: string, p: string) => Promise<void>;
  signUp: (e: string, p: string, n: string, isStudent: boolean) => Promise<void>;
  googleSignIn: (e: string, n: string, pic?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};
const AuthCtx = createContext<Ctx | null>(null);
const KEY = "pritha_auth_v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await storage.getItem(KEY);
        if (raw) {
          const p = JSON.parse(raw);
          setToken(p.token); setUser(p.user);
        }
      } catch {}
      setReady(true);
    })();
  }, []);

  const persist = async (t: string, u: User) => {
    setToken(t); setUser(u);
    await storage.setItem(KEY, JSON.stringify({ token: t, user: u }));
  };

  const signIn = async (email: string, password: string) => {
    const r = await api<any>("/auth/login", { method: "POST", body: { email, password } });
    await persist(r.access_token, r.user);
  };
  const signUp = async (email: string, password: string, name: string, is_student: boolean) => {
    const r = await api<any>("/auth/signup", { method: "POST", body: { email, password, name, is_student } });
    await persist(r.access_token, r.user);
  };
  const googleSignIn = async (email: string, name: string, picture?: string) => {
    const r = await api<any>("/auth/google", { method: "POST", body: { email, name, picture } });
    await persist(r.access_token, r.user);
  };
  const signOut = async () => {
    setToken(null); setUser(null);
    await storage.removeItem(KEY);
  };
  const refresh = async () => {
    if (!token) return;
    try {
      const u = await api<User>("/auth/me", { token });
      setUser(u);
      await storage.setItem(KEY, JSON.stringify({ token, user: u }));
    } catch {}
  };

  return (
    <AuthCtx.Provider value={{ user, token, ready, signIn, signUp, googleSignIn, signOut, refresh }}>
      {children}
    </AuthCtx.Provider>
  );
}
export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth needs AuthProvider");
  return c;
}
