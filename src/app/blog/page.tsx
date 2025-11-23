"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogPage() {
  const blogPosts = [
    {
      title: "Introducing Onyx: Your Personal Operating System",
      excerpt: "Discover how Onyx helps you manage your digital life with powerful productivity tools, web tracking, and expense management.",
      author: "Alex Johnson",
      date: "Nov 20, 2024",
      readTime: "5 min read",
      category: "Product"
    },
    {
      title: "10 Productivity Hacks to Boost Your Workflow",
      excerpt: "Learn proven strategies to maximize your productivity and get more done in less time using Onyx's powerful features.",
      author: "Sarah Chen",
      date: "Nov 15, 2024",
      readTime: "7 min read",
      category: "Productivity"
    },
    {
      title: "How We Built Onyx: A Technical Deep Dive",
      excerpt: "Explore the technology stack and architecture decisions behind Onyx, from Next.js to real-time data synchronization.",
      author: "Mike Rodriguez",
      date: "Nov 10, 2024",
      readTime: "10 min read",
      category: "Engineering"
    },
    {
      title: "Privacy-First Productivity: Our Commitment to Your Data",
      excerpt: "Learn about our security practices and how we protect your personal information while providing powerful productivity insights.",
      author: "Emma Davis",
      date: "Nov 5, 2024",
      readTime: "6 min read",
      category: "Security"
    },
    {
      title: "The Future of Personal Productivity Tools",
      excerpt: "Our vision for the next generation of productivity software and how AI will transform the way we work.",
      author: "Alex Johnson",
      date: "Oct 28, 2024",
      readTime: "8 min read",
      category: "Vision"
    },
    {
      title: "Managing Remote Work with Onyx",
      excerpt: "Tips and best practices for staying productive while working remotely using Onyx's suite of tools.",
      author: "Sarah Chen",
      date: "Oct 20, 2024",
      readTime: "5 min read",
      category: "Remote Work"
    }
  ];

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Onyx Blog</h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Insights, updates, and stories from the Onyx team
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:shadow-lg transition-all">
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20" />
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        {post.category}
                      </span>
                      <span className="text-xs text-neutral-500">{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">{post.author}</div>
                          <div className="text-xs text-neutral-500">{post.date}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
