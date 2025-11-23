"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Clock, CheckCircle2, DollarSign, Zap, ArrowRight, FileText, Calendar, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { AddTaskModal } from "@/components/modals/AddTaskModal";
import { useApi } from "@/hooks/useApi";
import { PageTransition } from "@/components/PageTransition";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskCompletionChart } from "@/components/charts/TaskCompletionChart";

const activityData = [
  { day: "Mon", hours: 6.5, tasks: 12 },
  { day: "Tue", hours: 7.2, tasks: 15 },
  { day: "Wed", hours: 5.8, tasks: 10 },
  { day: "Thu", hours: 8.1, tasks: 18 },
  { day: "Fri", hours: 6.9, tasks: 14 },
  { day: "Sat", hours: 4.2, tasks: 8 },
  { day: "Sun", hours: 3.5, tasks: 6 },
];

const expenseData = [
  { name: "Food", value: 450, color: "#1e3a8a" },
  { name: "Transport", value: 280, color: "#1e293b" },
  { name: "Entertainment", value: 180, color: "#334155" },
  { name: "Shopping", value: 320, color: "#475569" },
  { name: "Bills", value: 520, color: "#64748b" },
];

const productivityData = [
  { month: "Jan", productivity: 65 },
  { month: "Feb", productivity: 72 },
  { month: "Mar", productivity: 68 },
  { month: "Apr", productivity: 81 },
  { month: "May", productivity: 75 },
  { month: "Jun", productivity: 88 },
];

const taskCompletionData = [
  { week: "Week 1", completed: 24, total: 30 },
  { week: "Week 2", completed: 28, total: 32 },
  { week: "Week 3", completed: 22, total: 28 },
  { week: "Week 4", completed: 30, total: 35 },
];

