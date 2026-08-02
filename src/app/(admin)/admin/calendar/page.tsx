"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, CheckCircle2, AlertTriangle, ShieldCheck, X } from "lucide-react";
import { useAppState } from "@/context/StateContext";

export default function AdminCalendarPage() {
  const { blockedDates, toggleBlockedDate } = useAppState();
  const [selectedDate, setSelectedDate] = useState("");

  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && !blockedDates.includes(selectedDate)) {
      toggleBlockedDate(selectedDate);
      setSelectedDate("");
    }
  };

  // Generate next 14 days list to let user toggle quickly
  const getNextDays = () => {
    const days = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date(Date.now() + 86400000 * i);
      const str = date.toISOString().split("T")[0];
      const formatted = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      days.push({ str, formatted });
    }
    return days;
  };

  const nextDays = getNextDays();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Baking Capacity & Availability Calendar</h1>
        <p className="text-slate-500 text-xs mt-0.5">Manage daily order capacity. Block out dates when the kitchen is fully booked to prevent new storefront orders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Toggle Grid */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CalendarIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-800">Quick Toggle Capacity (Next 14 Days)</h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Click on a date card to block/unblock it. Blocked dates will show as "Fully Booked" on the storefront checkout date picker, preventing any customer order placement.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {nextDays.map((day) => {
              const isBlocked = blockedDates.includes(day.str);
              return (
                <button
                  key={day.str}
                  onClick={() => toggleBlockedDate(day.str)}
                  className={`p-4 border rounded-2xl text-center space-y-2 transition transform hover:-translate-y-0.5 shadow-xs flex flex-col items-center justify-center ${
                    isBlocked
                      ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100/50"
                      : "bg-white border-purple-100 text-slate-700 hover:bg-purple-50/50"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                    {day.formatted.split(",")[0]}
                  </span>
                  <span className="text-base font-black">
                    {day.formatted.split(",")[1]}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                    isBlocked
                      ? "bg-red-100/60 border-red-200 text-red-700"
                      : "bg-green-50 border-green-200 text-green-700"
                  }`}>
                    {isBlocked ? "Fully Booked" : "Available"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Manual Picker & Blocked list */}
        <div className="lg:col-span-4 space-y-6">
          {/* Add Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Block Custom Date</h3>
            <form onSubmit={handleAddBlockedDate} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Select Date</label>
                <input
                  type="date"
                  required
                  min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs text-slate-700 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Mark Date Fully Booked
              </button>
            </form>
          </div>

          {/* List of blocked dates */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Blocked Dates List</h3>
            {blockedDates.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-2 space-y-2">
                {blockedDates.map((date) => (
                  <div key={date} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="font-bold text-slate-800">
                        {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleBlockedDate(date)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition"
                      title="Unblock date"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs space-y-2">
                <ShieldCheck className="w-8 h-8 mx-auto text-green-500" />
                <p>All dates are currently available for orders. No blocked dates.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
