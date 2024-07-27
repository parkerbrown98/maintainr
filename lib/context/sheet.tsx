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
  open?: boolean;
  children: React.ReactNode;
}

export function SheetProvider({
  children,
  open: isDefaultOpen = false,
}: SheetProviderProps) {
  const [open, setOpen] = useState(isDefaultOpen);

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}
