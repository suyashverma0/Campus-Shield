import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Trash2, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/common/Button";
import StatusBadge from "../components/common/StatusBadge";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useItems } from "../context/ItemContext";
import { formatDate } from "../utils/helpers";

export default function MyReports() {
  const { myItems, resolveItem, deleteItem, loading } = useItems();
  const [activeTab, setActiveTab] = useState("all"); // "all" | "lost" | "found"
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const filteredItems = myItems.filter((item) => {
    if (activeTab === "lost") return item.type === "lost";
    if (activeTab === "found") return item.type === "found";
    return true;
  });

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteItem(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Sidebar className="hidden lg:flex" />

        <div className="flex-1 w-full flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border-2 border-ink bg-paper-2 shadow-hard">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-pill bg-paper-3 text-ink">User Submissions</span>
              </div>
              <h1 className="font-heavy text-2xl sm:text-3xl font-black text-ink">
                My Reported Gear
              </h1>
              <p className="text-xs font-bold text-ink-3 mt-1">
                Manage, update, or mark your lost and found listings as reunited
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/report-lost">
                <Button variant="danger" size="sm" icon={PlusCircle}>
                  Report Lost
                </Button>
              </Link>
              <Link to="/report-found">
                <Button variant="accent" size="sm" icon={PlusCircle}>
                  Log Found
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl border-2 border-ink bg-paper shadow-hard-sm w-fit">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide border transition-all ${
                activeTab === "all"
                  ? "bg-ink text-paper border-ink shadow-hard-sm"
                  : "border-transparent text-ink-2 hover:text-ink"
              }`}
            >
              All ({myItems.length})
            </button>
            <button
              onClick={() => setActiveTab("lost")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide border transition-all ${
                activeTab === "lost"
                  ? "bg-status-lost text-white border-ink shadow-hard-sm"
                  : "border-transparent text-ink-2 hover:text-ink"
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => setActiveTab("found")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide border transition-all ${
                activeTab === "found"
                  ? "bg-accent text-accent-fg border-ink shadow-hard-sm"
                  : "border-transparent text-ink-2 hover:text-ink"
              }`}
            >
              Found
            </button>
          </div>

          {/* Listings */}
          {filteredItems.length === 0 ? (
            <EmptyState
              title="No Reports In This Category"
              description="You have no active or completed reports in this tab."
              icon={FileText}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border-2 border-ink bg-paper-2 shadow-hard hover:shadow-hard-md transition-all"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300"}
                      alt={item.title}
                      className="w-16 h-16 rounded-2xl border-2 border-ink object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <StatusBadge type={item.type} size="sm" />
                        {item.status === "resolved" && <StatusBadge status="resolved" size="sm" />}
                        <span className="text-[10px] font-bold text-ink-3">
                          Reported {formatDate(item.date)}
                        </span>
                      </div>
                      <h3 className="font-heavy text-base font-black text-ink truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs font-bold text-ink-3 mt-0.5 truncate">
                        {item.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-3 sm:pt-0 border-t-2 sm:border-t-0 border-paper-3">
                    <Link to={`/item/${item.id}`}>
                      <Button variant="outline" size="sm">
                        View Dossier
                      </Button>
                    </Link>

                    {item.status !== "resolved" && (
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => resolveItem(item.id, "Reunited with verified owner.")}
                      >
                        Mark Reunited
                      </Button>
                    )}

                    <button
                      onClick={() => setDeleteTargetId(item.id)}
                      className="p-2 rounded-xl border border-transparent text-ink-3 hover:text-status-lost hover:border-status-lost hover:bg-status-lost-wash/30 transition-colors cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Remove Item Listing?"
        message="This will permanently delete this report from the campus registry."
        confirmText="Delete Report"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
