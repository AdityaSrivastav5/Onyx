"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Utensils, Car, Home, Zap, ShoppingBag } from "lucide-react";

interface EditExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
  } | null;
  onUpdate?: (expense: {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => void;
}

const categories = [
  { value: "food", label: "Food", icon: Utensils },
  { value: "transport", label: "Transport", icon: Car },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "bills", label: "Bills", icon: Home },
  { value: "entertainment", label: "Entertainment", icon: Zap },
  { value: "other", label: "Other", icon: ShoppingCart },
];

export function EditExpenseModal({ open, onOpenChange, expense, onUpdate }: EditExpenseModalProps) {
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState("food");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState("");

  React.useEffect(() => {
    if (expense) {
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDescription(expense.description);
      setDate(expense.date);
    }
  }, [expense, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0 || !expense) {
      return;
    }

    const updatedExpense = {
      id: expense.id,
      amount: amountNum,
      category,
      description,
      date,
    };

    onUpdate?.(updatedExpense);
    onOpenChange(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>
            Update the details of this transaction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-amount">
                Amount <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="edit-amount"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-7"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="edit-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-expense-description">Description</Label>
              <Textarea
                id="edit-expense-description"
                placeholder="What was this expense for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-expense-date">Date</Label>
              <Input
                id="edit-expense-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
