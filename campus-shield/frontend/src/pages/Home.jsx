import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Lock,
  Clock,
  MapPin,
  TrendingUp,
  Award,
  Users,
  Compass
} from "lucide-react";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import ItemGrid from "../components/items/ItemGrid";
import { useItems } from "../context/ItemContext";
import { mockTestimonials } from "../data/mockData";

export default function Home() {
  const { items, stats, loading } = useItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "lost" | "found"

  const filteredItems = items
    .filter((item) => {
      if (activeTab === "lost") return item.type === "lost";
      if (activeTab === "found") return item.type === "found";
      return true;
    })
    .slice(0, 6);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section (Linklee.in Style: Bold, Neo-brutalist, High Polish) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b-2.5 border-ink bg-paper bg-dot-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Pill offer badge */}
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-pop px-3.5 py-1 text-xs font-black uppercase text-ink shadow-hard-sm mb-6">
                <Sparkles className="w-4 h-4 text-ink" />
                <span>Smart Campus Lost & Found · 24/7 AI Matching</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heavy text-[clamp(2.5rem,5.5vw,4.5rem)] font-black uppercase leading-[0.98] tracking-tight text-ink text-balance">
                Lost your gear?{" "}
                <span className="relative inline-block">
                  <span className="absolute inset-x-[-4px] bottom-1 h-3.5 -rotate-1 bg-pop -z-0 rounded-sm" />
                  <span className="relative z-10">We'll find it.</span>
                </span>
              </h1>

              {/* Subheading */}
              <p className="mt-6 text-lg sm:text-xl font-bold text-ink-2 max-w-xl leading-relaxed">
                Campus Shield pairs lost laptops, student IDs, keys, and backpacks with real-time finder turn-ins across libraries, hostels, and lecture halls.
              </p>

              {/* Search Bar Input */}
              <div className="mt-8 w-full max-w-xl">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Quick search: 'MacBook', 'Fossil Wallet', 'Casio'..."
                />
              </div>

              {/* Primary Call to Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-4 w-full">
                <Link to="/report-lost">
                  <Button variant="danger" size="lg" icon={ArrowRight} iconPosition="right">
                    Report Lost Item
                  </Button>
                </Link>

                <Link to="/report-found">
                  <Button variant="accent" size="lg" icon={ArrowRight} iconPosition="right">
                    Log Found Valuables
                  </Button>
                </Link>

                <Link to="/matches">
                  <Button variant="outline" size="lg" icon={Sparkles} iconPosition="left">
                    View AI Matches
                  </Button>
                </Link>
              </div>

              {/* Live Trust Metrics snippet */}
              <div className="mt-8 flex items-center gap-6 text-xs font-black uppercase tracking-wider text-ink-3">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  Verified Student IDs Only
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-ink" />
                  Secure Handover Protocols
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Card with Tactile Linklee Aesthetic */}
            <div className="lg:col-span-5 relative">
              {/* Floating hard badges */}
              <div className="absolute -top-4 -left-4 z-20 hidden sm:flex items-center gap-2 rounded-2xl border-2 border-ink bg-pop px-3.5 py-2 text-xs font-black text-ink shadow-hard">
                <Sparkles className="w-4 h-4" />
                <span>94% AI Match on Library Desk</span>
              </div>

              <div className="absolute -bottom-4 -right-2 z-20 hidden sm:flex items-center gap-2 rounded-2xl border-2 border-ink bg-accent text-accent-fg px-3.5 py-2 text-xs font-black shadow-hard">
                <CheckCircle2 className="w-4 h-4 text-pop" />
                <span>Reunited in 45 Mins</span>
              </div>

              {/* Mockup Card */}
              <div className="rounded-[2.5rem] border-3 border-ink bg-paper-2 p-6 shadow-hard-lg overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b-2 border-ink mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full border border-ink bg-status-lost" />
                    <div className="w-3.5 h-3.5 rounded-full border border-ink bg-pop" />
                    <div className="w-3.5 h-3.5 rounded-full border border-ink bg-accent" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-ink bg-paper-3 px-2 py-0.5 rounded-md border border-ink">
                    Live Campus Feed
                  </span>
                </div>

                {/* Preview Item Card inside phone-style frame */}
                <div className="rounded-2xl border-2 border-ink overflow-hidden bg-paper shadow-hard-sm">
                  <div className="aspect-[16/10] w-full bg-paper-3 overflow-hidden border-b-2 border-ink relative">
                    <img
                      src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"
                      alt="MacBook Demo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full border border-ink bg-status-lost text-white text-[10px] font-black uppercase">
                      Lost Item
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full border border-ink bg-pop text-ink text-[10px] font-black uppercase">
                      Reward: ₹1,500
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heavy text-sm font-black text-ink">
                      Space Grey MacBook Air M2 in Navy Sleeve
                    </h3>
                    <p className="text-[11px] text-ink-2 font-semibold mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-status-lost" />
                      Central Library - 2nd Floor Reading Hall
                    </p>
                    <div className="mt-3 p-2.5 rounded-xl border-2 border-ink bg-pop-wash flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black text-ink">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span>Pair Found with Turn-In #FND-201</span>
                      </div>
                      <span className="text-[11px] font-black text-accent bg-paper px-2 py-0.5 rounded border border-ink">
                        94% Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick stats mini row */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                  <div className="p-2.5 rounded-xl border-2 border-ink bg-paper-3">
                    <p className="font-heavy text-lg font-black text-ink">{stats.reunitedItems}</p>
                    <p className="text-[10px] font-bold text-ink-3 uppercase">Reunited Items</p>
                  </div>
                  <div className="p-2.5 rounded-xl border-2 border-ink bg-accent-wash">
                    <p className="font-heavy text-lg font-black text-accent">{stats.reunionRate}</p>
                    <p className="text-[10px] font-bold text-ink-3 uppercase">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Campus Statistics Grid (Editorial tactile counters) */}
      <section className="py-12 border-b-2.5 border-ink bg-paper-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 rounded-2xl border-2 border-ink bg-paper shadow-hard text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-ink-3 flex items-center justify-center sm:justify-start gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-accent" />
                Total Logged
              </span>
              <p className="font-heavy text-3xl sm:text-4xl font-black text-ink mt-2">
                {stats.totalReported}
              </p>
              <p className="text-xs text-ink-2 font-bold mt-1">Across 6 university campuses</p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-ink bg-pop-wash shadow-hard text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-ink-3 flex items-center justify-center sm:justify-start gap-1">
                <Award className="w-3.5 h-3.5 text-ink" />
                Reunion Rate
              </span>
              <p className="font-heavy text-3xl sm:text-4xl font-black text-ink mt-2">
                {stats.reunionRate}
              </p>
              <p className="text-xs text-ink-2 font-bold mt-1">Safely recovered gear</p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-ink bg-accent-wash shadow-hard text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-ink-3 flex items-center justify-center sm:justify-start gap-1">
                <Clock className="w-3.5 h-3.5 text-accent" />
                Avg Recovery Time
              </span>
              <p className="font-heavy text-3xl sm:text-4xl font-black text-accent mt-2">
                {stats.averageRecoveryHours}h
              </p>
              <p className="text-xs text-ink-2 font-bold mt-1">From report to handover</p>
            </div>

            <div className="p-6 rounded-2xl border-2 border-ink bg-paper shadow-hard text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-ink-3 flex items-center justify-center sm:justify-start gap-1">
                <Users className="w-3.5 h-3.5 text-ink" />
                Active Cases
              </span>
              <p className="font-heavy text-3xl sm:text-4xl font-black text-status-lost mt-2">
                {stats.activeLost}
              </p>
              <p className="text-xs text-ink-2 font-bold mt-1">{stats.activeFound} found pending claim</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works (Linklee Inspired Step Cards) */}
      <section className="py-20 border-b-2.5 border-ink bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-pill bg-pop text-ink mb-3">
              Frictionless Process
            </span>
            <h2 className="font-heavy text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink">
              How Campus Shield Works
            </h2>
            <p className="text-base font-bold text-ink-2 mt-3">
              Replacing noisy WhatsApp groups and chaotic notice boards with a verifiable, automated college registry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative rounded-3xl border-2 border-ink bg-paper-2 p-8 shadow-hard hover:shadow-hard-md transition-all">
              <div className="w-12 h-12 rounded-2xl border-2 border-ink bg-status-lost text-white font-heavy text-xl font-black flex items-center justify-center shadow-hard-sm mb-6">
                01
              </div>
              <h3 className="font-heavy text-xl font-black uppercase text-ink">
                Report In 60 Seconds
              </h3>
              <p className="mt-3 text-sm text-ink-2 font-semibold leading-relaxed">
                Log what you lost or picked up with campus locations, timestamps, and optional photos. Attach a secret verification question.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-3xl border-2 border-ink bg-pop-wash p-8 shadow-hard hover:shadow-hard-md transition-all">
              <div className="w-12 h-12 rounded-2xl border-2 border-ink bg-pop text-ink font-heavy text-xl font-black flex items-center justify-center shadow-hard-sm mb-6">
                02
              </div>
              <h3 className="font-heavy text-xl font-black uppercase text-ink">
                AI Cross-Comparison
              </h3>
              <p className="mt-3 text-sm text-ink-2 font-semibold leading-relaxed">
                Our smart algorithm scores attributes—timestamps, buildings, brands, and categories—notifying both parties when confidence exceeds 50%.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-3xl border-2 border-ink bg-accent-wash p-8 shadow-hard hover:shadow-hard-md transition-all">
              <div className="w-12 h-12 rounded-2xl border-2 border-ink bg-accent text-accent-fg font-heavy text-xl font-black flex items-center justify-center shadow-hard-sm mb-6">
                03
              </div>
              <h3 className="font-heavy text-xl font-black uppercase text-ink">
                Verified Handover
              </h3>
              <p className="mt-3 text-sm text-ink-2 font-semibold leading-relaxed">
                Connect via authenticated in-app chat, verify ownership with security answers, and collect from campus lockers or security desks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Registry Items Feed */}
      <section className="py-20 border-b-2.5 border-ink bg-paper-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <span className="badge-pill bg-paper-3 text-ink mb-2">
                Real-Time Campus Bulletin
              </span>
              <h2 className="font-heavy text-3xl font-black uppercase tracking-tight text-ink">
                Recent Campus Reports
              </h2>
              <p className="text-sm font-bold text-ink-2 mt-1">
                Browse latest reported items or search by building and item type.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl border-2 border-ink bg-paper shadow-hard-sm">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide border transition-all ${
                  activeTab === "all"
                    ? "bg-ink text-paper border-ink shadow-hard-sm"
                    : "border-transparent text-ink-2 hover:text-ink"
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => setActiveTab("lost")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide border transition-all ${
                  activeTab === "lost"
                    ? "bg-status-lost text-white border-ink shadow-hard-sm"
                    : "border-transparent text-ink-2 hover:text-ink"
                }`}
              >
                Lost Only
              </button>
              <button
                onClick={() => setActiveTab("found")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide border transition-all ${
                  activeTab === "found"
                    ? "bg-accent text-accent-fg border-ink shadow-hard-sm"
                    : "border-transparent text-ink-2 hover:text-ink"
                }`}
              >
                Found Only
              </button>
            </div>
          </div>

          {/* Item Grid */}
          <ItemGrid
            items={filteredItems}
            loading={loading}
            emptyTitle="No recent reports"
            emptyDescription="All reported items in this category have been reunited or resolved."
          />

          <div className="mt-12 flex justify-center">
            <Link to={activeTab === "found" ? "/found" : "/lost"}>
              <Button variant="outline" size="lg" icon={ArrowRight} iconPosition="right">
                Explore Full Registry ({items.length} items)
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Student Community Testimonials */}
      <section className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="badge-pill bg-accent text-accent-fg mb-3">
              Campus Stories
            </span>
            <h2 className="font-heavy text-3xl font-black uppercase tracking-tight text-ink">
              Trusted by 12,000+ Students & Staff
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTestimonials.map((t, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-3xl border-2 border-ink bg-paper-2 p-6 shadow-hard hover:shadow-hard-md transition-all"
              >
                <p className="text-sm font-bold text-ink leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="mt-6 pt-4 border-t-2 border-paper-3 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-full border-2 border-ink object-cover"
                  />
                  <div>
                    <h4 className="font-heavy text-xs font-black text-ink">{t.author}</h4>
                    <p className="text-[11px] font-bold text-ink-3">{t.dept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Call to Action Card */}
          <div className="mt-16 rounded-[2.5rem] border-3 border-ink bg-pop p-8 sm:p-12 shadow-hard-lg flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full border-2 border-ink bg-ink text-paper text-xs font-black uppercase mb-3">
                Join Campus Shield
              </span>
              <h3 className="font-heavy text-2xl sm:text-4xl font-black uppercase tracking-tight text-ink leading-tight">
                Help build an honest, connected campus community.
              </h3>
              <p className="text-sm font-bold text-ink mt-2">
                Claim your student account with university email and start earning karma points for good deeds.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to="/register">
                <Button variant="dark" size="lg">
                  Register Student ID
                </Button>
              </Link>
              <Link to="/report-found">
                <Button variant="outline" size="lg">
                  Report Found Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
