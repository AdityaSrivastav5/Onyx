"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Last updated: November 22, 2024
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using Onyx, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
            </p>

            <h2>Description of Service</h2>
            <p>
              Onyx is a personal operating system that helps you manage tasks, track productivity, monitor web activity, manage expenses, and organize your digital life.
            </p>

            <h2>User Accounts</h2>
            <h3>Account Creation</h3>
            <p>To use Onyx, you must:</p>
            <ul>
              <li>Create an account with accurate information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 13 years of age</li>
              <li>Comply with all applicable laws</li>
            </ul>

            <h3>Account Responsibilities</h3>
            <p>You are responsible for:</p>
            <ul>
              <li>All activities that occur under your account</li>
              <li>Maintaining the confidentiality of your password</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>

            <h2>Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Upload malicious code or viruses</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>

            <h2>Chrome Extension</h2>
            <p>
              Our Chrome extension tracks your web activity to provide productivity insights. By installing the extension, you consent to this tracking. You can uninstall the extension at any time.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are owned by Onyx and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2>User Content</h2>
            <p>
              You retain ownership of any content you submit to Onyx. By submitting content, you grant us a license to use, store, and display that content as necessary to provide the service.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice, for any reason, including breach of these Terms.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              Onyx shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
            </p>

            <h2>Contact Us</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a href="mailto:legal@onyx.app">legal@onyx.app</a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
