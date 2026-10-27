import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("aarav.sharma@campus.edu");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-paper bg-dot-pattern">
      <div className="w-full max-w-md rounded-3xl border-3 border-ink bg-paper-2 p-8 sm:p-10 shadow-hard-lg">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl border-2 border-ink bg-accent flex items-center justify-center shadow-hard mb-3">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <span className="font-heavy text-2xl font-black uppercase text-ink">
            Campus<span className="text-accent">Shield</span>
          </span>
          <p className="text-xs font-bold text-ink-3 mt-1">
            Sign in with your university student credentials
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl border-2 border-status-lost bg-status-lost-wash text-xs font-bold text-status-lost">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="College Email"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="student@campus.edu"
          />

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-ink">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-bold text-accent hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="mt-4">
            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to Shield
            </Button>
          </div>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="mt-6 p-3.5 rounded-2xl border-2 border-ink bg-pop-wash">
          <p className="text-[11px] font-black uppercase text-ink mb-1">
            Demo Student Profiles
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setEmail("aarav.sharma@campus.edu");
                setPassword("demo");
              }}
              className="px-2 py-1 rounded-lg border border-ink bg-paper text-[10px] font-bold hover:bg-pop cursor-pointer"
            >
              Aarav (Student)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("ananya.iyer@campus.edu");
                setPassword("demo");
              }}
              className="px-2 py-1 rounded-lg border border-ink bg-paper text-[10px] font-bold hover:bg-pop cursor-pointer"
            >
              Ananya (Finder)
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t-2 border-paper-3 text-center text-xs font-bold text-ink-2">
          New to Campus Shield?{" "}
          <Link to="/register" className="text-ink font-black hover:underline">
            Register Student Account
          </Link>
        </div>
      </div>
    </div>
  );
}
