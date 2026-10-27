import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Sparkles, PlusCircle, Search, Menu, X, LogOut, User, Bell, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useItems } from "../../context/ItemContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { matches } = useItems();

  const suggestedMatchesCount = matches.filter((m) => m.status === "suggested").length;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-ink bg-paper/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl border-2 border-ink bg-accent flex items-center justify-center shadow-hard transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:rotate-2">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heavy text-2xl font-black uppercase tracking-tight text-ink flex items-center gap-1 leading-none">
                Campus<span className="text-accent">Shield</span>
                <span className="w-2 h-2 rounded-full bg-pop border border-ink" />
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-ink-3">
                University Lost & Found
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/lost"
              className={`px-4 py-2 rounded-xl text-sm font-extrabold uppercase tracking-wide transition-all duration-150 ${
                isActive("/lost")
                  ? "bg-paper-2 border-2 border-ink text-ink shadow-hard-sm -translate-y-0.5"
                  : "text-ink-2 hover:text-ink hover:bg-paper-3"
              }`}
            >
              Lost Items
            </Link>
            <Link
              to="/found"
              className={`px-4 py-2 rounded-xl text-sm font-extrabold uppercase tracking-wide transition-all duration-150 ${
                isActive("/found")
                  ? "bg-paper-2 border-2 border-ink text-ink shadow-hard-sm -translate-y-0.5"
                  : "text-ink-2 hover:text-ink hover:bg-paper-3"
              }`}
            >
              Found Items
            </Link>
            <Link
              to="/matches"
              className={`relative px-4 py-2 rounded-xl text-sm font-extrabold uppercase tracking-wide transition-all duration-150 flex items-center gap-1.5 ${
                isActive("/matches")
                  ? "bg-pop text-ink border-2 border-ink shadow-hard-sm -translate-y-0.5"
                  : "text-ink-2 hover:text-ink hover:bg-paper-3"
              }`}
            >
              <Sparkles className="w-4 h-4 text-ink animate-bounce-subtle" />
              <span>AI Matches</span>
              {suggestedMatchesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-ink text-paper text-[10px] font-black border border-paper">
                  {suggestedMatchesCount}
                </span>
              )}
            </Link>
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-xl text-sm font-extrabold uppercase tracking-wide transition-all duration-150 ${
                isActive("/dashboard")
                  ? "bg-paper-2 border-2 border-ink text-ink shadow-hard-sm -translate-y-0.5"
                  : "text-ink-2 hover:text-ink hover:bg-paper-3"
              }`}
            >
              Dashboard
            </Link>
          </nav>

          {/* Right actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Report Buttons */}
            <Link
              to="/report-lost"
              className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border-2 border-ink bg-status-lost-wash text-status-lost text-xs font-black uppercase tracking-wider shadow-hard-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-hard active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Lost
            </Link>

            <Link
              to="/report-found"
              className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border-2 border-ink bg-accent text-accent-fg text-xs font-black uppercase tracking-wider shadow-hard-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-hard active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Found
            </Link>

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border-2 border-ink bg-paper-2 shadow-hard-sm hover:shadow-hard transition-all cursor-pointer"
                  aria-label="User menu"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-lg object-cover border border-ink"
                  />
                  <div className="hidden md:flex flex-col text-left pr-2">
                    <span className="text-xs font-black text-ink leading-tight truncate max-w-[110px]">
                      {currentUser?.name}
                    </span>
                    <span className="text-[10px] font-bold text-accent">
                      {currentUser?.karmaPoints} Karma
                    </span>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border-2 border-ink bg-paper-2 p-2 shadow-hard-lg z-50 animate-in fade-in zoom-in-95">
                    <div className="p-3 border-b-2 border-paper-3 bg-paper-wash rounded-xl mb-1">
                      <p className="text-xs font-black text-ink">{currentUser?.name}</p>
                      <p className="text-[11px] text-ink-3 truncate">{currentUser?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-pop text-ink border border-ink">
                        {currentUser?.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-ink hover:bg-paper-3 transition-colors"
                    >
                      <User className="w-4 h-4 text-ink-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/my-reports"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-ink hover:bg-paper-3 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-ink-2" />
                      My Reports
                    </Link>
                    <Link
                      to="/messages"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-ink hover:bg-paper-3 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-ink-2" />
                      Messages
                    </Link>

                    <div className="my-1 border-t-2 border-paper-3" />

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        navigate("/");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-status-lost hover:bg-status-lost-wash/50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center h-10 px-4 rounded-xl border-2 border-ink bg-paper-2 text-ink text-xs font-extrabold uppercase tracking-wide shadow-hard-sm hover:bg-paper-3 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center h-10 px-4 rounded-xl border-2 border-ink bg-pop text-ink text-xs font-extrabold uppercase tracking-wide shadow-hard-sm hover:bg-pop-hover transition-all"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border-2 border-ink bg-paper-2 shadow-hard-sm hover:bg-paper-3 text-ink"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-ink" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-ink bg-paper-2 px-4 pt-4 pb-6 shadow-hard animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            <Link
              to="/lost"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide text-ink border-2 border-ink bg-paper"
            >
              Lost Items
            </Link>
            <Link
              to="/found"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide text-ink border-2 border-ink bg-paper"
            >
              Found Items
            </Link>
            <Link
              to="/matches"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide text-ink border-2 border-ink bg-pop flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Matches
              </span>
              {suggestedMatchesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-ink text-paper text-xs font-black">
                  {suggestedMatchesCount}
                </span>
              )}
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide text-ink border-2 border-ink bg-paper"
            >
              Dashboard
            </Link>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Link
                to="/report-lost"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 border-ink bg-status-lost-wash text-status-lost text-xs font-black uppercase"
              >
                <PlusCircle className="w-4 h-4" />
                Report Lost
              </Link>
              <Link
                to="/report-found"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl border-2 border-ink bg-accent text-accent-fg text-xs font-black uppercase"
              >
                <PlusCircle className="w-4 h-4" />
                Report Found
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="mt-4 pt-4 border-t-2 border-paper-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-10 h-10 rounded-xl border-2 border-ink object-cover"
                  />
                  <div>
                    <p className="text-xs font-black text-ink">{currentUser?.name}</p>
                    <p className="text-[10px] text-ink-3">{currentUser?.studentId}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate("/");
                  }}
                  className="px-3 py-1.5 rounded-xl border-2 border-ink bg-paper text-xs font-extrabold text-status-lost"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl border-2 border-ink bg-paper-2 text-xs font-extrabold uppercase"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl border-2 border-ink bg-pop text-xs font-extrabold uppercase"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
