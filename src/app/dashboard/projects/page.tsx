"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Plus,
  FolderKanban,
  Star,
  MoreVertical,
  Pencil,
  Trash2,
  Archive,
  Grid3x3,
  List,
} from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Project {
  _id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  isFavorite: boolean;
  sections: { id: string; name: string; position: number }[];
  viewType: "list" | "board" | "calendar";
  isArchived: boolean;
  createdAt: string;
}

const COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // green
  "#06b6d4", // cyan
  "#ef4444", // red
  "#6366f1", // indigo
];

export default function ProjectsPage() {
  const api = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: COLORS[0],
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      if (editingProject) {
        const response = await api.put(`/projects/${editingProject._id}`, formData);
        setProjects(projects.map((p) => (p._id === editingProject._id ? response.data : p)));
        toast.success("Project updated!");
      } else {
        const response = await api.post("/projects", formData);
        setProjects([response.data, ...projects]);
        toast.success("Project created!");
      }

      handleCloseModal();
    } catch (error) {
      console.error("Failed to save project", error);
      toast.error("Failed to save project");
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
      color: COLORS[0],
    });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || "",
      color: project.color,
    });
    setIsCreateModalOpen(true);
  };

  const handleToggleFavorite = async (project: Project) => {
    try {
      const response = await api.post(`/projects/${project._id}/favorite`);
      setProjects(projects.map((p) => (p._id === project._id ? response.data : p)));
      toast.success(response.data.isFavorite ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      console.error("Failed to toggle favorite", error);
      toast.error("Failed to update project");
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure? This will archive the project and all its tasks.")) return;

    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(projects.filter((p) => p._id !== projectId));
      toast.success("Project archived");
    } catch (error) {
      console.error("Failed to delete project", error);
      toast.error("Failed to delete project");
    }
  };

  const favoriteProjects = projects.filter((p) => p.isFavorite && !p.isArchived);
  const regularProjects = projects.filter((p) => !p.isFavorite && !p.isArchived);

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Organize your tasks into projects
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </motion.div>

        {/* Favorites */}
        {favoriteProjects.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              Favorites
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favoriteProjects.map((project, i) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                  delay={i * 0.05}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Projects */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Projects</h2>
          {isLoading ? (
            <div className="text-center py-10">Loading projects...</div>
          ) : regularProjects.length === 0 && favoriteProjects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FolderKanban className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first project to organize your tasks
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {regularProjects.map((project, i) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                  delay={i * 0.05}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Create New Project"}
              </DialogTitle>
              <DialogDescription>
                {editingProject
                  ? "Update your project details"
                  : "Create a new project to organize your tasks"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Website Redesign"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What is this project about?"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        formData.color === color
                          ? "border-primary scale-110"
                          : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProject ? "Update Project" : "Create Project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onToggleFavorite: (project: Project) => void;
  delay: number;
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
  onToggleFavorite,
  delay,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="group hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: project.color + "20" }}
              >
                <FolderKanban
                  className="w-5 h-5"
                  style={{ color: project.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onToggleFavorite(project)}
              >
                <Star
                  className={cn(
                    "w-4 h-4",
                    project.isFavorite
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{project.sections.length} sections</span>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEdit(project)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive"
                onClick={() => onDelete(project._id)}
              >
                <Archive className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
