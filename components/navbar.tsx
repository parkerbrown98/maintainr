import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CarFront, Menu } from "lucide-react";
import VehicleSwitcher from "./vehicle-switcher";
import Link from "next/link";
import NavLinks from "./navlinks";
import { UserDropdown } from "./user-dropdown";

export default function Navbar() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 items-start">
                                <Link href="/" className="-mt-2 mb-2 flex items-center gap-2 text-lg font-semibold">
                                    <CarFront className="h-5 w-5" />
                                    <span>Maintainr</span>
                                </Link>
                                <NavLinks />
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <VehicleSwitcher />
                </div>
                <UserDropdown />
            </div>
        </header>
    )
}