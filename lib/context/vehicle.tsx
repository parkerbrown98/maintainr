"use client";

import { createContext } from "react";
import { Vehicle } from "@/drizzle/schema";

interface VehicleContext {
  vehicle: Vehicle | null;
}

export const VehicleContext = createContext<VehicleContext>({ vehicle: null });

interface VehicleProviderProps {
  vehicle: Vehicle | null;
  children: React.ReactNode;
}

export function VehicleProvider({ vehicle, children }: VehicleProviderProps) {
  return (
    <VehicleContext.Provider value={{ vehicle }}>
      {children}
    </VehicleContext.Provider>
  );
}
