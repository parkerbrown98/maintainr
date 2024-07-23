"use client";

import { createContext } from "react";
import type { User } from "lucia";

interface AuthContext {
  user: User | null;
}

export const AuthContext = createContext<AuthContext>({ user: null });

interface AuthProviderProps {
  user: User | null;
  children: React.ReactNode;
}

export function AuthProvider({ user, children }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
