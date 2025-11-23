"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Plus, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import { PageTransition } from "@/components/PageTransition";
import { StatCard } from "@/components/dashboard/StatCard";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Groceries",
  "Personal Care",
  "Gifts & Donations",
  "Other",
];

interface Budget {
  _id: string;
  month: string;
  totalBudget: number;
  categoryBudgets: Record<string, number>;
  spent: number;
  remaining: number;
}

interface CategoryBudget {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
}

export default function BudgetPage() {
  const api = useApi();
  const { settings } = useSettings();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [budgetStatus, setBudgetStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [totalBudget, setTotalBudget] = useState("");
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchBudget();
    fetchBudgetStatus();
  }, []);

  const fetchBudget = async () => {
    try {
      const response = await api.get("/budgets/current");
      setBudget(response.data);
      setTotalBudget(response.data.totalBudget.toString());
      
      const catBudgets: Record<string, string> = {};
      if (response.data.categoryBudgets) {
        Object.entries(response.data.categoryBudgets).forEach(([key, value]) => {
          catBudgets[key] = value.toString();
        });
      }
      setCategoryBudgets(catBudgets);
    } catch (error) {
      console.error("Failed to fetch budget", error);
      toast.error("Failed to load budget");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBudgetStatus = async () => {
    try {
      const response = await api.get("/budgets/status");
      setBudgetStatus(response.data);
    } catch (error) {
      console.error("Failed to fetch budget status", error);
    }
  };

  const handleSaveBudget = async () => {
    try {
      const catBudgetsNum: Record<string, number> = {};
      Object.entries(categoryBudgets).forEach(([key, value]) => {
        if (value) {
          catBudgetsNum[key] = parseFloat(value);
        }
      });

      await api.post("/budgets", {
        month: new Date().toISOString().slice(0, 7),
        totalBudget: parseFloat(totalBudget),
        categoryBudgets: catBudgetsNum,
      });

      toast.success("Budget updated successfully!");
      fetchBudget();
      fetchBudgetStatus();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to save budget", error);
      toast.error("Failed to save budget");
    }
  };

  const percentageUsed = budget
    ? budget.totalBudget > 0
      ? (budget.spent / budget.totalBudget) * 100
      : 0
    : 0;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-orange-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

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
            <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
            <p className="text-muted-foreground">Manage your monthly budget</p>
          </div>
          <Button onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Budget
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Budget"
            value={budget ? formatCurrency(budget.totalBudget, settings.currency) : formatCurrency(0, settings.currency)}
            subtext="This month"
            icon={<DollarSign className="w-5 h-5" />}
            trend="neutral"
            delay={0.1}
            color="blue"
          />
          <StatCard
            title="Spent"
            value={budget ? formatCurrency(budget.spent, settings.currency) : formatCurrency(0, settings.currency)}
            subtext={`${percentageUsed.toFixed(0)}% of budget`}
            icon={<TrendingDown className="w-5 h-5" />}
            trend="down"
            delay={0.2}
            color="red"
          />
          <StatCard
            title="Remaining"
            value={budget ? formatCurrency(budget.remaining, settings.currency) : formatCurrency(0, settings.currency)}
            subtext="Available to spend"
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
            delay={0.3}
            color="green"
          />
          <StatCard
            title="Status"
            value={percentageUsed >= 100 ? "Over Budget" : "On Track"}
            subtext={percentageUsed >= 100 ? "Reduce spending" : "Keep it up!"}
            icon={<AlertCircle className="w-5 h-5" />}
            trend={percentageUsed >= 100 ? "down" : "up"}
            delay={0.4}
            color={percentageUsed >= 100 ? "red" : "green"}
          />
        </div>

        {/* Overall Budget Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Overall Budget Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Spent: {budget ? formatCurrency(budget.spent, settings.currency) : formatCurrency(0, settings.currency)}
                </span>
                <span className="text-muted-foreground">
                  Budget: {budget ? formatCurrency(budget.totalBudget, settings.currency) : formatCurrency(0, settings.currency)}
                </span>
              </div>
              <div className="relative">
                <Progress value={Math.min(percentageUsed, 100)} className="h-4" />
                <div
                  className={`absolute top-0 left-0 h-4 rounded-full transition-all ${getProgressColor(
                    percentageUsed
                  )}`}
                  style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {percentageUsed < 100
                  ? `You have ${budget ? formatCurrency(budget.remaining, settings.currency) : formatCurrency(0, settings.currency)} left to spend this month`
                  : `You've exceeded your budget by ${budget ? formatCurrency(Math.abs(budget.remaining), settings.currency) : formatCurrency(0, settings.currency)}`}
              </p>
              {percentageUsed >= 80 && percentageUsed < 100 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">
                    Warning: You've used {percentageUsed.toFixed(0)}% of your budget
                  </p>
                </div>
              )}
              {percentageUsed >= 100 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">Alert: You've exceeded your monthly budget!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Budgets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Category Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgetStatus?.categoryBreakdown?.length > 0 ? (
                  budgetStatus.categoryBreakdown.map((cat: CategoryBudget, i: number) => (
                    <motion.div
                      key={cat.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{cat.category}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(cat.spent, settings.currency)} / {formatCurrency(cat.budget, settings.currency)}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress
                          value={Math.min(cat.percentageUsed, 100)}
                          className="h-2"
                        />
                        <div
                          className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(
                            cat.percentageUsed
                          )}`}
                          style={{ width: `${Math.min(cat.percentageUsed, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{cat.percentageUsed.toFixed(0)}% used</span>
                        <span>
                          {cat.remaining >= 0
                            ? `${formatCurrency(cat.remaining, settings.currency)} remaining`
                            : `${formatCurrency(Math.abs(cat.remaining), settings.currency)} over`}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No category budgets set. Click "Edit Budget" to set category budgets.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Budget Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Monthly Budget</DialogTitle>
              <DialogDescription>
                Set your total budget and allocate amounts to different categories
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="totalBudget">Total Monthly Budget ({getCurrencySymbol(settings.currency)})</Label>
                <Input
                  id="totalBudget"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Category Budgets</h3>
                <div className="grid grid-cols-2 gap-4">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="space-y-2">
                      <Label htmlFor={category}>{category}</Label>
                      <Input
                        id={category}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={categoryBudgets[category] || ""}
                        onChange={(e) =>
                          setCategoryBudgets({
                            ...categoryBudgets,
                            [category]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveBudget}>Save Budget</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
