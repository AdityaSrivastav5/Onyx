"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "next-themes";

interface ActivityTrendChartProps {
  data: any[];
}

export function ActivityTrendChart({ data }: ActivityTrendChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item._id).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    productive: item.productive,
    distracting: item.distracting,
    neutral: item.neutral,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorProductive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDistracting" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} vertical={false} />
          <XAxis
            dataKey="date"
            stroke={isDark ? "#888" : "#888"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={isDark ? "#888" : "#888"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatTime(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#171717" : "#fff",
              border: "1px solid " + (isDark ? "#333" : "#eee"),
              borderRadius: "8px",
            }}
            formatter={(value: number) => [formatTime(value), ""]}
            labelStyle={{ color: isDark ? "#fff" : "#000", marginBottom: "4px" }}
          />
          <Area
            type="monotone"
            dataKey="productive"
            name="Productive"
            stroke="#22c55e"
            fillOpacity={1}
            fill="url(#colorProductive)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="distracting"
            name="Distracting"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorDistracting)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
