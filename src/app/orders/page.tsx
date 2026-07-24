"use client";

import { useMemo, useState } from "react";
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

// Gold stays reserved for a single meaning — "almost in your hands" — on
// the Ready for Dispatch step. Everything else uses the same purple-*/
// slate-* Tailwind classes as the storefront home page, plus the brand's
// arbitrary hex accents (#2F0538, #9D5CDB, #4A1054, #C292F0) it already uses.
const STEP_CLASSES: Record<string, string> = {
  "Pending": "bg-[#C292F0] text-white",
  "Confirmed": "bg-[#9D5CDB] text-white",
  "Baking/Decorating": "bg-purple-700 text-white",
  "Ready for Dispatch": "bg-[#F0B429] text-[#2F0538]",
  "Delivered": "bg-[#2F0538] text-white"
};

const STEP_LINE_CLASSES: Record<string, string> = {
  "Pending": "bg-[#C292F0]",
  "Confirmed": "bg-[#9D5CDB]",
  "Baking/Decorating": "bg-purple-700",
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

// --- Robust ownership check -------------------------------------------
// Handles: id type mismatches (string vs number), case differences in
// email, stray whitespace, and avoids matching when both sides are empty.
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
// ------------------------------------------------------------------------

function MiniTracker({ status }: { status: string }) {
  const key = status?.toLowerCase();

  if (key === "cancelled") {
    // Cancelled isn't "an error" — it's simply outside the pipeline, so it
    // gets a neutral slate badge rather than a red/rose alarm color.
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-100 px-3 py-2 text-xs font-bold text-slate-500">
        <XCircle className="w-3.5 h-3.5" />
        Order cancelled
      </div>
    );
  }

  if (key === "delivered" || key === "completed") {
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-[#2F0538] px-3 py-2 text-xs font-bold text-white">
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
                isDone ? STEP_CLASSES[step.name] : "bg-purple-50 text-purple-300 border border-purple-100"
              }`}
              title={step.name}
            >
              {isDone ? "✓" : idx + 1}
            </span>
            {!isLast && (
              <span
                className={`h-0.5 flex-1 mx-1 rounded-full transition-colors ${
                  idx < activeIdx ? STEP_LINE_CLASSES[step.name] : "bg-purple-100"
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
    <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 p-5 pb-4 border-b border-dashed border-purple-100">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-slate-400 truncate">#{order.id}</p>
          <p className="font-display text-base font-semibold text-slate-800 mt-0.5">
            {summarizeItems(order.items)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Placed {formatDate(order.createdAt)}</p>
        </div>
        <span className="flex-shrink-0 text-right">
          <span className="block font-black text-slate-900 text-sm">{formatCurrency(order.totalPrice)}</span>
          <span className="text-[10px] font-bold uppercase text-slate-400">
            {order.paymentStatus ?? "Unpaid"}
          </span>
        </span>
      </div>

      <div className="px-5 pt-4 flex items-center gap-2">
        {visible.length === 0 ? (
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-purple-100 bg-purple-50 text-purple-300">
            <ShoppingBag className="w-4 h-4" />
          </span>
        ) : (
          visible.map((item: any, idx: number) => {
            const src = item?.product?.image;
            return (
              <span
                key={idx}
                className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-purple-100 bg-purple-50"
                title={item.product?.name}
              >
                {src ? (
                  <img src={src} alt={item.product?.name ?? "Item"} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-purple-300">
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

      <div className="flex items-center gap-2 border-t border-purple-50 p-4 bg-purple-50/30">
        <Link
          href={getOrderViewHref(order)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-purple-50 hover:bg-purple-900 hover:text-white text-purple-700 text-xs font-bold rounded-lg transition-colors duration-300"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        {isCancellable && (
          <button
            onClick={() => onCancel(order)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-colors duration-300"
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

  // Only this customer's own orders — robust match on email OR userId,
  // tolerant of type/case/whitespace differences between records.
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
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
          <AlertCircle className="w-8 h-8 text-purple-300" />
          <p className="font-display text-lg font-semibold text-slate-900">Please log in to view your orders</p>
          <Link
            href="/login"
            className="px-5 py-2.5 bg-[#9D5CDB] hover:bg-[#8545C2] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#9D5CDB]/30 transition-all duration-300"
          >
            Go to Login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap");
        .font-display {
          font-family: "Fraunces", ui-serif, Georgia, serif;
          letter-spacing: -0.01em;
        }
      `}</style>

      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#2F0538] via-[#1E0124] to-[#4A1054] text-white py-16 sm:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#9D5CDB] filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#9D5CDB] filter blur-3xl animate-pulse"></div>
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[#C292F0] font-semibold text-xs tracking-[0.15em] uppercase border border-white/10">
            <span>Order Ledger</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-4">My Orders</h1>
          <p className="text-purple-100/90 text-sm mt-2">
            {myOrders.length} order{myOrders.length === 1 ? "" : "s"}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">

        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB] focus:border-transparent transition"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 bg-purple-50/60 p-1 rounded-xl border border-purple-100 self-start">
              {STATUS_FILTERS.map((status) => {
                const active = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3.5 py-1.5 text-xs font-bold capitalize rounded-lg transition-colors duration-300 ${
                      active
                        ? "bg-purple-900 text-white"
                        : "bg-purple-50 hover:bg-purple-900 hover:text-white text-purple-700"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-16 text-center bg-white rounded-2xl border border-purple-100">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-1">
              <PackageX className="h-6 w-6 text-purple-300" />
            </div>
            <p className="font-display font-semibold text-lg text-slate-900">
              {myOrders.length === 0 ? "No orders yet" : "No orders match your search"}
            </p>
            <p className="text-sm text-slate-500">
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
          className="fixed inset-0 z-50 bg-purple-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !cancelling && setCancelOrder(null)}
        >
          <div
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">Cancel this order?</h3>
            <p className="text-sm text-slate-500 mb-1">This will mark your order as cancelled.</p>
            <p className="text-xs text-slate-500 font-semibold mb-6">This action cannot be undone.</p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCancelOrder(null)}
                disabled={cancelling}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#2F0538] hover:bg-[#4A1054] text-white text-sm font-bold transition disabled:opacity-60"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling…
                  </>
                ) : (
                  "Yes, Cancel Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}