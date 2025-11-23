"use client";

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { UserButton, SignOutButton } from "@clerk/nextjs";
// import { Bell, Moon, Sun, Globe, Shield, Download, DollarSign } from "lucide-react";
// import { useState, useEffect } from "react";
// import { useApi } from "@/hooks/useApi";
// import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { Bell, Moon, Sun, Globe, Shield, Download, DollarSign } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useSettings } from "@/context/SettingsContext";
import { toast } from "sonner";

export default function SettingsPage() {
  const api = useApi();
  const { settings, updateSettings, isLoading } = useSettings();

  const handleExportData = async () => {
    try {
      toast.loading("Preparing export...");
      const response = await api.get("/settings/export");
      
      // Create blob and download
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `personal-os-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.dismiss();
      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Failed to export data", error);
      toast.dismiss();
      toast.error("Failed to export data");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-1 bg-secondary rounded-full">
                  <UserButton afterSignOutUrl="/" appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}/>
                </div>
                <div>
                  <p className="text-sm font-medium">Your Profile</p>
                  <p className="text-xs text-muted-foreground">Manage your account settings via Clerk</p>
                </div>
              </div>
              <SignOutButton>
                <Button variant="destructive" size="sm">
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </CardContent>
        </Card>

        {/* Appearance & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <div>
                  <Label htmlFor="theme" className="font-medium">Theme</Label>
                  <p className="text-xs text-muted-foreground">Select your preferred theme</p>
                </div>
              </div>
              <Select
                value={settings.theme}
                onValueChange={(value) => updateSettings("theme", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5" />
                <div>
                  <Label htmlFor="currency" className="font-medium">Currency</Label>
                  <p className="text-xs text-muted-foreground">Default currency for expenses</p>
                </div>
              </div>
              <Select
                value={settings.currency}
                onValueChange={(value) => updateSettings("currency", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                <div>
                  <Label htmlFor="notifications" className="font-medium">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive notifications for tasks and events</p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSettings("notifications", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>Connect external services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5" />
                <div>
                  <p className="font-medium">Google Calendar</p>
                  <p className="text-xs text-muted-foreground">Sync your events</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5" />
                <div>
                  <p className="font-medium">Google Tasks</p>
                  <p className="text-xs text-muted-foreground">Import your tasks</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
            <CardDescription>Control your data and privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5" />
                <div>
                  <p className="font-medium">Data Export</p>
                  <p className="text-xs text-muted-foreground">Download all your data (JSON)</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
