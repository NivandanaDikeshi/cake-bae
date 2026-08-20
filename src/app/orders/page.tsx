"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useAppState } from "@/context/StateContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  PackageX,
  AlertCircle,
  Search,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Trash2,
  Loader2,
  ArrowRight
} from "lucide-react";

// Lightweight fallback for environments without framer-motion installed.
// This shim ignores animation-specific props and renders plain HTML elements.
const motion: any = new Proxy({}, {
  get: (_target, tag: string) => (props: any) => {
    const { children, ...rest } = props || {};
    // strip animation-related props
    const { initial, animate, variants, whileHover, whileTap, transition, viewport, whileInView, ...pass } = rest as any;
    return React.createElement(tag, pass, children);
  }
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const STEP_CLASSES: Record<string, string> = {
  "Pending": "bg-[#C292F0] text-white",
  "Confirmed": "bg-[#9D5CDB] text-white",
  "Baking/Decorating": "bg-[#4A1054] text-white",
  "Ready for Dispatch": "bg-[#F0B429] text-[#2F0538]",
  "Delivered": "bg-[#2F0538] text-white"
};

const STEP_LINE_CLASSES: Record<string, string> = {
  "Pending": "bg-[#C292F0]",
  "Confirmed": "bg-[#9D5CDB]",
  "Baking/Decorating": "bg-[#4A1054]",
  "Ready for Dispatch": "bg-[#F0B429]",
  "Delivered": "bg-[#2F0538]"
};

const STATUS_FILTERS = [
  "All",
  "Pending",
  "Confirmed",
  "Baking/Decorating",
  "Ready for Dispatch",
  "Delivered",
  "Cancelled"
];

const TRACK_STEPS = [
  { name: "Pending" },
  { name: "Confirmed" },
  { name: "Baking/Decorating" },
  { name: "Ready for Dispatch" },
  { name: "Delivered" }
];

function getStepIndex(status: string) {
  if (status === "Cancelled") return -1;
  if (status === "Completed" || status === "Delivered") return TRACK_STEPS.length - 1;
  const idx = TRACK_STEPS.findIndex((s) => s.name === status);
  return idx === -1 ? 0 : idx;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function formatCurrency(amount?: number) {
  return `Rs. ${(amount ?? 0).toLocaleString()}`;
}

function summarizeItems(items?: { product?: { name?: string } }[]) {
  const list = items ?? [];
  if (list.length === 0) return "No items";
  const first = list[0]?.product?.name ?? "Item";
  if (list.length === 1) return first;
  return `${first} + ${list.length - 1} more`;
}

function getOrderViewHref(order: { id: string }) {
  return `/order-success/${order.id}`;
}

function isOwnedByUser(order: any, user: any): boolean {
  if (!user) return false;

  const userEmail = (user.email ?? "").trim().toLowerCase();
  const orderEmail = (order.customerEmail ?? "").trim().toLowerCase();
  const matchesEmail = Boolean(userEmail) && Boolean(orderEmail) && userEmail === orderEmail;

  const userId = user.id ?? user._id;
  const orderUserId = order.userId ?? order.user?.id ?? order.user?._id;
  const matchesUserId =
    userId !== undefined &&
    userId !== null &&
    orderUserId !== undefined &&
    orderUserId !== null &&
    String(userId) === String(orderUserId);

  return matchesEmail || matchesUserId;
}

function MiniTracker({ status }: { status: string }) {
  const key = status?.toLowerCase();

  if (key === "cancelled") {
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-[#241129]/[0.05] border border-[#241129]/[0.08] px-3 py-2 text-xs font-bold text-[#241129]/50">
        <XCircle className="w-3.5 h-3.5" />
        Order cancelled
      </div>
    );
  }

  if (key === "delivered" || key === "completed") {
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-[#4A1054] px-3 py-2 text-xs font-bold text-white">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Delivered — order complete
      </div>
    );
  }

  const activeIdx = getStepIndex(status);

  return (
    <div className="flex items-center">
      {TRACK_STEPS.map((step, idx) => {
        const isDone = idx <= activeIdx;
        const isLast = idx === TRACK_STEPS.length - 1;
        return (
          <div key={step.name} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <span
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                isDone ? STEP_CLASSES[step.name] : "bg-[#9D5CDB]/[0.08] text-[#9D5CDB]/50 border border-[#9D5CDB]/20"
              }`}
              title={step.name}
            >
              {isDone ? "✓" : idx + 1}
            </span>
            {!isLast && (
              <span
                className={`h-0.5 flex-1 mx-1 rounded-full transition-colors ${
                  idx < activeIdx ? STEP_LINE_CLASSES[step.name] : "bg-[#9D5CDB]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, onCancel }: { order: any; onCancel: (order: any) => void }) {
  const items = order.items ?? [];
  const visible = items.slice(0, 4);
  const overflow = items.length - visible.length;
  const isCancellable = order.status !== "Cancelled" && order.status !== "Delivered" && order.status !== "Completed";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#9D5CDB]/15 bg-white shadow-sm hover:shadow-lg hover:shadow-[#2F0538]/5 hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between gap-3 p-5 pb-4 border-b border-dashed border-[#9D5CDB]/15">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-[#241129]/35 truncate">#{order.id}</p>
          <p className="font-display text-base font-semibold text-[#241129] mt-0.5">
            {summarizeItems(order.items)}
          </p>
          <p className="text-[11px] text-[#241129]/40 mt-0.5">Placed {formatDate(order.createdAt)}</p>
        </div>
        <span className="flex-shrink-0 text-right">
          <span className="block font-bold text-[#2F0538] text-sm">{formatCurrency(order.totalPrice)}</span>
          <span className="text-[10px] font-bold uppercase text-[#241129]/35">
            {order.paymentStatus ?? "Unpaid"}
          </span>
        </span>
      </div>

      <div className="px-5 pt-4 flex items-center gap-2">
        {visible.length === 0 ? (
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#9D5CDB]/15 bg-[#F7F1FB] text-[#9D5CDB]/50">
            <ShoppingBag className="w-4 h-4" />
          </span>
        ) : (
          visible.map((item: any, idx: number) => {
            const src = item?.product?.image;
            return (
              <span
                key={idx}
                className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-[#9D5CDB]/15 bg-[#F7F1FB]"
                title={item.product?.name}
              >
                {src ? (
                  <img src={src} alt={item.product?.name ?? "Item"} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[#9D5CDB]/50">
                    <ShoppingBag className="w-4 h-4" />
                  </span>
                )}
              </span>
            );
          })
        )}
        {overflow > 0 && (
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#9D5CDB] text-[11px] font-bold text-white">
            +{overflow}
          </span>
        )}
      </div>

      <div className="px-5 pt-5 pb-5">
        <MiniTracker status={order.status} />
      </div>

      <div className="flex items-center gap-2 border-t border-[#9D5CDB]/10 p-4 bg-[#F7F1FB]/60">
        <Link
          href={getOrderViewHref(order)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#F7F1FB] hover:bg-[#4A1054] hover:text-white text-[#4A1054] text-xs font-bold rounded-lg transition-colors duration-300"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        {isCancellable && (
          <button
            onClick={() => onCancel(order)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-500 text-xs font-bold hover:bg-red-500 hover:border-red-500 hover:text-white active:scale-95 transition-all duration-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cancel</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { orders, currentUser, updateOrderStatus } = useAppState();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [cancelOrder, setCancelOrder] = useState<any | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const myOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders
      .filter((o) => isOwnedByUser(o, currentUser))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, currentUser]);

  const filteredOrders = useMemo(() => {
    return myOrders.filter((order) => {
      const matchesSearch = !searchTerm || order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [myOrders, searchTerm, statusFilter]);

  const handleConfirmCancel = async () => {
    if (!cancelOrder) return;
    setCancelling(true);
    try {
      await updateOrderStatus(cancelOrder.id, "Cancelled");
      setCancelOrder(null);
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Something went wrong while cancelling this order. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F7F1FB] flex flex-col">
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap");
          .font-display {
            font-family: "Fraunces", ui-serif, Georgia, serif;
            letter-spacing: -0.01em;
          }
          body { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
        `}</style>
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
          <AlertCircle className="w-8 h-8 text-[#9D5CDB]/50" />
          <p className="font-display text-lg font-semibold text-[#241129]">Please log in to view your orders</p>
          <Link
            href="/login"
            className="px-5 py-2.5 bg-[#9D5CDB] hover:bg-[#4A1054] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#9D5CDB]/30 transition-all duration-300"
          >
            Go to Login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F1FB]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap");
        .font-display {
          font-family: "Fraunces", ui-serif, Georgia, serif;
          letter-spacing: -0.01em;
        }
        body { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }

        /* Slim, unobtrusive horizontal scrollbar for the status filter row */
        .status-filter-row::-webkit-scrollbar {
          height: 4px;
        }
        .status-filter-row::-webkit-scrollbar-thumb {
          background-color: rgba(157, 92, 219, 0.25);
          border-radius: 9999px;
        }
        .status-filter-row::-webkit-scrollbar-track {
          background: transparent;
        }

        @keyframes cancelModalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .cancel-modal-in {
          animation: cancelModalIn 0.25s ease-out;
        }
      `}</style>

      <Header />

      {/* Page Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2F0538] via-[#1E0124] to-[#4A1054] text-white py-20 sm:py-24 text-center">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#9D5CDB] filter blur-3xl opacity-20"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-5"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#F7F1FB] font-semibold text-xs tracking-[0.15em] uppercase border border-white/10"
          >
            <span>Order Ledger</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]">
            My <span className="italic font-medium bg-gradient-to-r from-[#F7F1FB] to-[#9D5CDB] bg-clip-text text-transparent">Orders</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-[#F7F1FB]/85 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
            You have placed {myOrders.length} order{myOrders.length === 1 ? "" : "s"} with Cake Bae.
          </motion.p>
        </motion.div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">

        <div className="bg-white rounded-2xl border border-[#9D5CDB]/15 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#241129]/35" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#9D5CDB]/15 bg-[#F7F1FB]/60 text-sm text-[#241129] placeholder:text-[#241129]/35 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/25 focus:border-[#9D5CDB] transition-all duration-200"
              />
            </div>
            <div className="status-filter-row flex flex-nowrap items-center gap-1 bg-[#F7F1FB] p-1 rounded-xl border border-[#9D5CDB]/12 self-start overflow-x-auto max-w-full">
              {STATUS_FILTERS.map((status) => {
                const active = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg text-[11px] font-bold border whitespace-nowrap shrink-0 transition-all duration-200 ${active ? 'border-[#9D5CDB] bg-[#9D5CDB] text-white' : 'border-transparent bg-transparent text-[#9D5CDB]'} hover:bg-[#4A1054] hover:border-[#4A1054] hover:text-white`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-16 text-center bg-white rounded-2xl border border-[#9D5CDB]/15">
            <div className="w-14 h-14 rounded-2xl bg-[#F7F1FB] flex items-center justify-center mb-1">
              <PackageX className="h-6 w-6 text-[#9D5CDB]/50" />
            </div>
            <p className="font-display font-semibold text-lg text-[#241129]">
              {myOrders.length === 0 ? "No orders yet" : "No orders match your search"}
            </p>
            <p className="text-sm text-[#241129]/50">
              {myOrders.length === 0
                ? "Your orders will show up here once you place one."
                : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={setCancelOrder} />
            ))}
          </div>
        )}
      </div>

      {cancelOrder && (
        <div
          className="fixed inset-0 z-50 bg-[#2F0538]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !cancelling && setCancelOrder(null)}
        >
          <div
            className="cancel-modal-in relative w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-red-900/10 overflow-hidden text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative red top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-red-400 via-red-500 to-red-400" />

            <div className="p-7 sm:p-8">
              <div className="relative w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5 ring-8 ring-red-50/50">
                <div className="absolute inset-0 rounded-2xl bg-red-400/10 animate-ping" />
                <AlertCircle className="relative w-7 h-7 text-red-500" strokeWidth={2.2} />
              </div>

              <h3 className="font-display text-xl font-semibold text-[#241129] mb-2">
                Cancel this order?
              </h3>
              <p className="text-sm text-[#241129]/55 leading-relaxed mb-1">
                This will mark order <span className="font-mono font-semibold text-[#241129]/70">#{cancelOrder.id}</span> as cancelled.
              </p>
              <p className="text-xs text-red-500/80 font-semibold mb-7">
                This action cannot be undone.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCancelOrder(null)}
                  disabled={cancelling}
                  className="flex-1 px-4 py-3 rounded-xl border border-[#241129]/12 text-[#241129]/70 text-sm font-bold hover:bg-[#F7F1FB] transition disabled:opacity-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={cancelling}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelling…
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Yes, Cancel Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}