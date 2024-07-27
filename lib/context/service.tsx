"use client";

import { createContext, useState } from "react";
import { ServiceRecord } from "@/drizzle/schema";

interface ServiceContext {
  service: ServiceRecord | null;
  setService: (service: ServiceRecord | null) => void;
}

export const ServiceContext = createContext<ServiceContext>({
  service: null,
  setService: () => {},
});

interface ServiceProviderProps {
  service: ServiceRecord | null;
  children: React.ReactNode;
}

export function ServiceProvider({
  service: defaultService,
  children,
}: ServiceProviderProps) {
  const [service, setService] = useState<ServiceRecord | null>(defaultService);

  return (
    <ServiceContext.Provider value={{ service, setService }}>
      {children}
    </ServiceContext.Provider>
  );
}
