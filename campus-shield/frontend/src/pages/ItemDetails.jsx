import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Tag,
  Gift,
  Lock,
  Building,
  Share2,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import Button from "../components/common/Button";
import StatusBadge from "../components/common/StatusBadge";
import LoadingState from "../components/common/LoadingState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { itemService } from "../services/itemService";
import { messageService } from "../services/messageService";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../context/ItemContext";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../utils/helpers";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { resolveItem } = useItems();
  const toast = useToast();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmResolveOpen, setConfirmResolveOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimAnswer, setClaimAnswer] = useState("");

  useEffect(() => {
    async function fetchItem() {
      try {
        setLoading(true);
        const data = await itemService.getItemById(id);
        setItem(data);
      } catch (err) {
        toast.error("Not Found", "Item could not be found.");
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id, toast]);

  if (loading) return <LoadingState message="Loading item dossier..." />;
  if (!item) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h2 className="font-heavy text-2xl font-black text-ink">Item Not Found</h2>
        <p className="text-sm text-ink-2 mt-2">The requested report does not exist or has been removed.</p>
        <Link to="/lost" className="mt-6 inline-block">
          <Button variant="accent">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const isOwner = currentUser && currentUser.id === item.userId;
  const isLost = item.type === "lost";

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Link Copied!", "Share this report with campus friends or WhatsApp groups.");
  };

  const handleStartChat = async () => {
    try {
      const thread = await messageService.createOrGetThread(
        { id: item.userId, name: item.userName, avatar: item.userAvatar, department: item.userDepartment },
        item
      );
      navigate("/messages");
    } catch (err) {
      toast.error("Error", "Could not start conversation.");
    }
  };

  const handleResolve = async () => {
    try {
      await resolveItem(item.id, "Successfully reunited on campus!");
      setItem((prev) => ({ ...prev, status: "resolved" }));
      setConfirmResolveOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimAnswer.trim()) {
      toast.error("Missing Answer", "Please answer the owner verification challenge.");
      return;
    }
    setClaimModalOpen(false);
    toast.success(
      "Claim Request Transmitted!",
      "The finder and campus security have received your verification response."
    );
    handleStartChat();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button & share */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-ink-2 hover:text-ink hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to previous page
        </button>

        <Button variant="outline" size="sm" icon={Share2} onClick={handleShare}>
          Share Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Photo & Custody */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative aspect-[16/11] w-full rounded-3xl border-2.5 border-ink bg-paper-2 overflow-hidden shadow-hard-md">
            <img
              src={item.image || "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=900"}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <StatusBadge type={item.type} />
              {item.status === "resolved" && <StatusBadge status="resolved" />}
            </div>
            {isLost && item.reward && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-ink bg-pop text-ink text-xs font-black uppercase shadow-hard-sm">
                  <Gift className="w-3.5 h-3.5" />
                  Reward: {item.reward}
                </span>
              </div>
            )}
          </div>

          {/* Physical Specifications */}
          <div className="p-6 rounded-3xl border-2 border-ink bg-paper-2 shadow-hard">
            <h3 className="font-heavy text-base font-black uppercase tracking-wider text-ink mb-4 border-b-2 border-paper-3 pb-3">
              Item Properties & Identifiers
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-bold">
              <div className="p-3 rounded-xl border border-ink bg-paper">
                <span className="text-[10px] text-ink-3 uppercase block">Category</span>
                <span className="text-ink text-xs font-black">{item.category}</span>
              </div>

              <div className="p-3 rounded-xl border border-ink bg-paper">
                <span className="text-[10px] text-ink-3 uppercase block">Brand / Make</span>
                <span className="text-ink text-xs font-black">{item.brand || "Unspecified"}</span>
              </div>

              <div className="p-3 rounded-xl border border-ink bg-paper">
                <span className="text-[10px] text-ink-3 uppercase block">Color Palette</span>
                <span className="text-ink text-xs font-black">{item.color || "Standard"}</span>
              </div>

              <div className="p-3 rounded-xl border border-ink bg-paper">
                <span className="text-[10px] text-ink-3 uppercase block">Date Logged</span>
                <span className="text-ink text-xs font-black">{formatDate(item.date)}</span>
              </div>

              <div className="p-3 rounded-xl border border-ink bg-paper">
                <span className="text-[10px] text-ink-3 uppercase block">Time Approx</span>
                <span className="text-ink text-xs font-black">{item.time || "N/A"}</span>
              </div>

              <div className="p-3 rounded-xl border border-ink bg-paper">
                <span className="text-[10px] text-ink-3 uppercase block">Report ID</span>
                <span className="text-ink text-xs font-black">{item.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Description, Claimant & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-3xl border-2.5 border-ink bg-paper-2 shadow-hard">
            {/* Title & Location */}
            <span className="text-[10px] font-black uppercase tracking-widest text-ink-3">
              {item.category}
            </span>
            <h1 className="font-heavy text-2xl font-black text-ink mt-1 leading-tight">
              {item.title}
            </h1>

            <div className="mt-3 flex items-start gap-2 text-xs font-bold text-ink-2">
              <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>{item.location}</span>
            </div>

            {/* Description */}
            <div className="mt-5 pt-4 border-t-2 border-paper-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-ink mb-1.5">
                Description & Marks
              </h4>
              <p className="text-xs font-semibold text-ink-2 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Custody if Found */}
            {item.custodyLocation && (
              <div className="mt-5 p-3.5 rounded-2xl border-2 border-ink bg-accent-wash">
                <div className="flex items-center gap-1.5 text-xs font-black text-accent mb-1">
                  <Building className="w-4 h-4" />
                  <span>Physical Holding Point</span>
                </div>
                <p className="text-xs font-bold text-ink">
                  {item.custodyLocation}
                </p>
              </div>
            )}

            {/* Reporter Profile */}
            <div className="mt-6 pt-4 border-t-2 border-paper-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.userAvatar}
                  alt={item.userName}
                  className="w-10 h-10 rounded-full border-2 border-ink object-cover"
                />
                <div>
                  <h4 className="font-heavy text-xs font-black text-ink">{item.userName}</h4>
                  <p className="text-[11px] font-bold text-ink-3">{item.userDepartment}</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full border border-ink bg-pop text-ink text-[10px] font-black uppercase">
                Verified Student
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t-2 border-paper-3 flex flex-col gap-3">
              {item.status === "resolved" ? (
                <div className="p-3 rounded-xl border-2 border-ink bg-status-found-wash text-center font-black text-xs text-accent">
                  ✓ Reunited & Closed
                </div>
              ) : (
                <>
                  {!isOwner && (
                    <Button
                      variant={isLost ? "accent" : "pop"}
                      size="lg"
                      className="w-full"
                      onClick={() => setClaimModalOpen(true)}
                    >
                      {isLost ? "I Found This Item!" : "Claim: This Belongs To Me"}
                    </Button>
                  )}

                  {!isOwner && (
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full"
                      icon={MessageSquare}
                      onClick={handleStartChat}
                    >
                      Message {item.userName.split(" ")[0]}
                    </Button>
                  )}

                  {isOwner && (
                    <Button
                      variant="accent"
                      size="lg"
                      className="w-full"
                      icon={CheckCircle2}
                      onClick={() => setConfirmResolveOpen(true)}
                    >
                      Mark as Reunited & Closed
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Claim Modal */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-ink bg-paper-2 p-6 sm:p-8 shadow-hard-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl border-2 border-ink bg-pop flex items-center justify-center shadow-hard-sm">
                <Lock className="w-5 h-5 text-ink" />
              </div>
              <div>
                <h3 className="font-heavy text-lg font-black text-ink">
                  {isLost ? "Found Item Report Match" : "Claim Ownership Challenge"}
                </h3>
                <p className="text-xs font-bold text-ink-3">
                  Campus Shield Anti-Fraud Verification
                </p>
              </div>
            </div>

            <form onSubmit={handleClaimSubmit} className="flex flex-col gap-4">
              <p className="text-xs font-semibold text-ink-2 leading-relaxed">
                To protect property from false claims, answer the owner's verification prompt or provide unique details (case stickers, lock screen, engraved initials).
              </p>

              {item.securityQuestion && (
                <div className="p-3.5 rounded-xl border-2 border-ink bg-pop-wash">
                  <span className="text-[10px] font-black uppercase text-ink-3 block">
                    Security Question:
                  </span>
                  <p className="text-xs font-black text-ink mt-0.5">
                    "{item.securityQuestion}"
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold uppercase text-ink">
                  Your Answer / Identifying Details:
                </label>
                <textarea
                  rows={3}
                  required
                  value={claimAnswer}
                  onChange={(e) => setClaimAnswer(e.target.value)}
                  placeholder="Provide proof of ownership..."
                  className="w-full rounded-xl border-2 border-ink bg-paper p-3 text-xs font-bold text-ink focus:outline-none focus:shadow-hard-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-paper-3">
                <Button variant="outline" size="sm" onClick={() => setClaimModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="accent" size="sm">
                  Transmit Verification
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Resolve Dialog */}
      <ConfirmDialog
        isOpen={confirmResolveOpen}
        title="Mark Item as Reunited?"
        message="This will mark the item as successfully recovered and award karma points to the finder. Congratulations on the recovery!"
        confirmText="Confirm Reunited"
        variant="accent"
        onConfirm={handleResolve}
        onCancel={() => setConfirmResolveOpen(false)}
      />
    </div>
  );
}
