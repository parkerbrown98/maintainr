import { SettingsLanguageCard } from "@/components/settings/language-card";
import { SettingsUnitsCard } from "@/components/settings/units-card";

export default function LocalePage() {
  return (
    <div className="flex flex-col h-full gap-4 lg:gap-6">
      <SettingsLanguageCard />
      <SettingsUnitsCard />
    </div>
  );
}
