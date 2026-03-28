"use client";

import { useState, useMemo } from "react";
import { useAuth, useFirestore, useCollection } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { Transaction } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Receipt, 
  Calendar as CalendarIcon,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { aiCategorizeTransaction } from "@/genkit-flows/transactionCategorization";

const categories = ["Food", "Transport", "Rent", "Utilities", "Health", "Education", "Shopping", "Entertainment", "Other"];

export default function FinancePage() {
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);

  // Form State
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Other");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const transactionsQuery = useMemo(() => {
    if (!auth.currentUser || !db || (db as any).__isMock) return null;
    return query(
      collection(db, "users", auth.currentUser.uid, "transactions"),
      orderBy("date", "desc"),
      limit(20)
    );
  }, [auth.currentUser, db]);

  const { data: transactions, loading } = useCollection<Transaction>(transactionsQuery);

  const totals = useMemo(() => {
    return (transactions || []).reduce((acc, curr) => {
      if (curr.type === "income") acc.income += curr.amount;
      else acc.expense += curr.amount;
      return acc;
    }, { income: 0, expense: 0 });
  }, [transactions]);

  const handleAiCategorize = async () => {
    if (!note) return;
    setIsCategorizing(true);
    try {
      const result = await aiCategorizeTransaction({ note, categories });
      setCategory(result.suggestedCategory);
      toast({ title: "AI Categorized", description: `Suggested category: ${result.suggestedCategory}` });
    } catch (e) {
      console.error(e);
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleAddTransaction = () => {
    if (!amount || (db as any).__isMock) {
      toast({ 
        title: "Demo Mode", 
        description: (db as any).__isMock ? "Database write disabled in demo mode." : "Please enter an amount." 
      });
      return;
    }

    setIsAdding(true);
    const transRef = collection(db, "users", auth.currentUser!.uid, "transactions");
    
    addDoc(transRef, {
      uid: auth.currentUser!.uid,
      amount: parseFloat(amount),
      type,
      category,
      note,
      date,
      createdAt: serverTimestamp(),
    }).then(() => {
      toast({ title: "Success", description: "Transaction added successfully." });
      setAmount("");
      setNote("");
      setIsAdding(false);
    }).catch(e => {
      console.error(e);
      setIsAdding(false);
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Wallet</h1>
          <p className="text-muted-foreground mt-1">Track your income and expenses to unlock better financial insights.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm accent-gradient text-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-white/80">Total Balance</p>
                <h3 className="text-3xl font-bold mt-1">₹{(totals.income - totals.expense).toLocaleString()}</h3>
              </div>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <Receipt className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                <h3 className="text-3xl font-bold mt-1 text-emerald-600">₹{totals.income.toLocaleString()}</h3>
                <div className="flex items-center gap-1 mt-1 text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span className="text-xs font-bold">+5%</span>
                </div>
              </div>
              <div className="bg-emerald-100 p-2 rounded-lg dark:bg-emerald-900/30">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expense</p>
                <h3 className="text-3xl font-bold mt-1 text-rose-600">₹{totals.expense.toLocaleString()}</h3>
                <div className="flex items-center gap-1 mt-1 text-rose-600">
                  <ArrowDownRight className="h-3 w-3" />
                  <span className="text-xs font-bold">+2%</span>
                </div>
              </div>
              <div className="bg-rose-100 p-2 rounded-lg dark:bg-rose-900/30">
                <TrendingDown className="h-5 w-5 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl">Add Transaction</CardTitle>
              <CardDescription>Enter details to record a new entry.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
                <Button 
                  variant={type === "expense" ? "default" : "ghost"} 
                  size="sm" 
                  className="rounded-lg h-9"
                  onClick={() => setType("expense")}
                >
                  Expense
                </Button>
                <Button 
                  variant={type === "income" ? "default" : "ghost"} 
                  size="sm" 
                  className="rounded-lg h-9"
                  onClick={() => setType("income")}
                >
                  Income
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="bg-muted/50 border-none h-11"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Note / Description</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[10px] text-primary font-bold px-2"
                    onClick={handleAiCategorize}
                    disabled={!note || isCategorizing}
                  >
                    {isCategorizing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                    AI CATEGORIZE
                  </Button>
                </div>
                <Input 
                  placeholder="e.g. Weekly grocery shopping" 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)} 
                  className="bg-muted/50 border-none h-11"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-muted/50 border-none h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="bg-muted/50 border-none h-11"
                />
              </div>

              <Button 
                className="w-full h-11 indigo-gradient hover:opacity-90 mt-4 shadow-lg font-bold" 
                onClick={handleAddTransaction}
                disabled={isAdding}
              >
                {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Transaction
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Recent History
            </h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="space-y-3">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-2xl" />
              ))
            ) : transactions?.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
                <Receipt className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
                <p className="text-muted-foreground font-medium">No transactions recorded yet.</p>
              </div>
            ) : (
              transactions?.map((t) => (
                <Card key={t.id} className="border-none shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden border border-border/40">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/20'}`}>
                        {t.type === 'income' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{t.note || t.category}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-[10px] py-0 font-bold border-muted-foreground/20">{t.category}</Badge>
                          <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                            <CalendarIcon className="h-2.5 w-2.5" />
                            {format(new Date(t.date), 'dd MMM yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-extrabold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
