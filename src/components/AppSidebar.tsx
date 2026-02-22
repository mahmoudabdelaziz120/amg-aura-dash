import {
  LayoutDashboard, BarChart3, Car, ShieldAlert, Radio,
  Activity, Battery, Thermometer, Wrench, Gauge,
  Users, Flag, Cpu, Settings, Zap, Timer
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import amgLogo from '@/assets/amg-petronas-logo.png';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const mainNav = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Digital Twin', url: '/digital-twin', icon: Car },
  { title: 'Safety & Risk', url: '/safety', icon: ShieldAlert },
  { title: 'Fleet Monitor', url: '/fleet', icon: Radio },
];

const systemNav = [
  { title: 'Telemetry', url: '/telemetry', icon: Activity },
  { title: 'Battery', url: '/battery', icon: Battery },
  { title: 'Thermal', url: '/thermal', icon: Thermometer },
  { title: 'Powertrain', url: '/powertrain', icon: Wrench },
  { title: 'Diagnostics', url: '/diagnostics', icon: Gauge },
];

const racingNav = [
  { title: 'Driving Behavior', url: '/driving-behavior', icon: Zap },
  { title: 'Drivers & Teams', url: '/drivers-teams', icon: Users },
  { title: 'Pit Stop Analytics', url: '/pit-stop', icon: Timer },
  { title: 'Tech Updates', url: '/tech-updates', icon: Wrench },
  { title: 'AI Intelligence', url: '/ai-intelligence', icon: Cpu },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  const renderItems = (items: typeof mainNav) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink
            to={item.url}
            end={item.url === '/'}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-body text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            activeClassName="bg-primary/10 text-primary border-l-2 border-primary"
          >
            <item.icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-56'} collapsible="icon">
      <SidebarContent className="bg-[hsl(var(--sidebar-background))] border-r border-border">
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center justify-center">
          <img src={amgLogo} alt="AMG Petronas" className={collapsed ? 'h-6' : 'h-8'} />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="font-display text-[9px] uppercase tracking-[0.2em] text-muted-foreground px-4 py-2">
            {!collapsed && 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(mainNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-display text-[9px] uppercase tracking-[0.2em] text-muted-foreground px-4 py-2">
            {!collapsed && 'Systems'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(systemNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-display text-[9px] uppercase tracking-[0.2em] text-muted-foreground px-4 py-2">
            {!collapsed && 'Racing & AI'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(racingNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status indicator */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-neon-pulse" />
              <span className="text-[10px] font-display uppercase tracking-wider text-muted-foreground">
                Systems Online
              </span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
