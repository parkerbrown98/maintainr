import { SettingsEmailCard } from "@/components/settings/email-card";
import { SettingsInfoCard } from "@/components/settings/info-card";

export default function Settings() {
    return (
        <div className="flex flex-col h-full gap-4 lg:gap-6">
            <SettingsInfoCard />
            <SettingsEmailCard />
        </div>
    )
}