"use client";

import { Navbar } from "@/components/layout/Navbar";
import { useEffect, useState } from "react";

/**
 * Dashboard layout that no longer requires authentication checks.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
      <footer className="py-8 border-t bg-white dark:bg-card mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground font-medium">
          © {new Date().getFullYear()} GovFinAI Assistant. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
