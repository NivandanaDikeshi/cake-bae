"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Sparkles,
  Heart,
  Award,
  Leaf,
  Clock,
  MessageCircle,
  ChevronRight,
  Quote
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { value: "500+", label: "Happy Orders" },
    { value: "4.9★", label: "Customer Rating" },
    { value: "15+", label: "Cake Designs" },
    { value: "100%", label: "Freshly Baked" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Made With Love",
      description: "Every cake is hand-decorated by Savi herself, with no two orders treated the same way.",
      color: "bg-pink-50 text-pink-600 border-pink-100"
    },
    {
      icon: Leaf,
      title: "Premium Ingredients",
      description: "Belgian chocolate, Australian cream cheese, and fresh fruit — never preservatives or shortcuts.",
      color: "bg-amber-50 text-amber-600 border-amber-100"
    },
    {
      icon: Award,
      title: "Custom Craftsmanship",
      description: "From flavor to writing to 3D design, every detail is built around your celebration.",
      color: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      icon: Clock,
      title: "Always Fresh",
      description: "Nothing leaves our kitchen in Rajagiriya until it's baked fresh to order for your date.",
      color: "bg-rose-50 text-rose-600 border-rose-100"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Tell Us Your Vision",
      description: "Browse our shop or message us on WhatsApp with your flavor, size, and design ideas."
    },
    {
      step: "02",
      title: "We Bring It To Life",
      description: "Savi hand-crafts and decorates your order using premium, freshly sourced ingredients."
    },
    {
      step: "03",
      title: "Fresh To Your Door",
      description: "Your cake is delivered fresh across Colombo and suburbs, right on your chosen date."
    }
  ];

  return (
    <div className="pb-0 bg-white">
      <Header />

      {/* Page Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2F0538] via-[#1E0124] to-[#4A1054] text-white py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#9D5CDB] filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#f59e0b] filter blur-3xl animate-pulse"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[#C292F0] font-semibold text-xs tracking-[0.15em] uppercase border border-white/10">
            <Sparkles className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
            <span>Behind Cake Bae</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Our Sweet <span className="bg-gradient-to-r from-[#C292F0] to-[#E9D9FB] bg-clip-text text-transparent">Story</span>
          </h1>
          <p className="text-purple-100/90 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            From a home kitchen in Rajagiriya to Sri Lanka's premium custom bakery — every cake carries a little bit of our heart.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          {/* Portrait */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-none">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-purple-200 via-purple-100 to-amber-100 blur-2xl opacity-60"></div>
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-[6px] border-white overflow-hidden shadow-2xl bg-[#4A1054] ring-1 ring-purple-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="Chef Savi Wijayalath"
                  className="w-full h-full object-cover hover:scale-105 transition duration-700 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
              <div className="absolute -bottom-5 -right-3 sm:right-3 bg-white rounded-2xl shadow-xl border border-purple-100 px-5 py-3.5 flex items-center gap-2.5 max-w-[220px]">
                <Quote className="w-5 h-5 text-[#9D5CDB] shrink-0 fill-purple-100" />
                <span className="text-xs font-bold text-slate-700 leading-snug">
                  A cake is a celebration's centerpiece.
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 font-bold text-xs tracking-wider uppercase">
              <Heart className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
              <span>Meet The Baker</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2F0538] leading-tight">
              Hi, I'm Savi Wijayalath
            </h2>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              Founder and head pastry chef at Cake Bae. My passion for baking started in my home kitchen in Rajagiriya, experimenting with rich flavors and minimalist frosting designs that bring joy to celebrations.
            </p>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              At Cake Bae, we believe a cake is not just a dessert — it's the centerpiece of your most treasured celebrations. That's why we pour our heart into every custom order, hand-decorating each cake to perfection and sourcing premium Belgian chocolate, Australian cream cheese, and fresh fruits to ensure your cake tastes as heavenly as it looks.
            </p>
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-5">
              <div>
                <h5 className="font-black text-slate-800 text-base">Savi Wijayalath</h5>
                <p className="text-xs text-purple-600 font-bold tracking-wide">FOUNDER & HEAD BAKER, CAKE BAE</p>
              </div>
              <a
                href="https://www.facebook.com/share/1KGEzKfUu9/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#2F0538] hover:bg-[#4A1054] text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="relative bg-[#2F0538] py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-[#9D5CDB] filter blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            {stats.map((stat) => (
              <div key={stat.label} className="px-2">
                <h4 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{stat.value}</h4>
                <p className="text-[11px] sm:text-xs text-purple-300 font-bold tracking-wider uppercase mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 font-bold text-xs tracking-wider uppercase border border-purple-100">
            <span>Our Promise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2F0538]">Why Customers Love Cake Bae</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
            The values that go into every box we hand over.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div
              key={value.title}
              className={`p-7 rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${value.color}`}
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm mb-5">
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-800 mb-2">{value.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Timeline */}
      <section className="bg-gradient-to-b from-purple-50/70 to-purple-50/20 py-24 border-y border-purple-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-purple-600 font-bold text-xs tracking-wider uppercase border border-purple-100 shadow-sm">
              <span>The Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2F0538]">How We Bring It To Life</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              From first message to doorstep delivery — here's what to expect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {process.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl border border-purple-100 p-8 shadow-sm hover:shadow-lg transition-all duration-300 h-full space-y-4">
                  <span className="text-5xl font-black bg-gradient-to-br from-purple-200 to-purple-100 bg-clip-text text-transparent">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-black text-slate-800">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-purple-200 items-center justify-center shadow-sm z-10">
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2F0538] via-[#1E0124] to-[#4A1054] px-8 py-16 sm:px-16 sm:py-20 text-center text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#9D5CDB] filter blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#f59e0b] filter blur-3xl animate-pulse"></div>
          </div>
          <div className="relative z-10 space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[#C292F0] font-semibold text-xs tracking-wider uppercase border border-white/10">
              <Sparkles className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
              <span>Let's Celebrate Together</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
              Ready to Order Your Sweet Moment?
            </h2>
            <p className="text-purple-100/90 max-w-xl mx-auto text-sm sm:text-base font-medium leading-relaxed">
              Custom cakes, cupcakes, bento boxes, and desserts — freshly baked and delivered across Colombo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <Link
                href="/shop"
                className="w-full sm:w-auto text-center px-8 py-4 bg-[#9D5CDB] hover:bg-[#8545C2] text-white font-bold rounded-xl shadow-lg shadow-[#9D5CDB]/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Order Online Now
              </Link>

              <a
                href="https://www.facebook.com/share/1KGEzKfUu9/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-bold rounded-xl transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enquire on FB</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}