import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AgentSidebar } from "~/components/agent-sidebar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <SidebarProvider>
      <AgentSidebar />
      <main>
        <SidebarTrigger className="bg-red-50" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
