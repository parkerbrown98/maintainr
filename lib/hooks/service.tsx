"use client";

import { useContext } from "react";
import { ServiceContext } from "../context/service";

export function useService() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useService must be used within a ServiceProvider");
  }

  return context;
}
