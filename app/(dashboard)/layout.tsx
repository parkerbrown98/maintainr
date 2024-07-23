import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { validateUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/lib/context/auth";

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
  if (!session) {
    return redirect("/login");
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider user={session.user}>
          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col h-full">
              <Navbar />
              <main className="p-4 lg:p-6 flex-1">{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
