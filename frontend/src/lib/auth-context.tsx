"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authApi } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setTokenCookie(token: string) {
  // Set cookie with 7 day expiry for middleware to check
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `fitsync_token=${token};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function removeTokenCookie() {
  document.cookie = "fitsync_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("fitsync_token");
    if (stored) {
      setToken(stored);
      setTokenCookie(stored);
      // Verify token is still valid
      authApi.me()
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem("fitsync_token");
          removeTokenCookie();
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    localStorage.setItem("fitsync_token", data.token);
    setTokenCookie(data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const data = await authApi.signup({ name, email, password });
    localStorage.setItem("fitsync_token", data.token);
    setTokenCookie(data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("fitsync_token");
    removeTokenCookie();
    setToken(null);
    setUser(null);
    window.location.href = "/";
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await authApi.me();
      setUser(data);
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
