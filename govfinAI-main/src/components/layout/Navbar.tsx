"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Search, 
  BarChart3, 
  Bot, 
  User, 
  Settings,
  Bell,
  Globe,
  ChevronDown,
  Menu,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFirestore, useDoc, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { UserProfile } from "@/lib/types";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Schemes", href: "/schemes", icon: Search },
  { name: "My Wallet", href: "/finance", icon: BarChart3 },
  { name: "AI Assistant", href: "/assistant", icon: Bot },
];

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "mr", name: "मराठी" },
  { code: "ta", name: "தமிழ்" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const db = useFirestore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  const userProfileRef = useMemo(() => {
    // CRITICAL: Defensive check to prevent SDK crashes during initialization or demo mode
    if (!user || !db || (db as any).__isMock) return null;
    try {
      return doc(db, "users", user.uid);
    } catch (e) {
      return null;
    }
  }, [user, db]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tighter shrink-0 hover:scale-105 transition-transform">
            <div className="w-8 h-8 rounded-lg indigo-gradient flex items-center justify-center text-white shadow-lg">G</div>
            <span className="hidden sm:inline">Gov<span className="text-primary">Fin</span>AI</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Button key={item.href} variant="ghost" asChild className={cn(
                  "h-10 px-4 rounded-xl transition-all duration-300",
                  active ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted"
                )}>
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className={cn("h-4 w-4 transition-transform duration-300", active ? "scale-110 text-primary" : "text-muted-foreground")} />
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full transition-all duration-300 hover:bg-muted">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 gap-2 rounded-full border border-border">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-bold">{languages.find(l => l.code === selectedLang)?.name}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code} onClick={() => setSelectedLang(lang.code)} className="rounded-lg m-1">
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="h-9 w-9 relative rounded-full border border-border transition-all duration-300 hover:bg-muted">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse"></span>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 shadow-sm border border-border group overflow-hidden">
                <Avatar className="h-9 w-9 transition-transform duration-300 group-hover:scale-110">
                  <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'user'}/100/100`} />
                  <AvatarFallback className="bg-primary text-white font-bold">{userProfile?.name?.charAt(0) || user?.displayName?.charAt(0) || "G"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2 rounded-2xl animate-in slide-in-from-top-2 duration-300" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold">{userProfile?.name || user?.displayName || "Gov Visitor"}</p>
                  <p className="text-xs text-muted-foreground truncate">{userProfile?.email || user?.email || "visitor@govfin.ai"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-lg m-1 cursor-pointer">
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg m-1 cursor-pointer">
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 rounded-full border border-border">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <div className="flex flex-col h-full bg-background">
                <div className="h-16 flex items-center px-6 border-b">
                  <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <div className="w-8 h-8 rounded-lg indigo-gradient flex items-center justify-center text-white">G</div>
                    <span>GovFinAI</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {mainNavItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Button key={item.href} variant="ghost" asChild className={cn(
                        "w-full justify-start h-12 rounded-xl transition-all",
                        active ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                      )} onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href={item.href} className="flex items-center gap-3">
                          <item.icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                          {item.name}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
                <div className="p-4 border-t space-y-2">
                  <Button variant="outline" onClick={toggleDarkMode} className="w-full justify-start rounded-xl">
                    {isDarkMode ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
