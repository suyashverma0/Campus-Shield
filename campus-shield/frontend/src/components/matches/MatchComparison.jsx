import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles, MapPin, Calendar, CheckCircle2, ShieldCheck, Lock, MessageSquare } from "lucide-react";
import Button from "../common/Button";
import { formatDate } from "../../utils/helpers";
import { resolveImageUrl } from "../../services/api";

export default function MatchComparison({ match, onClose, onVerify, onConfirm }) {
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [answerRevealed, setAnswerRevealed] = useState(false);

  if (!match) return null;

  const { lostItem, foundItem, score, factors, status } = match;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-ink bg-paper-2 p-6 sm:p-8 shadow-hard-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl border border-transparent hover:border-ink hover:bg-paper-3 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-ink-2" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b-2 border-paper-3 pb-5">
          <div className="w-12 h-12 rounded-2xl border-2 border-ink bg-pop flex items-center justify-center shadow-hard-sm">
            <Sparkles className="w-6 h-6 text-ink" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full border border-ink bg-accent text-accent-fg text-[10px] font-black uppercase">
                {score}% Match Confidence
              </span>
              <span className="text-xs font-bold text-ink-3">Registry Match #{match.id}</span>
            </div>
            <h2 className="font-heavy text-2xl font-black text-ink mt-1">
              Side-by-Side Match Verification
            </h2>
          </div>
        </div>

        {/* Side-by-Side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* Lost Item Details */}
          <div className="flex flex-col rounded-2xl border-2 border-ink bg-paper p-5 shadow-hard-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full border border-ink bg-status-lost text-white text-xs font-black uppercase tracking-wider">
                Lost Report ({lostItem?.id})
              </span>
              <span className="text-xs font-bold text-ink-3">{formatDate(lostItem?.date)}</span>
            </div>

            <div className="aspect-video w-full rounded-xl border-2 border-ink overflow-hidden mb-4 bg-paper-2">
              <img
                src={resolveImageUrl(lostItem?.image)}
                alt={lostItem?.title || "Lost item"}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-heavy text-lg font-black text-ink">{lostItem?.title}</h3>
            <p className="text-xs text-ink-2 mt-2 leading-relaxed">{lostItem?.description}</p>

            <div className="mt-4 pt-3 border-t-2 border-paper-3 flex flex-col gap-2 text-xs font-bold text-ink">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-status-lost" />
                <span>{lostItem?.location}</span>
              </div>
              <div>
                <span className="text-ink-3">Reported By:</span> {lostItem?.userName} ({lostItem?.userDepartment})
              </div>
              {lostItem?.reward && (
                <div className="p-2 rounded-xl border border-ink bg-pop/40 font-extrabold text-xs">
                  Offered Reward: {lostItem?.reward}
                </div>
              )}
            </div>
          </div>

          {/* Found Item Details */}
          <div className="flex flex-col rounded-2xl border-2 border-ink bg-paper p-5 shadow-hard-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full border border-ink bg-accent text-accent-fg text-xs font-black uppercase tracking-wider">
                Found Turn-In ({foundItem?.id})
              </span>
              <span className="text-xs font-bold text-ink-3">{formatDate(foundItem?.date)}</span>
            </div>

            <div className="aspect-video w-full rounded-xl border-2 border-ink overflow-hidden mb-4 bg-paper-2">
              <img
                src={resolveImageUrl(foundItem?.image)}
                alt={foundItem?.title || "Found item"}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-heavy text-lg font-black text-ink">{foundItem?.title}</h3>
            <p className="text-xs text-ink-2 mt-2 leading-relaxed">{foundItem?.description}</p>

            <div className="mt-4 pt-3 border-t-2 border-paper-3 flex flex-col gap-2 text-xs font-bold text-ink">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>{foundItem?.location}</span>
              </div>
              <div>
                <span className="text-ink-3">Found By:</span> {foundItem?.userName} ({foundItem?.userDepartment})
              </div>
              {foundItem?.custodyLocation && (
                <div className="p-2 rounded-xl border border-ink bg-accent-wash font-extrabold text-xs text-accent-hover">
                  Turned In At: {foundItem?.custodyLocation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Question Verification Challenge */}
        {lostItem?.securityQuestion && (
          <div className="p-5 rounded-2xl border-2 border-ink bg-pop-wash my-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-ink" />
              <h4 className="font-heavy text-sm font-black uppercase text-ink">
                Owner Verification Challenge
              </h4>
            </div>
            <p className="text-xs font-bold text-ink-2 mb-3">
              Question: "{lostItem?.securityQuestion}"
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter identifying detail/answer..."
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="flex-1 rounded-xl border-2 border-ink bg-paper-2 px-3 py-2 text-xs font-bold text-ink focus:outline-none"
              />
              <Button
                size="sm"
                variant="pop"
                onClick={() => setAnswerRevealed(!answerRevealed)}
              >
                {answerRevealed ? "Hide Hint" : "Check Answer"}
              </Button>
            </div>
            {answerRevealed && (
              <p className="text-[11px] font-extrabold text-accent mt-2">
                Student verified credentials and ownership details match records.
              </p>
            )}
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-paper-3">
          <Link
            to="/messages"
            className="inline-flex items-center gap-2 text-xs font-black uppercase text-ink hover:underline"
          >
            <MessageSquare className="w-4 h-4" />
            Open Secure Chat Thread
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close Preview
            </Button>

            {status !== "verified" && (
              <Button
                variant="accent"
                size="sm"
                onClick={() => {
                  onVerify(match.id);
                  onClose();
                }}
              >
                Verify Legitimate Match
              </Button>
            )}

            {onConfirm && (
              <Button
                variant="pop"
                size="sm"
                onClick={() => {
                  onConfirm(match.id);
                  onClose();
                }}
              >
                Mark Item Handover Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
