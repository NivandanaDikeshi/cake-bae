"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ShoppingBag,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { useAppState, Order } from "@/context/StateContext";

const STATUS_STEPS = [
  { name: "Pending", label: "Order Received", desc: "We have received your order details." },
  { name: "Confirmed", label: "Confirmed", desc: "Order details verified & scheduled." },
  { name: "Baking/Decorating", label: "Baking / Decorating", desc: "Fresh ingredients are being crafted." },
  { name: "Ready for Dispatch", label: "Ready for Dispatch", desc: "Cake is boxed and ready for handoff." },
  { name: "Delivered", label: "Delivered / Completed", desc: "Delivered safely. Enjoy your Cake Bae treats!" },
];

/**
 * Order items can come from slightly different shapes depending on where
 * they were created (cart vs. admin-added vs. legacy orders), so we check
 * a handful of common field names instead of assuming one. This is the
 * fix for images not showing up on the success page.
 */
function resolveItemImage(item: any): string | undefined {
  const product = item?.product ?? {};

  const candidates = [
    item?.imageUrl,
    item?.image,
    product?.imageUrl,
    product?.image,
    product?.img,
    product?.photo,
    product?.picture,
    Array.isArray(product?.images) ? product.images[0] : undefined,
  ];

  const found = candidates.find(
    (val) => typeof val === "string" && val.trim().length > 0
  );

  return found;
}

// Small reusable product thumbnail with graceful fallback.
// Uses a plain <img> so it works regardless of next.config.js domain whitelisting.
function ProductThumb({ src, alt }: { src?: string; alt: string }) {
  const [errored, setErrored] = useState(false);

  // Reset the error state if a new (different) src comes in,
  // otherwise a previously-failed thumb can get stuck showing the fallback.
  useEffect(() => {
    setErrored(false);
  }, [src]);

  const showImage = !!src && !errored;

  return (
    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-amber-50">
      {showImage ? (
        <img
          src={src}
          alt={alt}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#9D5CDB]">
          <ShoppingBag className="w-6 h-6" strokeWidth={1.75} />
        </div>
      )}
    </div>
  );
}

