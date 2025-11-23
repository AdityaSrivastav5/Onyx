"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ExpenseChartProps {
  data: Array<{
    category: string;
    amount: number;
  }>;
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No expenses yet. Add your first expense to see analytics!
      </div>
    );
  }

  // Sort by amount descending
  const sortedData = [...data].sort((a, b) => b.amount - a.amount);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sortedData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="category" 
          className="text-xs"
          tick={{ fill: 'hsl(var(--foreground))' }}
        />
        <YAxis 
          className="text-xs"
          tick={{ fill: 'hsl(var(--foreground))' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar 
          dataKey="amount" 
          fill="#8b5cf6" 
          radius={[8, 8, 0, 0]}
          name="Amount ($)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
