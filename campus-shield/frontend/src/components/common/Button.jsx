import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "accent", // "accent" | "pop" | "dark" | "outline" | "danger" | "ghost"
  size = "md", // "sm" | "md" | "lg"
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const baseClasses =
    "relative inline-flex items-center justify-center font-extrabold uppercase tracking-wide transition-all duration-150 select-none cursor-pointer border-2 border-ink disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none";

  const sizeClasses = {
    sm: "h-9 px-3.5 text-xs rounded-xl gap-1.5 shadow-hard-sm hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px]",
    md: "h-11 px-5 text-sm rounded-xl gap-2 shadow-hard hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]",
    lg: "h-14 px-7 text-base rounded-2xl gap-2.5 shadow-hard-md hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px]"
  }[size] || "h-11 px-5 text-sm rounded-xl gap-2";

  const variantClasses = {
    accent: "bg-accent text-accent-fg hover:bg-accent-hover hover:shadow-hard-md active:shadow-none",
    pop: "bg-pop text-ink hover:bg-pop-hover hover:shadow-hard-md active:shadow-none",
    dark: "bg-ink text-paper hover:bg-neutral-800 hover:shadow-hard-md active:shadow-none",
    outline: "bg-paper-2 text-ink hover:bg-paper-3 hover:shadow-hard-md active:shadow-none",
    danger: "bg-status-lost text-white hover:bg-red-600 hover:shadow-hard-md active:shadow-none",
    ghost: "bg-transparent border-transparent shadow-none hover:bg-paper-3 text-ink hover:border-ink hover:shadow-hard-sm"
  }[variant] || "bg-accent text-accent-fg";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!loading && Icon && iconPosition === "right" && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
}
