"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar as CalendarIcon, MapPin, Phone, User, Mail, CreditCard, ArrowLeft, ShieldAlert } from "lucide-react";
import { useAppState } from "@/context/StateContext";

const DELIVERY_REGIONS = [
  { name: "Rajagiriya / Nawala", fee: 200 },
  { name: "Colombo 1-15 (Fort, Borella, Havelock, etc.)", fee: 350 },
  { name: "Nugegoda / Kotte", fee: 250 },
  { name: "Battaramulla / Thalawathugoda", fee: 300 },
  { name: "Mount Lavinia / Dehiwala", fee: 450 },
  { name: "Other Colombo Suburbs", fee: 550 }
];

export default function CheckoutPage() {
  const { cart, blockedDates, placeOrder, getCartTotal, currentUser } = useAppState();
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(DELIVERY_REGIONS[0].name);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("14:00");
  const [orderNotes, setOrderNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill details from logged in user
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.address) setAddress(currentUser.address);
    }
  }, [currentUser]);

  const subtotal = getCartTotal();
  const regionObj = DELIVERY_REGIONS.find((r) => r.name === selectedRegion) || DELIVERY_REGIONS[0];
  const deliveryFee = regionObj.fee;
  const grandTotal = subtotal + deliveryFee;

  // Minimum date should be tomorrow (24 hours prep)
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cart.length === 0) {
      setError("Your cart is empty. Please add cakes to place an order.");
      return;
    }

    if (!name || !phone || !email || !address || !deliveryDate || !deliveryTime) {
      setError("Please fill in all required fields.");
      return;
    }

    // Check if the selected date is fully booked/blocked
    if (blockedDates.includes(deliveryDate)) {
      setError("The selected delivery date is fully booked. Please choose another date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await placeOrder({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        deliveryAddress: address,
        deliveryRegion: selectedRegion,
        deliveryFee,
        deliveryDate,
        deliveryTime,
        paymentMethod: "COD",
        paymentStatus: "Unpaid",
        orderNotes,
        items: cart,
        totalPrice: grandTotal
      });

      router.push(`/order-success/${order.id}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while placing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-400">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm">
          Please add a product before checking out.
        </p>
        <Link href="/shop" className="px-6 py-3 bg-[#9D5CDB] text-white font-bold rounded-xl text-sm shadow-md inline-block">
          Go To Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back to Cart link */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#9D5CDB] mb-8 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to shopping cart</span>
      </Link>

      <h1 className="text-3xl font-black text-[#2F0538] mb-10">Checkout Details</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Shipping Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
              Delivery Information
            </h3>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-purple-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition"
                  />
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Mobile Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0771234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-purple-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition"
                  />
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-purple-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Delivery Street Address *</label>
              <div className="relative">
                <textarea
                  required
                  rows={2}
                  placeholder="House number, apartment, street name, block, etc."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-purple-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition resize-none"
                />
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
              </div>
            </div>

            {/* Region Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Delivery Region / Suburb *</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-white border border-purple-100 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
              >
                {DELIVERY_REGIONS.map((region) => (
                  <option key={region.name} value={region.name}>
                    {region.name} (+ Rs. {region.fee})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Delivery/Pickup Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={tomorrowStr}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-white border border-purple-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition"
                  />
                  <CalendarIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400 pointer-events-none" />
                </div>
                {blockedDates.includes(deliveryDate) && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">
                    ⚠️ Fully booked! Please select another date.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Time Slot *</label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full bg-white border border-purple-100 rounded-xl p-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
                >
                  <option value="10:00">Morning Slot (10:00 AM - 12:00 PM)</option>
                  <option value="14:00">Afternoon Slot (02:00 PM - 04:00 PM)</option>
                  <option value="18:00">Evening Slot (06:00 PM - 08:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Order Notes / Extra Instructions</label>
              <textarea
                rows={3}
                placeholder="Mention cake writing, delivery instructions, or allergic concerns here..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full bg-white border border-purple-100 rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Checkout Summary Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order Details Panel */}
          <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
              Order Items
            </h3>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-2 space-y-3">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 py-3 items-start justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs font-bold text-[#9D5CDB] bg-purple-50 px-2 py-1 rounded-md h-fit border border-purple-100">
                      {item.quantity}x
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {item.selectedSize} | {item.selectedFlavour}
                      </p>
                      {item.customMessage && (
                        <p className="text-[10px] text-amber-600 italic mt-0.5">
                          "{item.customMessage}"
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Details */}
            <div className="border-t border-slate-100 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-700">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Charge ({regionObj.name.split(" (")[0]})</span>
                <span className="font-semibold text-slate-700">Rs. {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Method</span>
                <span className="font-bold text-[#f59e0b] bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md text-[10px] uppercase flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  Cash on Delivery (COD)
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between">
                <span className="text-base font-bold text-slate-800">Grand Total</span>
                <span className="text-xl font-black text-[#2F0538]">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs flex gap-2 items-start font-medium leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || blockedDates.includes(deliveryDate)}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#9D5CDB] hover:bg-[#8545C2] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md shadow-purple-500/25 transition transform hover:-translate-y-0.5 text-sm"
            >
              {isSubmitting ? "Confirming Order..." : "Confirm & Place Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
