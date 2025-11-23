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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  TrendingUp,
  DollarSign,
  Download,
  Filter,
  X,
  Calendar,
  Tag,
  CreditCard,
  Wallet,
  Smartphone,
  Banknote,
  Pencil,
  Trash2,
  Receipt,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import { PageTransition } from "@/components/PageTransition";
import { StatCard } from "@/components/dashboard/StatCard";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";
import { ExpenseChart } from "@/components/charts/ExpenseChart";

interface Expense {
  _id: string;
  amount: number;
  category: string;
  subcategory?: string;
  description?: string;
  date: string;
  paymentMethod: string;
  tags: string[];
  isRecurring: boolean;
  recurringFrequency?: string;
  notes?: string;
  currency: string;
}

const PAYMENT_METHODS = [
  { value: "Cash", label: "Cash", icon: Banknote },
  { value: "UPI", label: "UPI", icon: Smartphone },
  { value: "Credit Card", label: "Credit Card", icon: CreditCard },
  { value: "Debit Card", label: "Debit Card", icon: CreditCard },
  { value: "Net Banking", label: "Net Banking", icon: Wallet },
  { value: "Wallet", label: "Wallet", icon: Wallet },
  { value: "Other", label: "Other", icon: DollarSign },
];

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

const SUBCATEGORIES: Record<string, string[]> = {
  "Food & Dining": ["Restaurants", "Groceries", "Coffee", "Fast Food", "Delivery"],
  "Transportation": ["Fuel", "Public Transport", "Taxi/Ride Share", "Parking", "Maintenance"],
  "Shopping": ["Clothing", "Electronics", "Home", "Books", "Online Shopping"],
  "Entertainment": ["Movies", "Games", "Streaming", "Events", "Hobbies"],
  "Bills & Utilities": ["Electricity", "Water", "Internet", "Phone", "Rent", "Insurance"],
  "Healthcare": ["Doctor", "Pharmacy", "Gym", "Wellness"],
  "Education": ["Courses", "Books", "Tuition", "Supplies"],
  "Travel": ["Flights", "Hotels", "Activities", "Food"],
};

