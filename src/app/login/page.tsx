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

  // No auto-redirect / no persisted-session check here on purpose:
  // this page should always show the login form fresh and require the
  // person to enter their email and password every time, rather than
  // silently signing them in from an existing session.

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
        // Block staff/admin accounts from using the customer login.
        // We don't log them out here — that could sign them out of an
        // admin session open elsewhere. We just refuse to proceed on
        // this page.
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
        setError("We couldn't find an account matching that email and password. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      // Distinguish a network/server hiccup from a plain auth failure so the
      // person knows whether retrying is likely to help.
      if (err?.message?.toLowerCase().includes("network") || err?.message?.toLowerCase().includes("fetch")) {
        setError("We're having trouble connecting right now. Please check your internet connection and try again.");
      } else {
        setError(err?.message || "Something went wrong while signing you in. Please try again in a moment.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2F0538] to-[#1E0124] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 p-8">

        {/* Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border border-purple-200 shadow-md bg-purple-50 flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="Cake Bae Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          <h1 className="mt-5 text-3xl font-black text-[#2F0538]">
            User Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to access the Cake Bae user Dashboard.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>

            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" />

              <input
                type="email"
                placeholder="you@cakebae.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                autoComplete="username"
                style={{ color: "#0f172a" }}
                className="w-full rounded-xl border border-purple-200 py-3 pl-12 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                autoComplete="current-password"
                style={{ color: "#0f172a" }}
                className="w-full rounded-xl border border-purple-200 py-3 pl-12 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="flex gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting || !!successMessage}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#9D5CDB] py-3.5 text-white font-bold transition hover:bg-[#4A1054] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing In..." : successMessage ? "Redirecting..." : "Log In to Dashboard"}
            {!isSubmitting && !successMessage && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-[#9D5CDB] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}