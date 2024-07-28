"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { setActiveVehicle } from "@/lib/actions/vehicles";
import { useRouter } from "next/navigation";
import { useUserVehicle } from "@/lib/hooks/user-vehicle";

interface VehicleCardActionsProps {
  vehicleId: string;
}

export function VehicleCardActions({ vehicleId }: VehicleCardActionsProps) {
  const { activeVehicle } = useUserVehicle();
  const router = useRouter();

  const handleSetActive = async () => {
    try {
      await setActiveVehicle(vehicleId);
      toast.success("Vehicle set as active");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return (
    <>
      <Button size="sm" asChild>
        <Link href={`/vehicles/${vehicleId}`}>View</Link>
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleSetActive}
        disabled={activeVehicle?.id === vehicleId}
      >
        {activeVehicle?.id === vehicleId ? "Active" : "Set Active"}
      </Button>
    </>
  );
}
