"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      <Link
        href="/settings"
        className={cn({
          "font-semibold text-primary": pathname === "/settings",
        })}
      >
        Profile
      </Link>
      <Link
        href="/settings/security"
        className={cn({
          "font-semibold text-primary":
            pathname.startsWith("/settings/security"),
        })}
      >
        Security
      </Link>
      <Link
        href="/settings/locale"
        className={cn({
          "font-semibold text-primary": pathname.startsWith("/settings/locale"),
        })}
      >
        Locale
      </Link>
      <Link
        href="/settings/integrations"
        className={cn({
          "font-semibold text-primary": pathname.startsWith(
            "/settings/integrations"
          ),
        })}
      >
        Integrations
      </Link>
      <Link
        href="/settings/advanced"
        className={cn({
          "font-semibold text-primary":
            pathname.startsWith("/settings/advanced"),
        })}
      >
        Advanced
      </Link>
    </nav>
  );
}
