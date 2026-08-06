"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

import { User, Mail, Lock, ShieldAlert, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear any existing error as soon as the person starts correcting a field
    if (error) setError(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    // Friendly, field-specific validation instead of one generic line
    if (!trimmedName) {
      setError("Please enter your full name.");
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
    if (!formData.password) {
      setError("Please create a password.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Your password needs to be at least 6 characters long.");
      return;
    }
    if (!formData.confirmPassword) {
      setError("Please confirm your password.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Those passwords don't match. Please re-enter them.");
      return;
    }

    try {
      setLoading(true);

      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        formData.password
      );

      const user = userCredential.user;

      // Check if a user with this email already exists in Firestore (e.g. pre-authorized staff member)
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", trimmedEmail.toLowerCase()));
      const querySnapshot = await getDocs(q);

      let existingRole = "customer";
      let existingStatus = "Active";
      let existingPhone = "";
      let existingAddress = "";

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        const existingData = existingDoc.data();
        existingRole = existingData.roleId || existingData.role || "customer";
        existingStatus = existingData.status || "Active";
        existingPhone = existingData.phone || "";
        existingAddress = existingData.address || "";

        // If the pre-authorized document had a different ID (e.g. u-temp-xxx), delete it
        if (existingDoc.id !== user.uid) {
          await deleteDoc(doc(db, "users", existingDoc.id));
        }
      } else {
        const allUsersSnap = await getDocs(usersRef);
        const hasSuperAdmin = allUsersSnap.docs.some((d) => d.data().roleId === "r-superadmin");
        if (!hasSuperAdmin || trimmedEmail.toLowerCase().startsWith("admin@")) {
          existingRole = "r-superadmin";
        }
      }

      // Save user details in Firestore under their Firebase UID
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: trimmedName,
        email: trimmedEmail,
        roleId: existingRole,
        status: existingStatus,
        phone: existingPhone,
        address: existingAddress,
        createdAt: serverTimestamp(),
      });

      setSuccessMessage("Account created! Taking you to the login page...");
      setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (err: any) {
      console.error(err);

      // Friendly, specific messages mapped from Firebase's error codes
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Try logging in instead, or use a different email.");
      } else if (err.code === "auth/invalid-email") {
        setError("That email address doesn't look quite right. Please double-check it.");
      } else if (err.code === "auth/weak-password") {
        setError("That password is too weak. Try adding more characters, numbers, or symbols.");
      } else if (err.code === "auth/network-request-failed") {
        setError("We're having trouble connecting right now. Please check your internet connection and try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts in a row. Please wait a moment before trying again.");
      } else {
        setError("We couldn't create your account. Please try again in a moment.");
      }
    } finally {
      setLoading(false);
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
            Create Account
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-500/90 font-medium">
            Join Cake Bae and start ordering.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              Full Name
            </label>

            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-purple-400/80" />

              <input
                name="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                style={{ color: "#0f172a" }}
                className="w-full rounded-2xl border border-purple-100 bg-purple-50/15 py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 focus:bg-white transition duration-300 shadow-inner"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-purple-400/80" />

              <input
                name="email"
                type="email"
                placeholder="you@cakebae.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
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
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                style={{ color: "#0f172a" }}
                className="w-full rounded-2xl border border-purple-100 bg-purple-50/15 py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 focus:bg-white transition duration-300 shadow-inner"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              Confirm Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-purple-400/80" />

              <input
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
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

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading || !!successMessage}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#9D5CDB] to-[#6D28D9] hover:from-[#8B5CF6] hover:to-[#5B21B6] py-3.5 sm:py-4 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Creating Account..." : successMessage ? "Redirecting..." : "Create Account"}
            {!loading && !successMessage && <ArrowRight className="w-4.5 h-4.5" />}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-8 text-center text-xs sm:text-sm text-slate-500 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#9D5CDB] hover:text-[#7C3AED] transition hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}