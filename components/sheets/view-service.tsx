"use client";

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
import { Separator } from "../ui/separator";
import moment from "moment";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useVehicle } from "@/lib/hooks/vehicle";
import { UnitFormat } from "../unit-format";
import { UploadTiles } from "../upload-tiles";
import { useState } from "react";
import { DeleteServiceDialog } from "../dialogs/delete-service-record";

export function ViewServiceSheet() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { open, setOpen } = useSheet();
  const vehicle = useVehicle();
  const { service, uploads } = useService();

  if (!service || !vehicle) {
    return null;
  } else {
    const serviceType = service.serviceType as keyof typeof SERVICE_TYPES;
    const serviceDate = moment(service.serviceDate).format("MMMM Do, YYYY");

    return (
      <>
        <DeleteServiceDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          service={service}
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Service Details</SheetTitle>
              <SheetDescription>
                View details about this service
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 flex flex-col space-y-6">
              <div className="p-4 flex items-center justify-between bg-muted border border-border rounded-md">
                <div className="flex items-center gap-x-2">
                  <Avatar>
                    <AvatarFallback className="bg-gray-200">
                      {vehicle.make[0].toUpperCase()}
                      {vehicle.model[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium leading-tight">
                      {vehicle.year} {vehicle.make}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {vehicle.model}
                    </div>
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    View Vehicle
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Information</div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                  <div className="text-muted-foreground font-medium">
                    Service Type
                  </div>
                  <div>{SERVICE_TYPES[serviceType]}</div>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                  <div className="text-muted-foreground font-medium">Cost</div>
                  <div>
                    {Number(service.cost).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                  <div className="text-muted-foreground font-medium">Date</div>
                  <div>{serviceDate}</div>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                  <div className="text-muted-foreground font-medium">
                    Odometer
                  </div>
                  <div>
                    {service.odometer ? (
                      <UnitFormat value={service.odometer} unit="length" />
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Notes</div>
                <div className="text-sm text-muted-foreground">
                  {service.description ?? "No description provided."}
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Uploads</div>
                {uploads && uploads.length > 0 ? (
                  <UploadTiles uploads={uploads} />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No uploads have been attached to this service.
                  </div>
                )}
              </div>
            </div>
            <SheetFooter>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </>
    );
  }
}
