import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be reversed.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md rounded-2xl border-2 border-ink bg-paper-2 p-6 shadow-hard-lg animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-xl border border-transparent hover:border-ink hover:bg-paper-3 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5 text-ink-2" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl border-2 border-ink bg-pop-wash flex items-center justify-center shrink-0 shadow-hard-sm">
            <AlertTriangle className="w-6 h-6 text-status-pending" />
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="font-heavy text-lg font-extrabold text-ink">{title}</h3>
            <p className="mt-2 text-sm text-ink-2 font-medium leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t-2 border-paper-3">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant={variant} size="sm" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
