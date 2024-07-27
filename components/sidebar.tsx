"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUp10,
  BarChart3,
  Bell,
  Car,
  CarFront,
  Cog,
  Files,
  Home,
  OctagonAlert,
  Settings,
  Wrench,
} from "lucide-react";
import { useUserVehicle } from "@/lib/hooks/user-vehicle";
import { useVehicle } from "@/lib/hooks/vehicle";

export default function Sidebar() {
  const { activeVehicle } = useUserVehicle();
  const pageVehicle = useVehicle();
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <CarFront className="h-6 w-6" />
            <span className="">Maintainr</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                {
                  "text-primary bg-muted": pathname === "/",
                  "text-muted-foreground": pathname !== "/",
                }
              )}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/vehicles"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                {
                  "text-primary bg-muted":
                    pathname.startsWith("/vehicles") &&
                    activeVehicle?.id !== pageVehicle?.id,
                  "text-muted-foreground": pathname !== "/vehicles",
                }
              )}
            >
              <Car className="h-4 w-4" />
              Vehicles
            </Link>
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                {
                  "text-primary bg-muted": pathname.startsWith("/settings"),
                  "text-muted-foreground": !pathname.startsWith("/settings"),
                }
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <span className="block px-3 py-2 text-xs font-semibold text-muted-foreground mt-2">
              My Vehicle
            </span>
            {activeVehicle && (
              <>
                <Link
                  href={`/vehicles/${activeVehicle.id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    {
                      "text-primary bg-muted": pathname.endsWith(
                        `/vehicles/${activeVehicle.id}`
                      ),
                      "text-muted-foreground": !pathname.endsWith(
                        `/vehicles/${activeVehicle.id}`
                      ),
                    }
                  )}
                >
                  <CarFront className="h-4 w-4" />
                  Overview
                </Link>
                <Link
                  href={`/vehicles/${activeVehicle.id}/service`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    {
                      "text-primary bg-muted": pathname.startsWith(
                        `/vehicles/${activeVehicle.id}/service`
                      ),
                      "text-muted-foreground": !pathname.startsWith(
                        `/vehicles/${activeVehicle.id}/service`
                      ),
                    }
                  )}
                >
                  <Wrench className="h-4 w-4" />
                  Service
                </Link>
                <Link
                  href={`/vehicles/${activeVehicle.id}/parts`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    {
                      "text-primary bg-muted": pathname.startsWith(
                        `/vehicles/${activeVehicle.id}/parts`
                      ),
                      "text-muted-foreground": !pathname.startsWith(
                        `/vehicles/${activeVehicle.id}/parts`
                      ),
                    }
                  )}
                >
                  <Cog className="h-4 w-4" />
                  Parts
                </Link>
                <Link
                  href={`/vehicles/${activeVehicle.id}/odometer`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    {
                      "text-primary bg-muted": pathname.startsWith(
                        `/vehicles/${activeVehicle.id}/odometer`
                      ),
                      "text-muted-foreground": !pathname.startsWith(
                        `/vehicles/${activeVehicle.id}/odometer`
                      ),
                    }
                  )}
                >
                  <ArrowUp10 className="h-4 w-4" />
                  Odometer
                </Link>
                <Link
                  href={`/vehicles/${activeVehicle.id}/documents`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    {
                      "text-primary bg-muted": pathname.startsWith(
                        `/vehicles/${activeVehicle.id}/documents`
                      ),
                      "text-muted-foreground": !pathname.startsWith(
                        `/vehicles/${activeVehicle.id}/documents`
                      ),
                    }
                  )}
                >
                  <Files className="h-4 w-4" />
                  Documents
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
