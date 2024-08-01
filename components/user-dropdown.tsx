"use client";

import { ChevronDown, Cog, Computer, LogOut, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { logOut } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/auth";
import { useTheme } from "next-themes";

export function UserDropdown() {
  const router = useRouter();
  const { user } = useUser();
  const { setTheme } = useTheme();

  const handleLogout = async () => {
    await logOut();
    router.push("/login");
  };

  if (!user) {
    return null;
  }

  const userInitials = `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-x-1">
          <Avatar>
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium-leading-none">{user.firstName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-x-2">
              <Sun className="h-4 w-4" />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="flex items-center gap-x-2"
              >
                <Sun className="h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="flex items-center gap-x-2"
              >
                <Moon className="h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="flex items-center gap-x-2"
              >
                <Computer className="h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-x-2">
              <Cog className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-x-2"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
