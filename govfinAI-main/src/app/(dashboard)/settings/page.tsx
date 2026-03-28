"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Bell, 
  Globe, 
  Shield, 
  Moon, 
  Languages, 
  Eye, 
  Save,
  Trash2,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [lang, setLang] = useState("en");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSave = () => {
    toast({ title: "Settings Saved", description: "Your preferences have been updated." });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your app experience and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="md:col-span-1 space-y-2">
          <Button variant="ghost" className="w-full justify-start font-bold bg-primary/10 text-primary rounded-xl">
            <Settings className="mr-3 h-5 w-5" /> General
          </Button>
          <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:bg-muted rounded-xl">
            <Bell className="mr-3 h-5 w-5" /> Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground hover:bg-muted rounded-xl">
            <Lock className="mr-3 h-5 w-5" /> Privacy & Security
          </Button>
        </aside>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" />
                <CardTitle>Appearance & Language</CardTitle>
              </div>
              <CardDescription>Personalize how the app looks and speaks to you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">Preferred Language</Label>
                  <p className="text-xs text-muted-foreground">Affects AI Assistant and scheme summaries.</p>
                </div>
                <Select value={lang} onValueChange={setLang}>
                  <SelectTrigger className="w-[180px] bg-muted/50 border-none rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                    <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                    <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Toggle between light and dark themes.</p>
                </div>
                <Switch 
                  checked={isDarkMode} 
                  onCheckedChange={(v) => {
                    setIsDarkMode(v);
                    document.documentElement.classList.toggle('dark');
                  }} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Stay updated on scheme deadlines and financial insights.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                <Label className="font-bold">Email Alerts for New Schemes</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                <Label className="font-bold">Weekly Financial Summary</Label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm border-destructive/20 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </div>
              <CardDescription>Irreversible actions for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive hover:text-white rounded-xl font-bold">
                Clear All Transaction History
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" className="rounded-xl font-bold">Reset</Button>
            <Button className="indigo-gradient hover:opacity-90 rounded-xl font-bold px-8 shadow-lg" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
