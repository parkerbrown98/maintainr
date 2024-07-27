"use client";

import { NavTabs, NavTabItem } from "./ui/nav-tabs";
import { usePathname } from "next/navigation";

export function VehicleTabs({ id }: { id: string }) {
  const pathname = usePathname();

  return (
    <NavTabs>
      <NavTabItem
        href={`/vehicles/${id}`}
        active={pathname === `/vehicles/${id}`}
      >
        Overview
      </NavTabItem>
      <NavTabItem
        href={`/vehicles/${id}/service`}
        active={pathname === `/vehicles/${id}/service`}
      >
        Service
      </NavTabItem>
      <NavTabItem
        href={`/vehicles/${id}/parts`}
        active={pathname === `/vehicles/${id}/parts`}
      >
        Parts
      </NavTabItem>
      <NavTabItem
        href={`/vehicles/${id}/documents`}
        active={pathname === `/vehicles/${id}/documents`}
      >
        Documents
      </NavTabItem>
    </NavTabs>
  );
}
