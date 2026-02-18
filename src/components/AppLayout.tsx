import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Activity } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between px-4 border-b border-border bg-carbon/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-success animate-neon-pulse" />
                <span className="text-[10px] font-display uppercase tracking-wider text-muted-foreground">Live Telemetry</span>
              </div>
            </div>
            <span className="text-[9px] font-display uppercase tracking-[0.3em] text-muted-foreground">
              AMG Predictive AI Platform
            </span>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
