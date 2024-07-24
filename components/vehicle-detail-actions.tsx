"use client";

import { ArrowRightFromLine, Check, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { setActiveVehicle } from "@/lib/actions/vehicles";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserVehicle } from "@/lib/hooks/user-vehicle";
import EditVehicleDialog from "./dialogs/edit-vehicle";
import { useState } from "react";
import { useVehicle } from "@/lib/hooks/vehicle";

interface VehicleDetailActionsProps {
  vehicleId: string;
}

export function VehicleDetailActions({ vehicleId }: VehicleDetailActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { activeVehicle } = useUserVehicle();
  const vehicle = useVehicle();
  const router = useRouter();

  const handleActive = async () => {
    await setActiveVehicle(vehicleId);
    toast.success("Vehicle set as active");
    router.refresh();
  };

  if (!vehicle) {
    return null;
  }

  return (
    <>
      <EditVehicleDialog
        vehicle={vehicle}
        open={isEditOpen}
        setOpen={setIsEditOpen}
      />
      <div className="flex items-center gap-x-2">
        <Button
          variant="outline"
          className="flex items-center gap-x-2"
          onClick={() => setIsEditOpen(true)}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button
          className="flex items-center gap-x-2"
          onClick={handleActive}
          disabled={activeVehicle?.id === vehicleId}
        >
          {activeVehicle?.id === vehicleId ? (
            <Check className="h-4 w-4" />
          ) : (
            <ArrowRightFromLine className="h-4 w-4" />
          )}
          {activeVehicle?.id === vehicleId ? "Active" : "Set as active"}
        </Button>
      </div>
    </>
  );
}
