"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import NewVehicleDialog from "./dialogs/new-vehicle";

export function VehicleActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NewVehicleDialog open={open} setOpen={setOpen} />
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="h-5 w-5 mr-2" />
        Add Vehicle
      </Button>
    </>
  );
}
