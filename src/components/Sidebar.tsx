"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  FileText, 
  CreditCard, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Plug,
  Globe,
  Wallet,
  TrendingUp,
  FolderKanban,
  Zap,
  Target
} from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: typeof window !== 'undefined' && window.innerWidth < 768 && !isMobileOpen ? -256 : 0,
          width: isCollapsed ? 80 : 256 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-50 h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col md:z-40"
      >
        <div className={`flex h-16 items-center border-b px-4 gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
            <img src="/logo.png" alt="Onyx" className="w-5 h-5" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-lg tracking-tight overflow-hidden whitespace-nowrap"
              >
                Onyx
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          <SidebarLink href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active={pathname === "/dashboard"} collapsed={isCollapsed} />
          <SidebarLink href="/dashboard/tasks" icon={<CheckSquare className="w-5 h-5" />} label="Tasks" active={pathname === "/dashboard/tasks"} collapsed={isCollapsed} />
          <SidebarLink href="/dashboard/projects" icon={<FolderKanban className="w-5 h-5" />} label="Projects" active={pathname === "/dashboard/projects"} collapsed={isCollapsed} />
          <SidebarLink href="/dashboard/calendar" icon={<Calendar className="w-5 h-5" />} label="Calendar" active={pathname === "/dashboard/calendar"} collapsed={isCollapsed} />
          <SidebarLink href="/dashboard/habits" icon={<Target className="w-5 h-5" />} label="Habits" active={pathname === "/dashboard/habits"} collapsed={isCollapsed} />
          <SidebarLink href="/dashboard/notes" icon={<FileText className="w-5 h-5" />} label="Notes" active={pathname === "/dashboard/notes"} collapsed={isCollapsed} />
          <SidebarLink href="/dashboard/expenses" icon={<CreditCard className="w-5 h-5" />} label="Expenses" active={pathname === "/dashboard/expenses"} collapsed={isCollapsed} />
          <SidebarLink href="/dashboard/budget" icon={<Wallet className="w-5 h-5" />} label="Budget" active={pathname === "/dashboard/budget"} collapsed={isCollapsed} />
          <SidebarLink href="/dashboard/income" icon={<TrendingUp className="w-5 h-5" />} label="Income" active={pathname === "/dashboard/income"} collapsed={isCollapsed} />
          <SidebarLink href="/dashboard/activity" icon={<Globe className="w-5 h-5" />} label="Web Activity" active={pathname === "/dashboard/activity"} collapsed={isCollapsed} />
          <SidebarLink href="/dashboard/integrations" icon={<Plug className="w-5 h-5" />} label="Integrations" active={pathname === "/dashboard/integrations"} collapsed={isCollapsed} />
          <SidebarLink href="/dashboard/zen" icon={<Zap className="w-5 h-5" />} label="Zen Mode" active={pathname === "/dashboard/zen"} collapsed={isCollapsed} />
        </nav>

        <div className="p-3 border-t space-y-2">
          <SidebarLink href="/dashboard/settings" icon={<Settings className="w-5 h-5" />} label="Settings" active={pathname === "/dashboard/settings"} collapsed={isCollapsed} />
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ${isCollapsed ? "justify-center px-2" : ""}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Log out</span>}
          </Button>

          {/* Collapse button - hidden on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="w-full mt-2 hover:bg-muted hidden md:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </motion.aside>
    </>
  );
}

function SidebarLink({ href, icon, label, active, collapsed }: { href: string, icon: React.ReactNode, label: string, active?: boolean, collapsed: boolean }) {
  return (
    <Link href={href} className="block">
      <Button 
        variant={active ? "secondary" : "ghost"} 
        className={`w-full justify-start gap-3 ${active ? "font-medium" : "text-muted-foreground"} ${collapsed ? "justify-center px-2" : ""}`}
        title={collapsed ? label : undefined}
      >
        <span className="shrink-0">{icon}</span>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </Button>
    </Link>
  );
}
