import { AppSidebar } from "@/components/app-shell/AppSidebar";
import { AppMobileNav } from "@/components/app-shell/AppMobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <div className="pb-20 lg:ml-64 lg:pb-0">{children}</div>
      <AppMobileNav />
    </div>
  );
}
