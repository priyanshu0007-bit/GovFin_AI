"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth, useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { UserProfile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Plus,
  Bot,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Link from "next/link";

const chartData = [
  { name: "Mon", amount: 2400 },
  { name: "Tue", amount: 1398 },
  { name: "Wed", amount: 9800 },
  { name: "Thu", amount: 3908 },
  { name: "Fri", amount: 4800 },
  { name: "Sat", amount: 3800 },
  { name: "Sun", amount: 4300 },
];

export default function DashboardPage() {
  const auth = useAuth();
  const db = useFirestore();
  const [currentDate, setCurrentDate] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  
  const userProfileRef = useMemo(() => {
    if (!auth.currentUser || !db || (db as any).__isMock) return null;
    try {
      return doc(db, "users", auth.currentUser.uid);
    } catch (e) {
      return null;
    }
  }, [auth.currentUser, db]);

  const { data: profile, loading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    setMounted(true);
    setCurrentDate(new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const profileCompleteness = useMemo(() => {
    if (!profile) return 0;
    const fields = ['name', 'state', 'age', 'income', 'occupation', 'casteCategory', 'gender', 'familySize'];
    const filledFields = fields.filter(field => !!(profile as any)[field]);
    return Math.round((filledFields.length / fields.length) * 100);
  }, [profile]);

  const metrics = [
    { title: "Eligible Schemes", value: "14", change: "+2", icon: ShieldCheck, color: "text-accent bg-accent/10 dark:bg-accent/20" },
    { title: "Monthly Savings", value: "₹4,200", change: "12%", icon: TrendingUp, color: "text-primary bg-primary/10 dark:bg-primary/20" },
    { title: "AI Insights", value: "8", change: "+1", icon: Zap, color: "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20" },
  ];

  if (!mounted) return null;

  if (loading && userProfileRef) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-muted-foreground animate-pulse">Analyzing your financial world...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] indigo-gradient p-8 md:p-12 text-white shadow-2xl transition-all duration-500 hover:shadow-primary/20">
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-4 bg-white/20 text-white border-none backdrop-blur-md animate-in slide-in-from-top-4 duration-700">
            <Sparkles className="mr-1 h-3 w-3" />
            AI-Powered Dashboard
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight animate-in slide-in-from-left-4 duration-700">
            Welcome back, {profile?.name || "User"}
          </h1>
          <p className="mt-2 text-white/80 text-lg animate-in slide-in-from-left-4 duration-700 delay-100">
            {currentDate}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 animate-in slide-in-from-bottom-4 duration-700 delay-200">
            <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 shadow-lg px-8 transition-transform hover:scale-105 active:scale-95 rounded-2xl">
              <Link href="/schemes"><Search className="mr-2 h-5 w-5" /> Find Schemes</Link>
            </Button>
            <Button asChild size="lg" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-white border border-white/20 backdrop-blur-md transition-transform hover:scale-105 active:scale-95 rounded-2xl">
              <Link href="/finance"><Plus className="mr-2 h-5 w-5" /> Track Expense</Link>
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
          <Bot className="w-full h-full transform translate-x-1/4 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 border-none shadow-sm dark:bg-card/50 dark:border dark:border-border/50 rounded-[2rem] overflow-hidden group hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              Profile Score
              <Badge variant="outline" className="text-primary border-primary/20">{profileCompleteness}%</Badge>
            </CardTitle>
            <CardDescription>Complete profile for better accuracy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={profileCompleteness} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Add your <span className="text-foreground font-medium">family details</span> to unlock more eligible schemes.
            </p>
            <Button variant="outline" size="sm" className="w-full rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300" asChild>
              <Link href="/profile">Complete Profile <ChevronRight className="ml-2 h-3 w-3" /></Link>
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((m, i) => (
            <Card key={i} className="border-none shadow-sm dark:bg-card/50 dark:border dark:border-border/50 rounded-[2rem] hover:shadow-md transition-all duration-300 cursor-default animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{m.title}</p>
                    <h3 className="text-3xl font-bold mt-1 tracking-tight">{m.value}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <span className={`text-xs font-bold flex items-center ${m.change.startsWith('+') || m.change.includes('%') ? 'text-accent' : 'text-slate-500'}`}>
                        {m.change.startsWith('+') ? <ArrowUpRight className="h-3 w-3 mr-1" /> : null}
                        {m.change}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">this month</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-[1.5rem] ${m.color} transition-transform group-hover:rotate-12`}>
                    <m.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm dark:bg-card/50 dark:border dark:border-border/50 rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
            <div>
              <CardTitle className="text-xl">Spending Trends</CardTitle>
              <CardDescription>Overview of your daily financial activity.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 rounded-xl" asChild>
              <Link href="/finance">Detailed View</Link>
            </Button>
          </CardHeader>
          <CardContent className="h-[320px] mt-4 px-8 pb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'currentColor', opacity: 0.6, fontSize: 12}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'currentColor', opacity: 0.6, fontSize: 12}} 
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  cursor={{fill: 'currentColor', opacity: 0.05}}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 2 ? '#4F46E5' : 'currentColor'} 
                      opacity={index === 2 ? 1 : 0.1}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg accent-gradient text-white flex flex-col justify-between overflow-hidden relative group rounded-[2rem]">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
          <CardHeader className="p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md transition-transform group-hover:rotate-12 shadow-xl">
                <Bot className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">AI Financial Coach</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-8">
            <div className="bg-white/10 backdrop-blur-md rounded-[1.5rem] p-6 border border-white/20 animate-in fade-in duration-1000 shadow-inner">
              <p className="text-white/90 leading-relaxed font-medium italic text-lg">
                "Allocate an extra <span className="text-white font-bold underline decoration-white/50">₹500</span> to your savings to reach your goal 4 months early."
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/70">Top Suggestion</h4>
              <div className="flex items-center gap-3 bg-black/10 rounded-2xl p-4 transition-all hover:bg-black/20 cursor-pointer border border-white/5">
                <ShieldCheck className="h-5 w-5 text-white/90" />
                <span className="text-sm font-bold">Verify PM Kisan eligibility</span>
              </div>
            </div>
          </CardContent>
          <CardContent className="pt-0 pb-8 px-8">
            <Button variant="secondary" className="w-full bg-white text-accent font-bold hover:bg-white/90 shadow-2xl transition-all duration-300 hover:scale-[1.02] h-14 rounded-2xl" asChild>
              <Link href="/assistant">Chat with AI Assistant</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}