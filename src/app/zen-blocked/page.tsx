"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ZenBlockedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white p-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="max-w-md space-y-8"
      >
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight">Focus Mode Active</h1>
        <p className="text-xl text-neutral-400">
          This site is blocked while you are in Zen Mode. Get back to your goals!
        </p>

        <div className="pt-8">
          <Link href="/dashboard/zen">
            <Button size="lg" className="bg-white text-black hover:bg-neutral-200 rounded-full px-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Zen Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
