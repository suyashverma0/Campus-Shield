import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      icon: Icon,
      type = "text",
      className = "",
      containerClassName = "",
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-xs font-extrabold uppercase tracking-wider text-ink flex items-center justify-between">
            <span>
              {label} {required && <span className="text-status-lost">*</span>}
            </span>
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 pointer-events-none text-ink-3">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`w-full rounded-xl border-2 border-ink bg-paper-2 py-2.5 text-sm font-semibold text-ink placeholder:text-ink-muted focus:outline-none focus:ring-0 focus:shadow-hard transition-all duration-150 ${
              Icon ? "pl-10 pr-4" : "px-4"
            } ${error ? "border-status-lost bg-status-lost-wash/20" : ""} ${className}`}
            {...props}
          />
        </div>
        {hint && !error && <span className="text-[11px] text-ink-3 font-medium">{hint}</span>}
        {error && <span className="text-xs font-bold text-status-lost">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