export default function DashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstName || "User";
  const api = useApi();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [habitStats, setHabitStats] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [focusSessions, setFocusSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, tasksRes, habitsRes, habitStatsRes, expensesRes, focusRes] = await Promise.all([
          api.get('/summary'),
          api.get('/tasks'),
          api.get('/habits').catch(() => ({ data: [] })),
          api.get('/habits/stats').catch(() => ({ data: null })),
          api.get('/expenses').catch(() => ({ data: [] })),
          api.get('/focus/sessions').catch(() => ({ data: [] }))
        ]);
        setSummary(summaryRes.data);
        setTasks(tasksRes.data);
        setHabits(habitsRes.data);
        setHabitStats(habitStatsRes.data);
        setExpenses(expensesRes.data);
        setFocusSessions(focusRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [api]);

  const handleTaskSubmit = async (task: any) => {
    try {
      await api.post('/tasks', {
        ...task,
        status: "todo",
        dueDate: task.dueDate || "Today"
      });
      setIsTaskModalOpen(false);
      // Ideally refresh summary here
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  return (
    <PageTransition>
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(100px,auto)]">
        
        {/* Welcome & Productivity Banner - Large Block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-1 md:col-span-8 row-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-8 border border-white/20 dark:border-white/5 shadow-xl backdrop-blur-sm"
      >
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Hello, {firstName}
              </h1>
              <p className="text-muted-foreground text-lg font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="text-right bg-white/50 dark:bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/20">
              <div className="text-sm text-muted-foreground mb-1 font-medium">Productivity Score</div>
              <div className="text-5xl font-black text-blue-900 dark:text-blue-400 tracking-tighter">
                {summary && summary.tasksCount > 0 
                  ? Math.round(((summary.tasksCount - summary.pendingTasks) / summary.tasksCount) * 100)
                  : 0
                }
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 justify-end mt-2 font-bold bg-green-100/50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {summary && summary.tasksCount > 0 
                  ? `${Math.round(((summary.tasksCount - summary.pendingTasks) / summary.tasksCount) * 100)}%`
                  : '0%'
                }
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-4 border border-white/20 backdrop-blur-md">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Tasks</div>
              <div className="text-2xl font-bold">{summary ? `${summary.tasksCount - summary.pendingTasks}/${summary.tasksCount}` : '0/0'}</div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: summary && summary.tasksCount > 0 ? `${((summary.tasksCount - summary.pendingTasks) / summary.tasksCount) * 100}%` : '0%' }} />
              </div>
            </div>
            <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-4 border border-white/20 backdrop-blur-md">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Focus</div>
              <div className="text-2xl font-bold">
                {focusSessions.length > 0 
                  ? `${Math.floor(focusSessions.reduce((acc: number, s: any) => acc + (s.duration || 0), 0) / 60)}h ${Math.floor(focusSessions.reduce((acc: number, s: any) => acc + (s.duration || 0), 0) % 60)}m`
                  : '0h 0m'
                }
              </div>
              <div className="text-xs text-green-600 mt-2 font-medium">
                {focusSessions.length > 0 ? `${focusSessions.length} sessions` : 'No sessions'}
              </div>
            </div>
            <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-4 border border-white/20 backdrop-blur-md">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Streak</div>
              <div className="text-2xl font-bold">
                {habitStats?.longestStreak || 0} Days
              </div>
              <div className="flex gap-1 mt-3">
                {[1,2,3,4,5].map(i => <div key={i} className="w-full h-1.5 rounded-full bg-blue-500/40" />)}
              </div>
            </div>
            <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-4 border border-white/20 backdrop-blur-md">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Budget</div>
              <div className="text-2xl font-bold">
                {expenses.length > 0 
                  ? `$${expenses.reduce((acc: number, e: any) => acc + (e.amount || 0), 0).toFixed(0)}`
                  : '$0'
                }
              </div>
              <div className="text-xs text-muted-foreground mt-2">Spent this month</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions & Stats - Right Column */}
      <div className="col-span-1 md:col-span-4 row-span-2 grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="col-span-2 bg-blue-600 dark:bg-blue-700 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg shadow-blue-900/20 cursor-pointer hover:bg-blue-700 transition-colors"
          onClick={() => setIsTaskModalOpen(true)}
        >
          <Plus className="w-8 h-8 bg-white/20 p-1.5 rounded-full" />
          <div>
            <div className="font-bold text-xl">New Task</div>
            <div className="text-blue-100 text-sm">Create a new item</div>
          </div>
        </motion.div>

        <StatCard title="Total Tasks" value={summary?.tasksCount || "0"} icon={<CheckCircle2 className="w-4 h-4" />} delay={0.2} />
        <StatCard title="Pending" value={summary?.pendingTasks || "0"} icon={<TrendingUp className="w-4 h-4" />} delay={0.3} />
        <StatCard title="Active Time" value={summary ? `${Math.round(summary.totalTimeSpent / 3600)}h ${Math.round((summary.totalTimeSpent % 3600) / 60)}m` : "0h 0m"} icon={<Clock className="w-4 h-4" />} delay={0.4} />
        <StatCard 
          title="Expenses" 
          value={expenses.length > 0 ? `$${expenses.reduce((acc: number, e: any) => acc + (e.amount || 0), 0).toFixed(0)}` : "$0"} 
          icon={<DollarSign className="w-4 h-4" />} 
          delay={0.5} 
        />
      </div>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="col-span-1 md:col-span-4 row-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/50"
      >
        <h3 className="font-bold text-lg flex items-center gap-2 mb-6 text-indigo-900 dark:text-indigo-300">
          <Zap className="w-5 h-5" /> Insights
        </h3>
        
        <div className="space-y-4">
          <div className="bg-white/80 dark:bg-black/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
                <Clock className="w-4 h-4" />
              </div>
              <div className="font-semibold text-sm">Peak Performance</div>
            </div>
            <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">10 AM - 12 PM</div>
            <p className="text-xs text-muted-foreground mt-1">40% more tasks completed</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-xl border border-white/20">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Schedule deep work in mornings</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-xl border border-white/20">
              <DollarSign className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Reduce entertainment spending</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Area */}
      <motion.div className="col-span-1 md:col-span-8 row-span-2 bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Weekly Activity</h3>
          <select className="bg-transparent text-sm font-medium text-muted-foreground outline-none">
            <option>This Week</option>
            <option>Last Week</option>
          </select>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}h`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)' }}
                cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fill="url(#activityGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Secondary Charts */}
      <motion.div className="col-span-1 md:col-span-4 row-span-2 bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <h3 className="font-bold text-lg mb-6">Expense Breakdown</h3>
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-2xl font-bold">$1,750</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {expenseData.slice(0, 3).map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium">${item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Task Completion Chart */}
      <motion.div className="col-span-1 md:col-span-8 row-span-2 bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <h3 className="font-bold text-lg mb-6">Task Completion Status</h3>
        <div className="h-[300px] w-full">
          <TaskCompletionChart 
            data={{
              todo: tasks.filter(t => t.status === 'todo').length,
              inProgress: tasks.filter(t => t.status === 'in-progress').length,
              done: tasks.filter(t => t.status === 'done').length,
            }}
          />
        </div>
      </motion.div>

      {/* Add Task Modal */}
      <AddTaskModal
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        onSubmit={handleTaskSubmit}
      />
      </div>
    </PageTransition>
  );
}



function ActivityItem({ title, time, icon }: any) {
  return (
    <div className="flex items-start gap-3 group">
      <div className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white shrink-0 group-hover:scale-110 transition-transform bg-white dark:bg-neutral-900">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, title, href }: any) {
  return (
    <a href={href}>
      <Card className="hover:shadow-lg transition-all cursor-pointer border-none bg-gradient-to-br from-card to-card/50 group">
        <CardContent className="p-6 text-center">
          <div className="text-neutral-900 dark:text-white mb-3 group-hover:scale-110 transition-transform flex items-center justify-center">{icon}</div>
          <p className="text-sm font-medium">{title}</p>
        </CardContent>
      </Card>
    </a>
  );
}

function TaskItem({ title, status, priority, dueDate }: any) {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-2 h-2 rounded-full shrink-0 ${
          status === 'Done' ? 'bg-green-500' : 
          status === 'In Progress' ? 'bg-yellow-500' : 'bg-muted-foreground'
        }`} />
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm truncate ${status === 'Done' ? 'line-through text-muted-foreground' : ''}`}>
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{dueDate}</p>
        </div>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
        priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
        priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      }`}>
        {priority}
      </span>
    </motion.div>
  );
}
