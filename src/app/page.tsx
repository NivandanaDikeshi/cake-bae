"use client";

import React from "react";
import Link from "next/link";
import { Truck, Clock, Calendar, ChevronRight, MessageCircle, Star } from "lucide-react";
import { useAppState } from "@/context/StateContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const galleryFallback =
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80";

const testimonials = [
  {
    id: 1,
    name: "Ishara Perera",
    message:
      "Ordered a custom birthday cake for my daughter and it was absolutely stunning. Tasted even better than it looked!",
  },
  {
    id: 2,
    name: "Dinuka Fernando",
    message:
      "The bento cake was the perfect size for our small get-together. Delivery was right on time and packaging was flawless.",
  },
  {
    id: 3,
    name: "Sanduni Rathnayake",
    message:
      "Best cupcakes I've had in Colombo. Fresh, moist, and beautifully decorated. Will definitely be ordering again.",
  },
];

const categoriesList = [
  {
    name: "Celebration Cakes",
    description: "Custom birthday, wedding & anniversary gateaux",
    count: "15+ Designs",
    icon: "🎂",
  },
  {
    name: "Cupcakes",
    description: "Delicious gourmet frosted cupcakes in boxes",
    count: "6 Flavours",
    icon: "🧁",
  },
  {
    name: "Bento Cakes",
    description: "Mini Korean lunchbox cakes for 2-3 people",
    count: "Custom Text",
    icon: "🍰",
  },
  {
    name: "Desserts",
    description: "Teatime cakes, cheesecakes & sweet bites",
    count: "Freshly Baked",
    icon: "🍪",
  },
];

const journeySteps = [
  {
    step: "01",
    icon: Calendar,
    title: "Choose your date",
    description:
      "Pick your pickup or delivery slot at checkout. Real-time availability, no double-booked days.",
  },
  {
    step: "02",
    icon: Clock,
    title: "We bake it fresh",
    description:
      "Every order goes into the oven only after it's placed — imported cocoa, real butter, zero preservatives.",
  },
  {
    step: "03",
    icon: Truck,
    title: "We deliver with care",
    description:
      "Safely boxed and driven to your door across Colombo and suburb towns. Cash on delivery accepted.",
  },
];

// Generates a scalloped "icing drip" edge — repeating rounded drips across the width.
function buildDripPath(width: number, height: number, bumps: number) {
  const bumpWidth = width / bumps;
  let d = `M0,0 `;
  for (let i = 0; i < bumps; i++) {
    const cx = i * bumpWidth + bumpWidth / 2;
    const ex = (i + 1) * bumpWidth;
    d += `Q${cx},${height} ${ex},0 `;
  }
  d += `L${width},${height} L0,${height} Z`;
  return d;
}

const DRIP_PATH = buildDripPath(1440, 42, 18);

function IcingDivider({
  fill,
  flip = false,
  className = "",
}: {
  fill: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden leading-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 42"
        preserveAspectRatio="none"
        className={`w-full h-[28px] sm:h-[42px] block ${flip ? "rotate-180" : ""}`}
      >
        <path d={DRIP_PATH} fill={fill} />
      </svg>
    </div>
  );
}

