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

export default function Sidebar() {
  const vehicle = useUserVehicle();
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
            <span className="block px-3 py-2 text-xs font-semibold text-muted-foreground">
              Dashboard
            </span>
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
              Overview
            </Link>
            <Link
              href="/vehicles"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                {
                  "text-primary bg-muted": pathname.startsWith("/vehicles"),
                  "text-muted-foreground": !pathname.startsWith("/vehicles"),
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
            {vehicle && (
              <>
                <Link
                  href="/service"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    {
                      "text-primary bg-muted": pathname.startsWith("/service"),
                      "text-muted-foreground": !pathname.startsWith("/service"),
                    }
                  )}
                >
                  <Wrench className="h-4 w-4" />
                  Service
                </Link>
                <Link
                  href="/parts"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    {
                      "text-primary bg-muted": pathname.startsWith("/parts"),
                      "text-muted-foreground": !pathname.startsWith("/parts"),
                    }
                  )}
                >
                  <Cog className="h-4 w-4" />
                  Parts
                </Link>
                <Link
                  href="/incidents"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    {
                      "text-primary bg-muted":
                        pathname.startsWith("/incidents"),
                      "text-muted-foreground":
                        !pathname.startsWith("/incidents"),
                    }
                  )}
                >
                  <OctagonAlert className="h-4 w-4" />
                  Incidents
                </Link>
                <Link
                  href="/odometer"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    {
                      "text-primary bg-muted": pathname.startsWith("/odometer"),
                      "text-muted-foreground":
                        !pathname.startsWith("/odometer"),
                    }
                  )}
                >
                  <ArrowUp10 className="h-4 w-4" />
                  Odometer
                </Link>
                <Link
                  href="/documents"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    {
                      "text-primary bg-muted":
                        pathname.startsWith("/documents"),
                      "text-muted-foreground":
                        !pathname.startsWith("/documents"),
                    }
                  )}
                >
                  <Files className="h-4 w-4" />
                  Documents
                </Link>
                <Link
                  href="/reports"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    {
                      "text-primary bg-muted": pathname.startsWith("/reports"),
                      "text-muted-foreground": !pathname.startsWith("/reports"),
                    }
                  )}
                >
                  <BarChart3 className="h-4 w-4" />
                  Reports
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
