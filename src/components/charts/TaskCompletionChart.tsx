"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TaskCompletionChartProps {
  data: {
    todo: number;
    inProgress: number;
    done: number;
  };
}

const COLORS = {
  todo: '#3b82f6',      // Blue
  inProgress: '#f59e0b', // Orange
  done: '#10b981',       // Green
};

export function TaskCompletionChart({ data }: TaskCompletionChartProps) {
  const chartData = [
    { name: 'To Do', value: data.todo, color: COLORS.todo },
    { name: 'In Progress', value: data.inProgress, color: COLORS.inProgress },
    { name: 'Done', value: data.done, color: COLORS.done },
  ].filter(item => item.value > 0); // Only show non-zero values

  const total = data.todo + data.inProgress + data.done;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No tasks yet. Create your first task to see analytics!
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
