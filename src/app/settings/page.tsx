import { CustomIntervalsManager } from "@/components/settings/CustomIntervalsManager";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Application Settings</h1>
      
      <CustomIntervalsManager />
      
      {/* Placeholder for other settings if needed in the future */}
    </div>
  );
}
