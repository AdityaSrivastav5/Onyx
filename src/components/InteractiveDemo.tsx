"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Target,
  Flame,
  Calendar as CalendarIcon,
  DollarSign,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DemoTask {
  id: number;
  title: string;
  completed: boolean;
  priority: "P1" | "P2" | "P3";
}

interface DemoHabit {
  id: number;
  name: string;
  streak: number;
  completedToday: boolean;
}

interface DemoExpense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

const PRIORITY_COLORS = {
  P1: "bg-red-100 text-red-700 border-red-300",
  P2: "bg-orange-100 text-orange-700 border-orange-300",
  P3: "bg-blue-100 text-blue-700 border-blue-300",
};

export function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<"tasks" | "habits" | "expenses">("tasks");
  
  // Tasks state
  const [tasks, setTasks] = useState<DemoTask[]>([
    { id: 1, title: "Review project proposal", completed: false, priority: "P1" },
    { id: 2, title: "Update documentation", completed: true, priority: "P2" },
    { id: 3, title: "Team meeting prep", completed: false, priority: "P2" },
  ]);
  const [newTask, setNewTask] = useState("");

  // Habits state
  const [habits, setHabits] = useState<DemoHabit[]>([
    { id: 1, name: "Morning Exercise", streak: 7, completedToday: true },
    { id: 2, name: "Read 30 minutes", streak: 12, completedToday: false },
    { id: 3, name: "Meditate", streak: 5, completedToday: true },
  ]);

  // Expenses state
  const [expenses, setExpenses] = useState<DemoExpense[]>([
    { id: 1, description: "Lunch", amount: 15, category: "Food" },
    { id: 2, description: "Coffee", amount: 5, category: "Food" },
    { id: 3, description: "Uber", amount: 12, category: "Transport" },
  ]);
  const [newExpense, setNewExpense] = useState({ description: "", amount: "" });

  // Task functions
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTask, completed: false, priority: "P2" }]);
      setNewTask("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Habit functions
  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => 
      h.id === id 
        ? { ...h, completedToday: !h.completedToday, streak: !h.completedToday ? h.streak + 1 : h.streak - 1 }
        : h
    ));
  };

  // Expense functions
  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setExpenses([...expenses, { 
        id: Date.now(), 
        description: newExpense.description, 
        amount: parseFloat(newExpense.amount),
        category: "Other"
      }]);
      setNewExpense({ description: "", amount: "" });
    }
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
        {[
          { id: "tasks", label: "Tasks", icon: CheckCircle2 },
          { id: "habits", label: "Habits", icon: Target },
          { id: "expenses", label: "Expenses", icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              className="flex-1"
            />
            <Button onClick={addTask}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-400" />
                    )}
                  </button>
                  <span className={`flex-1 ${task.completed ? "line-through text-neutral-400" : ""}`}>
                    {task.title}
                  </span>
                  <Badge variant="outline" className={PRIORITY_COLORS[task.priority]}>
                    {task.priority}
                  </Badge>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="text-sm text-neutral-600 dark:text-neutral-400 text-center pt-4">
            {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
          </div>
        </motion.div>
      )}

      {/* Habits Tab */}
      {activeTab === "habits" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {habits.map((habit) => (
            <Card key={habit.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <h4 className="font-semibold">{habit.name}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                    <Flame className="w-4 h-4" />
                    <span className="font-bold">{habit.streak} day streak</span>
                  </div>
                </div>
                <Button
                  onClick={() => toggleHabit(habit.id)}
                  variant={habit.completedToday ? "secondary" : "default"}
                  className="w-full"
                  size="sm"
                >
                  {habit.completedToday ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completed Today
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 mr-2" />
                      Mark as Done
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Expenses Tab */}
      {activeTab === "expenses" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex gap-2">
            <Input
              placeholder="Description..."
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="w-32"
            />
            <Button onClick={addExpense}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Expenses</div>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-300">
              ${totalExpenses.toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {expenses.map((expense) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-xs text-neutral-500">{expense.category}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">${expense.amount.toFixed(2)}</span>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
