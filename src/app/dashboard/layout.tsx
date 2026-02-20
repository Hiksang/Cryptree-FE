import { Sidebar } from "@/domains/dashboard";
import { DashboardHeader } from "@/domains/dashboard";
import { BottomNav } from "@/domains/dashboard";
import { AuthGuard } from "@/shared/ui";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-bg-primary">
        <Sidebar />

        {/* Main content area */}
        <div className="md:ml-16 lg:ml-[240px]">
          <DashboardHeader />
          <main className="p-4 md:p-6 pb-20 md:pb-6">{children}</main>
        </div>

        <BottomNav />
      </div>
    </AuthGuard>
  );
}