export default function ExpensesPage() {
  const api = useApi();
  const { settings } = useSettings();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    subcategory: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    tags: [] as string[],
    isRecurring: false,
    recurringFrequency: "",
    notes: "",
    currency: settings.currency,
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Update form currency when settings change
  useEffect(() => {
    setFormData(prev => ({ ...prev, currency: settings.currency }));
  }, [settings.currency]);

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Failed to fetch expenses", error);
      toast.error("Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        currency: settings.currency, // Ensure we save with current currency
      };

      if (editingExpense) {
        await api.put(`/expenses/${editingExpense._id}`, expenseData);
        toast.success("Expense updated successfully!");
      } else {
        await api.post("/expenses", expenseData);
        toast.success("Expense added successfully!");
      }

      fetchExpenses();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save expense", error);
      toast.error("Failed to save expense");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      await api.delete(`/expenses/${id}`);
      toast.success("Expense deleted successfully!");
      fetchExpenses();
    } catch (error) {
      console.error("Failed to delete expense", error);
      toast.error("Failed to delete expense");
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      subcategory: expense.subcategory || "",
      description: expense.description || "",
      date: expense.date,
      paymentMethod: expense.paymentMethod,
      tags: expense.tags || [],
      isRecurring: expense.isRecurring,
      recurringFrequency: expense.recurringFrequency || "",
      notes: expense.notes || "",
      currency: expense.currency,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingExpense(null);
    setFormData({
      amount: "",
      category: "",
      subcategory: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "Cash",
      tags: [],
      isRecurring: false,
      recurringFrequency: "",
      notes: "",
      currency: settings.currency,
    });
    setTagInput("");
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = filterCategory === "all" || expense.category === filterCategory;
    const matchesPayment = filterPaymentMethod === "all" || expense.paymentMethod === filterPaymentMethod;
    const matchesSearch = 
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesPayment && matchesSearch;
  });

  // Calculate stats
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const recurringExpenses = filteredExpenses.filter((e) => e.isRecurring).length;
  const thisMonthExpenses = filteredExpenses.filter((e) => 
    e.date.startsWith(new Date().toISOString().slice(0, 7))
  );
  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by payment method
  const byPaymentMethod = filteredExpenses.reduce((acc, expense) => {
    acc[expense.paymentMethod] = (acc[expense.paymentMethod] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

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
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">Track and manage your expenses</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses, settings.currency)}
            subtext="All time"
            icon={<DollarSign className="w-5 h-5" />}
            trend="neutral"
            delay={0.1}
            color="red"
          />
          <StatCard
            title="This Month"
            value={formatCurrency(thisMonthTotal, settings.currency)}
            subtext={`${thisMonthExpenses.length} transactions`}
            icon={<Calendar className="w-5 h-5" />}
            trend="up"
            delay={0.2}
            color="blue"
          />
          <StatCard
            title="Recurring"
            value={recurringExpenses.toString()}
            subtext="Active subscriptions"
            icon={<RefreshCw className="w-5 h-5" />}
            trend="neutral"
            delay={0.3}
            color="purple"
          />
          <StatCard
            title="Categories"
            value={new Set(filteredExpenses.map((e) => e.category)).size.toString()}
            subtext="Different categories"
            icon={<Tag className="w-5 h-5" />}
            trend="neutral"
            delay={0.4}
            color="green"
          />
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4"
        >
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPaymentMethod} onValueChange={setFilterPaymentMethod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Payment Methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payment Methods</SelectItem>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Payment Method Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(byPaymentMethod).map(([method, amount]) => {
                  const methodInfo = PAYMENT_METHODS.find((m) => m.value === method);
                  const Icon = methodInfo?.icon || DollarSign;
                  return (
                    <div key={method} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{method}</p>
                        <p className="text-lg font-bold">{formatCurrency(amount, settings.currency)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Spending Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseChart 
                data={Object.entries(
                  filteredExpenses.reduce((acc, expense) => {
                    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([category, amount]) => ({ category, amount }))}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Expenses List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>All Expenses ({filteredExpenses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="text-center py-10">Loading...</div>
                ) : filteredExpenses.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No expenses found. Add your first expense!
                  </div>
                ) : (
                  filteredExpenses.map((expense, i) => (
                    <motion.div
                      key={expense._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{expense.description || expense.category}</p>
                          {expense.isRecurring && (
                            <Badge variant="secondary" className="text-xs">
                              <RefreshCw className="w-3 h-3 mr-1" />
                              {expense.recurringFrequency}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{expense.category}</span>
                          {expense.subcategory && <span>• {expense.subcategory}</span>}
                          <span>• {expense.paymentMethod}</span>
                          <span>• {expense.date}</span>
                        </div>
                        {expense.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {expense.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(expense.amount, settings.currency)}</p>
                        <p className="text-xs text-muted-foreground">{expense.currency}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(expense)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(expense._id)}
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

        {/* Add/Edit Expense Modal */}
        <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
              <DialogDescription>
                {editingExpense ? "Update expense details" : "Enter expense details"}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value, subcategory: "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                    disabled={!formData.category || !SUBCATEGORIES[formData.category]}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.category &&
                        SUBCATEGORIES[formData.category]?.map((subcat) => (
                          <SelectItem key={subcat} value={subcat}>
                            {subcat}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="e.g., Grocery shopping at Walmart"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                        <X
                          className="w-3 h-3 ml-1 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isRecurring: checked as boolean })
                  }
                />
                <Label htmlFor="isRecurring">This is a recurring expense</Label>
              </div>

              {formData.isRecurring && (
                <div className="space-y-2">
                  <Label htmlFor="recurringFrequency">Frequency</Label>
                  <Select
                    value={formData.recurringFrequency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, recurringFrequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExpense ? "Update Expense" : "Add Expense"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
