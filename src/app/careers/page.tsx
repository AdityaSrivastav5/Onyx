"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CareersPage() {
  const openings = [
    {
      title: "Senior Full Stack Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build the future of productivity tools with Next.js, Node.js, and modern web technologies."
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create beautiful, intuitive interfaces that help millions of users stay productive."
    },
    {
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Remote",
      type: "Full-time",
      description: "Scale our infrastructure and ensure 99.9% uptime for our growing user base."
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Remote / Hybrid",
      type: "Full-time",
      description: "Drive growth and tell the Onyx story to productivity enthusiasts worldwide."
    },
    {
      title: "Customer Success Lead",
      department: "Support",
      location: "Remote",
      type: "Full-time",
      description: "Help our users get the most out of Onyx and build lasting relationships."
    }
  ];

  const benefits = [
    "🏠 Remote-first culture",
    "💰 Competitive salary & equity",
    "🏥 Health, dental & vision insurance",
    "🌴 Unlimited PTO",
    "📚 Learning & development budget",
    "💻 Latest tech & equipment",
    "🌍 Annual team retreats",
    "🎯 Flexible working hours"
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
              Help us build the future of personal productivity
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Remote</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join Onyx?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
              >
                <span className="text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-12">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-3 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {job.description}
                    </p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Don't see a perfect fit?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            We're always looking for talented people. Send us your resume and tell us why you'd be a great addition to the team.
          </p>
          <Button size="lg" className="rounded-full">
            Send Us Your Resume
          </Button>
        </div>
      </section>
    </div>
  );
}
