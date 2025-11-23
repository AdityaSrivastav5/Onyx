"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { NoteSidebar } from "@/components/notes/NoteSidebar";
import { Editor } from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  MoreVertical,
  Star,
  Archive,
  Trash2,
  ArrowLeft,
  Pin,
  Calendar,
  Folder,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Note {
  _id: string;
  title: string;
  content: string;
  folderId?: string;
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  updatedAt: string;
}

interface FolderType {
  _id: string;
  name: string;
  color: string;
}

export default function NotesPage() {
  const api = useApi();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [view, setView] = useState<"all" | "favorites" | "trash" | "archive">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Folder Modal State
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#3b82f6");

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchData();
  }, [view, selectedFolderId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [notesRes, foldersRes] = await Promise.all([
        api.get("/notes", {
          params: {
            folderId: selectedFolderId,
            isFavorite: view === "favorites",
            isArchived: view === "archive",
            search: searchQuery,
          },
        }),
        api.get("/folders"),
      ]);
      setNotes(notesRes.data);
      setFolders(foldersRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      const newNote = {
        title: "Untitled Note",
        content: "",
        folderId: selectedFolderId,
      };
      const response = await api.post("/notes", newNote);
      setNotes([response.data, ...notes]);
      setSelectedNoteId(response.data._id);
      setEditTitle(response.data.title);
      setEditContent(response.data.content);
      setIsEditing(true);
    } catch (error) {
      toast.error("Failed to create note");
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const response = await api.post("/folders", {
        name: newFolderName,
        color: newFolderColor,
      });
      setFolders([...folders, response.data]);
      setIsFolderModalOpen(false);
      setNewFolderName("");
      toast.success("Folder created");
    } catch (error) {
      toast.error("Failed to create folder");
    }
  };

  const handleUpdateNote = async (id: string, data: Partial<Note>) => {
    try {
      const response = await api.put(`/notes/${id}`, data);
      setNotes(notes.map((n) => (n._id === id ? response.data : n)));
      if (selectedNoteId === id) {
        setEditTitle(response.data.title);
        setEditContent(response.data.content);
      }
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
        setIsEditing(false);
      }
      toast.success("Note deleted");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const response = await api.post(`/notes/${id}/pin`);
      setNotes(notes.map((n) => (n._id === id ? response.data : n)));
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const response = await api.post(`/notes/${id}/favorite`);
      setNotes(notes.map((n) => (n._id === id ? response.data : n)));
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const selectedNote = notes.find((n) => n._id === selectedNoteId);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Sidebar */}
      <NoteSidebar
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onCreateFolder={() => setIsFolderModalOpen(true)}
        onCreateNote={handleCreateNote}
        view={view}
        onSelectView={setView}
      />

      {/* Note List (Middle Column) */}
      <div className="w-80 border-r flex flex-col bg-muted/10">
        <div className="p-4 border-b">
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-background"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No notes found
            </div>
          ) : (
            <div className="divide-y">
              {notes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => {
                    setSelectedNoteId(note._id);
                    setEditTitle(note.title);
                    setEditContent(note.content);
                    setIsEditing(false);
                  }}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-muted/50 transition-colors group relative",
                    selectedNoteId === note._id && "bg-muted"
                  )}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium truncate pr-6">
                      {note.title || "Untitled"}
                    </h3>
                    {note.isPinned && (
                      <Pin className="w-3 h-3 text-muted-foreground absolute right-4 top-5" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2 h-8">
                    {note.content.replace(/<[^>]*>?/gm, "") || "No content"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {formatDistanceToNow(new Date(note.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {note.isFavorite && (
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor (Right Column) */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {selectedNote ? (
          <>
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex-1 mr-4">
                <Input
                  value={editTitle}
                  onChange={(e) => {
                    setEditTitle(e.target.value);
                    handleUpdateNote(selectedNote._id, { title: e.target.value });
                  }}
                  className="text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0 h-auto"
                  placeholder="Note Title"
                />
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Last edited{" "}
                    {formatDistanceToNow(new Date(selectedNote.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {selectedNote.folderId && (
                    <span className="flex items-center gap-1">
                      <Folder className="w-3 h-3" />
                      {folders.find((f) => f._id === selectedNote.folderId)?.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleTogglePin(selectedNote._id)}
                  className={cn(selectedNote.isPinned && "text-primary")}
                >
                  <Pin className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleFavorite(selectedNote._id)}
                  className={cn(
                    selectedNote.isFavorite && "text-yellow-400 fill-yellow-400"
                  )}
                >
                  <Star className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        handleUpdateNote(selectedNote._id, {
                          isArchived: !selectedNote.isArchived,
                        })
                      }
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      {selectedNote.isArchived ? "Unarchive" : "Archive"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteNote(selectedNote._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <Editor
                content={editContent}
                onChange={(content) => {
                  setEditContent(content);
                  // Debounce save could be added here
                  handleUpdateNote(selectedNote._id, { content });
                }}
                className="max-w-3xl mx-auto"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">Select a note</h3>
              <p className="text-sm max-w-xs mx-auto">
                Choose a note from the list or create a new one to get started.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Folder Name</Label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. Work, Personal, Ideas"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"].map(
                  (color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-8 h-8 rounded-full border-2",
                        newFolderColor === color
                          ? "border-primary"
                          : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewFolderColor(color)}
                    />
                  )
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFolderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { FileText } from "lucide-react";
