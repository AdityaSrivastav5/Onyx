"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check, LayoutDashboard, Shield, Zap, Star, Activity, Calendar, DollarSign, ChevronDown, Sparkles, TrendingUp, Users, Plus, Clock } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const activityData = [
  { day: "Mon", hours: 4 },
  { day: "Tue", hours: 6.5 },
  { day: "Wed", hours: 4.5 },
  { day: "Thu", hours: 8 },
  { day: "Fri", hours: 5.5 },
  { day: "Sat", hours: 7 },
  { day: "Sun", hours: 4 },
];

export default function Home() {
  const { isSignedIn } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Header */}
      <motion.header 
        className="border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* ... (Logo) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 font-semibold text-lg tracking-tight"
          >
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <img src="/logo.png" alt="Onyx" className="w-5 h-5" />
            </motion.div>
            Onyx
          </motion.div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {["Features", "How it Works", "Pricing", "FAQ"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ThemeToggle />
            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button size="sm" variant="outline">Dashboard</Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section with Spotlight & Premium Feel */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Spotlight Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/20 dark:bg-purple-500/10 blur-[100px] rounded-full pointer-events-none translate-y-20" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            {/* Movable 3D Object */}
            <motion.div
              drag
              dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
              className="absolute top-10 right-10 hidden lg:flex items-center justify-center cursor-grab active:cursor-grabbing z-0"
              style={{ perspective: 1000 }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 backdrop-blur-md rounded-xl" style={{ transform: "translateZ(64px)" }} />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-white/20 backdrop-blur-md rounded-xl" style={{ transform: "rotateY(180deg) translateZ(64px)" }} />
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-red-500/30 border border-white/20 backdrop-blur-md rounded-xl" style={{ transform: "rotateY(90deg) translateZ(64px)" }} />
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-500/30 border border-white/20 backdrop-blur-md rounded-xl" style={{ transform: "rotateY(-90deg) translateZ(64px)" }} />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-yellow-500/30 border border-white/20 backdrop-blur-md rounded-xl" style={{ transform: "rotateX(90deg) translateZ(64px)" }} />
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-green-500/30 border border-white/20 backdrop-blur-md rounded-xl" style={{ transform: "rotateX(-90deg) translateZ(64px)" }} />
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1 text-sm font-medium bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              v2.0 is now live — Experience the future
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold tracking-tight mb-8"
            >
              Your Life,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Organized
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Tasks, habits, focus sessions, expenses, notes, and calendar—all in one beautiful platform.
              <br className="hidden md:block" />
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">Track habits, master focus, own your data.</span>
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
            >
              <Link href="/sign-up">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-lg hover:shadow-xl transition-all">
                    Get Started for Free
                  </Button>
                </motion.div>
              </Link>
              <Link href="/demo">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 backdrop-blur-sm bg-white/50 dark:bg-neutral-900/50">
                    View Interactive Demo
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Dashboard Preview with 3D Tilt & Glow */}
            <div className="perspective-1000 relative mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, rotateX: 20, y: 100 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 100, damping: 20 }}
              >
                <div className="relative z-10 transform-style-3d rotate-y-12 rotate-x-12 scale-90 md:scale-100 transition-transform duration-700 hover:rotate-y-0 hover:rotate-x-0">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                    
                    {/* Floating 3D Elements */}
                    <motion.div 
                      animate={{ y: [-20, 20, -20], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl z-20 shadow-xl border border-white/20 hidden lg:block"
                    />
                    <motion.div 
                      animate={{ y: [20, -20, 20], rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full z-20 shadow-xl border border-white/20 hidden lg:block"
                    />
                    <motion.div 
                      animate={{ y: [-15, 15, -15], x: [-10, 10, -10] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                      className="absolute top-1/2 -right-16 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg z-20 shadow-xl border border-white/20 hidden lg:block rotate-45"
                    />

                    <div className="relative bg-neutral-950 rounded-[2rem] border border-neutral-800 shadow-2xl overflow-hidden aspect-[16/10] ring-1 ring-white/10">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        </div>
                        <div className="flex-1 text-center text-xs text-neutral-500 font-mono">onyx.app/dashboard</div>
                      </div>
                      <div className="aspect-[16/10] bg-neutral-950 relative overflow-hidden">
                    {/* Realistic Dashboard UI Representation */}
                    <div className="absolute inset-0 flex bg-neutral-950">
                      {/* Sidebar */}
                      <div className="w-64 bg-neutral-900 border-r border-neutral-800 p-4 flex flex-col gap-2 hidden md:flex">
                        <div className="flex items-center gap-3 px-2 mb-6">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                            <div className="w-5 h-5 bg-white/20 rounded-sm" />
                          </div>
                          <span className="text-white font-bold text-lg tracking-tight">Onyx</span>
                        </div>
                        <div className="space-y-1">
                          {[
                            { name: 'Dashboard', active: true, icon: <div className="w-4 h-4 border-2 border-current rounded-sm" /> },
                            { name: 'Tasks', active: false, icon: <div className="w-4 h-4 border-2 border-current rounded-sm" /> },
                            { name: 'Habits', active: false, icon: <div className="w-4 h-4 border-2 border-current rounded-full" />, badge: 'NEW' },
                            { name: 'Zen Mode', active: false, icon: <div className="w-4 h-4 border-2 border-current rounded-sm" />, badge: 'NEW' },
                            { name: 'Calendar', active: false, icon: <div className="w-4 h-4 border-2 border-current rounded-sm" /> },
                            { name: 'Notes', active: false, icon: <div className="w-4 h-4 border-2 border-current rounded-sm" /> },
                            { name: 'Expenses', active: false, icon: <div className="w-4 h-4 border-2 border-current rounded-sm" /> },
                          ].map((item) => (
                            <div key={item.name} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${item.active ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:bg-neutral-800/50'}`}>
                              {item.icon}
                              <span className="flex-1">{item.name}</span>
                              {item.badge && (
                                <span className="text-[9px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-auto pt-4 border-t border-neutral-800 space-y-1">
                          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:bg-neutral-800/50">
                            <div className="w-4 h-4 border-2 border-current rounded-sm" />
                            Settings
                          </div>
                          <div className="flex items-center gap-3 px-2 mt-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
                            <div className="text-xs">
                              <div className="text-white font-medium">Alex Morgan</div>
                              <div className="text-neutral-500">Pro Plan</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 flex flex-col min-w-0 bg-neutral-950">
                        {/* Header */}
                        <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <h2 className="text-white font-semibold">Dashboard</h2>
                            <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-neutral-500">
                              <kbd className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-neutral-400">⌘K</kbd>
                              <span>shortcuts</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-64 h-9 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center px-3 text-neutral-500 text-xs">Search...</div>
                            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700" />
                            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700" />
                          </div>
                        </div>

                        {/* Dashboard Grid - Matching Actual Dashboard */}
                        <div className="p-6 grid grid-cols-12 gap-6 overflow-hidden h-full">
                          
                          {/* Welcome & Productivity Banner - Large Block (Col 8) */}
                          <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                            <div className="flex justify-between items-start relative z-10">
                              <div>
                                <h1 className="text-3xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Hello, Alex</h1>
                                <p className="text-neutral-500 text-sm font-medium">Friday, November 22</p>
                              </div>
                              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-right">
                                <div className="text-xs text-neutral-500 font-medium mb-1">Productivity Score</div>
                                <div className="text-3xl font-black text-blue-500">87</div>
                                <div className="text-[10px] text-green-500 font-bold bg-green-500/10 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
                                  <TrendingUp className="w-2 h-2" /> +12%
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-3 mt-6">
                              {[
                                { label: "Tasks", value: "12/15", bar: 80 },
                                { label: "Focus", value: "6h 42m", sub: "↑ 12%" },
                                { label: "Streak", value: "12 Days", dots: 5 },
                                { label: "Budget", value: "$1,750", sub: "Spent" }
                              ].map((stat, i) => (
                                <div key={i} className="bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                                  <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                                  <div className="text-lg font-bold text-neutral-900 dark:text-white">{stat.value}</div>
                                  {stat.bar && (
                                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1 rounded-full mt-2">
                                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${stat.bar}%` }} />
                                    </div>
                                  )}
                                  {stat.sub && <div className="text-[10px] text-green-500 mt-1 font-medium">{stat.sub}</div>}
                                  {stat.dots && (
                                    <div className="flex gap-0.5 mt-2">
                                      {[...Array(stat.dots)].map((_, j) => <div key={j} className="w-full h-1 rounded-full bg-blue-500/40" />)}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Quick Actions & Stats (Col 4) */}
                          <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-3">
                            <div className="col-span-2 bg-blue-600 rounded-3xl p-5 text-white flex flex-col justify-between shadow-lg shadow-blue-900/20">
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-2">
                                <Plus className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-bold text-lg">New Task</div>
                                <div className="text-blue-100 text-xs">Create a new item</div>
                              </div>
                            </div>
                            {[
                              { label: "Pending", value: "5", icon: <TrendingUp className="w-3 h-3" /> },
                              { label: "Active", value: "3h 20m", icon: <Clock className="w-3 h-3" /> }
                            ].map((stat, i) => (
                              <div key={i} className="bg-white dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-xs text-neutral-500 font-medium">{stat.label}</span>
                                  <div className="text-neutral-400">{stat.icon}</div>
                                </div>
                                <div className="text-xl font-bold text-neutral-900 dark:text-white">{stat.value}</div>
                              </div>
                            ))}
                          </div>

                          {/* Weekly Activity Chart (Col 8) */}
                          <div className="col-span-12 lg:col-span-8 bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Weekly Activity</h3>
                              <div className="text-xs text-neutral-500">This Week</div>
                            </div>
                            <div className="h-32 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activityData}>
                                  <defs>
                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                                  />
                                  <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Expense Breakdown (Col 4) */}
                          <div className="col-span-12 lg:col-span-4 bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="font-bold text-sm text-neutral-900 dark:text-white mb-4">Expenses</h3>
                            <div className="relative w-32 h-32 mx-auto mb-4">
                              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="0" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="100" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#64748b" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="200" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-lg font-bold text-neutral-900 dark:text-white">$1.7k</span>
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              {[
                                { label: "Food", val: "$450", color: "bg-blue-500" },
                                { label: "Transport", val: "$280", color: "bg-slate-800" },
                              ].map((item, i) => (
                                <div key={i} className="flex justify-between text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                                    <span className="text-neutral-500">{item.label}</span>
                                  </div>
                                  <span className="font-medium text-neutral-900 dark:text-white">{item.val}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Social Proof Strip - Clean & Simple */}
          <div className="mt-24 py-16 border-y border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
            <div className="container mx-auto px-4">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-12"
              >
                Trusted by productive teams at
              </motion.p>
              
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
                {['Acme Corp', 'Global Tech', 'Nebula', 'Vertex', 'Horizon'].map((brand, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
                      <span className="text-white dark:text-neutral-900 font-bold text-sm">
                        {brand.charAt(0)}
                      </span>
                    </div>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {brand}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Floating Stats Section */}
        <section className="py-16 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Users className="w-8 h-8" />, value: "10,000+", label: "Active Users" },
                { icon: <TrendingUp className="w-8 h-8" />, value: "99.9%", label: "Uptime" },
                { icon: <Star className="w-8 h-8" />, value: "4.9/5", label: "User Rating" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-neutral-600 dark:text-neutral-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Bento Grid */}
        <section id="features" className="py-32 bg-neutral-50 dark:bg-neutral-900/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Everything you need. <br/> <span className="text-neutral-500">Nothing you don't.</span></h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-400">
                A suite of powerful tools designed to work together seamlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {/* Card 1: Task Management (Large) */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="md:col-span-2 bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden relative group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Check className="w-32 h-32" />
                </div>
                <div className="relative z-10">

                  <h3 className="text-2xl font-bold mb-2">Task Master</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
                    Organize your life with powerful Kanban boards. Drag, drop, and get things done with satisfying animations.
                  </p>
                  
                  {/* Mini Kanban Board Visualization */}
                  <div className="bg-neutral-50 dark:bg-neutral-950 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800 flex gap-4 overflow-hidden">
                    {['To Do', 'In Progress', 'Done'].map((col, i) => (
                      <div key={i} className="flex-1 min-w-[120px]">
                        <div className="text-xs font-semibold text-neutral-500 mb-3 uppercase tracking-wider">{col}</div>
                        <div className="space-y-2">
                          {[1, 2].map((card) => (
                            <div key={card} className="bg-white dark:bg-neutral-900 p-3 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 text-xs">
                              <div className="h-2 w-16 bg-neutral-200 dark:bg-neutral-800 rounded mb-2" />
                              <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800/50 rounded" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Smart Notes (Tall) */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="md:row-span-2 bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden relative group"
              >
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl" />
                <div className="relative z-10 h-full flex flex-col">

                  <h3 className="text-2xl font-bold mb-2">Smart Notes</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                    Capture ideas instantly. Rich text, code blocks, and auto-saving.
                  </p>
                  <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
                    <SmartNotesAnimation />
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Analytics (Medium) */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden relative group"
              >
                <div className="relative z-10">

                  <h3 className="text-2xl font-bold mb-2">Live Insights</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Track where your time goes with detailed analytics.
                  </p>
                  <div className="flex items-end gap-1 h-16">
                    {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                      <div key={i} className="flex-1 bg-green-500/20 rounded-t-sm relative overflow-hidden group-hover:bg-green-500 transition-colors duration-500">
                        <div className="absolute bottom-0 left-0 right-0 bg-green-500" style={{ height: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Card 4: Calendar (Medium) */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden relative group"
              >
                <div className="relative z-10">

                  <h3 className="text-2xl font-bold mb-2">Calendar Sync</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Never miss a meeting. Syncs with Google Calendar.
                  </p>
                  <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <div className="bg-white dark:bg-neutral-900 p-2 rounded-lg text-center min-w-[50px] shadow-sm">
                      <div className="text-[10px] text-red-500 font-bold uppercase">Nov</div>
                      <div className="text-xl font-bold">22</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold">Team Sync</div>
                      <div className="text-xs text-neutral-500">10:00 AM • Zoom</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 5: Habit Tracking (NEW) */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-3xl p-8 border border-purple-200 dark:border-purple-900 shadow-sm overflow-hidden relative group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Star className="w-24 h-24 text-purple-500" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold mb-4">
                    <Sparkles className="w-3 h-3" />
                    NEW
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Habit Tracking</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Build better habits with streak tracking and visual progress calendars.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/50 dark:bg-neutral-900/50 p-4 rounded-xl border border-purple-200 dark:border-purple-900">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm font-medium">Morning Exercise</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-neutral-500">
                        <Activity className="w-3 h-3 text-orange-500" />
                        <span className="font-bold text-orange-500">12 day streak</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 6: Focus Mode (NEW) */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-3xl p-8 border border-blue-200 dark:border-blue-900 shadow-sm overflow-hidden relative group"
              >
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold mb-4">
                    <Zap className="w-3 h-3" />
                    POPULAR
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Zen Focus Mode</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
                    Pomodoro timer with ambient sounds. Block distractions and enter deep work sessions.
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="bg-white/50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-blue-200 dark:border-blue-900">
                      <div className="text-5xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">25:00</div>
                      <div className="text-xs text-neutral-500 mt-2">Focus Session</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {['Pink Noise', 'Brown Noise', 'White Noise'].map((sound, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                          <span className="text-neutral-600 dark:text-neutral-400">{sound}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 7: Data Export (NEW) */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden relative group"
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Data Ownership</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    Export all your data anytime. Full backup in JSON format.
                  </p>
                  <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium">Your data, your control</span>
                    </div>
                    <div className="text-xs text-neutral-500 space-y-1">
                      <div>✓ Full data export</div>
                      <div>✓ Modular backups</div>
                      <div>✓ No vendor lock-in</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How it Works - Timeline Style */}
        <section id="how-it-works" className="py-24 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">How it Works</h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
                Get started in minutes. No complex setup required.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-800 z-0" />
              {[
                { icon: <Users className="w-6 h-6" />, title: "Create Account", desc: "Sign up securely with your email or Google account." },
                { icon: <Zap className="w-6 h-6" />, title: "Install Extension", desc: "Add our Chrome extension to track activity and capture content." },
                { icon: <Calendar className="w-6 h-6" />, title: "Connect Apps", desc: "Link your Google Calendar and start organizing your life." },
              ].map((step, i) => (
                <StepCard key={i} {...step} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Simple Pricing</h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
                Start free, upgrade when you need more power.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <PricingCard 
                name="Free"
                price="$0"
                description="Perfect for individuals getting started"
                features={[
                  "Up to 50 tasks",
                  "Basic calendar sync",
                  "5 notes",
                  "Activity tracking (7 days)",
                  "Community support"
                ]}
                cta="Get Started"
                popular={false}
              />
              <PricingCard 
                name="Pro"
                price="$4.99"
                description="For power users who need more"
                features={[
                  "Unlimited tasks",
                  "Advanced calendar features",
                  "Unlimited notes",
                  "Activity tracking (unlimited)",
                  "Priority support",
                  "Custom themes",
                  "Export data"
                ]}
                cta="Start Free Trial"
                popular={true}
              />
              <PricingCard 
                name="Team"
                price="$12.99"
                description="For teams and families"
                features={[
                  "Everything in Pro",
                  "Up to 5 members",
                  "Shared workspaces",
                  "Team analytics",
                  "Admin controls",
                  "Dedicated support"
                ]}
                cta="Contact Sales"
                popular={false}
              />
            </div>
          </div>
        </section>

        {/* Testimonials - Infinite Marquee */}
        <section className="py-32 bg-neutral-950 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white dark:from-neutral-950 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent z-10" />
          
          <div className="container mx-auto px-4 relative z-20 mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Loved by productive people</h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Join thousands of users who have streamlined their digital lives with Onyx.
            </p>
          </div>

          <div className="relative flex flex-col gap-8">
            {/* Row 1: Left to Right */}
            <div className="flex overflow-hidden">
              <motion.div 
                className="flex gap-6 pl-6"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              >
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-6">
                    {[
                      { quote: "Onyx has completely replaced Notion and Todoist for me. The web activity tracking is a game changer.", author: "Sarah Chen", role: "Product Designer", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
                      { quote: "Finally, a dashboard that actually looks good and works fast. The dark mode is stunning.", author: "Marcus Johnson", role: "Software Engineer", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
                      { quote: "I love how it integrates my expenses and tasks. It gives me a full picture of my life.", author: "Emily Davis", role: "Freelancer", avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d" },
                      { quote: "The best productivity app I've used in years. Simple yet powerful.", author: "David Wilson", role: "Entrepreneur", avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c" },
                    ].map((testimonial, j) => (
                      <div key={j} className="w-[400px] bg-neutral-900/50 backdrop-blur-md p-8 rounded-2xl border border-neutral-800 shrink-0">
                        <div className="flex gap-1 mb-4 text-yellow-400">
                          {[...Array(5)].map((_, k) => <Star key={k} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-lg mb-6 leading-relaxed text-neutral-300">"{testimonial.quote}"</p>
                        <div className="flex items-center gap-4">
                          <img src={testimonial.avatar} alt={testimonial.author} className="w-10 h-10 rounded-full ring-2 ring-neutral-800" />
                          <div>
                            <div className="font-bold">{testimonial.author}</div>
                            <div className="text-sm text-neutral-500">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Row 2: Right to Left */}
            <div className="flex overflow-hidden">
              <motion.div 
                className="flex gap-6 pl-6"
                animate={{ x: [-1000, 0] }}
                transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
              >
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-6">
                    {[
                      { quote: "The Chrome extension is a lifesaver. I can finally see where my time goes.", author: "Jessica Lee", role: "Marketing Manager", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d" },
                      { quote: "Clean, minimal, and effective. Exactly what I needed to stay focused.", author: "Ryan Park", role: "Student", avatar: "https://i.pravatar.cc/150?u=a04258114e29026705d" },
                      { quote: "I recommend Onyx to all my clients. It helps them stay organized without the clutter.", author: "Sophie Martin", role: "Productivity Coach", avatar: "https://i.pravatar.cc/150?u=a04258114e29026709d" },
                      { quote: "The calendar sync works perfectly. No more double bookings.", author: "Chris Taylor", role: "Consultant", avatar: "https://i.pravatar.cc/150?u=a04258114e29026701d" },
                    ].map((testimonial, j) => (
                      <div key={j} className="w-[400px] bg-neutral-900/50 backdrop-blur-md p-8 rounded-2xl border border-neutral-800 shrink-0">
                        <div className="flex gap-1 mb-4 text-yellow-400">
                          {[...Array(5)].map((_, k) => <Star key={k} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-lg mb-6 leading-relaxed text-neutral-300">"{testimonial.quote}"</p>
                        <div className="flex items-center gap-4">
                          <img src={testimonial.avatar} alt={testimonial.author} className="w-10 h-10 rounded-full ring-2 ring-neutral-800" />
                          <div>
                            <div className="font-bold">{testimonial.author}</div>
                            <div className="text-sm text-neutral-500">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">FAQ</h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                Everything you need to know about Personal OS.
              </p>
            </motion.div>
            <div className="space-y-4">
              {[
                { q: "Is Personal OS really free?", a: "Yes! Our free plan includes all core features with reasonable limits. You can upgrade to Pro for unlimited access." },
                { q: "How does the Chrome extension work?", a: "The extension runs in the background and tracks which websites you visit and for how long. You can also manually capture screenshots. All data is stored securely in your account." },
                { q: "Can I export my data?", a: "Absolutely! We believe your data is yours. Pro users can export all their data in JSON format at any time." },
                { q: "Do you support mobile apps?", a: "Mobile apps are coming soon! For now, our web app is fully responsive and works great on mobile browsers." },
                { q: "How do you handle my privacy?", a: "We take privacy seriously. We encrypt all data, store minimal PII, and never sell your information. You can delete your account and all data at any time." },
              ].map((faq, i) => (
                <FaqItem key={i} question={faq.q} answer={faq.a} index={i} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="bg-neutral-900 dark:bg-white rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white dark:text-neutral-900 tracking-tight">
                  Ready to take control?
                </h2>
                <p className="text-xl text-neutral-400 dark:text-neutral-600 mb-12 max-w-2xl mx-auto">
                  Join thousands of users who are getting more done with less stress. Start your free trial today.
                </p>
                <Link href="/sign-up">
                  <Button size="lg" className="h-16 px-10 text-xl rounded-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all hover:scale-105">
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-neutral-900 dark:bg-white rounded flex items-center justify-center text-white dark:text-neutral-900 text-xs font-bold">
                  OS
                </div>
                <span className="font-bold text-lg">Personal OS</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Your entire life, one dashboard.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link href="#features" className="hover:text-neutral-900 dark:hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-neutral-900 dark:hover:text-white">Pricing</Link></li>
                <li><Link href="/roadmap" className="hover:text-neutral-900 dark:hover:text-white">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link href="/blog" className="hover:text-neutral-900 dark:hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-neutral-900 dark:hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white">Terms</Link></li>
                <li><Link href="/security" className="hover:text-neutral-900 dark:hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              © 2025 Personal OS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, index }: { icon: React.ReactNode, title: string, desc: string, index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="group perspective-1000"
    >
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all h-full bg-white dark:bg-neutral-900 relative overflow-hidden transform-style-3d">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-transparent dark:from-neutral-800 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="relative z-10 transform-style-3d group-hover:translate-z-10 transition-transform duration-200">
          <motion.div
            className="mb-4 w-12 h-12 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white group-hover:border-neutral-900 dark:group-hover:border-white transition-colors relative"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
              {index + 1}
            </div>
          </motion.div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 transform-style-3d group-hover:translate-z-10 transition-transform duration-200">
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StepCard({ icon, title, desc, index }: { icon: React.ReactNode, title: string, desc: string, index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="group perspective-1000"
    >
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all h-full bg-white dark:bg-neutral-900 relative overflow-hidden transform-style-3d">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-transparent dark:from-neutral-800 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="relative z-10 transform-style-3d group-hover:translate-z-10 transition-transform duration-200">
          <motion.div
            className="mb-4 w-12 h-12 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white group-hover:border-neutral-900 dark:group-hover:border-white transition-colors relative"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
              {index + 1}
            </div>
          </motion.div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 transform-style-3d group-hover:translate-z-10 transition-transform duration-200">
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SmartNotesAnimation() {
  const [lines, setLines] = useState<string[]>([]);
  const fullLines = [
    "# Project Ideas",
    "",
    "- Build a better dashboard",
    "",
    "- Integrate AI features"
  ];

  useEffect(() => {
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let currentText = "";
    
    // Reset state on mount
    setLines([""]);

    const interval = setInterval(() => {
      if (currentLineIndex >= fullLines.length) {
        clearInterval(interval);
        return;
      }

      const targetLine = fullLines[currentLineIndex];
      
      if (currentCharIndex < targetLine.length) {
        currentText += targetLine[currentCharIndex];
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = currentText;
          return newLines;
        });
        currentCharIndex++;
      } else {
        currentLineIndex++;
        currentCharIndex = 0;
        currentText = "";
        if (currentLineIndex < fullLines.length) {
           setLines(prev => [...prev, ""]);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
      {lines.map((line, i) => (
        <div key={i} className="min-h-[1.5em] flex">
          <span>{line}</span>
          {i === lines.length - 1 && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-blue-500 ml-1 align-middle"
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PricingCard({ name, price, description, features, cta, popular }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative perspective-1000"
    >
      {popular && (
        <motion.div 
          className="absolute -top-4 left-0 right-0 flex justify-center z-20"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
            Most Popular
          </span>
        </motion.div>
      )}
      <Card className={`h-full ${popular ? 'border-neutral-900 dark:border-white border-2 shadow-lg' : 'border-neutral-200 dark:border-neutral-800'} bg-white dark:bg-neutral-900 transform-style-3d`}>
        <CardHeader className="transform-style-3d group-hover:translate-z-10">
          <CardTitle className="text-2xl">{name}</CardTitle>
          <CardDescription className="text-neutral-600 dark:text-neutral-400">{description}</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">{price}</span>
            {price !== "$0" && <span className="text-neutral-600 dark:text-neutral-400">/month</span>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 transform-style-3d group-hover:translate-z-10">
          <ul className="space-y-3">
            {features.map((feature: string, i: number) => (
              <motion.li 
                key={i} 
                className="flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Check className="w-5 h-5 text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">{feature}</span>
              </motion.li>
            ))}
          </ul>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className={`w-full ${popular ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : ''}`} variant={popular ? "default" : "outline"}>
              {cta}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, role, index }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="perspective-1000"
    >
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-shadow h-full bg-white dark:bg-neutral-900 transform-style-3d">
        <CardContent className="pt-6 transform-style-3d group-hover:translate-z-10">
          <div className="flex gap-1 mb-4 text-neutral-900 dark:text-white">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + (i * 0.1) }}
              >
                <Star className="w-4 h-4 fill-current" />
              </motion.div>
            ))}
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">"{quote}"</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center font-semibold text-sm">
              {author.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <div className="font-semibold">{author}</div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">{role}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FaqItem({ question, answer, index, isOpen, onClick }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 5 }}
    >
      <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-neutral-900" onClick={onClick}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-semibold">{question}</CardTitle>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </CardHeader>
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <CardContent>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{answer}</p>
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  );
}


