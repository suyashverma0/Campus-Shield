import React from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Sparkles,
  FileText,
  Award,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/common/Button";
import StatusBadge from "../components/common/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../context/ItemContext";
import { formatDate } from "../utils/helpers";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { myItems, myMatches, items } = useItems();

  const activeMyItems = myItems.filter((i) => i.status !== "resolved");
  const resolvedMyItems = myItems.filter((i) => i.status === "resolved");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar */}
        <Sidebar className="hidden lg:flex" />

        {/* Main Dashboard Content */}
        <div className="flex-1 w-full flex flex-col gap-8">
          {/* Top Welcome Banner */}
          <div className="p-8 rounded-3xl border-2 border-ink bg-paper-2 shadow-hard flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-16 h-16 rounded-2xl border-2 border-ink object-cover shadow-hard-sm"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-ink bg-pop text-ink">
                    {currentUser?.role}
                  </span>
                  <span className="text-xs font-bold text-ink-3">ID: {currentUser?.studentId}</span>
                </div>
                <h1 className="font-heavy text-2xl sm:text-3xl font-black text-ink">
                  Welcome back, {currentUser?.name?.split(" ")[0]}!
                </h1>
                <p className="text-xs font-semibold text-ink-2 mt-0.5">
                  {currentUser?.department} · University Active Member
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/report-lost">
                <Button variant="danger" size="md" icon={PlusCircle}>
                  Report Lost
                </Button>
              </Link>
              <Link to="/report-found">
                <Button variant="accent" size="md" icon={PlusCircle}>
                  Log Found
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border-2 border-ink bg-paper-2 shadow-hard">
              <span className="text-[10px] font-black uppercase text-ink-3 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-ink" />
                My Active Reports
              </span>
              <p className="font-heavy text-2xl sm:text-3xl font-black text-ink mt-2">
                {activeMyItems.length}
              </p>
              <p className="text-[11px] font-bold text-ink-3 mt-1">Pending recovery</p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-ink bg-pop-wash shadow-hard">
              <span className="text-[10px] font-black uppercase text-ink flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-ink" />
                AI Matched Pairs
              </span>
              <p className="font-heavy text-2xl sm:text-3xl font-black text-ink mt-2">
                {myMatches.length}
              </p>
              <p className="text-[11px] font-bold text-ink-2 mt-1">Ready for verification</p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-ink bg-accent-wash shadow-hard">
              <span className="text-[10px] font-black uppercase text-accent flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                Reunited Items
              </span>
              <p className="font-heavy text-2xl sm:text-3xl font-black text-accent mt-2">
                {resolvedMyItems.length + 1}
              </p>
              <p className="text-[11px] font-bold text-ink-2 mt-1">Successful returns</p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-ink bg-paper-2 shadow-hard">
              <span className="text-[10px] font-black uppercase text-ink flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-pop-dark" />
                Shield Karma
              </span>
              <p className="font-heavy text-2xl sm:text-3xl font-black text-pop-dark mt-2">
                {currentUser?.karmaPoints}
              </p>
              <p className="text-[11px] font-bold text-ink-3 mt-1">Community score</p>
            </div>
          </div>

          {/* AI Matches Callout Card */}
          {myMatches.length > 0 && (
            <div className="p-6 rounded-3xl border-2 border-ink bg-pop-wash shadow-hard flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl border-2 border-ink bg-pop flex items-center justify-center shadow-hard-sm shrink-0">
                  <Sparkles className="w-6 h-6 text-ink animate-bounce-subtle" />
                </div>
                <div>
                  <h3 className="font-heavy text-base font-black text-ink">
                    You have {myMatches.length} Pending AI Matches
                  </h3>
                  <p className="text-xs font-bold text-ink-2 mt-0.5">
                    Found turn-ins have been paired with your report. Review and claim now.
                  </p>
                </div>
              </div>
              <Link to="/my-matches">
                <Button variant="dark" size="sm" icon={ArrowRight} iconPosition="right">
                  Inspect Matches
                </Button>
              </Link>
            </div>
          )}

          {/* My Active Listings */}
          <div className="p-6 rounded-3xl border-2 border-ink bg-paper-2 shadow-hard">
            <div className="flex items-center justify-between border-b-2 border-paper-3 pb-4 mb-4">
              <div>
                <h3 className="font-heavy text-lg font-black text-ink">My Reported Gear</h3>
                <p className="text-xs font-bold text-ink-3">Items you have reported lost or found</p>
              </div>
              <Link to="/my-reports" className="text-xs font-black uppercase text-accent hover:underline">
                View All
              </Link>
            </div>

            {myItems.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs font-bold text-ink-2">You haven't reported any items yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {myItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-3.5 rounded-2xl border-2 border-ink bg-paper hover:bg-paper-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300"}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl border border-ink object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge type={item.type} size="sm" />
                          <span className="text-[10px] font-bold text-ink-3">{formatDate(item.date)}</span>
                        </div>
                        <h4 className="text-xs font-black text-ink truncate">{item.title}</h4>
                      </div>
                    </div>

                    <Link to={`/item/${item.id}`} className="shrink-0">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
