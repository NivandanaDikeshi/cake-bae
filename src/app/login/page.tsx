"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cake, User, Lock, ShieldAlert, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { useAppState } from "@/context/StateContext";

export default function UserLoginPage() {
  const { login, roles } = useAppState();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper: is this account a staff/admin account?
  const isStaffUser = (user: { roleId?: string | null } | null | undefined) => {
    if (!user?.roleId) return false;
    return roles.some((r) => r.id === user.roleId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Friendly, specific validation messages instead of one generic line
    if (!trimmedEmail && !trimmedPassword) {
      setError("Please enter your email and password to continue.");
      return;
    }
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("That email address doesn't look quite right. Please double-check it.");
      return;
    }
    if (!trimmedPassword) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedInUser = await login(trimmedEmail, trimmedPassword);

      if (loggedInUser) {
        if (isStaffUser(loggedInUser)) {
          setError("This login is for customer accounts only. Please use the admin login to access the dashboard.");
          setIsSubmitting(false);
          return;
        }

        setSuccessMessage("You're logged in! Taking you to your dashboard...");
        setTimeout(() => {
          router.push("/");
        }, 700);
      } else {
        setError("Username or Password incorrect.");
      }
    } catch (err: any) {
      console.error(err);
      if (err?.message?.toLowerCase().includes("network") || err?.message?.toLowerCase().includes("fetch")) {
        setError("We're having trouble connecting right now. Please check your internet connection and try again.");
      } else {
        setError("Username or Password incorrect.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2F0538] to-[#1E0124] flex items-center justify-center p-4 relative overflow-hidden bg-grid-pattern">
      <style jsx global>{`
        .bg-grid-pattern {
          background-size: 30px 30px;
          background-image: linear-gradient(to right, rgba(157, 92, 219, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(157, 92, 219, 0.03) 1px, transparent 1px);
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .ambient-glow {
          animation: pulse-glow 8s infinite ease-in-out;
        }
      `}</style>

      {/* Decorative ambient glowing orbs */}
      <div className="absolute -top-[10%] -left-[10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-purple-600/10 blur-[100px] sm:blur-[130px] pointer-events-none ambient-glow" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-pink-500/10 blur-[100px] sm:blur-[130px] pointer-events-none ambient-glow" style={{ animationDelay: "4s" }} />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(47,5,56,0.3)] border border-purple-100/50 p-8 sm:p-10 relative z-10 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(47,5,56,0.35)]">
        {/* Floating Return Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 text-xs font-bold text-purple-400 hover:text-purple-600 flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Store</span>
        </Link>

        {/* Logo */}
        <div className="flex flex-col items-center text-center mt-4 mb-8">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-purple-200 shadow-lg bg-purple-50 flex items-center justify-center p-0.5 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition duration-500" />
            <img
              src="/logo.jpg"
              alt="Cake Bae Logo"
              className="w-full h-full object-cover rounded-full relative z-10 transition duration-500 group-hover:scale-95"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          <h1 className="mt-5 text-3xl font-black text-[#2F0538] tracking-tight bg-gradient-to-r from-[#2F0538] to-[#4A1054] bg-clip-text text-transparent">
            User Login
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-500/90 font-medium">
            Sign in to access your Cake Bae account dashboard.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              Email Address
            </label>

            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-purple-400/80" />

              <input
                type="email"
                placeholder="you@cakebae.com"
                value={email}
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                autoComplete="username"
                style={{ color: "#0f172a" }}
                className="w-full rounded-2xl border border-purple-100 bg-purple-50/15 py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 focus:bg-white transition duration-300 shadow-inner"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-purple-400/80" />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                autoComplete="current-password"
                style={{ color: "#0f172a" }}
                className="w-full rounded-2xl border border-purple-100 bg-purple-50/15 py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 focus:bg-white transition duration-300 shadow-inner"
              />
            </div>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="flex gap-2 rounded-2xl border border-green-200 bg-green-50/80 p-3 text-xs sm:text-sm text-green-700 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex gap-2 rounded-2xl border border-red-200 bg-red-50/80 p-3 text-xs sm:text-sm text-red-700 animate-fade-in">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting || !!successMessage}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#9D5CDB] to-[#6D28D9] hover:from-[#8B5CF6] hover:to-[#5B21B6] py-3.5 sm:py-4 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Signing In..." : successMessage ? "Redirecting..." : "Log In to Dashboard"}
            {!isSubmitting && !successMessage && <ArrowRight className="w-4.5 h-4.5" />}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-8 text-center text-xs sm:text-sm text-slate-500 font-medium">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-[#9D5CDB] hover:text-[#7C3AED] transition hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}