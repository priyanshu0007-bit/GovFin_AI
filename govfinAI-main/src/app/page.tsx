
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Languages, 
  Search, 
  ArrowRight,
  Moon,
  Sun,
  Zap,
  Bot,
  Heart,
  CheckCircle2,
  Users,
  MousePointer2
} from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
      {/* Fixed Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter group cursor-pointer">
            <div className="w-8 h-8 rounded-lg indigo-gradient flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12">G</div>
            <span>Gov<span className="text-primary">Fin</span>AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-semibold hover:text-primary transition-colors">Features</Link>
            <Link href="#impact" className="text-sm font-semibold hover:text-primary transition-colors">Impact</Link>
            <Link href="/schemes" className="text-sm font-semibold hover:text-primary transition-colors">Scheme Finder</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full hover:bg-muted/50 transition-all">
              {isDarkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </Button>
            <Button asChild className="indigo-gradient hover:opacity-90 transition-all hover:scale-105 active:scale-95 px-6 rounded-xl font-bold shadow-md">
              <Link href="/dashboard">Launch App</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-grid-slate-200 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none opacity-20 dark:opacity-10"></div>
          <div className="absolute top-0 -left-4 w-[500px] h-[500px] bg-primary/20 rounded-full filter blur-[120px] animate-blob"></div>
          <div className="absolute top-0 -right-4 w-[500px] h-[500px] bg-purple-500/20 rounded-full filter blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-accent/10 rounded-full filter blur-[120px] animate-blob animation-delay-4000"></div>

          <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-16 items-center relative z-10">
            <div className="lg:col-span-7 space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-700">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Empowering 1.4 Billion People</span>
              </div>
              
              <div className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-1000">
                <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black tracking-tighter leading-[0.85] text-slate-900 dark:text-white">
                  Financial <br />
                  <span className="text-transparent bg-clip-text indigo-gradient">Freedom</span> <br />
                  for Bharat.
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed font-medium mt-6">
                  Experience AI that speaks your language. Match with 1,200+ government schemes and take control of your finances instantly.
                </p>
              </div>

              <div className="flex flex-col sm:row gap-5 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                <Button size="lg" asChild className="indigo-gradient h-16 px-10 text-lg rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:translate-y-[-4px] font-bold group">
                  <Link href="/dashboard">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-2xl border-border bg-background/50 backdrop-blur-md hover:bg-muted font-bold transition-all" asChild>
                  <Link href="#features">How it works</Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-8 border-t border-border/40 max-w-md animate-in fade-in duration-1000 delay-500">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-background overflow-hidden ring-2 ring-primary/10">
                      <Image src={`https://picsum.photos/seed/${i + 20}/100/100`} width={40} height={40} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Trusted by <span className="text-foreground font-black">25,000+</span> Citizens
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Sparkles key={s} className="h-2 w-2 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              {/* Main Visual Container */}
              <div className="relative z-10 p-4 bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[3.5rem] shadow-2xl animate-in fade-in zoom-in duration-1000 delay-300">
                <div className="relative overflow-hidden rounded-[2.8rem]">
                  <Image 
                    src="https://picsum.photos/seed/bharat-hero/1200/1600" 
                    width={1200} 
                    height={1600} 
                    alt="Bharat Digital" 
                    className="object-cover h-[500px] lg:h-[650px] w-full"
                    data-ai-hint="indian digital"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Floating Benefit Cards - Staggered Entry */}
              <div className="absolute -top-12 -right-8 glass-morphism p-6 rounded-[2rem] animate-float z-20 max-w-[200px] shadow-2xl border-emerald-500/20 animate-in slide-in-from-right-12 duration-1000 delay-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Eligibility</span>
                </div>
                <p className="text-sm font-bold text-foreground">PM Kisan Matched</p>
                <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">₹2,000 Next Installment</p>
              </div>

              <div className="absolute top-1/2 -left-16 glass-morphism p-6 rounded-[2rem] animate-float animation-delay-2000 z-20 shadow-2xl border-indigo-500/20 animate-in slide-in-from-left-12 duration-1000 delay-1000">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Savings Score</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black">88</span>
                  <span className="text-[10px] text-indigo-500 font-bold">TOP 5%</span>
                </div>
                <div className="w-full bg-indigo-500/10 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[88%]"></div>
                </div>
              </div>

              <div className="absolute -bottom-8 right-8 glass-morphism p-5 rounded-[2.5rem] animate-float animation-delay-4000 z-20 flex items-center gap-4 shadow-2xl border-primary/10 animate-in slide-in-from-bottom-12 duration-1000 delay-1200">
                <div className="h-12 w-12 rounded-2xl indigo-gradient flex items-center justify-center text-white shadow-xl">
                  <Languages className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Assistant</p>
                  <p className="text-sm font-bold text-primary">Active in हिन्दी</p>
                </div>
              </div>

              {/* Interactive Cursor Element */}
              <div className="absolute top-1/4 left-1/4 animate-pulse duration-[3000ms] pointer-events-none">
                <div className="h-4 w-4 rounded-full bg-primary/40 blur-sm"></div>
                <MousePointer2 className="h-4 w-4 text-primary absolute top-2 left-2 rotate-12" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-slate-50 dark:bg-slate-900/30 relative">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
              <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 text-primary font-bold">PLATFORM OVERVIEW</Badge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Built for every citizen.</h2>
              <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">Bridging the gap between government complexity and citizen empowerment through cutting-edge AI.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  title: "Smart Scheme Discovery",
                  desc: "Our AI matches your unique profile with 1,200+ central and state schemes instantly. No more missing out on your entitled benefits.",
                  icon: Search,
                  color: "bg-primary",
                  delay: "0ms"
                },
                {
                  title: "Vernacular AI Support",
                  desc: "Chat, ask questions, and get complex policy summaries in 7+ Indian languages with our LLM-powered multilingual assistant.",
                  icon: Bot,
                  color: "bg-purple-600",
                  delay: "200ms"
                },
                {
                  title: "Insightful My Wallet",
                  desc: "Track every rupee with automated AI categorization and receive personalized saving nudges tailored to the Indian context.",
                  icon: TrendingUp,
                  color: "bg-accent",
                  delay: "400ms"
                }
              ].map((f, i) => (
                <div key={i} className="group p-10 rounded-[3rem] bg-white dark:bg-card border border-border/50 shadow-sm hover:shadow-2xl hover:translate-y-[-12px] transition-all duration-500 animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: f.delay }}>
                  <div className={`${f.color} w-20 h-20 rounded-[1.8rem] flex items-center justify-center text-white mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-2xl`}>
                    <f.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-black mb-5 tracking-tight">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium text-lg">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="py-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="glass-morphism p-12 md:p-24 rounded-[4.5rem] relative overflow-hidden indigo-gradient text-white shadow-2xl">
              {/* Abstract Background Elements */}
              <div className="absolute top-0 right-0 p-24 opacity-10 pointer-events-none">
                <Heart className="w-[500px] h-[500px] animate-pulse" />
              </div>
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-10">
                  <Badge className="bg-white/20 text-white border-none backdrop-blur-md px-4 py-1.5 font-bold">OUR IMPACT</Badge>
                  <h2 className="text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter">Changing lives <br />at scale.</h2>
                  <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed max-w-lg">
                    We're committed to ensuring that information is never a barrier to progress for any citizen of India.
                  </p>
                  <Button size="lg" variant="secondary" className="h-16 px-12 rounded-2xl bg-white text-indigo-600 font-black hover:bg-white/90 shadow-2xl transition-all hover:scale-105" asChild>
                    <Link href="/dashboard">Launch Your Dashboard</Link>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
                  <div className="p-10 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20">
                    <h4 className="text-6xl font-black tracking-tighter">₹15Cr+</h4>
                    <p className="text-white/60 font-black uppercase tracking-[0.2em] text-[10px] mt-4">Benefits Identified</p>
                  </div>
                  <div className="p-10 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20">
                    <h4 className="text-6xl font-black tracking-tighter">1.2k+</h4>
                    <p className="text-white/60 font-black uppercase tracking-[0.2em] text-[10px] mt-4">Verified Schemes</p>
                  </div>
                  <div className="p-10 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 text-center flex flex-col items-center">
                    <h4 className="text-6xl font-black tracking-tighter">7+</h4>
                    <p className="text-white/60 font-black uppercase tracking-[0.2em] text-[10px] mt-4">Regional Languages</p>
                  </div>
                  <div className="p-10 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col justify-center items-center text-center">
                    <Users className="h-12 w-12 text-white/80 mb-4" />
                    <p className="text-sm font-bold">Serving All Bharat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-24 border-t bg-slate-50 dark:bg-black/20 border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-2 font-bold text-3xl tracking-tighter">
                <div className="w-10 h-10 rounded-xl indigo-gradient flex items-center justify-center text-white shadow-lg">G</div>
                <span>GovFinAI</span>
              </div>
              <p className="text-muted-foreground max-w-sm font-medium leading-relaxed">
                Empowering the 1.4 billion citizens of Bharat through intelligent financial technology and local language support.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">App Features</h4>
              <ul className="space-y-2">
                <li><Link href="/schemes" className="text-sm font-bold hover:text-primary transition-colors">Scheme Finder</Link></li>
                <li><Link href="/finance" className="text-sm font-bold hover:text-primary transition-colors">Wallet Tracker</Link></li>
                <li><Link href="/assistant" className="text-sm font-bold hover:text-primary transition-colors">AI Guide</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm font-bold hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm font-bold hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-sm font-bold hover:text-primary transition-colors">Feedback</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] border-t border-border/40 text-center">
            © {new Date().getFullYear()} GovFinAI. Designed with Heart in India.
          </div>
        </div>
      </footer>
    </div>
  );
}
