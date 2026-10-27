import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  CheckSquare,
  Sparkles,
  FileText,
  MessageSquare,
  User,
  PlusCircle,
  ShieldAlert
} from "lucide-react";
import { useItems } from "../../context/ItemContext";

export default function Sidebar({ className = "" }) {
  const { matches, myMatches } = useItems();
  const unreviewedCount = myMatches.filter((m) => m.status === "suggested").length;

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Lost Items Feed", path: "/lost", icon: Search },
    { label: "Found Items Feed", path: "/found", icon: CheckSquare },
    {
      label: "AI Matches",
      path: "/matches",
      icon: Sparkles,
      badge: unreviewedCount > 0 ? unreviewedCount : null
    },
    { label: "My Reports", path: "/my-reports", icon: FileText },
    { label: "My Matches", path: "/my-matches", icon: ShieldAlert },
    { label: "Messages", path: "/messages", icon: MessageSquare },
    { label: "My Profile", path: "/profile", icon: User }
  ];

  return (
    <aside
      className={`w-64 shrink-0 flex flex-col gap-6 p-4 rounded-3xl border-2 border-ink bg-paper-2 shadow-hard ${className}`}
    >
      <div className="flex flex-col gap-1">
        <span className="px-3 text-[11px] font-black uppercase tracking-widest text-ink-3">
          Navigation
        </span>
        <nav className="flex flex-col gap-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all duration-150 ${
                    isActive
                      ? "bg-pop text-ink border-2 border-ink shadow-hard-sm -translate-x-[1px] -translate-y-[1px]"
                      : "text-ink-2 hover:bg-paper-3 hover:text-ink"
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-ink text-paper text-[10px] font-black border border-paper">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t-2 border-paper-3 pt-4 flex flex-col gap-2">
        <span className="px-3 text-[11px] font-black uppercase tracking-widest text-ink-3">
          Quick Actions
        </span>
        <NavLink
          to="/report-lost"
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 border-ink bg-status-lost-wash text-status-lost text-xs font-black uppercase shadow-hard-sm hover:shadow-hard transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Report Lost Item
        </NavLink>
        <NavLink
          to="/report-found"
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 border-ink bg-accent text-accent-fg text-xs font-black uppercase shadow-hard-sm hover:shadow-hard transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Log Found Item
        </NavLink>
      </div>
    </aside>
  );
}
