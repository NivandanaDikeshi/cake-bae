"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ShieldCheck, Heart, Sparkles, Truck, Clock, Calendar, ChevronRight, MessageCircle } from "lucide-react";
import { useAppState } from "@/context/StateContext";

export default function StoreFrontHome() {
  const { products } = useAppState();
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // Filter 4 featured bestsellers
  const bestSellers = products.slice(0, 4);

  const categoriesList = [
    {
      name: "Celebration Cakes",
      description: "Custom birthday, wedding & anniversary gateaux",
      count: "15+ Designs",
      icon: "🎂",
      color: "bg-pink-50 border-pink-100 text-pink-600 hover:bg-pink-100/50"
    },
    {
      name: "Cupcakes",
      description: "Delicious gourmet frosted cupcakes in boxes",
      count: "6 Flavours",
      icon: "🧁",
      color: "bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100/50"
    },
    {
      name: "Bento Cakes",
      description: "Mini Korean lunchbox cakes for 2-3 people",
      count: "Custom Text",
      icon: "🍰",
      color: "bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100/50"
    },
    {
      name: "Desserts",
      description: "Teatime cakes, cheesecakes & sweet bites",
      count: "Freshly Baked",
      icon: "🍪",
      color: "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100/50"
    }
  ];

  const faqs = [
    {
      question: "How far in advance do I need to place my order?",
      answer: "We require at least 24 hours notice for standard cakes, cupcakes, and bento cakes. For custom celebration or wedding cakes with complex designs, please place orders at least 48 to 72 hours in advance."
    },
    {
      question: "Where do you deliver and what are the charges?",
      answer: "We deliver across Colombo 1-15, Rajagiriya, Nugegoda, Nawala, Mount Lavinia, and other Colombo suburbs. Delivery fees range from 200 LKR to 600 LKR depending on the distance from our kitchen in Rajagiriya."
    },
    {
      question: "Can I customize the flavor, size, and writing on the cake?",
      answer: "Yes, absolutely! On our website, you can select your preferred size, flavor, and input custom message writing. For bespoke 3D design requests, please contact us directly via WhatsApp."
    },
    {
      question: "What are your payment options?",
      answer: "We accept Cash on Delivery (COD) and direct Bank Transfers. Card payments can also be selected during checkout, and bank transfer receipt slips can be messaged to us on WhatsApp."
    }
  ];

  const galleryImages = [
    { url: "https://res.cloudinary.com/dzxuzqg5g/image/upload/v1700000000/g1.jpg", title: "Custom Birthday Cake" },
    { url: "https://res.cloudinary.com/dzxuzqg5g/image/upload/v1700000000/g2.jpg", title: "Bento Box Cakes" },
    { url: "https://res.cloudinary.com/dzxuzqg5g/image/upload/v1700000000/g3.jpg", title: "Double Fudgy Brownies" },
    { url: "https://res.cloudinary.com/dzxuzqg5g/image/upload/v1700000000/g4.jpg", title: "Pastel Cupcake Set" },
    { url: "https://res.cloudinary.com/dzxuzqg5g/image/upload/v1700000000/g5.jpg", title: "Floral Wedding Cake" },
    { url: "https://res.cloudinary.com/dzxuzqg5g/image/upload/v1700000000/g6.jpg", title: "Lotus Biscoff Treats" }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2F0538] via-[#1E0124] to-[#4A1054] text-white py-24 sm:py-32">
        {/* Background decorative shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#9D5CDB] filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#f59e0b] filter blur-3xl animate-pulse"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-[#9D5CDB] font-semibold text-xs tracking-wider uppercase border border-white/5">
                <Sparkles className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                <span>Sri Lanka's Premium Custom Bakery</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Crafting Your Sweet <br />
                <span className="text-[#9D5CDB] bg-gradient-to-r from-[#C292F0] to-[#E9D9FB] bg-clip-text text-transparent">
                  Dream Moments
                </span>
              </h1>
              <p className="text-lg text-purple-100 max-w-2xl mx-auto lg:mx-0 font-medium">
                Freshly baked custom birthday cakes, adorable bento box treats, and luxury desserts crafted by hand with premium ingredients.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-[#9D5CDB] hover:bg-[#8545C2] text-white font-bold rounded-xl shadow-lg shadow-[#9D5CDB]/30 transition transform hover:-translate-y-0.5"
                >
                  Order Online Now
                </Link>
                <a
                  href="https://www.facebook.com/share/1KGEzKfUu9/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-bold rounded-xl transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Enquire on FB</span>
                </a>
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 text-center sm:text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white">100%</h4>
                  <p className="text-xs text-purple-200">Freshly Baked</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white">500+</h4>
                  <p className="text-xs text-purple-200">Happy Orders</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white">4.9 ★</h4>
                  <p className="text-xs text-purple-200">Customer Rating</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full border-4 border-[#9D5CDB]/50 overflow-hidden shadow-2xl bg-[#3F0F4A]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="Cake Bae Masterpiece"
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-[#2F0538]">Browse By Category</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            Select a category to explore our freshly baked collection and select customizable options.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {categoriesList.map((cat) => (
            <Link
              key={cat.name}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className={`flex flex-col items-center text-center p-8 border rounded-2xl shadow-sm transition-all duration-300 transform hover:-translate-y-1 ${cat.color}`}
            >
              <span className="text-5xl mb-4 filter drop-shadow-sm">{cat.icon}</span>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{cat.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{cat.description}</p>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white border rounded-full shadow-sm text-slate-700">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Bestsellers */}
      <section className="bg-purple-50/50 py-16 border-y border-purple-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-black text-[#2F0538]">Trending Bestsellers</h2>
              <p className="text-slate-500 text-sm mt-1">Our most loved signature cake recipes & dessert combinations.</p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 font-bold text-purple-700 hover:text-purple-900 group text-sm"
            >
              <span>View All Products</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full group"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-purple-50 border-b border-purple-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                  <span className="absolute top-2.5 right-2.5 bg-[#f59e0b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {product.rating} ★
                  </span>
                </div>
                {/* Content */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-purple-500 tracking-wider uppercase">
                      {product.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-black text-slate-900">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <Link
                      href={`/shop/${product.id}`}
                      className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg transition"
                    >
                      Customize
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div className="p-6 border border-slate-100 rounded-2xl bg-white space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mx-auto md:mx-0">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Booking Calendar</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Select your preferred pickup/delivery date and time slot at checkout. Real-time availability block-outs.
          </p>
        </div>

        <div className="p-6 border border-slate-100 rounded-2xl bg-white space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mx-auto md:mx-0">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Prompt Home Delivery</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            We deliver safely right to your doorstep across Colombo and suburb towns. Cash on delivery accepted.
          </p>
        </div>

        <div className="p-6 border border-slate-100 rounded-2xl bg-white space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-pink-700 mx-auto md:mx-0">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Freshness Guaranteed</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            All cakes are baked fresh to order using the finest imported cocoa, butter, and cream cheese. No preservatives.
          </p>
        </div>
      </section>

      {/* Brand Story (About Us) */}
      <section id="about" className="bg-[#2F0538] text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Logo illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-80 h-80 rounded-full border-8 border-purple-950 overflow-hidden shadow-2xl bg-[#4A1054]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="Chef Savi Wijayalath"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80";
                }}
              />
            </div>
          </div>
          {/* Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900 border border-purple-800 text-purple-300 font-semibold text-xs tracking-wider uppercase">
              <span>Behind Cake Bae</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black">Our Sweet Story</h2>
            <p className="text-purple-100 leading-relaxed font-medium">
              Hello, I'm Savi Wijayalath, the founder and head pastry chef at Cake Bae. My passion for baking started in my home kitchen in Rajagiriya, experimenting with rich flavors and minimalist frosting designs that bring joy to celebrations.
            </p>
            <p className="text-purple-200 text-sm leading-relaxed">
              At Cake Bae, we believe that a cake is not just a dessert; it's the centerpiece of your most treasured celebrations. That's why we pour our heart into every custom order—hand-decorating each cake to perfection, and sourcing premium Belgian chocolate, Australian cream cheese, and fresh fruits to ensure your cake tastes as heavenly as it looks.
            </p>
            <div className="pt-4 border-t border-purple-900 flex items-center gap-4">
              <div>
                <h5 className="font-bold text-white text-base">Savi Wijayalath</h5>
                <p className="text-xs text-purple-300">Founder & Head Baker, Cake Bae</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-black text-[#2F0538]">Sweet Inspiration Gallery</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            Browse through some of our past customized bento cakes, drip gateaux, and birthday party designs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-2xl overflow-hidden group bg-purple-50 border border-purple-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                onError={(e) => {
                  const fallbackList = [
                    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
                    "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600",
                    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600",
                    "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600",
                    "https://images.unsplash.com/photo-1518047601542-79f18c655718?w=600",
                    "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600"
                  ];
                  (e.target as HTMLImageElement).src = fallbackList[index % fallbackList.length];
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                <span className="text-white text-xs font-bold">{image.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-black text-[#2F0538]">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-sm">
            Everything you need to know about placing custom cake orders and delivery details.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-purple-100 rounded-xl bg-white overflow-hidden transition-colors"
            >
              <button
                onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-purple-700 transition"
              >
                <span>{faq.question}</span>
                <span className="text-purple-500 ml-4">
                  {activeFAQ === index ? "−" : "+"}
                </span>
              </button>
              {activeFAQ === index && (
                <div className="p-5 pt-0 text-sm text-slate-600 border-t border-purple-50 bg-purple-50/20 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
