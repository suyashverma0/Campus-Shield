import React, { useState } from "react";
import { Sparkles, ShieldCheck, CheckCircle2, Filter } from "lucide-react";
import MatchCard from "../components/matches/MatchCard";
import MatchComparison from "../components/matches/MatchComparison";
import EmptyState from "../components/common/EmptyState";
import { useItems } from "../context/ItemContext";

export default function Matches() {
  const { matches, verifyMatch, confirmMatch, dismissMatch, loading } = useItems();
  const [activeTab, setActiveTab] = useState("all"); // "all" | "suggested" | "verified"
  const [selectedMatch, setSelectedMatch] = useState(null);

  const filteredMatches = matches.filter((m) => {
    if (activeTab === "suggested") return m.status === "suggested";
    if (activeTab === "verified") return m.status === "verified";
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 p-8 rounded-3xl border-2 border-ink bg-pop-wash shadow-hard">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ink bg-pop text-ink text-xs font-black uppercase mb-3 shadow-hard-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Automated Discovery</span>
          </div>
          <h1 className="font-heavy text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink">
            AI Match Registry
          </h1>
          <p className="text-sm font-bold text-ink-2 mt-2 max-w-xl leading-relaxed">
            Our multi-vector algorithm continuously compares Lost reports against Found turn-ins. Verify pairs to initiate safe student handovers.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl border-2 border-ink bg-paper shadow-hard-sm shrink-0">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide border transition-all ${
              activeTab === "all"
                ? "bg-ink text-paper border-ink shadow-hard-sm"
                : "border-transparent text-ink-2 hover:text-ink"
            }`}
          >
            All ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab("suggested")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide border transition-all ${
              activeTab === "suggested"
                ? "bg-pop text-ink border-ink shadow-hard-sm"
                : "border-transparent text-ink-2 hover:text-ink"
            }`}
          >
            Suggested
          </button>
          <button
            onClick={() => setActiveTab("verified")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide border transition-all ${
              activeTab === "verified"
                ? "bg-accent text-accent-fg border-ink shadow-hard-sm"
                : "border-transparent text-ink-2 hover:text-ink"
            }`}
          >
            Verified
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <EmptyState
          title="No Matches In This Filter"
          description="New reports are checked immediately upon submission. When a matching item is detected, it will appear here."
          icon={Sparkles}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onCompare={setSelectedMatch}
              onVerify={verifyMatch}
              onDismiss={dismissMatch}
            />
          ))}
        </div>
      )}

      {/* Comparison Modal */}
      {selectedMatch && (
        <MatchComparison
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onVerify={verifyMatch}
          onConfirm={confirmMatch}
        />
      )}
    </div>
  );
}
