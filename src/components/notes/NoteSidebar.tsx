"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  FileText,
  Folder,
  Plus,
  Star,
  Trash2,
  Archive,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

interface FolderType {
  _id: string;
  name: string;
  color: string;
  icon?: string;
}

interface NoteSidebarProps {
  folders: FolderType[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: () => void;
  onCreateNote: () => void;
  view: "all" | "favorites" | "trash" | "archive";
  onSelectView: (view: "all" | "favorites" | "trash" | "archive") => void;
}

export function NoteSidebar({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onCreateNote,
  view,
  onSelectView,
}: NoteSidebarProps) {
  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col h-full">
      <div className="p-4">
        <Button className="w-full justify-start gap-2" onClick={onCreateNote}>
          <Plus className="w-4 h-4" />
          New Note
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-6">
          {/* Library */}
          <div className="space-y-1">
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase mb-2">
              Library
            </h3>
            <SidebarItem
              icon={<FileText className="w-4 h-4" />}
              label="All Notes"
              active={view === "all" && !selectedFolderId}
              onClick={() => {
                onSelectView("all");
                onSelectFolder(null);
              }}
            />
            <SidebarItem
              icon={<Star className="w-4 h-4" />}
              label="Favorites"
              active={view === "favorites"}
              onClick={() => {
                onSelectView("favorites");
                onSelectFolder(null);
              }}
            />
            <SidebarItem
              icon={<Archive className="w-4 h-4" />}
              label="Archive"
              active={view === "archive"}
              onClick={() => {
                onSelectView("archive");
                onSelectFolder(null);
              }}
            />
            <SidebarItem
              icon={<Trash2 className="w-4 h-4" />}
              label="Trash"
              active={view === "trash"}
              onClick={() => {
                onSelectView("trash");
                onSelectFolder(null);
              }}
            />
          </div>

          {/* Folders */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                Folders
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={onCreateFolder}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {folders.map((folder) => (
              <SidebarItem
                key={folder._id}
                icon={
                  <Folder
                    className="w-4 h-4"
                    style={{ color: folder.color }}
                  />
                }
                label={folder.name}
                active={selectedFolderId === folder._id}
                onClick={() => {
                  onSelectFolder(folder._id);
                  onSelectView("all");
                }}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-2 font-normal",
        active && "font-medium"
      )}
      onClick={onClick}
    >
      {icon}
      <span className="truncate">{label}</span>
    </Button>
  );
}
