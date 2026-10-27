import React, { useState } from "react";
import { User, Award, Shield, Phone, Mail, GraduationCap, CheckCircle2, Save } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    department: currentUser?.department || "",
    studentId: currentUser?.studentId || ""
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const badges = [
    { title: "Eagle Eye", desc: "Reported 2+ found items turned over to library", color: "bg-pop" },
    { title: "Campus Shield Verified", desc: "University identity and student email verified", color: "bg-accent text-accent-fg" },
    { title: "Quick Responder", desc: "Responds to claim requests within 1 hour", color: "bg-paper-3" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Sidebar className="hidden lg:flex" />

        <div className="flex-1 w-full flex flex-col gap-8">
          {/* Student Profile Card */}
          <div className="p-8 rounded-3xl border-2 border-ink bg-paper-2 shadow-hard flex flex-col sm:flex-row items-center gap-6">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-24 h-24 rounded-3xl border-3 border-ink object-cover shadow-hard-sm"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full border border-ink bg-pop text-ink text-xs font-black uppercase">
                  {currentUser?.role}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full border border-ink bg-accent text-accent-fg text-xs font-black uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ID Verified
                </span>
              </div>
              <h1 className="font-heavy text-2xl sm:text-3xl font-black text-ink">
                {currentUser?.name}
              </h1>
              <p className="text-xs font-bold text-ink-3 mt-1">
                Student ID: <span className="text-ink">{currentUser?.studentId}</span> · {currentUser?.department}
              </p>
            </div>

            <div className="p-4 rounded-2xl border-2 border-ink bg-pop-wash text-center shadow-hard-sm">
              <span className="text-[10px] font-black uppercase text-ink-3 block">
                Total Shield Karma
              </span>
              <p className="font-heavy text-3xl font-black text-accent mt-0.5">
                {currentUser?.karmaPoints}
              </p>
              <span className="text-[10px] font-extrabold text-ink">Top 5% Finder</span>
            </div>
          </div>

          {/* Karma & Badges Section */}
          <div className="p-6 rounded-3xl border-2 border-ink bg-paper-2 shadow-hard">
            <div className="flex items-center gap-2 border-b-2 border-paper-3 pb-3 mb-4">
              <Award className="w-5 h-5 text-accent" />
              <h3 className="font-heavy text-base font-black text-ink uppercase tracking-wide">
                Earned Campus Accolades
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {badges.map((b, i) => (
                <div key={i} className="p-4 rounded-2xl border-2 border-ink bg-paper shadow-hard-sm">
                  <span className={`inline-block px-2.5 py-0.5 rounded-md border border-ink text-[10px] font-black uppercase mb-2 ${b.color}`}>
                    {b.title}
                  </span>
                  <p className="text-xs font-bold text-ink-2">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Form */}
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl border-2 border-ink bg-paper-2 shadow-hard flex flex-col gap-6"
          >
            <div className="border-b-2 border-paper-3 pb-3">
              <h3 className="font-heavy text-lg font-black text-ink">
                Student Identity Settings
              </h3>
              <p className="text-xs font-bold text-ink-3 mt-0.5">
                Keep your department and phone updated to ensure smooth item returns.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                icon={User}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="University Email"
                icon={Mail}
                type="email"
                disabled
                value={formData.email}
                hint="University credentials cannot be changed."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Student ID Badge Number"
                icon={GraduationCap}
                disabled
                value={formData.studentId}
              />

              <Input
                label="Primary Phone / WhatsApp"
                icon={Phone}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <Input
              label="Academic Department / School"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />

            <div className="flex justify-end pt-4 border-t-2 border-paper-3">
              <Button type="submit" variant="accent" icon={Save} loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
