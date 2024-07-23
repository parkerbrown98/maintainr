"use client";

import { createContext } from "react";
import { Vehicle } from "@/drizzle/schema";

interface UserVehicleContext {
  vehicle: Vehicle | null;
}

export const UserVehicleContext = createContext<UserVehicleContext>({
  vehicle: null,
});

interface UserVehicleProviderProps {
  vehicle: Vehicle | null;
  children: React.ReactNode;
}

export function UserVehicleProvider({
  vehicle,
  children,
}: UserVehicleProviderProps) {
  return (
    <UserVehicleContext.Provider value={{ vehicle }}>
      {children}
    </UserVehicleContext.Provider>
  );
}
