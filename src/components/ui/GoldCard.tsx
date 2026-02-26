"use client";

import { HTMLAttributes, forwardRef } from "react";

interface GoldCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "highlight";
}

export const GoldCard = forwardRef<HTMLDivElement, GoldCardProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    const variants = {
      default: "border-gold-600/20 bg-midnight-800/60",
      interactive:
        "border-gold-600/20 bg-midnight-800/60 hover:border-gold-500/40 hover:bg-midnight-800/80 cursor-pointer transition-all duration-300",
      highlight:
        "border-gold-500/40 bg-gradient-to-br from-midnight-800/80 to-midnight-700/60 shadow-gold",
    };

    return (
      <div
        ref={ref}
        className={`rounded-xl border p-5 backdrop-blur-sm ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GoldCard.displayName = "GoldCard";
