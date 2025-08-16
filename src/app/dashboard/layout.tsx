
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset>
            <header className="p-4 sm:p-6 lg:p-8 flex items-center gap-4 border-b">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold">Dashboard</h1>
            </header>
          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {children}
          </div>
          <Toaster />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
