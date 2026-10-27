import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, PlusCircle } from "lucide-react";
import SearchBar from "../components/common/SearchBar";
import ItemFilters from "../components/items/ItemFilters";
import ItemGrid from "../components/items/ItemGrid";
import Button from "../components/common/Button";
import { useItems } from "../context/ItemContext";

export default function FoundItems() {
  const { foundItems, loading } = useItems();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    location: "all",
    status: "all"
  });

  const handleFilterChange = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setSearch("");
    setFilters({ category: "all", location: "all", status: "all" });
  };

  const filteredItems = foundItems.filter((item) => {
    if (filters.category !== "all" && item.category !== filters.category) return false;
    if (
      filters.location !== "all" &&
      !item.location.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false;
    if (filters.status !== "all" && item.status !== filters.status) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 p-8 rounded-3xl border-2 border-ink bg-status-found-wash/40 shadow-hard">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ink bg-accent text-accent-fg text-xs font-black uppercase mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Turned-In Gear</span>
          </div>
          <h1 className="font-heavy text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink">
            Found Items on Campus
          </h1>
          <p className="text-sm font-bold text-ink-2 mt-2 max-w-xl leading-relaxed">
            Good samaritans have turned these items in to security desks, department heads, and library staff. Recognize yours? Initiate a claim.
          </p>
        </div>

        <Link to="/report-found" className="shrink-0">
          <Button variant="accent" size="lg" icon={PlusCircle}>
            Log A Found Item
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-6 mb-8">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by keywords, color, custody location, library, hostel..."
        />

        <ItemFilters
          filters={{ ...filters, search }}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-black uppercase tracking-wider text-ink-3">
          Showing <span className="text-ink font-black">{filteredItems.length}</span> Found Items
        </span>
      </div>

      {/* Grid */}
      <ItemGrid
        items={filteredItems}
        loading={loading}
        emptyTitle="No Found Items Match Your Filter"
        emptyDescription="If you lost something recently, report it now so you're alerted as soon as it's turned in."
        emptyActionText="Reset Filters"
        onEmptyAction={handleReset}
      />
    </div>
  );
}
