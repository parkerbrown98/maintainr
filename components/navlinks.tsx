"use client";

import { cn } from "@/lib/utils";
import { Cog, Wrench, OctagonAlert, Ruler, Files, BarChart3 } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <>
            <Link
                href="/service"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", {
                    "text-primary bg-muted": pathname === "/service",
                    "text-muted-foreground": pathname !== "/service",
                })}
            >
                <Cog className="h-4 w-4" />
                Service
            </Link>
            <Link
                href="/parts"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", {
                    "text-primary bg-muted": pathname.startsWith("/parts"),
                    "text-muted-foreground": !pathname.startsWith("/parts"),
                })}
            >
                <Wrench className="h-4 w-4" />
                Parts
            </Link>
            <Link
                href="/incidents"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", {
                    "text-primary bg-muted": pathname.startsWith("/incidents"),
                    "text-muted-foreground": !pathname.startsWith("/incidents"),
                })}
            >
                <OctagonAlert className="h-4 w-4" />
                Incidents
            </Link>
            <Link
                href="/odometer"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", {
                    "text-primary bg-muted": pathname.startsWith("/odometer"),
                    "text-muted-foreground": !pathname.startsWith("/odometer"),
                })}
            >
                <Ruler className="h-4 w-4" />
                Odometer
            </Link>
            <Link
                href="/documents"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", {
                    "text-primary bg-muted": pathname.startsWith("/documents"),
                    "text-muted-foreground": !pathname.startsWith("/documents"),
                })}
            >
                <Files className="h-4 w-4" />
                Documents
            </Link>
            <Link
                href="/reports"
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary", {
                    "text-primary bg-muted": pathname.startsWith("/reports"),
                    "text-muted-foreground": !pathname.startsWith("/reports"),
                })}
            >
                <BarChart3 className="h-4 w-4" />
                Reports
            </Link>
        </>
    )
}