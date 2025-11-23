"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DollarSign,
  TrendingUp,
  Briefcase,
  Gift,
  PiggyBank,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import { PageTransition } from "@/components/PageTransition";
import { StatCard } from "@/components/dashboard/StatCard";
import { toast } from "sonner";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";

const INCOME_SOURCES = [
  { value: "Salary", label: "Salary", icon: Briefcase },
  { value: "Freelance", label: "Freelance", icon: Briefcase },
  { value: "Investment", label: "Investment", icon: TrendingUp },
  { value: "Business", label: "Business", icon: Briefcase },
  { value: "Gift", label: "Gift", icon: Gift },
  { value: "Refund", label: "Refund", icon: DollarSign },
  { value: "Other", label: "Other", icon: DollarSign },
];

interface Income {
  _id: string;
  amount: number;
  source: string;
  description?: string;
  date: string;
  paymentMethod?: string;
}

export default function IncomePage() {
  const api = useApi();
  const { settings } = useSettings();
  const [incomeRecords, setIncomeRecords] = useState<Income[]>([]);
  const [incomeSummary, setIncomeSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const [formData, setFormData] = useState({
    amount: "",
    source: "Salary",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "",
  });

  useEffect(() => {
    fetchIncome();
    fetchIncomeSummary();
  }, []);

  const fetchIncome = async () => {
    try {
      const response = await api.get("/income");
      setIncomeRecords(response.data);
    } catch (error) {
      console.error("Failed to fetch income", error);
      toast.error("Failed to load income");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIncomeSummary = async () => {
    try {
      const response = await api.get("/income/summary");
      setIncomeSummary(response.data);
    } catch (error) {
      console.error("Failed to fetch income summary", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.source || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const incomeData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (editingIncome) {
        await api.put(`/income/${editingIncome._id}`, incomeData);
        toast.success("Income updated successfully!");
      } else {
        await api.post("/income", incomeData);
        toast.success("Income added successfully!");
      }

      fetchIncome();
      fetchIncomeSummary();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save income", error);
      toast.error("Failed to save income");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this income record?")) return;

    try {
      await api.delete(`/income/${id}`);
      toast.success("Income deleted successfully!");
      fetchIncome();
      fetchIncomeSummary();
    } catch (error) {
      console.error("Failed to delete income", error);
      toast.error("Failed to delete income");
    }
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setFormData({
      amount: income.amount.toString(),
      source: income.source,
      description: income.description || "",
      date: income.date,
      paymentMethod: income.paymentMethod || "",
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingIncome(null);
    setFormData({
      amount: "",
      source: "Salary",
      description: "",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "",
    });
  };

  const totalIncome = incomeRecords.reduce((sum, i) => sum + i.amount, 0);

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
            <h1 className="text-3xl font-bold tracking-tight">Income</h1>
            <p className="text-muted-foreground">Track your income sources</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Income
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Income"
            value={formatCurrency(totalIncome, settings.currency)}
            subtext="All time"
            icon={<DollarSign className="w-5 h-5" />}
            trend="up"
            delay={0.1}
            color="green"
          />
          <StatCard
            title="This Month"
            value={incomeSummary ? formatCurrency(incomeSummary.totalIncome, settings.currency) : formatCurrency(0, settings.currency)}
            subtext={`${incomeSummary?.bySource?.length || 0} sources`}
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
            delay={0.2}
            color="blue"
          />
          <StatCard
            title="Records"
            value={incomeRecords.length.toString()}
            subtext="Total entries"
            icon={<Briefcase className="w-5 h-5" />}
            trend="neutral"
            delay={0.3}
            color="purple"
          />
          <StatCard
            title="Savings Rate"
            value="--"
            subtext="Coming soon"
            icon={<PiggyBank className="w-5 h-5" />}
            trend="neutral"
            delay={0.4}
            color="green"
          />
        </div>

        {/* Income by Source */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Income by Source (This Month)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {incomeSummary?.bySource?.map((source: any) => {
                  const sourceInfo = INCOME_SOURCES.find((s) => s.value === source.source);
                  const Icon = sourceInfo?.icon || DollarSign;
                  return (
                    <div key={source.source} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Icon className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">{source.source}</p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(source.amount, settings.currency)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Income Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>All Income Records ({incomeRecords.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="text-center py-10">Loading...</div>
                ) : incomeRecords.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No income records found. Add your first income!
                  </div>
                ) : (
                  incomeRecords.map((income, i) => (
                    <motion.div
                      key={income._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{income.description || income.source}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{income.source}</span>
                          <span>• {income.date}</span>
                          {income.paymentMethod && <span>• {income.paymentMethod}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          +{formatCurrency(income.amount, settings.currency)}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(income)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(income._id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add/Edit Income Modal */}
        <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIncome ? "Edit Income" : "Add New Income"}</DialogTitle>
              <DialogDescription>
                {editingIncome ? "Update income details" : "Enter income details"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ({getCurrencySymbol(settings.currency)}) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source *</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => setFormData({ ...formData, source: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOME_SOURCES.map((source) => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="e.g., Monthly salary"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Input
                  id="paymentMethod"
                  placeholder="e.g., Bank Transfer"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">{editingIncome ? "Update Income" : "Add Income"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
