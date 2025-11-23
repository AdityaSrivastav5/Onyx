"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  FileText,
  CreditCard,
  Target,
  Zap,
  Settings,
  Plus,
  Search,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMANDS = [
  {
    group: "Navigation",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", action: "/dashboard", shortcut: "D" },
      { icon: CheckSquare, label: "Tasks", action: "/dashboard/tasks", shortcut: "T" },
      { icon: Target, label: "Habits", action: "/dashboard/habits", shortcut: "H" },
      { icon: Zap, label: "Zen Mode", action: "/dashboard/zen", shortcut: "Z" },
      { icon: Calendar, label: "Calendar", action: "/dashboard/calendar", shortcut: "C" },
      { icon: FileText, label: "Notes", action: "/dashboard/notes", shortcut: "N" },
      { icon: CreditCard, label: "Expenses", action: "/dashboard/expenses", shortcut: "E" },
      { icon: Settings, label: "Settings", action: "/dashboard/settings", shortcut: "S" },
    ],
  },
  {
    group: "Actions",
    items: [
      { icon: Plus, label: "New Task", action: "new-task", shortcut: "⌘N" },
      { icon: Plus, label: "New Habit", action: "new-habit", shortcut: "⌘H" },
      { icon: Plus, label: "New Note", action: "new-note", shortcut: "⌘⇧N" },
      { icon: Zap, label: "Start Focus Session", action: "start-focus", shortcut: "⌘Z" },
    ],
  },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  const handleSelect = (action: string) => {
    if (action.startsWith("/")) {
      router.push(action);
    } else {
      // Handle actions
      switch (action) {
        case "new-task":
          router.push("/dashboard/tasks");
          // TODO: Trigger task modal
          break;
        case "new-habit":
          router.push("/dashboard/habits");
          // TODO: Trigger habit modal
          break;
        case "new-note":
          router.push("/dashboard/notes");
          // TODO: Trigger note modal
          break;
        case "start-focus":
          router.push("/dashboard/zen");
          break;
      }
    }
    onClose();
  };

  const filteredCommands = COMMANDS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-2xl">
        <Command className="rounded-lg border-none">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Type a command or search..."
              value={search}
              onValueChange={setSearch}
              className="border-0 focus:ring-0"
            />
          </div>
          <CommandList className="max-h-[400px]">
            <CommandEmpty>No results found.</CommandEmpty>
            {filteredCommands.map((group) => (
              <CommandGroup key={group.group} heading={group.group}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.action}
                      onSelect={() => handleSelect(item.action)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.shortcut && (
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                          {item.shortcut}
                        </kbd>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
