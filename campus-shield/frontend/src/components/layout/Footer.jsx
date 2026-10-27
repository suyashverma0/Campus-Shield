import React from "react";
import { Link } from "react-router-dom";
import { Shield, PhoneCall, Mail, MapPin, Heart, Sparkles, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t-2.5 border-ink bg-paper-2 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b-2 border-paper-3">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border-2 border-ink bg-accent flex items-center justify-center shadow-hard">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-heavy text-2xl font-black uppercase tracking-tight text-ink">
                Campus<span className="text-accent">Shield</span>
              </span>
            </Link>
            <p className="text-sm font-medium text-ink-2 max-w-sm leading-relaxed">
              University campus smart Lost & Found network. Empowering students, faculty, and campus security with AI-driven matching and verified handovers.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-ink bg-pop-wash text-xs font-bold text-ink w-fit shadow-hard-sm">
              <Sparkles className="w-4 h-4 text-ink" />
              <span>86.4% verified reunion rate across university halls</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heavy text-xs font-extrabold uppercase tracking-widest text-ink">
              Lost & Found
            </h4>
            <ul className="flex flex-col gap-2 text-sm font-bold text-ink-2">
              <li>
                <Link to="/lost" className="hover:text-ink hover:underline decoration-2">
                  Browse Lost Items
                </Link>
              </li>
              <li>
                <Link to="/found" className="hover:text-ink hover:underline decoration-2">
                  Browse Found Items
                </Link>
              </li>
              <li>
                <Link to="/report-lost" className="hover:text-ink hover:underline decoration-2">
                  Report a Lost Item
                </Link>
              </li>
              <li>
                <Link to="/report-found" className="hover:text-ink hover:underline decoration-2">
                  Log a Found Item
                </Link>
              </li>
              <li>
                <Link to="/matches" className="hover:text-ink hover:underline decoration-2 flex items-center gap-1.5">
                  <span>Match Registry</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-pop text-ink text-[10px] font-black border border-ink">
                    AI
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Hub */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heavy text-xs font-extrabold uppercase tracking-widest text-ink">
              Student Hub
            </h4>
            <ul className="flex flex-col gap-2 text-sm font-bold text-ink-2">
              <li>
                <Link to="/dashboard" className="hover:text-ink hover:underline decoration-2">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-reports" className="hover:text-ink hover:underline decoration-2">
                  My Reports & Claims
                </Link>
              </li>
              <li>
                <Link to="/messages" className="hover:text-ink hover:underline decoration-2">
                  Security Chat
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-ink hover:underline decoration-2">
                  Karma Points & Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Emergency / Security Hotline */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heavy text-xs font-extrabold uppercase tracking-widest text-ink">
              Security Contacts
            </h4>
            <div className="flex flex-col gap-2.5 text-xs font-bold text-ink-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Central Security Office, Admin Gate #1</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-status-lost shrink-0" />
                <span>24/7 Hotline: 011-2766-8800</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-ink-3 shrink-0" />
                <span>campus-shield@university.edu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-ink-3">
          <p>© {new Date().getFullYear()} Campus Shield. All rights reserved. University Campus Safety Initiative.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              Designed with inspiration from <a href="https://linklee.in" target="_blank" rel="noreferrer" className="text-ink font-black hover:underline flex items-center gap-0.5">Linklee.in <ExternalLink className="w-3 h-3" /></a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
