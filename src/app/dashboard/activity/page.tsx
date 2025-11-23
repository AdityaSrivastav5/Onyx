"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { PageTransition } from "@/components/PageTransition";
import { Card3D } from "@/components/Card3D";
import { WebActivityChart } from "@/components/charts/WebActivityChart";
import { ActivityTrendChart } from "@/components/charts/ActivityTrendChart";
import { Clock, Globe, AlertCircle, Calendar, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Activity {
  _id: string;
  domain: string;
  timeSpent: number;
  date: string;
  favicon?: string;
  category: 'productive' | 'distracting' | 'neutral';
}

interface Insights {
  productivityScore: number;
  breakdown: {
    productive: number;
    distracting: number;
    neutral: number;
    total: number;
  };
}

const DATE_RANGES = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
];

export default function ActivityPage() {
  const api = useApi();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("today");

  const getDateParams = (range: string) => {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    let startDate = endDate;

    if (range === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      startDate = yesterday.toISOString().split('T')[0];
      return { startDate, endDate: startDate }; // Yesterday is a single day
    } else if (range === "7days") {
      const past = new Date(today);
      past.setDate(past.getDate() - 6);
      startDate = past.toISOString().split('T')[0];
    } else if (range === "30days") {
      const past = new Date(today);
      past.setDate(past.getDate() - 29);
      startDate = past.toISOString().split('T')[0];
    }

    return { startDate, endDate };
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { startDate, endDate } = getDateParams(dateRange);
      const params = { startDate, endDate };

      const [activitiesRes, insightsRes, trendRes] = await Promise.all([
        api.get('/activities', { params }),
        api.get('/activities/insights', { params }),
        api.get('/activities/trend', { params })
      ]);

      setActivities(activitiesRes.data);
      setInsights(insightsRes.data);
      setTrendData(trendRes.data);
    } catch (error) {
      console.error("Failed to fetch activity data", error);
      toast.error("Failed to load activity data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [api, dateRange]);

  const handleUpdateCategory = async (domain: string, newCategory: string) => {
    try {
      await api.put('/activities/category', { domain, category: newCategory });
      toast.success(`Updated ${domain} to ${newCategory}`);
      fetchData(); // Refresh data to reflect changes
    } catch (error) {
      console.error("Failed to update category", error);
      toast.error("Failed to update category");
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <PageTransition>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Web Activity</h1>
            <p className="text-muted-foreground">Track your time and productivity across the web.</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {insights && (
              <div className="hidden md:flex bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full font-medium items-center gap-2">
                <Clock className="w-4 h-4" />
                Total: {formatTime(insights.breakdown.total)}
              </div>
            )}
          </div>
        </div>

        {activities.length === 0 && !isLoading ? (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-2xl p-6 flex items-center gap-4"
           >
             <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full text-yellow-600 dark:text-yellow-400">
               <AlertCircle className="w-6 h-6" />
             </div>
             <div>
               <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">No activity data found</h3>
               <p className="text-yellow-700 dark:text-yellow-300/80 text-sm">
                 Make sure you have installed the Onyx Extension and connected it to your account.
               </p>
             </div>
           </motion.div>
        ) : null}

        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Productivity Score Card */}
            <Card3D className="bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-medium text-white/80 mb-2">Productivity Score</h3>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold">{insights.productivityScore}</span>
                <span className="text-2xl mb-1 opacity-80">/100</span>
              </div>
              <div className="mt-4 bg-white/20 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${insights.productivityScore}%` }} 
                />
              </div>
              <p className="mt-4 text-sm text-white/80">
                {insights.productivityScore >= 80 ? "Excellent focus! 🚀" : 
                 insights.productivityScore >= 50 ? "Good balance. Keep it up! 👍" : 
                 "Too many distractions? 🛑"}
              </p>
            </Card3D>

            {/* Breakdown Card */}
            <Card3D className="md:col-span-2 bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <h3 className="font-bold text-lg mb-6">Time Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-green-600 dark:text-green-400">Productive</span>
                    <span>{formatTime(insights.breakdown.productive)}</span>
                  </div>
                  <div className="bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: `${(insights.breakdown.productive / insights.breakdown.total) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-red-600 dark:text-red-400">Distracting</span>
                    <span>{formatTime(insights.breakdown.distracting)}</span>
                  </div>
                  <div className="bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${(insights.breakdown.distracting / insights.breakdown.total) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Neutral</span>
                    <span>{formatTime(insights.breakdown.neutral)}</span>
                  </div>
                  <div className="bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gray-500 h-full rounded-full" style={{ width: `${(insights.breakdown.neutral / insights.breakdown.total) * 100}%` }} />
                  </div>
                </div>
              </div>
            </Card3D>
          </div>
        )}

        {/* Trend Chart */}
        {trendData.length > 0 && (
          <Card3D className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Productivity Trend</h3>
            <ActivityTrendChart data={trendData} />
          </Card3D>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <Card3D className="lg:col-span-1 bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm h-fit">
            <h3 className="font-bold text-lg mb-6">Top Websites</h3>
            <WebActivityChart data={activities} />
          </Card3D>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 overflow-hidden">
                  {activity.favicon ? (
                    <img src={activity.favicon} alt={activity.domain} className="w-6 h-6" />
                  ) : (
                    <Globe className="w-5 h-5 text-neutral-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{activity.domain}</h4>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold cursor-pointer hover:opacity-80 transition-opacity ${
                          activity.category === 'productive' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          activity.category === 'distracting' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {activity.category} <ChevronDown className="w-3 h-3 inline ml-0.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => handleUpdateCategory(activity.domain, 'productive')}>
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                          Productive
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateCategory(activity.domain, 'distracting')}>
                          <span className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                          Distracting
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateCategory(activity.domain, 'neutral')}>
                          <span className="w-2 h-2 rounded-full bg-gray-500 mr-2" />
                          Neutral
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        activity.category === 'productive' ? 'bg-green-500' :
                        activity.category === 'distracting' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${insights ? Math.min((activity.timeSpent / insights.breakdown.total) * 100, 100) : 0}%` }} 
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-lg">{formatTime(activity.timeSpent)}</div>
                  <div className="text-xs text-muted-foreground">
                    {insights ? ((activity.timeSpent / insights.breakdown.total) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
