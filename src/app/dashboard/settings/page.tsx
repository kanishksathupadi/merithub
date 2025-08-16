import { SettingsForm } from "@/components/dashboard/settings-form";
import { Toaster } from "@/components/ui/toaster";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account, notifications, and privacy settings.</p>
      </header>
      <SettingsForm />
      <Toaster />
    </div>
  );
}
