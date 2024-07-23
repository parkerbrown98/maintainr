import { cn } from "@/lib/utils";
import Link from "next/link";

export function NavTabs({ children }: { children: React.ReactNode }) {
  return (
    <nav className="w-full flex gap-x-1 border-b border-border pb-2 overflow-x-scroll no-scrollbar">
      {children}
    </nav>
  );
}

export function NavTabItem({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      className={cn(
        "py-2 px-3 text-sm font-medium rounded-md hover:bg-muted hover:text-black transition-colors",
        {
          "text-muted-foreground": !active,
          "bg-muted text-black": active,
        }
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
