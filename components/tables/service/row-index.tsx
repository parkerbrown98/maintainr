"use client";

import { SERVICE_TYPES } from "@/lib/constants";
import { useSheet } from "@/lib/hooks/sheet";
import { useRouter } from "next/navigation";

export function ServiceRowIndex({
  serviceId,
  serviceType,
}: {
  serviceId: string;
  serviceType: keyof typeof SERVICE_TYPES;
}) {
  const router = useRouter();
  const sheet = useSheet();

  const openSheet = () => {
    router.push(`?show=${serviceId}`);
    sheet.setOpen(true);
  };

  return (
    <div
      onClick={openSheet}
      className="font-medium hover:underline cursor-pointer"
    >
      {SERVICE_TYPES[serviceType]}
    </div>
  );
}
