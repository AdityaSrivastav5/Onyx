"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import {
  Plus,
  Flame,
  Trophy,
  Target,
  Calendar as CalendarIcon,
  Check,
  X,
  Trash2,
  TrendingUp,
  LayoutTemplate,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { HabitTemplatesModal } from "@/components/modals/HabitTemplatesModal";

interface Habit {
  _id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly" | "custom";
  targetDays: number[];
  color: string;
  icon?: string;
  streak: number;
  longestStreak: number;
  completions: Date[];
  isActive: boolean;
}

interface HabitStats {
  totalHabits: number;
  activeStreaks: number;
  totalCompletions: number;
  longestStreak: number;
  completedToday: number;
}

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
];

export default function HabitsPage() {
  const api = useApi();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTemplates, setShowTemplates] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    frequency: "daily",
    color: COLORS[0],
  });

  useEffect(() => {
    fetchHabits();
    fetchStats();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await api.get("/habits");
      setHabits(response.data.map((h: any) => ({
        ...h,
        completions: h.completions.map((d: string) => new Date(d))
      })));
    } catch (error) {
      console.error("Failed to fetch habits", error);
      toast.error("Failed to load habits");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/habits/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    try {
      const response = await api.post("/habits", formData);
      setHabits([response.data, ...habits]);
      setIsAddModalOpen(false);
      setFormData({ name: "", description: "", frequency: "daily", color: COLORS[0] });
      toast.success("Habit created!");
      fetchStats();
    } catch (error) {
      console.error("Failed to create habit", error);
      toast.error("Failed to create habit");
    }
  };

  const handleToggle = async (habitId: string) => {
    try {
      const response = await api.post(`/habits/${habitId}/toggle`);
      setHabits(habits.map(h => h._id === habitId ? {
        ...response.data,
        completions: response.data.completions.map((d: string) => new Date(d))
      } : h));
      toast.success("Habit updated!");
      fetchStats();
    } catch (error) {
      console.error("Failed to toggle habit", error);
      toast.error("Failed to update habit");
    }
  };

  const handleDelete = async (habitId: string) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    try {
      await api.delete(`/habits/${habitId}`);
      setHabits(habits.filter(h => h._id !== habitId));
      toast.success("Habit deleted");
      fetchStats();
    } catch (error) {
      console.error("Failed to delete habit", error);
      toast.error("Failed to delete habit");
    }
  };

  const handleTemplateSelect = async (templateHabits: any[]) => {
    try {
      for (const habit of templateHabits) {
        await api.post("/habits", {
          name: habit.name,
          description: habit.description,
          color: habit.color,
          frequency: "daily",
        });
      }
      await fetchHabits();
      await fetchStats();
      toast.success(`Created ${templateHabits.length} habits from template!`);
    } catch (error) {
      console.error("Failed to create habits from template", error);
      toast.error("Failed to create habits from template");
    }
  };

  const isCompletedOnDate = (habit: Habit, date: Date) => {
    return habit.completions.some(completion => isSameDay(new Date(completion), date));
  };

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

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
            <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
            <p className="text-muted-foreground">Build better habits, one day at a time</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowTemplates(true)}>
              <LayoutTemplate className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard
              title="Total Habits"
              value={stats.totalHabits}
              icon={<Target className="w-5 h-5" />}
              color="blue"
              delay={0.1}
            />
            <StatCard
              title="Completed Today"
              value={stats.completedToday}
              icon={<Check className="w-5 h-5" />}
              color="green"
              delay={0.2}
            />
            <StatCard
              title="Active Streaks"
              value={stats.activeStreaks}
              icon={<Flame className="w-5 h-5" />}
              color="orange"
              delay={0.3}
            />
            <StatCard
              title="Longest Streak"
              value={stats.longestStreak}
              icon={<Trophy className="w-5 h-5" />}
              color="purple"
              delay={0.4}
            />
            <StatCard
              title="Total Completions"
              value={stats.totalCompletions}
              icon={<TrendingUp className="w-5 h-5" />}
              color="cyan"
              delay={0.5}
            />
          </div>
        )}

        {/* Habits List */}
        <div className="grid gap-4 md:grid-cols-2">
          {isLoading ? (
            <div className="col-span-2 text-center py-10">Loading habits...</div>
          ) : habits.length === 0 ? (
            <div className="col-span-2 text-center py-10 text-muted-foreground">
              No habits yet. Create your first habit to get started!
            </div>
          ) : (
            habits.map((habit, i) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onToggle={handleToggle}
                onDelete={handleDelete}
                delay={i * 0.05}
              />
            ))
          )}
        </div>

        {/* Calendar View */}
        {habits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {habits.map(habit => (
                    <div key={habit._id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: habit.color }}
                        />
                        <span className="font-medium text-sm">{habit.name}</span>
                        <Badge variant="secondary" className="ml-auto">
                          <Flame className="w-3 h-3 mr-1" />
                          {habit.streak} day streak
                        </Badge>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {monthDays.slice(0, 31).map((day, i) => {
                          const completed = isCompletedOnDate(habit, day);
                          return (
                            <div
                              key={i}
                              className={`aspect-square rounded flex items-center justify-center text-xs ${
                                completed
                                  ? "bg-opacity-100 text-white font-bold"
                                  : "bg-muted/30 text-muted-foreground"
                              } ${isToday(day) ? "ring-2 ring-primary" : ""}`}
                              style={{
                                backgroundColor: completed ? habit.color : undefined,
                              }}
                            >
                              {format(day, "d")}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Add Habit Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Habit</DialogTitle>
              <DialogDescription>
                Start building a new positive habit today
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Habit Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Morning Exercise"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Optional description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full transition-transform ${
                        formData.color === color ? "scale-125 ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Habit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <HabitTemplatesModal
          isOpen={showTemplates}
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={handleTemplateSelect}
        />
      </div>
    </PageTransition>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

function StatCard({ title, value, icon, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  delay: number;
}

function HabitCard({ habit, onToggle, onDelete, delay }: HabitCardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = habit.completions.some(date => {
    const completionDate = new Date(date);
    completionDate.setHours(0, 0, 0, 0);
    return completionDate.getTime() === today.getTime();
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div
                className="w-4 h-4 rounded-full mt-1"
                style={{ backgroundColor: habit.color }}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{habit.name}</h3>
                {habit.description && (
                  <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => onDelete(habit._id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">{habit.streak} day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Best: {habit.longestStreak}</span>
            </div>
          </div>

          <Button
            className="w-full"
            variant={completedToday ? "secondary" : "default"}
            onClick={() => onToggle(habit._id)}
          >
            {completedToday ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Completed Today
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Mark as Done
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
