"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { editVehicle } from "@/lib/actions/vehicles";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/auth";
import { toast } from "sonner";
import { Vehicle } from "@/drizzle/schema";
import { FormError } from "../ui/form-error";

const schema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900).max(2100),
  vin: z
    .string()
    .length(17, "VIN must be 17 characters")
    .optional()
    .or(z.literal("")),
  licensePlate: z
    .string()
    .min(3, "License plate must be at least 3 characters")
    .optional()
    .or(z.literal("")),
});

interface EditVehicleDialogProps {
  vehicle: Vehicle;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function EditVehicleDialog({
  vehicle,
  open,
  setOpen,
}: EditVehicleDialogProps) {
  const user = useUser();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      vin: vehicle.vin ?? "",
      licensePlate: vehicle.licensePlate ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      vin: vehicle.vin ?? "",
      licensePlate: vehicle.licensePlate ?? "",
    });
  }, [vehicle, open]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!user || !vehicle) {
      return;
    }

    try {
      setLoading(true);
      await editVehicle(vehicle.id, values);
      form.reset();
      setOpen(false);
      router.refresh();
      toast.success(`Your changes have been saved`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit vehicle</DialogTitle>
          <DialogDescription>Make changes to your vehicle</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-vehicle"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {error && <FormError>{error}</FormError>}
            <div className="grid grid-cols-2 gap-4">
              <FormMessage />
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make*</FormLabel>
                    <FormControl>
                      <Input placeholder="Honda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model*</FormLabel>
                    <FormControl>
                      <Input placeholder="Civic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2021"
                      {...field}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    The year the vehicle was manufactured
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN</FormLabel>
                    <FormControl>
                      <Input placeholder="1HGBH41JXMN109186" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Plate</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button form="edit-vehicle" type="submit" disabled={loading}>
            {loading ? "Working" : "Save"}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
