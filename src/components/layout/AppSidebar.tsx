import { LayoutDashboard, Briefcase, TrendingUp, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
const navigationItems = [{
  title: "Visión General",
  url: "/",
  icon: LayoutDashboard
}, {
  title: "Portafolios",
  url: "/portfolios",
  icon: Briefcase
}, {
  title: "Operaciones",
  url: "/operations",
  icon: TrendingUp
}, {
  title: "Configuración",
  url: "/settings",
  icon: Settings
}];
export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };
  const isCollapsed = state === "collapsed";
  return <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">PortfolioHub</h1>
              <p className="text-xs text-muted-foreground">Gestión de Inversiones</p>
            </div>
          </div>}
        <SidebarTrigger className="h-8 w-8" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className={({
                  isActive
                }) => `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"}`}>
                      <item.icon className="h-5 w-5 bg-gray-900" />
                      {!isCollapsed && <span className="text-gray-900">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}