"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
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

      {/* Content */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Last updated: November 22, 2024
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>Introduction</h2>
            <p>
              At Onyx, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our personal operating system platform.
            </p>

            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Name and email address</li>
              <li>Account credentials</li>
              <li>Profile information</li>
              <li>Communication preferences</li>
            </ul>

            <h3>Usage Data</h3>
            <p>We automatically collect certain information when you use Onyx:</p>
            <ul>
              <li>Browser activity and web tracking data (via Chrome extension)</li>
              <li>Task and productivity metrics</li>
              <li>Device information and IP address</li>
              <li>Usage patterns and feature interactions</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Track your productivity and web activity</li>
              <li>Send you updates and notifications</li>
              <li>Respond to your requests and support needs</li>
              <li>Analyze usage patterns to enhance user experience</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>

            <h2>Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul>
              <li><strong>Clerk:</strong> For authentication and user management</li>
              <li><strong>Chrome Extension API:</strong> For activity tracking</li>
            </ul>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of certain data collection</li>
              <li>Export your data</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@onyx.app">privacy@onyx.app</a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
