"use client";

<<<<<<< HEAD
import React from "react";
import Link from "next/link";
import { Truck, Clock, Calendar, ChevronRight, MessageCircle, Star } from "lucide-react";
=======
import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Truck, Clock, Calendar, ChevronRight, MessageCircle, Heart } from "lucide-react";
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
import { useAppState } from "@/context/StateContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

<<<<<<< HEAD
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
=======
export default function StoreFrontHome() {
  const { products } = useAppState();
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // Filter 4 featured bestsellers
  const bestSellers = products.slice(0, 4);

  // Gallery now pulls real product images (Cloudinary URLs already on each product)
  const galleryProducts = products.slice(0, 6);

  const categoriesList = [
    {
      name: "Celebration Cakes",
      description: "Custom birthday, wedding & anniversary gateaux",
      count: "15+ Designs",
      icon: "🎂",
      color: "bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100/50"
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
      color: "bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100/50"
    },
    {
      name: "Desserts",
      description: "Teatime cakes, cheesecakes & sweet bites",
      count: "Freshly Baked",
      icon: "🍪",
      color: "bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100/50"
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

  const galleryFallback = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80";

  return (
    <div className="bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2F0538] via-[#1E0124] to-[#4A1054] text-white py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#9D5CDB] filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#9D5CDB] filter blur-3xl animate-pulse"></div>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
<<<<<<< HEAD
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
=======
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[#C292F0] font-semibold text-xs tracking-[0.15em] uppercase border border-white/10">
                <span>Sri Lanka's Premium Custom Bakery</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
                Crafting Your Sweet <br />
                <span className="italic font-medium bg-gradient-to-r from-[#C292F0] to-[#E9D9FB] bg-clip-text text-transparent">
                  Dream Moments
                </span>
              </h1>
              <p className="text-lg text-purple-100/90 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Freshly baked custom birthday cakes, adorable bento box treats, and luxury desserts crafted by hand with premium ingredients.
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/shop"
<<<<<<< HEAD
                  className="w-full sm:w-auto text-center px-8 py-4 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-bold rounded-xl shadow-lg shadow-[#9D5CDB]/30 transition-all duration-300 transform hover:-translate-y-0.5"
=======
                  className="w-full sm:w-auto text-center px-8 py-4 bg-[#9D5CDB] hover:bg-[#8545C2] text-white font-bold rounded-xl shadow-lg shadow-[#9D5CDB]/30 transition-all duration-300 transform hover:-translate-y-0.5"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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

<<<<<<< HEAD
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
=======
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 text-center sm:text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <h4 className="font-display text-xl sm:text-2xl font-semibold text-white">100%</h4>
                  <p className="text-xs text-purple-300 font-semibold mt-0.5">Freshly Baked</p>
                </div>
                <div>
                  <h4 className="font-display text-xl sm:text-2xl font-semibold text-white">500+</h4>
                  <p className="text-xs text-purple-300 font-semibold mt-0.5">Happy Orders</p>
                </div>
                <div>
                  <h4 className="font-display text-xl sm:text-2xl font-semibold text-white">4.9 ★</h4>
                  <p className="text-xs text-purple-300 font-semibold mt-0.5">Customer Rating</p>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[#9D5CDB]/20 to-[#9D5CDB]/20 blur-2xl" />
                <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full border-4 border-[#9D5CDB]/40 overflow-hidden shadow-2xl bg-[#2F0538] ring-4 ring-[#9D5CDB]/20 ring-offset-4 ring-offset-transparent">
=======
            {/* Hero Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[#9D5CDB]/30 to-[#9D5CDB]/10 blur-2xl"></div>
                <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full border-4 border-[#9D5CDB]/50 overflow-hidden shadow-2xl bg-[#3F0F4A]">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.jpg"
                    alt="Cake Bae Masterpiece"
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-700 ease-out"
                    onError={(e) => {
<<<<<<< HEAD
                      (e.target as HTMLImageElement).src = galleryFallback;
=======
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80";
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
<<<<<<< HEAD

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
=======
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 font-bold text-xs tracking-[0.14em] uppercase border border-purple-100">
            <span>What We Bake</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#2F0538]">Browse By Category</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
            Select a category to explore our freshly baked collection and select customizable options.
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
<<<<<<< HEAD
          {categoriesList.map((cat) => {
            const catImage =
              products.find((p) => p.category === cat.name)?.image || galleryFallback;
            return (
              <Link
                key={cat.name}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center text-center p-8 bg-white border border-[#9D5CDB]/15 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5"
              >
                <span className="relative flex items-center justify-center w-20 h-20 rounded-full overflow-hidden ring-1 ring-[#9D5CDB]/30 mb-4 group-hover:ring-[#9D5CDB] transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={catImage}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = galleryFallback;
                    }}
                  />
                </span>
                <h3 className="font-display text-lg font-semibold text-[#2F0538] mb-1">{cat.name}</h3>
                <p className="text-xs text-[#241129]/60 mb-4 leading-relaxed">{cat.description}</p>
                <span className="font-mono text-[11px] font-semibold px-3 py-1 bg-[#F7F1FB] border border-[#9D5CDB]/15 rounded-full text-[#9D5CDB]">
                  {cat.count}
                </span>
              </Link>
            );
          })}
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
=======
          {categoriesList.map((cat) => (
            <Link
              key={cat.name}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className={`flex flex-col items-center text-center p-8 border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1.5 ${cat.color}`}
            >
              <span className="text-5xl mb-4 filter drop-shadow-sm">{cat.icon}</span>
              <h3 className="font-display text-lg font-semibold text-slate-800 mb-1">{cat.name}</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">{cat.description}</p>
              <span className="text-xs font-bold px-3 py-1 bg-white border rounded-full shadow-sm text-slate-700">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Bestsellers */}
      <section className="bg-gradient-to-b from-purple-50/70 to-purple-50/20 py-20 border-y border-purple-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-purple-600 font-bold text-xs tracking-[0.14em] uppercase border border-purple-100 shadow-sm mb-3">
                <span>Fan Favorites</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#2F0538]">Trending Bestsellers</h2>
              <p className="text-slate-500 text-sm mt-1">Our most loved signature cake recipes & dessert combinations.</p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 font-bold text-purple-700 hover:text-purple-900 group text-sm shrink-0"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
            >
              <span>View All Products</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <div
                key={product.id}
<<<<<<< HEAD
                className="group bg-white rounded-2xl border border-[#9D5CDB]/15 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1.5 hover:rotate-[-0.5deg]"
              >
                <div className="relative aspect-square overflow-hidden bg-[#F7F1FB] border-b border-[#9D5CDB]/10">
=======
                className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-purple-50 border-b border-purple-50">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500 ease-out"
                    onError={(e) => {
<<<<<<< HEAD
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
                    <span className="font-display text-2xl font-semibold text-[#9D5CDB]">
=======
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                  <span className="absolute top-2.5 right-2.5 bg-[#9D5CDB] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {product.rating} ★
                  </span>
                </div>
                {/* Content */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-display text-base font-semibold text-slate-800 line-clamp-1">{product.name}</h3>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-black text-slate-900">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <Link
                      href={`/shop/${product.id}`}
<<<<<<< HEAD
                      className="px-3.5 py-1.5 bg-[#F7F1FB] hover:bg-[#2F0538] hover:text-white text-[#9D5CDB] text-xs font-bold rounded-lg transition-colors duration-300"
=======
                      className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-900 hover:text-white text-purple-700 text-xs font-bold rounded-lg transition-colors duration-300"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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

<<<<<<< HEAD
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
=======
      {/* Feature Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div className="p-7 border border-slate-100 rounded-2xl bg-white space-y-3 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mx-auto md:mx-0">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-semibold text-slate-800">Booking Calendar</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Select your preferred pickup/delivery date and time slot at checkout. Real-time availability block-outs.
          </p>
        </div>

        <div className="p-7 border border-slate-100 rounded-2xl bg-white space-y-3 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mx-auto md:mx-0">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-semibold text-slate-800">Prompt Home Delivery</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            We deliver safely right to your doorstep across Colombo and suburb towns. Cash on delivery accepted.
          </p>
        </div>

        <div className="p-7 border border-slate-100 rounded-2xl bg-white space-y-3 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mx-auto md:mx-0">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-semibold text-slate-800">Freshness Guaranteed</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            All cakes are baked fresh to order using the finest imported cocoa, butter, and cream cheese. No preservatives.
          </p>
        </div>
      </section>

      {/* Brand Story (About Us) */}
      <section id="about" className="relative overflow-hidden bg-[#2F0538] text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#9D5CDB] filter blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Logo illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-400/10 blur-2xl"></div>
              <div className="relative w-80 h-80 rounded-full border-8 border-purple-950 overflow-hidden shadow-2xl bg-[#4A1054]">
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
            </div>
          </div>
          {/* Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-purple-300 font-bold text-xs tracking-[0.14em] uppercase">
                <span>Behind Cake Bae</span>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 font-bold text-purple-300 hover:text-white group text-sm shrink-0"
              >
                <span>Read Full Story</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold italic leading-tight">Our Sweet Story</h2>
            <p className="text-purple-100/90 leading-relaxed font-medium">
              Hello, I'm Savi Wijayalath, the founder and head pastry chef at Cake Bae. My passion for baking started in my home kitchen in Rajagiriya, experimenting with rich flavors and minimalist frosting designs that bring joy to celebrations.
            </p>
            <p className="text-purple-200/80 text-sm leading-relaxed">
              At Cake Bae, we believe that a cake is not just a dessert; it's the centerpiece of your most treasured celebrations. That's why we pour our heart into every custom order—hand-decorating each cake to perfection, and sourcing premium Belgian chocolate, Australian cream cheese, and fresh fruits to ensure your cake tastes as heavenly as it looks.
            </p>
            <div className="pt-4 border-t border-white/10 flex items-center gap-4">
              <div>
                <h5 className="font-display font-semibold text-white text-base">Savi Wijayalath</h5>
                <p className="text-xs text-purple-300 font-semibold">Founder & Head Baker, Cake Bae</p>
              </div>
            </div>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
          </div>
        </div>
      </section>

<<<<<<< HEAD
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
=======
      {/* Gallery Section - now driven by real product images */}
      <section id="gallery" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="text-center sm:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 font-bold text-xs tracking-[0.14em] uppercase border border-purple-100">
              <span>Our Portfolio</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#2F0538]">Sweet Inspiration Gallery</h2>
            <p className="text-slate-500 max-w-xl text-sm sm:text-base">
              Browse through some of our past customized bento cakes, drip gateaux, and birthday party designs.
            </p>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 font-bold text-purple-700 hover:text-purple-900 group text-sm shrink-0"
          >
            <span>View Full Gallery</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryProducts.map((product) => (
            <div
              key={product.id}
              className="relative aspect-square rounded-2xl overflow-hidden group bg-purple-50 border border-purple-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500 ease-out"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = galleryFallback;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                <span className="text-white text-xs font-bold">{product.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-gradient-to-b from-purple-50/50 to-white py-20 border-t border-purple-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div className="text-center sm:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-purple-600 font-bold text-xs tracking-[0.14em] uppercase border border-purple-100 shadow-sm">
                <span>Got Questions?</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#2F0538]">Frequently Asked Questions</h2>
              <p className="text-slate-500 text-sm sm:text-base">
                Everything you need to know about placing custom cake orders and delivery details.
              </p>
            </div>
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 font-bold text-purple-700 hover:text-purple-900 group text-sm shrink-0"
            >
              <span>View All FAQs</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFAQ === index;
              return (
                <div
                  key={index}
                  className={`border rounded-2xl bg-white overflow-hidden transition-all duration-300 ${
                    isOpen ? "border-purple-200 shadow-md" : "border-purple-100 shadow-sm hover:shadow-md"
                  }`}
                >
                  <button
                    onClick={() => setActiveFAQ(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-slate-800 hover:text-purple-700 transition"
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 text-purple-600 ${
                        isOpen ? "bg-purple-50 border-purple-200 rotate-45" : "bg-white border-slate-200"
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-5 pt-0 text-sm text-slate-600 border-t border-purple-50 bg-purple-50/20 leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}