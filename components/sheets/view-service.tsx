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

interface ViewServiceSheetProps {
  service: ServiceRecord;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ViewServiceSheet({
  service,
  open,
  setOpen,
}: ViewServiceSheetProps) {
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
