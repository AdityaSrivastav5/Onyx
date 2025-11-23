"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@clerk/nextjs";

interface Settings {
  theme: string;
  notifications: boolean;
  currency: string;
  language: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (key: keyof Settings, value: any) => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: Settings = {
  theme: "system",
  notifications: true,
  currency: "USD",
  language: "en",
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { setTheme } = useTheme();
  const api = useApi();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      fetchSettings();
    } else {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/settings");
      const fetchedSettings = response.data;
      setSettings(fetchedSettings);
      
      // Sync theme with next-themes
      if (fetchedSettings.theme) {
        setTheme(fetchedSettings.theme);
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (key: keyof Settings, value: any) => {
    // Optimistic update
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Sync theme immediately
    if (key === "theme") {
      setTheme(value);
    }

    try {
      await api.put("/settings", { [key]: value });
    } catch (error) {
      console.error("Failed to update settings", error);
      // Revert on error
      setSettings(settings);
      if (key === "theme") {
        setTheme(settings.theme);
      }
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
