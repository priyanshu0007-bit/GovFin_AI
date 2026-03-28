"use client";

// This file is currently not used in the new Navbar-based layout, 
// but we keep it updated in case of future partial layout usage.

import { Bell, Globe, Search as SearchIcon, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useMemo, useEffect } from "react";
import { useAuth, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { UserProfile } from "@/lib/types";
import { useRouter } from "next/navigation";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "mr", name: "मराठी" },
];

export function DashboardHeader() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState("en");

  const userProfileRef = useMemo(() => {
    if (!auth.currentUser) return null;
    return doc(db, "users", auth.currentUser.uid);
  }, [auth.currentUser, db]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const handleLogout = async () => {
    localStorage.removeItem("demo_mode");
    await auth.signOut();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 transition-all">
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex relative max-w-sm">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-10 w-[240px] bg-slate-100/50 border-none h-9 rounded-full" 
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2 rounded-full px-3">
              <Globe className="h-4 w-4" />
              <span className="text-xs font-bold">
                {languages.find(l => l.code === selectedLang)?.name || "English"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl">
            {languages.map((lang) => (
              <DropdownMenuItem key={lang.code} onClick={() => setSelectedLang(lang.code)}>
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://picsum.photos/seed/${userProfile?.uid || 'user'}/100/100`} />
                <AvatarFallback className="bg-primary text-white font-bold">{userProfile?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mt-2 rounded-2xl shadow-xl" align="end">
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold leading-none">{userProfile?.name || "Gov User"}</p>
                  <Badge variant="secondary" className="text-[8px] h-4 py-0 bg-primary/10 text-primary border-none">PREMIUM</Badge>
                </div>
                <p className="text-xs leading-none text-muted-foreground font-medium">{userProfile?.email || "user@example.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg" onClick={handleLogout}>
              <span className="text-destructive font-bold">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}