"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search,
  BookMarked,
  BarChart3,
  Receipt,
  Bot,
  User,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase/provider";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Scheme Finder", href: "/schemes", icon: Search },
  { name: "My Schemes", href: "/my-schemes", icon: BookMarked },
];

const financeNavItems = [
  { name: "Finance Tracker", href: "/finance", icon: BarChart3 },
  { name: "Transactions", href: "/finance/transactions", icon: Receipt },
];

const aiNavItems = [
  { name: "AI Assistant", href: "/assistant", icon: Bot },
];

const userNavItems = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = async () => {
    localStorage.removeItem("demo_mode");
    try {
      await signOut(auth);
    } catch (e) {
      // Silently ignore sign out errors for demo mode
    }
    router.push("/login");
  };

  const NavGroup = ({ label, items }: { label: string; items: typeof mainNavItems }) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-4 mb-2">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1.5">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={active} 
                  tooltip={item.name}
                  className={cn(
                    "transition-all duration-300 rounded-xl h-10 px-4",
                    active 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold" 
                      : "hover:bg-primary/5 text-slate-600 hover:text-primary font-medium"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className={cn("h-4 w-4", active ? "text-white" : "text-slate-400 group-hover:text-primary")} />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-100 bg-white shadow-sm">
      <SidebarHeader className="h-20 flex items-center px-6 mb-4">
        <div className="flex items-center gap-3 font-extrabold text-2xl tracking-tighter text-slate-900">
          <div className="w-10 h-10 rounded-2xl indigo-gradient flex items-center justify-center text-white shadow-xl rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            G
          </div>
          <span className="group-data-[collapsible=icon]:hidden">Gov<span className="text-primary">Fin</span>AI</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 pb-8">
        <NavGroup label="Personalized" items={mainNavItems} />
        <NavGroup label="Financials" items={financeNavItems} />
        <NavGroup label="Support" items={aiNavItems} />
        <NavGroup label="Account" items={userNavItems} />

        <div className="group-data-[collapsible=icon]:hidden mt-12 p-4 mx-2 rounded-2xl indigo-gradient text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <p className="text-xs font-bold flex items-center gap-2 mb-2">
            <Sparkles className="h-3 w-3" />
            GOVFIN PRO
          </p>
          <p className="text-[10px] leading-relaxed text-white/80 font-medium mb-3">
            Upgrade to unlock premium AI insights and auto-fill applications.
          </p>
          <Button variant="secondary" size="sm" className="w-full h-8 text-[10px] font-bold bg-white text-primary rounded-lg hover:bg-white/90">
            Learn More
          </Button>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="w-full rounded-xl h-11 text-slate-500 hover:text-destructive hover:bg-destructive/5 font-bold transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}