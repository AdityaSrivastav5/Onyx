"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Server, Key, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "End-to-End Encryption",
      description: "All your data is encrypted in transit and at rest using industry-standard AES-256 encryption."
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: "Secure Authentication",
      description: "We use Clerk for enterprise-grade authentication with support for 2FA and SSO."
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Secure Infrastructure",
      description: "Our servers are hosted on secure, compliant infrastructure with regular security audits."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Privacy by Design",
      description: "We collect only the data necessary to provide our services and never sell your information."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Regular Security Updates",
      description: "We continuously monitor and update our systems to protect against emerging threats."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Compliance",
      description: "We adhere to GDPR, CCPA, and other data protection regulations."
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/20 mb-6">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Security at Onyx</h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Your data security and privacy are our top priorities. Learn how we protect your information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>Data Protection Practices</h2>
            <p>
              We implement multiple layers of security to ensure your data remains safe and private:
            </p>
            <ul>
              <li><strong>Encryption:</strong> All data is encrypted both in transit (TLS 1.3) and at rest (AES-256)</li>
              <li><strong>Access Control:</strong> Strict role-based access controls limit who can access your data</li>
              <li><strong>Monitoring:</strong> 24/7 security monitoring and automated threat detection</li>
              <li><strong>Backups:</strong> Regular encrypted backups to prevent data loss</li>
              <li><strong>Audits:</strong> Regular third-party security audits and penetration testing</li>
            </ul>

            <h2>Reporting Security Issues</h2>
            <p>
              If you discover a security vulnerability, please report it to us immediately at{" "}
              <a href="mailto:security@onyx.app">security@onyx.app</a>. We take all reports seriously and will respond promptly.
            </p>

            <h2>Questions?</h2>
            <p>
              For more information about our security practices, contact us at{" "}
              <a href="mailto:security@onyx.app">security@onyx.app</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
