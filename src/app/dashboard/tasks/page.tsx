"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Inbox,
  Calendar as CalendarIcon,
  Clock,
  Flag,
  Tag,
  FolderKanban,
  ChevronRight,
  Circle,
  CheckCircle2,
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
  LayoutTemplate,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TaskModal } from "@/components/TaskModal";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TemplatesModal } from "@/components/modals/TemplatesModal";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "P1" | "P2" | "P3" | "P4";
  dueDate?: string;
  labels: string[];
  tags: string[];
  parentTaskId?: string;
  subtaskIds: string[];
  projectId?: string;
  sectionId?: string;
  timeEstimate?: number;
  timeSpent: number;
  isRecurring: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  _id: string;
  name: string;
  color: string;
  icon?: string;
  isFavorite: boolean;
}

interface Label {
  _id: string;
  name: string;
  color: string;
}

const PRIORITY_CONFIG = {
  P1: { label: "Urgent", color: "text-red-600 bg-red-50 border-red-200", icon: "🔥" },
  P2: { label: "High", color: "text-orange-600 bg-orange-50 border-orange-200", icon: "⚡" },
  P3: { label: "Medium", color: "text-blue-600 bg-blue-50 border-blue-200", icon: "📌" },
  P4: { label: "Low", color: "text-gray-600 bg-gray-50 border-gray-200", icon: "📋" },
};

