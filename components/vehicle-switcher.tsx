"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Vehicle } from "@/drizzle/schema";
import { setActiveVehicle } from "@/lib/actions/vehicles";
import { useUserVehicle } from "@/lib/hooks/user-vehicle";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import NewVehicleDialog from "./dialogs/new-vehicle";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface VehicleSwitcherProps extends PopoverTriggerProps {}

export default function VehicleSwitcher({ className }: VehicleSwitcherProps) {
  const router = useRouter();
  const { vehicles, activeVehicle } = useUserVehicle();
  const [open, setOpen] = useState(false);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
    activeVehicle
  );

  useEffect(() => {
    setSelectedVehicle(activeVehicle);
  }, [activeVehicle]);

  const handleSelectVehicle = async (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setOpen(false);
    await setActiveVehicle(vehicle.id);
    router.refresh();
    toast.success("Vehicle set as active");
  };

  if (!vehicles) {
    return null;
  }

  return (
    <>
      <NewVehicleDialog open={addVehicleOpen} setOpen={setAddVehicleOpen} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a vehicle"
            className={cn("w-[250px] justify-between", className)}
          >
            {selectedVehicle && (
              <Avatar className="mr-2 h-8 w-8">
                <AvatarFallback>
                  {selectedVehicle.make[0].toUpperCase()}
                  {selectedVehicle.model[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            {selectedVehicle ? (
              <span className="truncate">
                {selectedVehicle.year} {selectedVehicle.make}{" "}
                {selectedVehicle.model}
              </span>
            ) : (
              <span className="text-gray-400">Select a vehicle</span>
            )}
            <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search vehicle..." />
              <CommandEmpty>No vehicle found.</CommandEmpty>
              {vehicles.map((vehicle) => (
                <CommandItem
                  key={vehicle.id}
                  onSelect={() => handleSelectVehicle(vehicle)}
                  className="text-sm"
                >
                  <Avatar className="mr-2 w-8 h-8">
                    {/* <AvatarImage
                        src={`https://avatar.vercel.sh/${team.value}.png`}
                        alt={team.label}
                        className="grayscale"
                      /> */}
                    <AvatarFallback>
                      {vehicle.make[0].toUpperCase()}
                      {vehicle.model[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </span>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      vehicle.id === selectedVehicle?.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setAddVehicleOpen(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add Vehicle
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
