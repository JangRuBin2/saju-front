"use client";

import { motion } from "framer-motion";

interface LoadingBookProps {
  message?: string;
  description?: string;
}

export function LoadingBook({ message, description }: LoadingBookProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="relative w-20 h-24">
        {/* Book base */}
        <div className="absolute inset-0 rounded-sm bg-gradient-to-r from-gold-700 to-gold-600 shadow-gold" />
        {/* Page flip animation */}
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2 origin-left rounded-r-sm bg-gold-100"
          animate={{
            rotateY: [0, -180, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformStyle: "preserve-3d" }}
        />
        {/* Book spine */}
        <div className="absolute inset-y-1 left-1/2 w-px bg-gold-800/50" />
      </div>
      {message && (
        <p className="text-gold-300 text-base font-medium animate-pulse">
          {message}
        </p>
      )}
      {description && (
        <p className="text-gold-600 text-sm">{description}</p>
      )}
    </div>
  );
}
