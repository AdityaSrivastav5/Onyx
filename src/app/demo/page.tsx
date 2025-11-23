"use client";

import { InteractiveDemo } from "@/components/InteractiveDemo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
              <img src="/logo.png" alt="Onyx" className="w-5 h-5" />
            </div>
            Onyx
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-bold mb-6">
            ✨ Interactive Demo
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Try Onyx <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Live</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
            No signup required. Experience the power of Onyx by adding tasks, tracking habits, and managing expenses.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <InteractiveDemo />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-lg">
            Ready to unlock all features? Sign up for free and get started in seconds.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
          <p>© 2024 Onyx. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
