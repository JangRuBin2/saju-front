"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface GoldSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export const GoldSelect = forwardRef<HTMLSelectElement, GoldSelectProps>(
  ({ label, error, options, placeholder, className = "", id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm text-gold-400 font-medium">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full rounded-lg border border-gold-600/30 bg-midnight-800/80 px-4 py-2.5 text-gold-100 focus:border-gold-500/60 focus:outline-none focus:ring-1 focus:ring-gold-500/30 transition-colors appearance-none ${
            error ? "border-red-500/60" : ""
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" className="bg-midnight-800">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-midnight-800">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

GoldSelect.displayName = "GoldSelect";
