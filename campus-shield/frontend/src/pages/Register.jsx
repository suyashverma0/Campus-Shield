import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, User, Mail, Lock, GraduationCap, ArrowRight } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    department: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-paper bg-dot-pattern">
      <div className="w-full max-w-lg rounded-3xl border-3 border-ink bg-paper-2 p-8 sm:p-10 shadow-hard-lg">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl border-2 border-ink bg-pop flex items-center justify-center shadow-hard mb-3">
            <Shield className="w-7 h-7 text-ink" />
          </div>
          <span className="font-heavy text-2xl font-black uppercase text-ink">
            Create Campus Account
          </span>
          <p className="text-xs font-bold text-ink-3 mt-1">
            Join the verified university Lost & Found network
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl border-2 border-status-lost bg-status-lost-wash text-xs font-bold text-status-lost">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Legal Name"
            icon={User}
            required
            placeholder="e.g. Tanvi Deshmukh"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="College Email Address"
            type="email"
            icon={Mail}
            required
            placeholder="tanvi.d@campus.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student ID Number"
              icon={GraduationCap}
              placeholder="e.g. CS2024-1102"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            />

            <Input
              label="Department / Course"
              placeholder="e.g. Architecture '25"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <Input
            label="Password"
            type="password"
            icon={Lock}
            required
            placeholder="Create secure password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="mt-4">
            <Button
              type="submit"
              variant="pop"
              size="lg"
              className="w-full"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Register & Join Campus Shield
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t-2 border-paper-3 text-center text-xs font-bold text-ink-2">
          Already registered?{" "}
          <Link to="/login" className="text-ink font-black hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
