"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface GoldInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const GoldInput = forwardRef<HTMLInputElement, GoldInputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm text-gold-400 font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg border border-gold-600/30 bg-midnight-800/80 px-4 py-2.5 text-gold-100 placeholder:text-gold-700 focus:border-gold-500/60 focus:outline-none focus:ring-1 focus:ring-gold-500/30 transition-colors ${
            error ? "border-red-500/60" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

GoldInput.displayName = "GoldInput";
