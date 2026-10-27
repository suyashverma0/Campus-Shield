import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Search lost or found items (e.g. MacBook, Wallet, Keys)...",
  className = ""
}) {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-4 w-5 h-5 text-ink-3 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border-2 border-ink bg-paper-2 py-3.5 pl-12 pr-11 text-sm font-bold text-ink shadow-hard placeholder:text-ink-3/70 placeholder:font-normal focus:outline-none focus:shadow-hard-md transition-all duration-150"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            if (onClear) onClear();
            else onChange("");
          }}
          className="absolute right-3.5 p-1 rounded-lg text-ink-3 hover:text-ink hover:bg-paper-3 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
