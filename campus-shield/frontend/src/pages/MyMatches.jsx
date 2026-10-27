import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import MatchCard from "../components/matches/MatchCard";
import MatchComparison from "../components/matches/MatchComparison";
import EmptyState from "../components/common/EmptyState";
import { useItems } from "../context/ItemContext";

export default function MyMatches() {
  const { myMatches, verifyMatch, confirmMatch, dismissMatch } = useItems();
  const [selectedMatch, setSelectedMatch] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Sidebar className="hidden lg:flex" />

        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="p-6 rounded-3xl border-2 border-ink bg-pop-wash shadow-hard">
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-pill bg-pop text-ink">Personal Alerts</span>
            </div>
            <h1 className="font-heavy text-2xl sm:text-3xl font-black text-ink">
              My AI Matches
            </h1>
            <p className="text-xs font-bold text-ink-2 mt-1">
              Potential pairings detected for items you have reported lost or found.
            </p>
          </div>

          {myMatches.length === 0 ? (
            <EmptyState
              title="No Personal Matches Yet"
              description="When a reported turn-in matches one of your lost items or vice-versa, it will be highlighted here."
              icon={Sparkles}
            />
          ) : (
            <div className="flex flex-col gap-6">
              {myMatches.map((match) => (
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
        </div>
      </div>

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
