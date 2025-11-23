"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { OnboardingTour } from "@/components/OnboardingTour";
import { CommandPalette } from "@/components/CommandPalette";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useExtensionTokenSync } from "@/hooks/useExtensionTokenSync";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const [marginLeft, setMarginLeft] = useState('256px');
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useKeyboardShortcuts();
  
  // Automatically sync Clerk token to Chrome extension
  useExtensionTokenSync();

  // Calculate margin on client side only to avoid hydration mismatch
  useEffect(() => {
    const updateMargin = () => {
      if (window.innerWidth >= 768) {
        setMarginLeft(isCollapsed ? '80px' : '256px');
      } else {
        setMarginLeft('0px');
      }
    };

    updateMargin();
    window.addEventListener('resize', updateMargin);
    return () => window.removeEventListener('resize', updateMargin);
  }, [isCollapsed]);

  return (
    <div className="flex h-screen bg-muted/10" suppressHydrationWarning>
      <Sidebar />

      {/* Main Content - dynamically adjusts based on sidebar state */}
      <main 
        className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out"
        style={{ marginLeft }}
        suppressHydrationWarning
      >
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex h-14 items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-2">
              <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
              <span className="hidden md:inline text-xs text-muted-foreground">to open command palette</span>
            </div>
            <ThemeToggle />
          </div>
        </header>
        
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
      
      {/* Onboarding Tour */}
      <OnboardingTour />
      
      {/* Command Palette */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