export default function OrderSuccessPage() {
  const { id } = useParams() as { id: string };
  const { orders } = useAppState();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id && orders.length > 0) {
      const found = orders.find((o) => o.id === id);
      if (found) setOrder(found);
    }
  }, [id, orders]);

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-[3px] border-purple-100 border-t-[#9D5CDB]" />
        <h2 className="text-xl font-bold text-slate-800">Loading Order Details...</h2>
        <p className="text-sm text-slate-500">Checking our baking records.</p>
      </div>
    );
  }

  const getStepIndex = (status: Order["status"]) => {
    if (status === "Cancelled") return -1;
    if (status === "Completed") return 4;
    return STATUS_STEPS.findIndex((s) => s.name === status);
  };

  const activeStepIdx = getStepIndex(order.status);

  const whatsAppMessage = `Hi Cake Bae, I placed an order on the website. My Order ID is ${order.id}. Could you confirm my order? Thank you!`;
  const whatsAppLink = `https://wa.me/94771234567?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Success banner */}
      <div className="relative overflow-hidden text-center space-y-3 bg-white border border-purple-100 rounded-3xl p-8 sm:p-10 shadow-sm">
        <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-purple-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-amber-100/50 blur-3xl" />

        <div className="relative inline-flex items-center justify-center p-3 rounded-full bg-green-50 text-green-600 mb-1 ring-8 ring-green-50/60">
          <CheckCircle2 className="w-11 h-11" strokeWidth={2.2} />
        </div>
        <h1 className="relative text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="relative text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
          Thank you for choosing Cake Bae by Savi Wijayalath. Your order has been registered and is pending review.
        </p>
        <div className="relative inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-xl text-sm font-bold border border-purple-100 mt-2">
          <span className="text-purple-400 font-semibold">Order ID</span>
          <span className="tracking-wide">{order.id}</span>
        </div>

        <div className="relative flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-slate-100 mt-6">
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Confirm via WhatsApp</span>
          </a>
          <a
            href="https://www.facebook.com/share/1KGEzKfUu9/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-purple-200 text-purple-700 font-bold text-xs rounded-xl hover:bg-purple-50 active:scale-[0.98] transition-all"
          >
            <span>Message on Facebook</span>
          </a>
        </div>
      </div>

      {/* Live Order Tracking */}
      <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
          Live Order Tracking
        </h3>

        {order.status === "Cancelled" ? (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-bold">
            ❌ This order has been cancelled. If you have questions, please reach out to us.
          </div>
        ) : (
          <div className="relative pl-6 border-l border-slate-200 ml-4 space-y-8 py-2">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx < activeStepIdx;
              const isActive = idx === activeStepIdx;

              return (
                <div key={idx} className="relative">
                  <span
                    className={`absolute -left-10 top-0.5 flex h-8 w-8 items-center justify-center rounded-full border-4 text-xs font-bold transition-colors ${
                      isCompleted
                        ? "bg-[#9D5CDB] border-purple-100 text-white"
                        : isActive
                        ? "bg-white border-[#9D5CDB] text-[#9D5CDB] shadow-[0_0_0_4px_rgba(157,92,219,0.12)]"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    {isCompleted ? "✓" : idx + 1}
                  </span>

                  <div className="pl-4 space-y-1">
                    <h4
                      className={`text-sm font-bold ${
                        isActive ? "text-[#9D5CDB] text-base" : isCompleted ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className={`text-xs ${isActive ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Delivery */}
        <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
            Customer & Delivery Details
          </h3>

          <div className="space-y-4 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
                <Phone className="w-4 h-4" />
              </span>
              <div>
                <span className="font-semibold block text-slate-800">{order.customerName}</span>
                <span className="text-slate-500">{order.customerPhone} · {order.customerEmail}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
                <MapPin className="w-4 h-4" />
              </span>
              <div>
                <span className="font-semibold block text-slate-800">Delivery Address</span>
                <span className="text-slate-500">{order.deliveryAddress} ({order.deliveryRegion})</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
                <Calendar className="w-4 h-4" />
              </span>
              <div>
                <span className="font-semibold block text-slate-800">Date slot</span>
                <span className="text-slate-500">{order.deliveryDate}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
                <Clock className="w-4 h-4" />
              </span>
              <div>
                <span className="font-semibold block text-slate-800">Time slot</span>
                <span className="text-slate-500">
                  {order.deliveryTime === "10:00"
                    ? "Morning Slot (10am - 12pm)"
                    : order.deliveryTime === "14:00"
                    ? "Afternoon Slot (2pm - 4pm)"
                    : "Evening Slot (6pm - 8pm)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Ordered — with guaranteed product image / fallback */}
        <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 mb-1">
              Items Ordered
            </h3>

            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => {
                const imageUrl = resolveItemImage(item);

                return (
                  <div key={idx} className="flex items-start gap-3 py-3.5">
                    <ProductThumb src={imageUrl} alt={item.product.name} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-800 text-xs leading-snug">
                          {item.quantity}× {item.product.name}
                        </span>
                        <span className="font-bold text-slate-700 text-xs whitespace-nowrap">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {item.selectedSize} · {item.selectedFlavour}
                      </p>
                      {item.customMessage && (
                        <p className="text-[10px] text-amber-600 italic mt-0.5 truncate">
                          "{item.customMessage}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 mt-3 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-500">
              <span>Items Total</span>
              <span>Rs. {(order.totalPrice - order.deliveryFee).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery Fee</span>
              <span>Rs. {order.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-800 text-sm pt-2 border-t border-dashed border-slate-100">
              <span>Total Price</span>
              <span className="text-[#2F0538] font-black">Rs. {order.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1.5 text-[10px] font-bold">
              <span className="text-slate-400 self-center">Payment Type</span>
              <span className="text-amber-600 flex items-center gap-1 uppercase bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                <CreditCard className="w-3 h-3" />
                COD ({order.paymentStatus})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 px-6 py-3 border border-purple-200 hover:bg-purple-50 active:scale-[0.98] text-purple-700 font-bold rounded-xl text-xs shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Online Shop</span>
        </Link>
      </div>
    </div>
  );
}