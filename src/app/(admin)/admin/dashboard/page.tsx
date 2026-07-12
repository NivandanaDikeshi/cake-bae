"use client";

import React from "react";
import { TrendingUp, ShoppingBag, Banknote, AlertTriangle, Clock, Plus, CheckCircle2 } from "lucide-react";
import { useAppState } from "@/context/StateContext";

export default function AdminDashboardOverview() {
  const { orders, products, blockedDates } = useAppState();

  // Metrics calculations
  const totalSalesToday = orders.filter(o => o.status !== "Cancelled").length;
  const revenueToday = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const activeOrders = orders.filter(
    (o) => o.status !== "Completed" && o.status !== "Delivered" && o.status !== "Cancelled"
  ).length;

  const lowStockIngredients = [
    { name: "Premium Cocoa Powder", level: "1.2 kg", target: "5.0 kg", status: "Needs attention" },
    { name: "Unsalted Butter", level: "3.5 kg", target: "15.0 kg", status: "Needs attention" }
  ];

  // Sales by Category
  const categorySales = {
    "Celebration Cakes": 42000,
    "Bento Cakes": 16800,
    "Cupcakes": 12000,
    "Desserts": 8500
  };

  const totalCategorySales = Object.values(categorySales).reduce((a, b) => a + b, 0);

  // Timeline events
  const timelineEvents = [
    { time: "13:45", text: "Low stock alert: Premium Cocoa Powder dropped below 2.0 kg reorder level.", type: "warning" },
    { time: "13:42", text: "Order recorded: CB-1002 — Lotus Biscoff Cheesecake Slide & Bento Box Cake by Minoli Perera.", type: "order" },
    { time: "12:10", text: "Custom Role added: Branch Manager created by Savi Wijayalath.", type: "role" },
    { time: "09:30", text: "Ingredients replenishment request submitted for Sugar and Cream Cheese.", type: "system" }
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-xs mt-0.5">Live baking operations overview — Sunday, July 12, 2026</p>
        </div>
        <div className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 h-fit w-fit">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
          <span>Placeholder data — connect API endpoints to go live</span>
        </div>
      </div>

      {/* Stats Cards (Inspired by Screenshot 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sales */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Sales Today</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">{totalSalesToday}</h3>
            <p className="text-xs text-slate-400 mt-1">Completed transactions</p>
          </div>
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md w-fit">
            <TrendingUp className="w-3 h-3" />
            <span>+12%</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Revenue Today</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">LKR {revenueToday.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-1">Collected cash/transfer</p>
          </div>
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md w-fit">
            <TrendingUp className="w-3 h-3" />
            <span>+8.4%</span>
          </div>
        </div>

        {/* Active Baking Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Kitchen Orders</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">{activeOrders}</h3>
            <p className="text-xs text-slate-400 mt-1">Pending or baking currently</p>
          </div>
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md w-fit">
            <span>In Progress</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Low Stock Alerts</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">{lowStockIngredients.length}</h3>
            <p className="text-xs text-slate-400 mt-1">Kitchen items below reorder level</p>
          </div>
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md w-fit">
            <span>Needs Attention</span>
          </div>
        </div>
      </div>

      {/* Row 2: Sales Charts & Capacity Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cake Sales by Category */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-800">Cake Sales by Category</h3>
          <div className="space-y-4">
            {Object.entries(categorySales).map(([cat, val]) => {
              const pct = (val / totalCategorySales) * 100;
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>{cat}</span>
                    <span className="font-bold text-slate-800">Rs. {val.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Capacity Levels */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-800">Kitchen Baking Capacity</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Slots Booked Today</span>
                <span className="font-bold text-slate-800">3 / 8 Orders (37.5%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: "37.5%" }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Slots Booked Tomorrow</span>
                <span className="font-bold text-slate-800">7 / 8 Orders (87.5%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "87.5%" }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Fully Booked Dates (Blocked)</span>
                <span className="font-bold text-slate-800">{blockedDates.length} Dates blocked</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full"
                  style={{ width: `${Math.min(blockedDates.length * 15, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-800">Payment Breakdown</h3>
          <div className="flex items-center justify-around py-4">
            <div className="relative w-28 h-28 rounded-full border-[10px] border-purple-600 flex items-center justify-center">
              <span className="text-xs font-black text-slate-700">75% COD</span>
            </div>
            <div className="space-y-2 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                <span>Cash on Delivery (75%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-slate-300 rounded-full"></span>
                <span>Bank Transfer (25%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Activity Timeline & Stock alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Timeline */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Activity Timeline</h3>
            <button className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
              Refresh
            </button>
          </div>
          
          <div className="space-y-4">
            {timelineEvents.map((event, idx) => (
              <div key={idx} className="flex gap-4 text-xs">
                <span className="text-slate-400 font-semibold flex-shrink-0 pt-0.5">{event.time}</span>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {event.type === "warning" && <span className="text-red-500 font-bold">⚠️ Warning: </span>}
                  {event.type === "order" && <span className="text-green-600 font-bold">🛒 New Order: </span>}
                  {event.type === "role" && <span className="text-[#9D5CDB] font-bold">🔑 Role Setup: </span>}
                  {event.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Ingredient alerts */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-800">Stock Warnings</h3>
          <div className="divide-y divide-slate-100">
            {lowStockIngredients.map((item, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-slate-800">{item.name}</h4>
                  <span className="text-slate-400">Current: {item.level} / Target: {item.target}</span>
                </div>
                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold border border-red-100 uppercase scale-90">
                  Low
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
