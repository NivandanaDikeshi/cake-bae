"use client";

import React, { useMemo } from "react";
import { TrendingUp, ShoppingBag, Banknote, AlertTriangle, Clock, PackageSearch } from "lucide-react";
import { useAppState, Order } from "@/context/StateContext";

const MAX_DAILY_ORDERS = 8;

function getOrderTotal(o: Order): number {
  const anyO = o as any;
  const raw = anyO.totalPrice ?? anyO.total ?? anyO.totalAmount ?? 0;
  return typeof raw === "number" ? raw : Number(raw) || 0;
}

function getOrderStatus(o: Order): string {
  return (o.status || "").toString().trim().toLowerCase();
}

function toDateKey(value: string | undefined): string | null {
  if (!value) return null;
  // Handles both full ISO timestamps and plain "YYYY-MM-DD" strings.
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
}

export default function AdminDashboardOverview() {
  const { orders, products, blockedDates } = useAppState();

  const todayKey = useMemo(() => new Date().toISOString().split("T")[0], []);
  const tomorrowKey = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const nonCancelledToday = useMemo(
    () =>
      orders.filter((o) => {
        const status = getOrderStatus(o);
        const createdKey = toDateKey(o.createdAt);
        return status !== "cancelled" && createdKey === todayKey;
      }),
    [orders, todayKey]
  );

  const totalSalesToday = nonCancelledToday.length;

  const revenueToday = useMemo(
    () => nonCancelledToday.reduce((sum, o) => sum + getOrderTotal(o), 0),
    [nonCancelledToday]
  );

  const activeOrders = useMemo(
    () =>
      orders.filter((o) => {
        const status = getOrderStatus(o);
        return status !== "completed" && status !== "delivered" && status !== "cancelled";
      }).length,
    [orders]
  );

  // Sales by product category — derived from real order line items,
  // matched against the live products list for each item's category.
  const categorySales = useMemo(() => {
    const productCategoryById = new Map(products.map((p) => [p.id, p.category]));
    const totals: Record<string, number> = {};

    orders.forEach((o) => {
      if (getOrderStatus(o) === "cancelled") return;
      (o.items || []).forEach((item) => {
        const category =
          productCategoryById.get(item.product?.id) || item.product?.category || "Uncategorized";
        const lineTotal = (item.product?.price || 0) * (item.quantity || 0);
        totals[category] = (totals[category] || 0) + lineTotal;
      });
    });

    return totals;
  }, [orders, products]);

  const totalCategorySales = Object.values(categorySales).reduce((a, b) => a + b, 0);

  // Kitchen capacity — real counts of orders scheduled per delivery date.
  const ordersToday = useMemo(
    () => orders.filter((o) => toDateKey(o.deliveryDate) === todayKey && getOrderStatus(o) !== "cancelled").length,
    [orders, todayKey]
  );
  const ordersTomorrow = useMemo(
    () =>
      orders.filter((o) => toDateKey(o.deliveryDate) === tomorrowKey && getOrderStatus(o) !== "cancelled").length,
    [orders, tomorrowKey]
  );

  const pctToday = Math.min((ordersToday / MAX_DAILY_ORDERS) * 100, 100);
  const pctTomorrow = Math.min((ordersTomorrow / MAX_DAILY_ORDERS) * 100, 100);

  // Payment method breakdown — real split from order.paymentMethod.
  const paymentBreakdown = useMemo(() => {
    const relevant = orders.filter((o) => getOrderStatus(o) !== "cancelled");
    const total = relevant.length;
    if (total === 0) return { codPct: 0, cardPct: 0, total: 0 };

    const codCount = relevant.filter((o) => (o.paymentMethod || "").toUpperCase() === "COD").length;
    const cardCount = total - codCount;

    return {
      codPct: Math.round((codCount / total) * 100),
      cardPct: Math.round((cardCount / total) * 100),
      total,
    };
  }, [orders]);

  // Activity timeline — real recent orders, most recent first.
  const recentActivity = useMemo(() => {
    return [...orders]
      .filter((o) => !!o.createdAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)
      .map((o) => ({
        time: new Date(o.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: `Order ${o.id} — ${o.customerName || "Unknown customer"} · ${o.status}`,
      }));
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-xs mt-0.5">Live baking operations overview — {todayLabel}</p>
        </div>
      </div>

      {/* Stats Cards */}
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
            <p className="text-xs text-slate-400 mt-1">Non-cancelled orders placed today</p>
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
            <p className="text-xs text-slate-400 mt-1">Sum of today's order totals</p>
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
        </div>

        {/* Blocked / fully booked dates */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Blocked Dates</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">{blockedDates.length}</h3>
            <p className="text-xs text-slate-400 mt-1">Dates unavailable for delivery</p>
          </div>
        </div>
      </div>

      {/* Row 2: Sales Charts & Capacity Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cake Sales by Category */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-800">Sales by Category</h3>
          {totalCategorySales === 0 ? (
            <p className="text-xs text-slate-400">No completed orders yet.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(categorySales)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, val]) => {
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
          )}
        </div>

        {/* Calendar Capacity Levels */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-800">Kitchen Baking Capacity</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Slots Booked Today</span>
                <span className="font-bold text-slate-800">
                  {ordersToday} / {MAX_DAILY_ORDERS} Orders ({Math.round(pctToday)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${pctToday >= 90 ? "bg-red-500" : pctToday >= 60 ? "bg-amber-500" : "bg-green-500"}`}
                  style={{ width: `${pctToday}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Slots Booked Tomorrow</span>
                <span className="font-bold text-slate-800">
                  {ordersTomorrow} / {MAX_DAILY_ORDERS} Orders ({Math.round(pctTomorrow)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${pctTomorrow >= 90 ? "bg-red-500" : pctTomorrow >= 60 ? "bg-amber-500" : "bg-green-500"}`}
                  style={{ width: `${pctTomorrow}%` }}
                ></div>
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
          {paymentBreakdown.total === 0 ? (
            <p className="text-xs text-slate-400">No orders yet.</p>
          ) : (
            <div className="flex items-center justify-around py-4">
              <div
                className="relative w-28 h-28 rounded-full flex items-center justify-center"
                style={{
                  border: "10px solid",
                  borderColor: "#9333ea",
                  background: `conic-gradient(#9333ea 0% ${paymentBreakdown.codPct}%, #cbd5e1 ${paymentBreakdown.codPct}% 100%)`,
                }}
              >
                <div className="absolute inset-[10px] bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-black text-slate-700">{paymentBreakdown.codPct}% COD</span>
                </div>
              </div>
              <div className="space-y-2 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                  <span>Cash on Delivery ({paymentBreakdown.codPct}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-slate-300 rounded-full"></span>
                  <span>Card ({paymentBreakdown.cardPct}%)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Activity Timeline & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Timeline — built from real recent orders */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Recent Order Activity</h3>
          </div>

          {recentActivity.length === 0 ? (
            <p className="text-xs text-slate-400">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((event, idx) => (
                <div key={idx} className="flex gap-4 text-xs">
                  <span className="text-slate-400 font-semibold flex-shrink-0 pt-0.5 whitespace-nowrap">
                    {event.time}
                  </span>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    <span className="text-green-600 font-bold">🛒 </span>
                    {event.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory — no ingredients collection exists yet */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Stock Warnings</h3>
          <div className="flex flex-col items-center justify-center text-center py-6 text-slate-400 gap-2">
            <PackageSearch className="w-8 h-8" />
            <p className="text-xs">
              No inventory tracking connected yet. Add an <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">ingredients</code> collection to
              show live low-stock alerts here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}