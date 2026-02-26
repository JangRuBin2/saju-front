"use client";

interface GoldToggleProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function GoldToggle({
  options,
  value,
  onChange,
  className = "",
}: GoldToggleProps) {
  return (
    <div
      className={`inline-flex rounded-lg border border-gold-600/30 bg-midnight-800/60 p-0.5 ${className}`}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            value === opt.value
              ? "bg-gold-600/30 text-gold-300"
              : "text-gold-600 hover:text-gold-400"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
