import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-paper bg-dot-pattern">
      <div className="w-full max-w-md rounded-3xl border-3 border-ink bg-paper-2 p-8 sm:p-10 shadow-hard-lg">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl border-2 border-ink bg-paper-3 flex items-center justify-center shadow-hard mb-3">
            <Shield className="w-7 h-7 text-ink" />
          </div>
          <h1 className="font-heavy text-2xl font-black uppercase text-ink">
            Reset Password
          </h1>
          <p className="text-xs font-bold text-ink-3 mt-1">
            We will dispatch reset instructions to your official college mailbox.
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center text-center p-6 rounded-2xl border-2 border-ink bg-accent-wash">
            <CheckCircle2 className="w-10 h-10 text-accent mb-2" />
            <h3 className="font-heavy text-base font-black text-ink">
              Instructions Dispatched
            </h3>
            <p className="text-xs font-bold text-ink-2 mt-1">
              Please check your university inbox at <span className="text-ink">{email}</span>.
            </p>
            <Link to="/login" className="mt-5">
              <Button variant="accent" size="sm">
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="College Email Address"
              type="email"
              icon={Mail}
              required
              placeholder="student@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" variant="accent" size="lg" loading={loading} className="mt-2">
              Send Password Reset Link
            </Button>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-ink-2 hover:text-ink hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
