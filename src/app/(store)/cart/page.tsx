"use client";

import React from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";
import { useAppState } from "@/context/StateContext";

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useAppState();

  const totalAmount = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-6 font-sans">
        <div className="w-20 h-20 bg-[#F0E8FD] rounded-full flex items-center justify-center mx-auto text-[#8B5CF6]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-[#241436]">Your Cart is Empty</h2>
          <p className="text-[#6B6178] text-sm max-w-sm mx-auto leading-relaxed">
            You haven't added any cakes or desserts to your order yet. Take a look at our sweet catalog!
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-sm rounded-xl shadow-md transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Cakes Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <h1 className="font-display text-3xl font-bold text-[#241436] tracking-tight mb-10">
        Your Order Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E7DBFB] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-center justify-between"
            >
              {/* Product Info */}
              <div className="flex gap-4 items-center w-full sm:w-auto">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F6F1FE] flex-shrink-0 border border-[#F0E8FD]">
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
                <div className="space-y-1">
                  <h3 className="font-display text-base font-bold text-[#241436]">{item.product.name}</h3>
                  <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
                    <span className="bg-[#F0E8FD] text-[#6D28D9] px-2 py-0.5 rounded-md border border-[#E1D2FA]">
                      Size: {item.selectedSize}
                    </span>
                    <span className="bg-[#F4F2F7] text-[#6B6178] px-2 py-0.5 rounded-md border border-[#EAE6EF]">
                      Flavour: {item.selectedFlavour}
                    </span>
                  </div>
                  {item.customMessage && (
                    <p className="text-xs text-[#B7791F] italic">
                      Message: "{item.customMessage}"
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Quantity Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#F0E8FD]">
                {/* Quantity Editor */}
                <div className="flex items-center border border-[#E1D2FA] rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                    className="p-2 text-[#6B6178] hover:bg-[#F0E8FD] hover:text-[#6D28D9] transition"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#241436]">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                    className="p-2 text-[#6B6178] hover:bg-[#F0E8FD] hover:text-[#6D28D9] transition"
                    title="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <span className="text-xs text-[#B3A3D6] block">Total</span>
                  <span className="font-display text-base font-bold text-[#241436]">
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(idx)}
                  className="p-2.5 text-[#B3A3D6] hover:text-[#C4433C] rounded-lg hover:bg-[#FDF3F2] transition"
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
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D28D9] hover:underline pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue shopping for more cakes</span>
          </Link>
        </div>

        {/* Right: Cart Summary Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#E7DBFB] rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-display text-lg font-bold text-[#241436] border-b border-[#F0E8FD] pb-4">
              Order Summary
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-[#6B6178]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#241436]">Rs. {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-[#6B6178]">
                <span>Estimated Delivery Fee</span>
                <span className="font-semibold text-[#241436]">Calculated at checkout</span>
              </div>

              <div className="border-t border-[#F0E8FD] pt-4 flex justify-between">
                <span className="text-base font-semibold text-[#241436]">Order Subtotal</span>
                <span className="font-display text-xl font-bold text-[#241436]">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-xl shadow-md shadow-[#7C3AED]/20 transition transform hover:-translate-y-0.5 text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[10px] text-center text-[#B3A3D6] leading-relaxed">
              By proceeding, you agree to our 24-48 hour lead-time requirements for fresh custom cakes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}