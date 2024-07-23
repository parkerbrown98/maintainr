"use client";

import { useContext } from "react";
import { VehicleContext } from "../context/vehicle";

export function useVehicle() {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicle must be used within a VehicleProvider");
  }

  return context.vehicle;
}
