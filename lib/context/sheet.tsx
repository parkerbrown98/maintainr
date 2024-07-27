"use client";

import { createContext, useState } from "react";

interface SheetContext {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const SheetContext = createContext<SheetContext>({
  open: false,
  setOpen: () => {},
});

interface SheetProviderProps {
  children: React.ReactNode;
}

export function SheetProvider({ children }: SheetProviderProps) {
  const [open, setOpen] = useState(false);

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}
