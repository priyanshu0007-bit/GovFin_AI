'use client';

import { useState, useMemo, useEffect } from "react";
import { useAuth, useFirestore, useDoc } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserProfile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Info, 
  Save, 
  Loader2,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const castes = ["General", "OBC", "SC", "ST"];
const genders = ["Male", "Female", "Other", "Prefer not to say"];

export default function ProfilePage() {
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const profileRef = useMemo(() => {
    if (!auth.currentUser || !db || (db as any).__isMock) return null;
    try {
      return doc(db, "users", auth.currentUser.uid);
    } catch (e) {
      return null;
    }
  }, [auth.currentUser, db]);

  const { data: profile, loading } = useDoc<UserProfile>(profileRef);

  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleUpdate = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profileRef) {
      toast({ title: "Demo Mode", description: "Profile updates are limited in demo mode." });
      return;
    }

    setIsSaving(true);
    try {
      await setDoc(profileRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast({ title: "Profile Updated", description: "Your profile information has been saved successfully." });
    } catch (e) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not save profile changes." });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && profileRef) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900 shadow-xl transition-transform group-hover:scale-105 duration-500">
            <AvatarImage src={`https://picsum.photos/seed/${auth.currentUser?.uid || 'user'}/200/200`} />
            <AvatarFallback className="text-3xl font-bold bg-primary text-white">
              {formData.name?.charAt(0) || "G"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center md:text-left space-y-2 flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{formData.name || "Gov Visitor"}</h1>
          <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
            <Mail className="h-4 w-4" /> {formData.email || "visitor@govfin.ai"}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Citizen Profile</Badge>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none">Verified Data</Badge>
          </div>
        </div>
        <Button className="indigo-gradient hover:opacity-90 shadow-lg font-bold px-8" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm dark:bg-card/40 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Basic Information</CardTitle>
            </div>
            <CardDescription>Details used for primary scheme identification.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={formData.name || ""} 
                onChange={(e) => handleUpdate("name", e.target.value)} 
                className="bg-muted/50 border-none h-11" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input 
                  type="number" 
                  value={formData.age || ""} 
                  onChange={(e) => handleUpdate("age", parseInt(e.target.value) || 0)} 
                  className="bg-muted/50 border-none h-11" 
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={formData.gender || ""} onValueChange={(v) => handleUpdate("gender", v)}>
                  <SelectTrigger className="bg-muted/50 border-none h-11">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Caste / Social Category</Label>
              <Select value={formData.casteCategory || ""} onValueChange={(v) => handleUpdate("casteCategory", v)}>
                <SelectTrigger className="bg-muted/50 border-none h-11">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {castes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm dark:bg-card/40 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Location & Social</CardTitle>
            </div>
            <CardDescription>Location-specific state government schemes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>State of Residence</Label>
              <Select value={formData.state || ""} onValueChange={(v) => handleUpdate("state", v)}>
                <SelectTrigger className="bg-muted/50 border-none h-11">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Family Size</Label>
              <Input 
                type="number" 
                value={formData.familySize || ""} 
                onChange={(e) => handleUpdate("familySize", parseInt(e.target.value) || 0)} 
                className="bg-muted/50 border-none h-11" 
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
              <div className="space-y-0.5">
                <Label className="text-base">Disability Status</Label>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">For PwD specific welfare</p>
              </div>
              <Switch 
                checked={formData.disabilityStatus || false} 
                onCheckedChange={(v) => handleUpdate("disabilityStatus", v)} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-500/10 p-6 rounded-3xl border border-amber-200 dark:border-amber-500/20 flex items-center gap-4">
        <div className="bg-amber-100 dark:bg-amber-500/20 p-3 rounded-2xl">
          <Info className="h-6 w-6 text-amber-600" />
        </div>
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          Your profile data is used exclusively for personalizing your financial dashboard and matching you with over 1,200+ government welfare schemes.
        </p>
      </div>
    </div>
  );
}
