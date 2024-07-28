"use client";

import { createContext } from "react";
import type { User } from "lucia";
import { UserPreferences } from "@/drizzle/schema";

interface AuthContext {
  user: User | null;
  preferences: UserPreferences | null;
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  preferences: null,
});

interface AuthProviderProps {
  user: User | null;
  preferences: UserPreferences | null;
  children: React.ReactNode;
}

export function AuthProvider({
  user,
  preferences,
  children,
}: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ user, preferences }}>
      {children}
    </AuthContext.Provider>
  );
}
