"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Tag, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";

interface Project {
  _id: string;
  name: string;
  color: string;
}

interface LabelType {
  _id: string;
  name: string;
  color: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: any) => void;
  projects: Project[];
  labels: LabelType[];
  defaultProjectId?: string | null;
}

const PRIORITIES = [
  { value: "P1", label: "Urgent", icon: "🔥", color: "text-red-600" },
  { value: "P2", label: "High", icon: "⚡", color: "text-orange-600" },
  { value: "P3", label: "Medium", icon: "📌", color: "text-blue-600" },
  { value: "P4", label: "Low", icon: "📋", color: "text-gray-600" },
];

export function TaskModal({
  isOpen,
  onClose,
  onTaskCreated,
  projects,
  labels,
  defaultProjectId,
}: TaskModalProps) {
  const api = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "P3",
    dueDate: "",
    projectId: defaultProjectId || "inbox",
    selectedLabels: [] as string[],
    timeEstimate: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        projectId: defaultProjectId || "inbox",
      }));
    }
  }, [isOpen, defaultProjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        projectId: formData.projectId === "inbox" ? undefined : formData.projectId,
        timeEstimate: formData.timeEstimate ? parseInt(formData.timeEstimate) : undefined,
        labels: formData.selectedLabels,
      };

      const response = await api.post("/tasks", payload);
      onTaskCreated(response.data);
      toast.success("Task created successfully");
      onClose();
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "P3",
        dueDate: "",
        projectId: defaultProjectId || "inbox",
        selectedLabels: [],
        timeEstimate: "",
      });
    } catch (error) {
      console.error("Failed to create task", error);
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLabel = (labelName: string) => {
    setFormData((prev) => {
      const labels = prev.selectedLabels.includes(labelName)
        ? prev.selectedLabels.filter((l) => l !== labelName)
        : [...prev.selectedLabels, labelName];
      return { ...prev, selectedLabels: labels };
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task with details, priority, and due date.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <div className="flex items-center gap-2">
                        <span>{p.icon}</span>
                        <span className={p.color}>{p.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Project</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) =>
                  setFormData({ ...formData, projectId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inbox">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      Inbox
                    </div>
                  </SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        {p.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Time Estimate (minutes)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-10"
                  placeholder="e.g. 30"
                  value={formData.timeEstimate}
                  onChange={(e) =>
                    setFormData({ ...formData, timeEstimate: e.target.value })
                  }
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Labels</Label>
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <Badge
                  key={label._id}
                  variant={
                    formData.selectedLabels.includes(label.name)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleLabel(label.name)}
                  style={
                    formData.selectedLabels.includes(label.name)
                      ? { backgroundColor: label.color }
                      : { borderColor: label.color, color: label.color }
                  }
                >
                  {label.name}
                </Badge>
              ))}
              {labels.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No labels created yet.
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
