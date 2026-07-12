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
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800">Your Cart is Empty</h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            You haven't added any cakes or desserts to your order yet. Take a look at our sweet catalog!
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#9D5CDB] hover:bg-[#8545C2] text-white font-bold text-sm rounded-xl shadow-md transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Cakes Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-[#2F0538] mb-10">Your Order Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-purple-100 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row gap-5 items-center justify-between"
            >
              {/* Product Info */}
              <div className="flex gap-4 items-center w-full sm:w-auto">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-purple-50 flex-shrink-0 border border-purple-50">
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
                  <h3 className="text-base font-bold text-slate-800">{item.product.name}</h3>
                  <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
                    <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md border border-purple-100">
                      Size: {item.selectedSize}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100">
                      Flavour: {item.selectedFlavour}
                    </span>
                  </div>
                  {item.customMessage && (
                    <p className="text-xs text-amber-600 italic">
                      Message: "{item.customMessage}"
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Quantity Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* Quantity Editor */}
                <div className="flex items-center border border-purple-100 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                    className="p-2 text-slate-500 hover:bg-purple-50 transition"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                    className="p-2 text-slate-500 hover:bg-purple-50 transition"
                    title="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total</span>
                  <span className="text-base font-black text-slate-900">
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(idx)}
                  className="p-2.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:underline pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue shopping for more cakes</span>
          </Link>
        </div>

        {/* Right: Cart Summary Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">
              Order Summary
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800">Rs. {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Estimated Delivery Fee</span>
                <span className="font-semibold text-slate-800">Calculated at checkout</span>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between">
                <span className="text-base font-bold text-slate-800">Order Subtotal</span>
                <span className="text-xl font-black text-[#2F0538]">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#9D5CDB] hover:bg-[#8545C2] text-white font-bold rounded-xl shadow-md shadow-purple-500/25 transition transform hover:-translate-y-0.5 text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <p className="text-[10px] text-center text-slate-400">
              By proceeding, you agree to our 24-48 hour lead-time requirements for fresh custom cakes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
