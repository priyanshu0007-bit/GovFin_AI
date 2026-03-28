
"use client";

import { use, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  Info,
  Calendar,
  ExternalLink,
  Loader2,
  FileSearch
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { policyExplainer, PolicyExplainerOutput } from "@/genkit-flows/policyExplainer";
import { realSchemes } from "@/lib/schemes-data";

export default function SchemeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [explaining, setExplaining] = useState(false);
  const [aiSummary, setAiSummary] = useState<PolicyExplainerOutput | null>(null);

  const scheme = realSchemes.find(s => s.id === id);

  if (!scheme) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <FileSearch className="h-16 w-16 text-muted-foreground opacity-20" />
        <h2 className="text-2xl font-bold">Scheme Not Found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const handleAiExplain = async () => {
    setExplaining(true);
    try {
      const result = await policyExplainer({
        policyText: scheme.fullPolicy || scheme.description,
        targetLanguage: "en",
        userEducationLevel: "basic"
      });
      setAiSummary(result);
    } catch (e) {
      console.error(e);
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="indigo-gradient text-white border-none">{scheme.category}</Badge>
              {scheme.isNational && <Badge variant="outline" className="border-primary text-primary">Central Sector Scheme</Badge>}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{scheme.name}</h1>
            <div className="flex items-center gap-3 text-muted-foreground font-medium">
              <Building2 className="h-5 w-5 text-primary" />
              {scheme.ministry}
            </div>
          </div>

          <Card className="border-none shadow-sm overflow-hidden bg-slate-50/50 dark:bg-muted/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">About the Scheme</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {scheme.description}
              </p>
              <Button 
                variant="outline" 
                className="mt-6 font-bold border-primary/20 hover:bg-primary/5 text-primary rounded-xl"
                onClick={handleAiExplain}
                disabled={explaining}
              >
                {explaining ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                {aiSummary ? "Re-generate AI Summary" : "AI Policy Explainer (Simple Terms)"}
              </Button>
            </CardContent>
          </Card>

          {aiSummary && (
            <Card className="border-none shadow-xl indigo-gradient text-white animate-in zoom-in-95 duration-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <CardTitle>AI-Simplified Explanation</CardTitle>
                </div>
                <CardDescription className="text-white/70">Complexity reduced for easy understanding.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <h4 className="font-bold mb-1 uppercase text-[10px] tracking-widest text-white/60">The Summary</h4>
                  <p className="text-white font-medium italic">"{aiSummary.summary}"</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-bold uppercase text-[10px] tracking-widest text-white/60">What You Get</h4>
                    <ul className="space-y-2">
                      {aiSummary.keyBenefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold uppercase text-[10px] tracking-widest text-white/60">Your Next Steps</h4>
                    <ul className="space-y-2">
                      {aiSummary.howToApply.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="h-4 w-4 shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Key Benefits
              </h3>
              <div className="space-y-3">
                {scheme.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white dark:bg-card rounded-xl shadow-sm border border-border/40 transition-transform hover:translate-x-1">
                    <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-emerald-600">{i + 1}</span>
                    </div>
                    <span className="text-sm font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Required Documents
              </h3>
              <div className="space-y-3">
                {scheme.documents.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-100/50 dark:bg-muted/10 rounded-xl border border-dashed border-border/60">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <Card className="border-none shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Apply Now</CardTitle>
              <CardDescription>Follow these steps to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative pl-6 space-y-8 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted-foreground/20">
                {scheme.howToApply.map((step, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[24px] top-0 h-[16px] w-[16px] rounded-full bg-primary border-4 border-white dark:border-slate-900 shadow-md"></div>
                    <p className="text-sm font-bold">{step}</p>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="text-xs">
                    <p className="text-muted-foreground uppercase font-bold tracking-widest">Application Status</p>
                    <p className="font-bold text-emerald-600">Open Always</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <div className="text-xs">
                    <p className="text-muted-foreground uppercase font-bold tracking-widest">Type</p>
                    <p className="font-bold">Government Grant</p>
                  </div>
                </div>
              </div>

              <Button className="w-full indigo-gradient font-bold h-12 shadow-lg hover:opacity-90 rounded-xl group">
                Official Portal <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
