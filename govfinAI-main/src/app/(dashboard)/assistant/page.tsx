"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot, Send, User, Mic, Copy, ThumbsUp, ThumbsDown, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore, useDoc, useCollection } from "@/firebase";
import { doc, collection, query, limit, orderBy } from "firebase/firestore";
import { UserProfile, Transaction } from "@/lib/types";
import { multilingualChat } from "@/genkit-flows/multilingual-chat";

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date | null;
};

const suggestedPrompts = [
  "Which schemes am I eligible for?",
  "Summarize my spending this month",
  "Explain PM Kisan Yojana in simple terms",
];

const languageMap: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  ta: "Tamil"
};

export default function AssistantPage() {
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: 'model',
      content: "Namaste! I am your GovFinAI assistant. How can I help you today with government schemes or your personal finances?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [targetLang, setTargetLang] = useState("en");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Context Data
  const profileRef = useMemo(() => {
    if (!auth.currentUser || !db || (db as any).__isMock) return null;
    return doc(db, "users", auth.currentUser.uid);
  }, [auth.currentUser, db]);
  const { data: profile } = useDoc<UserProfile>(profileRef);

  const transQuery = useMemo(() => {
    if (!auth.currentUser || !db || (db as any).__isMock) return null;
    return query(collection(db, "users", auth.currentUser.uid, "transactions"), orderBy("date", "desc"), limit(5));
  }, [auth.currentUser, db]);
  const { data: recentTrans } = useCollection<Transaction>(transQuery);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare context for Genkit
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      
      const response = await multilingualChat({
        messages: [...chatHistory, { role: 'user', content }],
        userProfile: {
          name: profile?.name || "Gov Visitor",
          state: profile?.state || "Maharashtra",
          age: profile?.age || 25,
          income: profile?.income || 5,
          occupation: profile?.occupation,
          gender: profile?.gender,
          casteCategory: profile?.casteCategory,
          familySize: profile?.familySize,
          disability: profile?.disabilityStatus ? "physical" : "none"
        },
        targetLanguage: languageMap[targetLang],
        recentTransactions: recentTrans?.map(t => ({
          amount: t.amount,
          category: t.category,
          type: t.type,
          note: t.note || t.category,
          date: t.date
        }))
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Assistant Error", description: "Failed to get AI response." });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "Copied to clipboard" });
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            GovFinAI Assistant
          </h1>
          <p className="text-sm text-muted-foreground">Your multilingual guide to government & finance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger className="w-[120px] bg-background border-none shadow-sm rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="mr">Marathi</SelectItem>
              <SelectItem value="ta">Tamil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="flex-1 flex flex-col min-h-0 border-none shadow-sm bg-slate-50/50 dark:bg-muted/5 rounded-[2rem] overflow-hidden">
        <ScrollArea className="flex-1 p-4 md:p-8" ref={scrollRef}>
          <div className="space-y-8 max-w-4xl mx-auto pb-8">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 md:gap-5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className={`h-9 w-9 md:h-12 md:w-12 shadow-md ${m.role === 'model' ? 'bg-primary' : 'bg-muted border border-border/40'}`}>
                  {m.role === 'model' ? (
                    <AvatarFallback className="bg-primary text-white"><Bot className="h-5 w-5 md:h-7 md:w-7" /></AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage src={`https://picsum.photos/seed/${auth.currentUser?.uid || 'user'}/100/100`} />
                      <AvatarFallback><User className="h-5 w-5 md:h-7 md:w-7" /></AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${m.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`p-4 md:p-6 rounded-[1.5rem] shadow-sm leading-relaxed ${
                    m.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none font-medium' 
                    : 'bg-white dark:bg-card text-foreground rounded-tl-none border border-border/40'
                  }`}>
                    <p className="text-sm md:text-[15px] whitespace-pre-wrap">{m.content}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2 px-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                      {isMounted && m.timestamp ? m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "..."}
                    </span>
                    {m.role === 'model' && (
                      <div className="flex items-center gap-3">
                        <button onClick={() => copyToClipboard(m.content)} className="text-muted-foreground hover:text-primary transition-colors"><Copy className="h-3.5 w-3.5" /></button>
                        <button className="text-muted-foreground hover:text-accent transition-colors"><ThumbsUp className="h-3.5 w-3.5" /></button>
                        <button className="text-muted-foreground hover:text-destructive transition-colors"><ThumbsDown className="h-3.5 w-3.5" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-5 animate-pulse">
                <Avatar className="h-12 w-12 bg-primary shadow-lg">
                  <AvatarFallback className="bg-primary text-white"><Bot className="h-7 w-7" /></AvatarFallback>
                </Avatar>
                <div className="p-6 rounded-[1.5rem] bg-white dark:bg-card shadow-sm border border-border/40 rounded-tl-none flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground italic font-medium">GovFinAI is generating response...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 border-t bg-white dark:bg-card shadow-2xl">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <Button 
                  key={prompt} 
                  variant="outline" 
                  size="sm" 
                  className="text-[11px] rounded-full hover:bg-primary/5 hover:text-primary hover:border-primary/40 dark:hover:bg-primary/20 border-border/60 transition-all font-bold"
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                >
                  <Sparkles className="h-3 w-3 mr-1.5 opacity-60" />
                  {prompt}
                </Button>
              ))}
            </div>
            <div className="flex gap-3 relative items-end">
              <Button variant="ghost" size="icon" className="shrink-0 h-14 w-14 rounded-2xl text-muted-foreground hover:bg-muted mb-0.5">
                <Mic className="h-6 w-6" />
              </Button>
              <div className="flex-1 relative">
                <Input 
                  placeholder="Ask me anything about schemes or your finances..." 
                  className="pr-16 py-7 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 text-base"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                />
                <Button 
                  className="absolute right-2 bottom-2 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 shadow-xl transition-all active:scale-95"
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
