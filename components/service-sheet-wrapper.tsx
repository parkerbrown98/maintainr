"use client";

import { useState } from "react";
import { ViewServiceSheet } from "./sheets/view-service";
import { ServiceRecord } from "@/drizzle/schema";

interface ServiceSheetWrapperProps {
  service: ServiceRecord | null;
}

export function ServiceSheetWrapper({ service }: ServiceSheetWrapperProps) {
  const [isOpen, setIsOpen] = useState(service !== null);

  if (!service) return null;

  return (
    <ViewServiceSheet service={service} open={isOpen} setOpen={setIsOpen} />
  );
}
