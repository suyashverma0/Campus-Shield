import React from "react";
import { Filter, RotateCcw, MapPin, Tag } from "lucide-react";
import { itemCategories, campusBuildings } from "../../utils/helpers";

export default function ItemFilters({ filters, onFilterChange, onReset }) {
  const isFiltered =
    filters.category !== "all" ||
    filters.location !== "all" ||
    filters.status !== "all" ||
    Boolean(filters.search);

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border-2 border-ink bg-paper-2 shadow-hard">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b-2 border-paper-3 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ink" />
          <span className="text-xs font-black uppercase tracking-wider text-ink">
            Filter Registry
          </span>
        </div>
        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-extrabold text-status-lost hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        )}
      </div>

      {/* Categories Horizontal Scrolling Pills */}
      <div>
        <label className="text-[11px] font-black uppercase tracking-wider text-ink-3 mb-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" />
          Categories
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => onFilterChange("category", "all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide border-2 border-ink transition-all shrink-0 cursor-pointer ${
              filters.category === "all"
                ? "bg-ink text-paper shadow-hard-sm -translate-y-0.5"
                : "bg-paper text-ink hover:bg-paper-3"
            }`}
          >
            All Categories
          </button>
          {itemCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onFilterChange("category", cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide border-2 border-ink transition-all shrink-0 cursor-pointer ${
                filters.category === cat
                  ? "bg-accent text-accent-fg shadow-hard-sm -translate-y-0.5"
                  : "bg-paper text-ink hover:bg-paper-3"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dropdown controls row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* Campus Location */}
        <div>
          <label className="text-[11px] font-black uppercase tracking-wider text-ink-3 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Campus Zone / Building
          </label>
          <select
            value={filters.location}
            onChange={(e) => onFilterChange("location", e.target.value)}
            className="w-full rounded-xl border-2 border-ink bg-paper py-2 px-3 text-xs font-bold text-ink focus:outline-none focus:shadow-hard-sm cursor-pointer"
          >
            <option value="all">Everywhere on Campus</option>
            {campusBuildings.map((building) => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-[11px] font-black uppercase tracking-wider text-ink-3 mb-1.5 block">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full rounded-xl border-2 border-ink bg-paper py-2 px-3 text-xs font-bold text-ink focus:outline-none focus:shadow-hard-sm cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (Unresolved)</option>
            <option value="matched">AI Matched</option>
            <option value="resolved">Reunited / Closed</option>
          </select>
        </div>
      </div>
    </div>
  );
}
