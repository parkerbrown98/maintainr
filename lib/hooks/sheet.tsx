"use client";

import { useContext } from "react";
import { SheetContext } from "../context/sheet";

export function useSheet() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within an SheetProvider");
  }

  return context;
}
