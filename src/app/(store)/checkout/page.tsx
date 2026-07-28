"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar as CalendarIcon, MapPin, Phone, User, Mail, CreditCard, ArrowLeft, ShieldAlert } from "lucide-react";
import { useAppState } from "@/context/StateContext";

<<<<<<< HEAD
// ── Brand palette (Cake Bae) — used identically on every page ──────────
// Aubergine #2F0538  — deep bg / primary dark surface
// Plum      #4A1054  — gradient partner / hover depth
// Orchid    #9D5CDB  — primary accent, buttons, active states
// Lavender  #F7F1FB  — light section bg
// Ink       #241129  — body text color
// Gold      #F0B429  — reserved for one meaning only: "Ready for Dispatch"
// Fonts: Fraunces (display) + Inter (body) — used site-wide, see BRAND_FONTS.
// ──────────────────────────────────────────────────────────────────────

=======
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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
<<<<<<< HEAD
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap");
          .font-display {
            font-family: "Fraunces", ui-serif, Georgia, serif;
            letter-spacing: -0.01em;
          }
          body { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
        `}</style>
        <div className="w-20 h-20 bg-[#F7F1FB] rounded-full flex items-center justify-center mx-auto text-[#9D5CDB]">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-[#241129]">Your Cart is Empty</h2>
        <p className="text-[#241129]/60 text-sm">
          Please add a product before checking out.
        </p>
        <Link href="/shop" className="px-6 py-3 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-bold rounded-xl text-sm shadow-md inline-block transition">
=======
        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-400">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm">
          Please add a product before checking out.
        </p>
        <Link href="/shop" className="px-6 py-3 bg-[#9D5CDB] text-white font-bold rounded-xl text-sm shadow-md inline-block">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
          Go To Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
<<<<<<< HEAD
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap");
        .font-display {
          font-family: "Fraunces", ui-serif, Georgia, serif;
          letter-spacing: -0.01em;
        }
        body { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      {/* Back to Cart link */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#241129]/60 hover:text-[#9D5CDB] mb-8 transition"
=======
      {/* Back to Cart link */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#9D5CDB] mb-8 transition"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to shopping cart</span>
      </Link>

<<<<<<< HEAD
      <h1 className="font-display text-3xl font-semibold text-[#2F0538] mb-10">Checkout Details</h1>
=======
      <h1 className="text-3xl font-black text-[#2F0538] mb-10">Checkout Details</h1>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Shipping Form */}
        <div className="lg:col-span-7 space-y-6">
<<<<<<< HEAD
          <div className="bg-white border border-[#9D5CDB]/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-display text-lg font-semibold text-[#2F0538] border-b border-[#9D5CDB]/10 pb-3">
=======
          <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              Delivery Information
            </h3>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
<<<<<<< HEAD
                <label className="text-xs font-bold text-[#241129]/80">Full Name *</label>
=======
                <label className="text-xs font-bold text-slate-600">Full Name *</label>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
<<<<<<< HEAD
                    className="w-full bg-white border border-[#9D5CDB]/15 rounded-xl py-3 pl-10 pr-4 text-sm text-[#241129] placeholder-[#241129]/40 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB] transition"
                  />
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#9D5CDB]/50" />
=======
                    className="w-full bg-white border border-purple-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition"
                  />
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                </div>
              </div>

              <div className="space-y-1.5">
<<<<<<< HEAD
                <label className="text-xs font-bold text-[#241129]/80">Mobile Number *</label>
=======
                <label className="text-xs font-bold text-slate-600">Mobile Number *</label>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0771234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
<<<<<<< HEAD
                    className="w-full bg-white border border-[#9D5CDB]/15 rounded-xl py-3 pl-10 pr-4 text-sm text-[#241129] placeholder-[#241129]/40 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB] transition"
                  />
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#9D5CDB]/50" />
=======
                    className="w-full bg-white border border-purple-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition"
                  />
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
<<<<<<< HEAD
              <label className="text-xs font-bold text-[#241129]/80">Email Address *</label>
=======
              <label className="text-xs font-bold text-slate-600">Email Address *</label>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
                  className="w-full bg-white border border-[#9D5CDB]/15 rounded-xl py-3 pl-10 pr-4 text-sm text-[#241129] placeholder-[#241129]/40 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB] transition"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#9D5CDB]/50" />
=======
                  className="w-full bg-white border border-purple-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
<<<<<<< HEAD
              <label className="text-xs font-bold text-[#241129]/80">Delivery Street Address *</label>
=======
              <label className="text-xs font-bold text-slate-600">Delivery Street Address *</label>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              <div className="relative">
                <textarea
                  required
                  rows={2}
                  placeholder="House number, apartment, street name, block, etc."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
<<<<<<< HEAD
                  className="w-full bg-white border border-[#9D5CDB]/15 rounded-xl py-3 pl-10 pr-4 text-sm text-[#241129] placeholder-[#241129]/40 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB] transition resize-none"
                />
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[#9D5CDB]/50" />
=======
                  className="w-full bg-white border border-purple-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition resize-none"
                />
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              </div>
            </div>

            {/* Region Selector */}
            <div className="space-y-1.5">
<<<<<<< HEAD
              <label className="text-xs font-bold text-[#241129]/80">Delivery Region / Suburb *</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-white border border-[#9D5CDB]/15 rounded-xl p-3 text-sm text-[#241129] focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB]"
=======
              <label className="text-xs font-bold text-slate-600">Delivery Region / Suburb *</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-white border border-purple-100 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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
<<<<<<< HEAD
                <label className="text-xs font-bold text-[#241129]/80">Delivery/Pickup Date *</label>
=======
                <label className="text-xs font-bold text-slate-600">Delivery/Pickup Date *</label>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={tomorrowStr}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
<<<<<<< HEAD
                    className="w-full bg-white border border-[#9D5CDB]/15 rounded-xl py-3 pl-10 pr-4 text-sm text-[#241129] focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB] transition"
                  />
                  <CalendarIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-[#9D5CDB]/50 pointer-events-none" />
=======
                    className="w-full bg-white border border-purple-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition"
                  />
                  <CalendarIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400 pointer-events-none" />
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                </div>
                {blockedDates.includes(deliveryDate) && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">
                    ⚠️ Fully booked! Please select another date.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
<<<<<<< HEAD
                <label className="text-xs font-bold text-[#241129]/80">Time Slot *</label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full bg-white border border-[#9D5CDB]/15 rounded-xl p-3.5 text-sm text-[#241129] focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB]"
=======
                <label className="text-xs font-bold text-slate-600">Time Slot *</label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full bg-white border border-purple-100 rounded-xl p-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                >
                  <option value="10:00">Morning Slot (10:00 AM - 12:00 PM)</option>
                  <option value="14:00">Afternoon Slot (02:00 PM - 04:00 PM)</option>
                  <option value="18:00">Evening Slot (06:00 PM - 08:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
<<<<<<< HEAD
              <label className="text-xs font-bold text-[#241129]/80">Order Notes / Extra Instructions</label>
=======
              <label className="text-xs font-bold text-slate-600">Order Notes / Extra Instructions</label>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              <textarea
                rows={3}
                placeholder="Mention cake writing, delivery instructions, or allergic concerns here..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
<<<<<<< HEAD
                className="w-full bg-white border border-[#9D5CDB]/15 rounded-xl py-3 px-4 text-sm text-[#241129] placeholder-[#241129]/40 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB] transition resize-none"
=======
                className="w-full bg-white border border-purple-100 rounded-xl py-3 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition resize-none"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              />
            </div>
          </div>
        </div>

        {/* Right: Checkout Summary Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order Details Panel */}
<<<<<<< HEAD
          <div className="bg-white border border-[#9D5CDB]/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-display text-lg font-semibold text-[#2F0538] border-b border-[#9D5CDB]/10 pb-3">
              Order Items
            </h3>

            <div className="divide-y divide-[#9D5CDB]/10 max-h-60 overflow-y-auto pr-2 space-y-3">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 py-3 items-start justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs font-bold text-[#9D5CDB] bg-[#F7F1FB] px-2 py-1 rounded-md h-fit border border-[#9D5CDB]/15">
                      {item.quantity}x
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#241129] line-clamp-1">{item.product.name}</h4>
                      <p className="text-[10px] text-[#241129]/60 font-medium">
                        {item.selectedSize} | {item.selectedFlavour}
                      </p>
                      {item.customMessage && (
                        <p className="text-[10px] text-[#4A1054] italic mt-0.5">
=======
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
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                          "{item.customMessage}"
                        </p>
                      )}
                    </div>
                  </div>
<<<<<<< HEAD
                  <span className="text-sm font-bold text-[#241129]">
=======
                  <span className="text-sm font-bold text-slate-700">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Details */}
<<<<<<< HEAD
            <div className="border-t border-[#9D5CDB]/10 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-[#241129]/60">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#241129]">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#241129]/60">
                <span>Delivery Charge ({regionObj.name.split(" (")[0]})</span>
                <span className="font-semibold text-[#241129]">Rs. {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#241129]/60">
                <span>Payment Method</span>
                <span className="font-bold text-[#4A1054] bg-[#F7F1FB] border border-[#9D5CDB]/15 px-2 py-0.5 rounded-md text-[10px] uppercase flex items-center gap-1">
=======
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
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                  <CreditCard className="w-3 h-3" />
                  Cash on Delivery (COD)
                </span>
              </div>

<<<<<<< HEAD
              <div className="border-t border-[#9D5CDB]/10 pt-4 flex justify-between">
                <span className="text-base font-semibold text-[#241129]">Grand Total</span>
                <span className="font-display text-xl font-semibold text-[#2F0538]">
=======
              <div className="border-t border-slate-100 pt-4 flex justify-between">
                <span className="text-base font-bold text-slate-800">Grand Total</span>
                <span className="text-xl font-black text-[#2F0538]">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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
<<<<<<< HEAD
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#9D5CDB] hover:bg-[#4A1054] disabled:bg-[#241129]/15 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md shadow-[#9D5CDB]/25 transition transform hover:-translate-y-0.5 text-sm"
=======
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#9D5CDB] hover:bg-[#8545C2] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md shadow-purple-500/25 transition transform hover:-translate-y-0.5 text-sm"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
            >
              {isSubmitting ? "Confirming Order..." : "Confirm & Place Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
