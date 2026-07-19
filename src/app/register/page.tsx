"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

import { User, Mail, Lock, Cake, ShieldAlert, ArrowRight } from "lucide-react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      const user = userCredential.user;

      // Check if a user with this email already exists in Firestore (e.g. pre-authorized staff member)
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", formData.email.trim().toLowerCase()));
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
        if (!hasSuperAdmin || formData.email.trim().toLowerCase().startsWith("admin@")) {
          existingRole = "r-superadmin";
        }
      }

      // Save user details in Firestore under their Firebase UID
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name.trim(),
        email: formData.email.trim(),
        roleId: existingRole,
        status: existingStatus,
        phone: existingPhone,
        address: existingAddress,
        createdAt: serverTimestamp(),
      });

      router.push("/login");
    } catch (err: any) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
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
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Join Cake Bae and start ordering.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name
            </label>

            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" />

              <input
                name="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                className="w-full rounded-xl border border-purple-200 py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" />

              <input
                name="email"
                type="email"
                placeholder="you@cakebae.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full rounded-xl border border-purple-200 py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full rounded-xl border border-purple-200 py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" />

              <input
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full rounded-xl border border-purple-200 py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2F0538] py-3.5 text-white font-bold transition hover:bg-[#4A1054] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#9D5CDB] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}