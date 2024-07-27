import { SettingsSidebar } from "@/components/settings-sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full gap-4 lg:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Settings
        </h1>
      </div>
      <div className="grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <SettingsSidebar />
        {children}
      </div>
    </div>
  );
}
