"use client";

import { useContext } from "react";
import { UserVehicleContext } from "../context/user-vehicle";

export function useUserVehicle() {
  const context = useContext(UserVehicleContext);
  if (!context) {
    throw new Error("useUserVehicle must be used within a UserVehicleProvider");
  }

  return { ...context };
}
