"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Circle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function RoadmapPage() {
  const roadmapItems = [
    {
      quarter: "Q4 2024",
      status: "completed",
      items: [
        { title: "Core Dashboard", completed: true },
        { title: "Task Management", completed: true },
        { title: "Web Activity Tracking", completed: true },
        { title: "Expense Management", completed: true },
        { title: "Chrome Extension", completed: true },
        { title: "Dark Mode", completed: true }
      ]
    },
    {
      quarter: "Q1 2025",
      status: "in-progress",
      items: [
        { title: "AI-Powered Insights", completed: false },
        { title: "Calendar Integration", completed: false },
        { title: "Mobile Apps (iOS & Android)", completed: false },
        { title: "Team Collaboration Features", completed: false },
        { title: "Advanced Analytics Dashboard", completed: false }
      ]
    },
    {
      quarter: "Q2 2025",
      status: "planned",
      items: [
        { title: "API for Third-Party Integrations", completed: false },
        { title: "Zapier Integration", completed: false },
        { title: "Slack Integration", completed: false },
        { title: "Custom Workflows & Automation", completed: false },
        { title: "Voice Commands", completed: false }
      ]
    },
    {
      quarter: "Q3 2025",
      status: "planned",
      items: [
        { title: "AI Assistant", completed: false },
        { title: "Smart Scheduling", completed: false },
        { title: "Focus Mode with Pomodoro", completed: false },
        { title: "Habit Tracking", completed: false },
        { title: "Goal Setting & OKRs", completed: false }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium">Completed</span>;
      case "in-progress":
        return <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium">In Progress</span>;
      case "planned":
        return <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm font-medium">Planned</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
              <img src="/logo.png" alt="Onyx" className="w-5 h-5" />
            </div>
            Onyx
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Roadmap</h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              See what we're building and what's coming next for Onyx
            </p>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-12">
            {roadmapItems.map((quarter, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* Timeline connector */}
                {i < roadmapItems.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-800 -mb-12" />
                )}
                
                <div className="flex gap-6">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 mt-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      quarter.status === 'completed' 
                        ? 'bg-green-100 dark:bg-green-900/20' 
                        : quarter.status === 'in-progress'
                        ? 'bg-blue-100 dark:bg-blue-900/20'
                        : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}>
                      {quarter.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      ) : quarter.status === 'in-progress' ? (
                        <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Circle className="w-6 h-6 text-neutral-400" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-2xl font-bold">{quarter.quarter}</h2>
                      {getStatusBadge(quarter.status)}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      {quarter.items.map((item, j) => (
                        <div
                          key={j}
                          className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                        >
                          {item.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={item.completed ? 'text-neutral-600 dark:text-neutral-400' : ''}>
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback CTA */}
      <section className="py-20 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Have a Feature Request?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            We'd love to hear your ideas! Your feedback helps us prioritize what to build next.
          </p>
          <Button size="lg" className="rounded-full">
            Submit Feedback
          </Button>
        </div>
      </section>
    </div>
  );
}
