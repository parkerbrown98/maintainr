"use client";

import { ArrowRightFromLine, Check, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { setActiveVehicle } from "@/lib/actions/vehicles";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserVehicle } from "@/lib/hooks/user-vehicle";

interface VehicleDetailActionsProps {
  vehicleId: string;
}

export function VehicleDetailActions({ vehicleId }: VehicleDetailActionsProps) {
  const { activeVehicle } = useUserVehicle();
  const router = useRouter();

  const handleActive = async () => {
    await setActiveVehicle(vehicleId);
    toast.success("Vehicle set as active");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-x-2">
      <div className="flex items-center gap-x-2">
        <Button variant="outline" className="flex items-center gap-x-2">
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
    </div>
  );
}
