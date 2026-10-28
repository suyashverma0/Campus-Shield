import React from "react";
import { Sparkles, ArrowRight, CheckCircle2, XCircle, MapPin, Calendar } from "lucide-react";
import Button from "../common/Button";
import { formatDate } from "../../utils/helpers";
import { resolveImageUrl } from "../../services/api";

export default function MatchCard({ match, onCompare, onVerify, onDismiss }) {
  const { lostItem, foundItem, score, factors, status } = match;

  const getScoreColor = (sc) => {
    if (sc >= 85) return "bg-accent text-accent-fg border-ink";
    if (sc >= 70) return "bg-pop text-ink border-ink";
    return "bg-status-pending-wash text-ink border-ink";
  };

  return (
    <div className="flex flex-col rounded-3xl border-2 border-ink bg-paper-2 p-6 shadow-hard hover:shadow-hard-md transition-all duration-200">
      {/* Top Banner with Score */}
      <div className="flex items-center justify-between border-b-2 border-paper-3 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl border-2 border-ink bg-pop flex items-center justify-center shadow-hard-sm">
            <Sparkles className="w-4 h-4 text-ink animate-bounce-subtle" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-ink block">
              Automated AI Pairing
            </span>
            <span className="text-[10px] font-bold text-ink-3">ID: {match.id}</span>
          </div>
        </div>

        {/* Confidence Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-ink hidden sm:inline">
            Confidence:
          </span>
          <div
            className={`px-3 py-1 rounded-full border-2 text-xs font-black shadow-hard-sm ${getScoreColor(
              score
            )}`}
          >
            {score}% Match
          </div>
        </div>
      </div>

      {/* Side-by-Side Item Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        {/* Lost Item Summary */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl border-2 border-ink bg-status-lost-wash/30">
          <img
            src={resolveImageUrl(lostItem?.image)}
            alt={lostItem?.title || "Lost item"}
            className="w-16 h-16 rounded-xl border border-ink object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 rounded-md border border-ink bg-status-lost text-white text-[9px] font-black uppercase tracking-wider mb-1">
              Lost Report
            </span>
            <h4 className="text-xs font-black text-ink truncate">{lostItem?.title}</h4>
            <p className="text-[11px] text-ink-2 font-medium flex items-center gap-1 mt-1 truncate">
              <MapPin className="w-3 h-3 text-status-lost shrink-0" />
              {lostItem?.location}
            </p>
            <p className="text-[10px] text-ink-3 font-semibold mt-0.5">
              Lost on {formatDate(lostItem?.date)} by {lostItem?.userName}
            </p>
          </div>
        </div>

        {/* Found Item Summary */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl border-2 border-ink bg-status-found-wash/40">
          <img
            src={resolveImageUrl(foundItem?.image)}
            alt={foundItem?.title || "Found item"}
            className="w-16 h-16 rounded-xl border border-ink object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 rounded-md border border-ink bg-accent text-accent-fg text-[9px] font-black uppercase tracking-wider mb-1">
              Found Turn-In
            </span>
            <h4 className="text-xs font-black text-ink truncate">{foundItem?.title}</h4>
            <p className="text-[11px] text-ink-2 font-medium flex items-center gap-1 mt-1 truncate">
              <MapPin className="w-3 h-3 text-accent shrink-0" />
              {foundItem?.location}
            </p>
            <p className="text-[10px] text-ink-3 font-semibold mt-0.5">
              Found on {formatDate(foundItem?.date)} by {foundItem?.userName}
            </p>
          </div>
        </div>
      </div>

      {/* Match Factor Badges */}
      <div className="flex flex-wrap gap-1.5 pb-4 border-b-2 border-paper-3">
        {factors?.map((f, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-ink bg-paper text-[10px] font-bold text-ink"
          >
            <span className="text-accent font-black">{f.score}</span>
            <span>{f.label}</span>
          </span>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {status === "verified" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-ink bg-accent text-accent-fg text-xs font-black uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified by Students
            </span>
          ) : (
            <span className="text-xs font-extrabold text-ink-3 uppercase">
              Requires Owner Review
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={() => onDismiss(match.id)}>
              Dismiss
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={() => onCompare(match)}>
            Inspect Comparison
          </Button>

          {status !== "verified" && onVerify && (
            <Button variant="accent" size="sm" onClick={() => onVerify(match.id)}>
              Verify Match
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
