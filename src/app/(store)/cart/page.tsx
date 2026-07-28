"use client";

import React from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";
import { useAppState } from "@/context/StateContext";

// ── Brand palette (Cake Bae) — used identically on every page ──────────
// Aubergine #2F0538  — deep bg / primary dark surface
// Plum      #4A1054  — gradient partner / hover depth
// Orchid    #9D5CDB  — primary accent, buttons, active states
// Lavender  #F7F1FB  — light section bg
// Ink       #241129  — body text color
// Gold      #F0B429  — reserved for one meaning only: "Ready for Dispatch"
// Fonts: Fraunces (display) + Inter (body) — used site-wide, see BRAND_FONTS.
// ──────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useAppState();

  const totalAmount = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F1FB]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap");
        .font-display {
          font-family: "Fraunces", ui-serif, Georgia, serif;
          letter-spacing: -0.01em;
        }
        body { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
      `}</style>
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-6 font-sans">
        <div className="w-20 h-20 bg-[#F7F1FB] rounded-full flex items-center justify-center mx-auto text-[#9D5CDB] ring-8 ring-[#F7F1FB]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-semibold text-[#241129]">Your Cart is Empty</h2>
          <p className="text-[#241129]/60 text-sm max-w-sm mx-auto leading-relaxed">
            You haven't added any cakes or desserts to your order yet. Take a look at our sweet catalog!
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-semibold text-sm rounded-xl shadow-md shadow-[#9D5CDB]/25 transition duration-300 hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Cakes Catalog</span>
        </Link>
      </div>
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
    `}</style>
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-semibold text-[#241129] tracking-tight">
          Your Order Cart
        </h1>
        <p className="mt-1.5 text-sm text-[#241129]/60">
          {cart.length} item{cart.length === 1 ? "" : "s"} ready for checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#9D5CDB]/15 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#9D5CDB]/25 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-center justify-between"
            >
              {/* Product Info */}
              <div className="flex gap-4 items-center w-full sm:w-auto">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-[#9D5CDB]/15 ring-1 ring-transparent hover:ring-[#9D5CDB]/25 transition">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display text-base font-semibold text-[#241129]">{item.product.name}</h3>
                  <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
                    <span className="bg-[#F7F1FB] text-[#9D5CDB] px-2 py-0.5 rounded-md border border-[#9D5CDB]/20">
                      Size: {item.selectedSize}
                    </span>
                    <span className="bg-[#241129]/[0.04] text-[#241129]/60 px-2 py-0.5 rounded-md border border-[#241129]/10">
                      Flavour: {item.selectedFlavour}
                    </span>
                  </div>
                  {item.customMessage && (
                    <p className="text-xs text-[#4A1054] italic">
                      Message: "{item.customMessage}"
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Quantity Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#9D5CDB]/15">
                {/* Quantity Editor */}
                <div className="flex items-center border border-[#9D5CDB]/20 rounded-lg overflow-hidden bg-white divide-x divide-[#9D5CDB]/15">
                  <button
                    onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                    className="p-2 text-[#241129]/60 hover:bg-[#F7F1FB] hover:text-[#9D5CDB] active:scale-95 transition"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center text-xs font-bold text-[#241129]">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                    className="p-2 text-[#241129]/60 hover:bg-[#F7F1FB] hover:text-[#9D5CDB] active:scale-95 transition"
                    title="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <span className="text-xs text-[#241129]/40 block">Total</span>
                  <span className="font-display text-base font-semibold text-[#241129]">
                    Rs. {totalAmount.toLocaleString()}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(idx)}
                  className="p-2.5 text-[#241129]/40 hover:text-[#C4433C] rounded-lg hover:bg-[#FDF3F2] active:scale-95 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Continue shopping link */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9D5CDB] hover:underline pt-2 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Continue shopping for more cakes</span>
          </Link>
        </div>

        {/* Right: Cart Summary Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#9D5CDB]/15 rounded-2xl p-6 shadow-sm space-y-6 lg:sticky lg:top-28">
            <h3 className="font-display text-lg font-semibold text-[#241129] border-b border-[#9D5CDB]/15 pb-4">
              Order Summary
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-[#241129]/60">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#241129]">Rs. {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-[#241129]/60">
                <span>Estimated Delivery Fee</span>
                <span className="font-semibold text-[#241129]">Calculated at checkout</span>
              </div>

              <div className="border-t border-dashed border-[#9D5CDB]/20 pt-4 flex justify-between items-baseline">
                <span className="text-base font-semibold text-[#241129]">Order Subtotal</span>
                <span className="font-display text-2xl font-semibold text-[#9D5CDB]">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-semibold rounded-xl shadow-md shadow-[#9D5CDB]/25 transition duration-300 hover:-translate-y-0.5 text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[10px] text-center text-[#241129]/40 leading-relaxed">
              By proceeding, you agree to our 24-48 hour lead-time requirements for fresh custom cakes.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}