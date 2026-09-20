"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

export type User = { name: string };

type AuthContextValue = {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
  saveScore: (entry: { game: string; score: number; name: string }) => void;
};

const USER_KEY = "av_user";
const SCORES_KEY = "av_scores";
const CHANGE_EVENT = "av-user-change";

const AuthContext = createContext<AuthContextValue | null>(null);

function subscribe(cb: () => void) {
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function readRaw() {
  try {
    return localStorage.getItem(USER_KEY);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const user = useMemo<User | null>(() => {
    try {
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }, [raw]);

  const signIn = useCallback((u: User) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch {}
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch {}
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const saveScore = useCallback((entry: { game: string; score: number; name: string }) => {
    try {
      const all = JSON.parse(localStorage.getItem(SCORES_KEY) || "[]");
      all.push({ ...entry, at: Date.now() });
      localStorage.setItem(SCORES_KEY, JSON.stringify(all));
    } catch {}
  }, []);

  const value = useMemo(() => ({ user, signIn, signOut, saveScore }), [user, signIn, signOut, saveScore]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
