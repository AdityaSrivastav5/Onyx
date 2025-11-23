import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  delay?: number;
  color?: string;
}

export function StatCard({ title, value, icon, subtext, trend, delay = 0, color = "blue" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between hover:border-blue-500/50 transition-colors group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-full transition-colors ${
          color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
          color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
          color === 'red' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
          'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
        }`}>
          {icon}
        </div>
        {trend && (
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground font-medium">{title}</div>
        {subtext && <div className="text-xs text-muted-foreground mt-1">{subtext}</div>}
      </div>
    </motion.div>
  );
}
