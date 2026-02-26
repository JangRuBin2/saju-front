"use client";

interface GoldFrameProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GoldFrame({ children, size = "md", className = "" }: GoldFrameProps) {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-full border border-gold-500/40 bg-gradient-to-br from-midnight-800 to-midnight-700 shadow-gold ${sizes[size]} ${className}`}
    >
      <div className="absolute inset-0 rounded-full border border-gold-400/20" />
      {children}
    </div>
  );
}
