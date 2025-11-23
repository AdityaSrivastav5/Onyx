"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface WebActivityChartProps {
  data: Array<{
    domain: string;
    timeSpent: number;
    favicon?: string;
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

export function WebActivityChart({ data }: WebActivityChartProps) {
  // Sort by time spent and take top 5, group others
  const sortedData = [...data].sort((a, b) => b.timeSpent - a.timeSpent);
  const topItems = sortedData.slice(0, 5);
  const otherItems = sortedData.slice(5);
  
  const chartData = topItems.map((item, index) => ({
    name: item.domain,
    value: item.timeSpent,
    color: COLORS[index % COLORS.length]
  }));

  if (otherItems.length > 0) {
    const otherTime = otherItems.reduce((acc, curr) => acc + curr.timeSpent, 0);
    chartData.push({
      name: 'Others',
      value: otherTime,
      color: '#9ca3af'
    });
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No activity recorded yet. Install the extension to track your web usage!
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
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip 
            formatter={(value: number) => formatTime(value)}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)' }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
