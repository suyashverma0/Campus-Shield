import React from "react";
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  const { type, title, message } = toast;

  const config = {
    success: {
      bg: "bg-paper-2",
      border: "border-ink",
      icon: <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />,
      tagBg: "bg-accent text-accent-fg",
      tagText: "Success"
    },
    error: {
      bg: "bg-status-lost-wash",
      border: "border-ink",
      icon: <AlertCircle className="w-5 h-5 text-status-lost shrink-0" />,
      tagBg: "bg-status-lost text-white",
      tagText: "Alert"
    },
    match: {
      bg: "bg-pop-wash",
      border: "border-ink",
      icon: <Sparkles className="w-5 h-5 text-ink shrink-0 animate-bounce-subtle" />,
      tagBg: "bg-pop text-ink",
      tagText: "Match AI"
    },
    info: {
      bg: "bg-paper-2",
      border: "border-ink",
      icon: <Info className="w-5 h-5 text-ink-2 shrink-0" />,
      tagBg: "bg-ink text-paper",
      tagText: "Notice"
    }
  }[type] || {
    bg: "bg-paper-2",
    border: "border-ink",
    icon: <Info className="w-5 h-5 text-ink-2 shrink-0" />,
    tagBg: "bg-ink text-paper",
    tagText: "Notice"
  };

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border-2 ${config.border} ${config.bg} shadow-hard transition-all duration-200 animate-in slide-in-from-bottom-3`}
    >
      <div className="pt-0.5">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full border border-ink ${config.tagBg}`}>
            {config.tagText}
          </span>
          {title && <h4 className="font-heavy text-sm font-bold text-ink truncate">{title}</h4>}
        </div>
        {message && <p className="text-xs text-ink-2 font-medium leading-relaxed">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-ink-3 hover:text-ink hover:bg-paper-3 transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
