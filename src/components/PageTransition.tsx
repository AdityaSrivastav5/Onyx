"use client";

import { motion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, rotateX: -10, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="perspective-1000 transform-style-3d"
    >
      {children}
    </motion.div>
  );
}
