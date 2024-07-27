"use client";

import { ServiceRecord } from "@/drizzle/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { SERVICE_TYPES } from "@/lib/constants";
import { Button } from "../ui/button";
import { useSheet } from "@/lib/hooks/sheet";
import { useService } from "@/lib/hooks/service";

export function ViewServiceSheet() {
  const { open, setOpen } = useSheet();
  const { service } = useService();

  if (!service) {
    return null;
  } else {
    const serviceType = service.serviceType as keyof typeof SERVICE_TYPES;

    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{SERVICE_TYPES[serviceType]}</SheetTitle>
            <SheetDescription>{service.description}</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
}
