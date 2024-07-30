"use client";

import { createContext } from "react";
import { ServiceRecord, Upload } from "@/drizzle/schema";

interface ServiceContext {
  service: ServiceRecord | null;
  uploads: Upload[] | null;
}

export const ServiceContext = createContext<ServiceContext>({
  service: null,
  uploads: null,
});

interface ServiceProviderProps {
  service: ServiceRecord | null;
  uploads: Upload[] | null;
  children: React.ReactNode;
}

export function ServiceProvider({
  service: defaultService,
  uploads,
  children,
}: ServiceProviderProps) {
  return (
    <ServiceContext.Provider value={{ service: defaultService, uploads }}>
      {children}
    </ServiceContext.Provider>
  );
}
