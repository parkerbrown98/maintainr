"use client";

import { createContext } from "react";
import { Vehicle } from "@/drizzle/schema";

interface UserVehicleContext {
  vehicles: Vehicle[] | null;
  activeVehicle: Vehicle | null;
}

export const UserVehicleContext = createContext<UserVehicleContext>({
  activeVehicle: null,
  vehicles: null,
});

interface UserVehicleProviderProps {
  vehicles: Vehicle[] | null;
  activeVehicle: Vehicle | null;
  children: React.ReactNode;
}

export function UserVehicleProvider({
  vehicles,
  activeVehicle,
  children,
}: UserVehicleProviderProps) {
  return (
    <UserVehicleContext.Provider value={{ activeVehicle, vehicles }}>
      {children}
    </UserVehicleContext.Provider>
  );
}
