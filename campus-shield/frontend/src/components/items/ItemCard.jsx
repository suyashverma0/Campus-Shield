import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Clock, ArrowUpRight, ShieldCheck, Tag } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { formatDate, timeAgo, truncateText } from "../../utils/helpers";

export default function ItemCard({ item }) {
  const isLost = item.type === "lost";

  return (
    <div className="group flex flex-col justify-between rounded-2xl border-2 border-ink bg-paper-2 overflow-hidden shadow-hard hover:shadow-hard-md hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all duration-200">
      {/* Top Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-ink bg-paper-3">
        <img
          src={item.image || "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80"}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <StatusBadge type={item.type} />
          {item.status === "resolved" && <StatusBadge status="resolved" size="sm" />}
          {item.status === "matched" && <StatusBadge status="matched" size="sm" />}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-ink bg-paper/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-extrabold text-ink shadow-sm">
            <Tag className="w-3 h-3 text-ink-3" />
            {item.category}
          </span>
        </div>

        {/* Reward Tag if Lost */}
        {isLost && item.reward && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center rounded-full border-2 border-ink bg-pop px-2.5 py-0.5 text-[10px] font-black uppercase text-ink shadow-hard-sm">
              Reward: {item.reward}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-ink-3 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(item.date)} · {timeAgo(item.createdAt || item.date)}
            </span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-ink bg-paper-3 text-ink">
              {item.id}
            </span>
          </div>

          <h3 className="font-heavy text-base font-extrabold text-ink line-clamp-2 leading-snug group-hover:text-accent transition-colors">
            {item.title}
          </h3>

          <p className="mt-2 text-xs text-ink-2 font-medium line-clamp-2 leading-relaxed">
            {item.description || "No further physical description provided."}
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-ink-2">
            <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>

        {/* Bottom author and action */}
        <div className="mt-5 pt-4 border-t-2 border-paper-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={item.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
              alt={item.userName}
              className="w-7 h-7 rounded-full border border-ink object-cover shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-black text-ink truncate leading-tight">
                {item.userName}
              </span>
              <span className="text-[10px] font-semibold text-ink-3 truncate leading-tight">
                {item.userDepartment || "Campus"}
              </span>
            </div>
          </div>

          <Link
            to={`/item/${item.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 border-ink bg-paper text-xs font-black uppercase tracking-wider text-ink shadow-hard-sm hover:bg-pop hover:shadow-hard transition-all duration-150 shrink-0"
          >
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
