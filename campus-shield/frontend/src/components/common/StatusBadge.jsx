import React from "react";
import { AlertCircle, CheckCircle2, Sparkles, Check, Clock } from "lucide-react";

export default function StatusBadge({ status, type, size = "md" }) {
  // If type is explicitly passed ('lost' or 'found')
  if (type === "lost") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-status-lost px-3 py-0.5 text-xs font-black uppercase tracking-wider text-white shadow-hard-sm">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        Lost
      </span>
    );
  }

  if (type === "found") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-accent px-3 py-0.5 text-xs font-black uppercase tracking-wider text-white shadow-hard-sm">
        <span className="w-2 h-2 rounded-full bg-pop" />
        Found
      </span>
    );
  }

  // Based on status string
  const configs = {
    active: {
      bg: "bg-pop",
      text: "text-ink",
      label: "Active Report",
      icon: <Clock className="w-3 h-3" />
    },
    matched: {
      bg: "bg-status-matched",
      text: "text-white",
      label: "AI Matched",
      icon: <Sparkles className="w-3 h-3" />
    },
    verified: {
      bg: "bg-accent",
      text: "text-white",
      label: "Verified Match",
      icon: <CheckCircle2 className="w-3 h-3" />
    },
    reunited: {
      bg: "bg-emerald-600",
      text: "text-white",
      label: "Reunited",
      icon: <Check className="w-3 h-3" />
    },
    resolved: {
      bg: "bg-paper-3",
      text: "text-ink-2",
      label: "Resolved",
      icon: <Check className="w-3 h-3" />
    },
    pending: {
      bg: "bg-status-pending-wash",
      text: "text-ink",
      label: "Pending Review",
      icon: <Clock className="w-3 h-3" />
    }
  };

  const current = configs[status] || configs.active;
  const paddingClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink ${current.bg} ${current.text} ${paddingClass} font-black uppercase tracking-wide shadow-hard-sm`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
}
