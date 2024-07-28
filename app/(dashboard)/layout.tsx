import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { validateUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/lib/context/auth";
import { db } from "@/lib/db";
import { vehicles } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { UserVehicleProvider } from "@/lib/context/user-vehicle";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maintainr",
  description: "A tool to help you maintain your fleet of vehicles",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateUser();
  if (!session || !session.user) {
    return redirect("/login");
  }

  const [selectedVehicle] = await db
    .select()
    .from(vehicles)
    .where(
      and(
        eq(vehicles.id, session.user.selectedVehicleId),
        eq(vehicles.userId, session.user.id)
      )
    )
    .limit(1);

  const allVehicles = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.userId, session.user.id));

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider preferences={session.preferences} user={session.user}>
          <UserVehicleProvider
            vehicles={allVehicles}
            activeVehicle={selectedVehicle}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <Sidebar />
                <div className="flex flex-col h-full">
                  <Navbar />
                  <main className="p-4 lg:p-6 flex-1">{children}</main>
                  <Toaster />
                </div>
              </div>
            </ThemeProvider>
          </UserVehicleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