export default function StoreFrontHome() {
  const { products } = useAppState();

  const bestSellers = products.slice(0, 8);

  return (
    <div className="bg-[#F7F1FB]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
        }
        .font-body {
          font-family: "Plus Jakarta Sans", sans-serif;
        }
        .font-mono {
          font-family: "IBM Plex Mono", monospace;
        }
      `}</style>

      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2F0538] to-[#4A1054] text-white pt-24 pb-16 sm:pt-32 sm:pb-20 font-body">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#9D5CDB] filter blur-3xl" />
          <div className="absolute -bottom-20 -right-40 w-96 h-96 rounded-full bg-[#9D5CDB] filter blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[#F7F1FB] font-semibold text-xs tracking-[0.2em] uppercase border border-white/10">
                <span>Sri Lanka's Premium Custom Bakery</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight leading-[1.05]">
                Crafting your sweet
                <br />
                <span className="italic font-medium bg-gradient-to-r from-[#F7F1FB] to-[#9D5CDB] bg-clip-text text-transparent">
                  dream moments
                </span>
              </h1>
              <p className="text-lg text-[#F7F1FB]/85 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Freshly baked custom birthday cakes, adorable bento box treats, and luxury
                desserts crafted by hand with premium ingredients.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-bold rounded-xl shadow-lg shadow-[#9D5CDB]/30 transition-all duration-300 transform hover:-translate-y-0.5"
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

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 text-center sm:text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <h4 className="font-display text-xl sm:text-2xl font-semibold text-white">100%</h4>
                  <p className="text-xs text-[#F7F1FB]/70 font-semibold mt-0.5">Freshly Baked</p>
                </div>
                <div>
                  <h4 className="font-display text-xl sm:text-2xl font-semibold text-white">500+</h4>
                  <p className="text-xs text-[#F7F1FB]/70 font-semibold mt-0.5">Happy Orders</p>
                </div>
                <div>
                  <h4 className="font-display text-xl sm:text-2xl font-semibold text-white">4.9 ★</h4>
                  <p className="text-xs text-[#F7F1FB]/70 font-semibold mt-0.5">Customer Rating</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[#9D5CDB]/20 to-[#9D5CDB]/20 blur-2xl" />
                <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full border-4 border-[#9D5CDB]/40 overflow-hidden shadow-2xl bg-[#2F0538] ring-4 ring-[#9D5CDB]/20 ring-offset-4 ring-offset-transparent">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.jpg"
                    alt="Cake Bae Masterpiece"
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = galleryFallback;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <IcingDivider fill="#F7F1FB" className="absolute bottom-0 left-0" />
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-20 font-body">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#9D5CDB] font-bold text-xs tracking-[0.18em] uppercase border border-[#9D5CDB]/20">
            <span>What We Bake</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#2F0538]">
            The Display Case
          </h2>
          <p className="text-[#241129]/75 max-w-xl mx-auto text-sm sm:text-base">
            Select a category to explore our freshly baked collection and customizable options.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {categoriesList.map((cat) => (
            <Link
              key={cat.name}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center text-center p-8 bg-white border border-[#9D5CDB]/15 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5"
            >
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-[#F7F1FB] ring-1 ring-[#9D5CDB]/30 text-3xl mb-4 group-hover:ring-[#9D5CDB] transition-all">
                {cat.icon}
              </span>
              <h3 className="font-display text-lg font-semibold text-[#2F0538] mb-1">{cat.name}</h3>
              <p className="text-xs text-[#241129]/60 mb-4 leading-relaxed">{cat.description}</p>
              <span className="font-mono text-[11px] font-semibold px-3 py-1 bg-[#F7F1FB] border border-[#9D5CDB]/15 rounded-full text-[#9D5CDB]">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="relative bg-white pt-6 pb-20 font-body">
        <IcingDivider fill="#F7F1FB" flip className="absolute -top-[1px] left-0 rotate-180" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F1FB] text-[#9D5CDB] font-bold text-xs tracking-[0.18em] uppercase border border-[#9D5CDB]/15 mb-3">
                <span>Fan Favorites</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#2F0538]">
                Trending Bestsellers
              </h2>
              <p className="text-[#241129]/60 text-sm mt-1">
                Our most loved signature cake recipes &amp; dessert combinations.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 font-bold text-[#9D5CDB] hover:text-[#2F0538] group text-sm shrink-0"
            >
              <span>View All Products</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-[#9D5CDB]/15 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1.5 hover:rotate-[-0.5deg]"
              >
                <div className="relative aspect-square overflow-hidden bg-[#F7F1FB] border-b border-[#9D5CDB]/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = galleryFallback;
                    }}
                  />
                  <span className="absolute top-2.5 right-2.5 bg-[#2F0538] text-[#F7F1FB] text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full shadow-sm">
                    {product.rating} ★
                  </span>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <h3 className="font-display text-base font-semibold text-[#2F0538] line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono text-base font-semibold text-[#2F0538]">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <Link
                      href={`/shop/${product.id}`}
                      className="px-3.5 py-1.5 bg-[#F7F1FB] hover:bg-[#2F0538] hover:text-white text-[#9D5CDB] text-xs font-bold rounded-lg transition-colors duration-300"
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

      {/* How it works */}
      <section className="relative bg-[#2F0538] text-white pt-6 pb-20 font-body">
        <IcingDivider fill="#2F0538" flip className="absolute -top-[1px] left-0 rotate-180" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F7F1FB] font-bold text-xs tracking-[0.18em] uppercase border border-white/10 mb-3">
              <span>From Order To Doorstep</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              How your cake gets to you
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {journeySteps.map(({ title, description }, idx) => (
              <div key={idx} className="relative">
                <h3 className="font-display text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-[#F7F1FB]/70 leading-relaxed">{description}</p>
                {idx < journeySteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-white/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative bg-[#F7F1FB] pt-6 pb-24 font-body">
        <IcingDivider fill="#F7F1FB" flip className="absolute -top-[1px] left-0 rotate-180" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#9D5CDB] font-bold text-xs tracking-[0.18em] uppercase border border-[#9D5CDB]/15 mb-3">
              <span>Notes From Our Customers</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#2F0538]">
              What our customers say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={testimonial.id}
                className={`relative p-7 bg-white rounded-2xl border border-[#9D5CDB]/15 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                  idx % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1"
                }`}
              >
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#9D5CDB] shadow-sm border-2 border-white" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#9D5CDB] text-[#9D5CDB]" />
                  ))}
                </div>
                <p className="text-sm text-[#241129]/75 leading-relaxed mb-4">{testimonial.message}</p>
                <h3 className="font-display text-base font-semibold text-[#2F0538]">
                  {testimonial.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}