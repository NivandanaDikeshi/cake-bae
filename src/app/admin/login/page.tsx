"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cake, User, ShieldAlert, ArrowLeft, ArrowRight } from "lucide-react";
import { useAppState } from "@/context/StateContext";

export default function AdminLoginPage() {
  const { login, currentUser, roles } = useAppState();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      router.push("/admin/dashboard");
    }
  }, [currentUser, router]);

  // Set default selected role
  useEffect(() => {
    if (roles.length > 0) {
      setSelectedRole(roles[0].name);
    }
  }, [roles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailToUse = email.trim() || `${selectedRole.toLowerCase().replace(/\s+/g, "")}@cakebae.lk`;

    if (!emailToUse) {
      setError("Please select a role or input an email.");
      return;
    }

    try {
      const success = login(emailToUse, selectedRole);
      if (success) {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid email credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Authentication error. Please try again.");
    }
  };

  const handleQuickLogin = (roleName: string) => {
    const defaultEmail = `${roleName.toLowerCase().replace(/\s+/g, "")}@cakebae.lk`;
    login(defaultEmail, roleName);
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2F0538] to-[#1E0124] flex flex-col justify-center items-center p-4">
      {/* Return to shop */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-1 text-xs font-bold text-purple-300 hover:text-white transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to storefront</span>
      </Link>

      <div className="w-full max-w-md bg-white border border-purple-100 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-purple-200 shadow-md flex items-center justify-center bg-purple-50 mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="Cake Bae Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <Cake className="w-8 h-8 text-purple-600 absolute" />
          </div>
          <h1 className="text-2xl font-black text-slate-800">Staff Portal Login</h1>
          <p className="text-xs text-slate-500">
            Access the orders, product catalogs, and custom RBAC dashboards.
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100/50 space-y-3">
          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block text-center">
            ⚡ Quick Demo Logins
          </span>
          <div className="grid grid-cols-2 gap-2">
            {roles.slice(0, 4).map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleQuickLogin(role.name)}
                className="px-3 py-2 bg-white hover:bg-purple-100 text-slate-700 hover:text-purple-700 rounded-lg text-xs font-bold shadow-xs border border-purple-100 transition truncate text-left"
                title={`Log in as ${role.name}`}
              >
                <span>{role.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Select Role Profile</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-white border border-purple-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-600">Portal Email Address</label>
              <span className="text-[9px] text-slate-400 font-medium">Leave blank for default demo email</span>
            </div>
            <div className="relative">
              <input
                type="email"
                placeholder={`${selectedRole.toLowerCase().replace(/\s+/g, "")}@cakebae.lk`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-purple-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition"
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs flex gap-2 items-start font-semibold">
              <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 py-3.5 bg-[#2F0538] hover:bg-[#4A1054] text-white font-bold rounded-xl shadow-md transition"
          >
            <span>Log In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
