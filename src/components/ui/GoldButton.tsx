"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const GoldButton = forwardRef<HTMLButtonElement, GoldButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-gradient-to-r from-gold-600 to-gold-500 text-midnight-950 hover:from-gold-500 hover:to-gold-400 shadow-gold hover:shadow-gold-lg active:scale-[0.98]",
      secondary:
        "border border-gold-600/40 text-gold-400 hover:bg-gold-600/10 hover:border-gold-500/60",
      ghost: "text-gold-400 hover:bg-gold-600/10",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-7 py-3.5 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

GoldButton.displayName = "GoldButton";
