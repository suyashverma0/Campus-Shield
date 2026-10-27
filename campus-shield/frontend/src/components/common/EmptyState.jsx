import React from "react";
import { ShieldCheck, SearchX } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  title = "No Items Found",
  description = "No lost or found items match your current search query or active filters.",
  actionText,
  onAction,
  icon: CustomIcon
}) {
  const Icon = CustomIcon || SearchX;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-3xl border-2 border-dashed border-ink/40 bg-paper-2/60 my-6">
      <div className="w-16 h-16 rounded-2xl border-2 border-ink bg-paper-3 flex items-center justify-center mb-4 shadow-hard">
        <Icon className="w-8 h-8 text-ink-2" />
      </div>
      <h3 className="font-heavy text-xl font-extrabold text-ink">{title}</h3>
      <p className="max-w-md text-sm text-ink-2 mt-2 font-medium leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <div className="mt-6">
          <Button variant="accent" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
