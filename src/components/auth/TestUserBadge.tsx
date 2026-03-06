"use client";

import { User } from "lucide-react";

export function TestUserBadge() {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/50 bg-amber-900/30 px-3 py-1.5 text-xs text-amber-400">
      <User size={14} strokeWidth={1.5} />
      <span>Test Mode</span>
    </div>
  );
}