export default function TasksPage() {
  const api = useApi();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState<"inbox" | "today" | "upcoming" | "project">("inbox");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, labelsRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
        api.get("/labels"),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setLabels(labelsRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const newTask = {
        title: newTaskTitle,
        status: "todo",
        priority: "P3",
        projectId: selectedView === "project" ? selectedProjectId : undefined,
      };

      const response = await api.post("/tasks", newTask);
      setTasks([response.data, ...tasks]);
      setNewTaskTitle("");
      toast.success("Task added!");
    } catch (error) {
      console.error("Failed to add task", error);
      toast.error("Failed to add task");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const newStatus = task.status === "done" ? "todo" : "done";
      const response = await api.put(`/tasks/${task._id}`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === task._id ? response.data : t)));
      toast.success(newStatus === "done" ? "Task completed!" : "Task reopened");
    } catch (error) {
      console.error("Failed to update task", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
    } catch (error) {
      console.error("Failed to delete task", error);
      toast.error("Failed to delete task");
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      setTasks(tasks.map((t) => (t._id === taskId ? response.data : t)));
      
      if (updates.status) {
        const statusLabels = {
          'todo': 'To Do',
          'in-progress': 'In Progress',
          'done': 'Done'
        };
        toast.success(`Task moved to ${statusLabels[updates.status]}`);
      }
    } catch (error) {
      console.error("Failed to update task", error);
      toast.error("Failed to update task");
    }
  };

  const handleTemplateSelect = async (templateTasks: any[]) => {
    try {
      for (const task of templateTasks) {
        await api.post("/tasks", {
          title: task.title,
          priority: task.priority || "P3",
          status: "todo",
        });
      }
      await fetchData();
      toast.success(`Created ${templateTasks.length} tasks from template!`);
    } catch (error) {
      console.error("Failed to create tasks from template", error);
      toast.error("Failed to create tasks from template");
    }
  };

  // Filter tasks based on selected view
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by view
    if (selectedView === "today") {
      const today = new Date().toISOString().split("T")[0];
      filtered = filtered.filter((t) => t.dueDate === today);
    } else if (selectedView === "upcoming") {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((t) => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        return dueDate >= today && dueDate <= nextWeek;
      });
    } else if (selectedView === "project" && selectedProjectId) {
      filtered = filtered.filter((t) => t.projectId === selectedProjectId);
    } else if (selectedView === "inbox") {
      filtered = filtered.filter((t) => !t.projectId);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter out subtasks (they'll be shown under parent tasks)
    filtered = filtered.filter((t) => !t.parentTaskId);

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const todoTasks = filteredTasks.filter((t) => t.status === "todo");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in-progress");
  const doneTasks = filteredTasks.filter((t) => t.status === "done");

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/30 p-4 space-y-6 overflow-y-auto">
          {/* Views */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Views
            </h3>
            <Button
              variant={selectedView === "inbox" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedView("inbox")}
            >
              <Inbox className="w-4 h-4 mr-2" />
              Inbox
              <Badge variant="secondary" className="ml-auto">
                {tasks.filter((t) => !t.projectId && t.status !== "done").length}
              </Badge>
            </Button>
            <Button
              variant={selectedView === "today" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedView("today")}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Today
              <Badge variant="secondary" className="ml-auto">
                {
                  tasks.filter(
                    (t) =>
                      t.dueDate === new Date().toISOString().split("T")[0] &&
                      t.status !== "done"
                  ).length
                }
              </Badge>
            </Button>
            <Button
              variant={selectedView === "upcoming" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedView("upcoming")}
            >
              <Clock className="w-4 h-4 mr-2" />
              Upcoming
            </Button>
          </div>

          {/* Projects */}
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                Projects
              </h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {projects.slice(0, 5).map((project) => (
              <Button
                key={project._id}
                variant={
                  selectedView === "project" && selectedProjectId === project._id
                    ? "secondary"
                    : "ghost"
                }
                className="w-full justify-start"
                onClick={() => {
                  setSelectedView("project");
                  setSelectedProjectId(project._id);
                }}
              >
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
                {project.isFavorite && <Star className="w-3 h-3 ml-auto fill-yellow-400 text-yellow-400" />}
              </Button>
            ))}
          </div>

          {/* Labels */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Labels
            </h3>
            {labels.slice(0, 5).map((label) => (
              <Button
                key={label._id}
                variant="ghost"
                className="w-full justify-start"
              >
                <Tag className="w-4 h-4 mr-2" style={{ color: label.color }} />
                {label.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">
                  {selectedView === "inbox" && "Inbox"}
                  {selectedView === "today" && "Today"}
                  {selectedView === "upcoming" && "Upcoming"}
                  {selectedView === "project" &&
                    projects.find((p) => p._id === selectedProjectId)?.name}
                </h1>
                <p className="text-muted-foreground">
                  {filteredTasks.filter((t) => t.status !== "done").length} active tasks
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-r-none"
                  >
                    <FolderKanban className="w-4 h-4 mr-2" />
                    List
                  </Button>
                  <Button
                    variant={viewMode === "kanban" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("kanban")}
                    className="rounded-l-none"
                  >
                    <FolderKanban className="w-4 h-4 mr-2" />
                    Board
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setShowTemplates(true)}>
                  <LayoutTemplate className="w-4 h-4 mr-2" />
                  Templates
                </Button>
                <Button onClick={() => setIsTaskModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Quick Add */}
          <div className="p-4 border-b bg-muted/20">
            <form onSubmit={handleQuickAdd} className="flex gap-2">
              <Input
                placeholder="Quick add task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Add</Button>
            </form>
          </div>

          {/* Task List or Kanban Board */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-10">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No tasks found. Add your first task!
              </div>
            ) : viewMode === "kanban" ? (
              <KanbanBoard
                tasks={filteredTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskClick={(task) => {
                  // TODO: Open task detail modal
                  console.log("Task clicked:", task);
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* To Do */}
                {todoTasks.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase">
                      To Do ({todoTasks.length})
                    </h2>
                    {todoTasks.map((task, i) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onToggle={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        delay={i * 0.02}
                      />
                    ))}
                  </div>
                )}

                {/* In Progress */}
                {inProgressTasks.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase">
                      In Progress ({inProgressTasks.length})
                    </h2>
                    {inProgressTasks.map((task, i) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onToggle={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        delay={i * 0.02}
                      />
                    ))}
                  </div>
                )}

                {/* Done */}
                {doneTasks.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase">
                      Done ({doneTasks.length})
                    </h2>
                    {doneTasks.map((task, i) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onToggle={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        delay={i * 0.02}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={(newTask) => setTasks([newTask, ...tasks])}
        projects={projects}
        labels={labels}
        defaultProjectId={selectedView === "project" ? selectedProjectId : null}
      />

      <TemplatesModal
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    </PageTransition>
  );
}

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (taskId: string) => void;
  delay: number;
}

function TaskCard({ task, onToggle, onDelete, delay }: TaskCardProps) {
  const priorityConfig = PRIORITY_CONFIG[task.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors",
        task.status === "done" && "opacity-60"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task)}
        className="mt-0.5 flex-shrink-0"
      >
        {task.status === "done" ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h3
            className={cn(
              "font-medium",
              task.status === "done" && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </h3>
          {priorityConfig && (
            <Badge
              variant="outline"
              className={cn("text-xs", priorityConfig.color)}
            >
              {priorityConfig.icon} {task.priority}
            </Badge>
          )}
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {task.dueDate}
            </span>
          )}
          {task.timeEstimate && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.timeEstimate}m
            </span>
          )}
          {task.labels.length > 0 && (
            <div className="flex gap-1">
              {task.labels.slice(0, 3).map((label, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive"
          onClick={() => onDelete(task._id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
