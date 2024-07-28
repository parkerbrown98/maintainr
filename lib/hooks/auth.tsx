"use client";

import { useContext } from "react";
import { AuthContext } from "../context/auth";

export function useUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthProvider");
  }

  return context;
}
