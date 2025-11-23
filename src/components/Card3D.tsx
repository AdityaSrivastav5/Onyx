"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Card3D({ children, className = "", delay = 0 }: Card3DProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -5,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.2 }
      }}
      className={`transform-gpu perspective-1000 ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div className="relative" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
