"use client";

import React from "react";
import Link from "next/link";
// Lightweight fallback for environments without framer-motion installed.
// This shim ignores animation-specific props and renders plain HTML elements.
const motion: any = new Proxy({}, {
  get: (_target, tag: string) => (props: any) => {
    const { children, ...rest } = props || {};
    // strip animation-related props
    const { initial, animate, variants, whileHover, whileTap, transition, viewport, whileInView, ...pass } = rest as any;
    return React.createElement(tag, pass, children);
  }
});
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
  Quote,
  Compass,
  Target,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};

export default function AboutPage() {
  const stats = [
    { value: "500+", label: "Happy Orders" },
    { value: "4.9★", label: "Customer Rating" },
    { value: "15+", label: "Cake Designs" },
    { value: "100%", label: "Freshly Baked" }
  ];

  const values = [
    { icon: Heart, title: "Made With Love", description: "Every cake is hand-decorated by Savi herself, with no two orders treated the same way." },
    { icon: Leaf, title: "Premium Ingredients", description: "Belgian chocolate, Australian cream cheese, and fresh fruit — never preservatives or shortcuts." },
    { icon: Award, title: "Custom Craftsmanship", description: "From flavor to writing to 3D design, every detail is built around your celebration." },
    { icon: Clock, title: "Always Fresh", description: "Nothing leaves our kitchen in Rajagiriya until it's baked fresh to order for your date." }
  ];

  const process = [
    { step: "01", title: "Tell Us Your Vision", description: "Browse our shop or message us on WhatsApp with your flavor, size, and design ideas." },
    { step: "02", title: "We Bring It To Life", description: "Savi hand-crafts and decorates your order using premium, freshly sourced ingredients." },
    { step: "03", title: "Fresh To Your Door", description: "Your cake is delivered fresh across Colombo and suburbs, right on your chosen date." }
  ];

  const visionMission = [
    {
      icon: Compass,
      label: "Our Vision",
      title: "Sri Lanka's Most Loved Custom Cake Brand",
      description: "A Cake Bae box in every celebration across Colombo and beyond — known for trust, care, and consistency in every order."
    },
    {
      icon: Target,
      label: "Our Mission",
      title: "Handcrafted Joy, Delivered Fresh",
      description: "Turning every occasion into a memorable one with premium ingredients, custom artistry, and reliable delivery."
    }
  ];

  return (
    <div className="pb-0 bg-white overflow-x-hidden">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap");
        .font-display {
          font-family: "Fraunces", ui-serif, Georgia, serif;
          letter-spacing: -0.01em;
        }
        body { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <Header />

      {/* Page Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2F0538] via-[#1E0124] to-[#4A1054] text-white py-24 sm:py-32">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#9D5CDB] filter blur-3xl opacity-20"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#F7F1FB] font-semibold text-xs tracking-[0.15em] uppercase border border-white/10"
          >
            <span>Behind Cake Bae</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]">
            Our Sweet <span className="italic text-[#9D5CDB]">Story</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-[#F7F1FB]/85 text-base sm:text-lg font-medium leading-relaxed">
            From a home kitchen in Rajagiriya to Sri Lanka's premium custom bakery — every cake carries a little bit of our heart.
          </motion.p>
        </motion.div>
      </section>

      {/* Founder Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex justify-center order-1 lg:order-none"
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-[#9D5CDB]/15 blur-2xl opacity-60" />
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-[6px] border-white overflow-hidden shadow-2xl bg-[#2F0538] ring-1 ring-[#9D5CDB]/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="Chef Savi Wijayalath"
                  className="w-full h-full object-cover hover:scale-105 transition duration-700 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
              <div className="absolute -bottom-5 -right-3 sm:right-3 bg-white rounded-2xl shadow-xl border border-[#9D5CDB]/15 px-5 py-3.5 flex items-center gap-2.5 max-w-[220px]">
                <Quote className="w-5 h-5 text-[#9D5CDB] shrink-0" />
                <span className="text-xs font-bold text-[#241129] leading-snug">
                  A cake is a celebration's centerpiece.
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={container}
            className="lg:col-span-7 space-y-7"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F1FB] border border-[#9D5CDB]/15 text-[#9D5CDB] font-bold text-xs tracking-wider uppercase">
              <span>Meet The Baker</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2F0538] leading-tight">
              Hi, I'm Savi Wijayalath
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#241129]/75 leading-relaxed text-base sm:text-lg">
              Founder and head pastry chef at Cake Bae. My passion for baking started in my home kitchen in Rajagiriya, experimenting with rich flavors and minimalist frosting designs that bring joy to celebrations.
            </motion.p>
            <motion.p variants={fadeUp} className="text-[#241129]/60 text-sm sm:text-base leading-relaxed">
              At Cake Bae, we believe a cake is not just a dessert — it's the centerpiece of your most treasured celebrations. That's why we pour our heart into every custom order, sourcing premium Belgian chocolate, Australian cream cheese, and fresh fruits.
            </motion.p>
            <motion.div variants={fadeUp} className="pt-6 border-t border-[#9D5CDB]/15 flex items-center justify-between flex-wrap gap-5">
              <div>
                <h5 className="font-display font-semibold text-[#2F0538] text-base">Savi Wijayalath</h5>
                <p className="text-xs text-[#9D5CDB] font-bold tracking-wide">FOUNDER & HEAD BAKER, CAKE BAE</p>
              </div>
              <motion.a
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                href="https://www.facebook.com/share/1KGEzKfUu9/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#9D5CDB] hover:bg-[#4A1054] text-white text-sm font-bold rounded-xl transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Us</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission — single-color (deep purple) themed pairing */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
          className="text-center space-y-3 mb-14"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F1FB] text-[#9D5CDB] font-bold text-xs tracking-wider uppercase border border-[#9D5CDB]/15">
            <span>What Drives Us</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl font-semibold text-[#2F0538]">
            Vision &amp; Mission
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="relative grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-[#2F0538]/10 shadow-xl shadow-[#2F0538]/5 bg-[#2F0538]"
        >
          {/* subtle glow accent, kept within the same purple family */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#9D5CDB] blur-3xl opacity-20" />

          {visionMission.map((item, idx) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={`relative p-9 sm:p-12 flex flex-col gap-5 bg-[#2F0538] ${
                idx === 0 ? "md:border-r border-white/10" : ""
              } ${idx === 1 ? "border-t md:border-t-0 border-white/10" : ""}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                <item.icon className="w-7 h-7 text-[#9D5CDB]" strokeWidth={2} />
              </div>
              <div className="space-y-3">
                <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase text-[#9D5CDB]">
                  {item.label}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-white leading-snug">{item.title}</h3>
                <p className="text-[#F7F1FB]/70 text-sm sm:text-base leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Band */}
      <section className="bg-[#2F0538] py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={container}
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="px-2">
                <h4 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">{stat.value}</h4>
                <p className="text-[11px] sm:text-xs text-[#9D5CDB] font-bold tracking-wider uppercase mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Values Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
          className="text-center space-y-3 mb-14"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F1FB] text-[#9D5CDB] font-bold text-xs tracking-wider uppercase border border-[#9D5CDB]/15">
            <span>Our Promise</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl font-semibold text-[#2F0538]">
            Why Customers Love Cake Bae
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              className="p-7 rounded-2xl border border-[#9D5CDB]/15 bg-[#F7F1FB]/40 hover:bg-[#F7F1FB] transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#9D5CDB]/15 flex items-center justify-center shadow-sm mb-5">
                <value.icon className="w-6 h-6 text-[#9D5CDB]" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#2F0538] mb-2">{value.title}</h3>
              <p className="text-sm text-[#241129]/60 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-[#2F0538] px-8 py-16 sm:px-16 sm:py-20 text-center text-white shadow-2xl"
        >
          <motion.div
            className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#9D5CDB] filter blur-3xl opacity-15"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#F7F1FB] font-semibold text-xs tracking-wider uppercase border border-white/10">
              <span>Let's Celebrate Together</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              Ready to Order Your Sweet Moment?
            </h2>
            <p className="text-[#F7F1FB]/85 max-w-xl mx-auto text-sm sm:text-base font-medium leading-relaxed">
              Custom cakes, cupcakes, bento boxes, and desserts — freshly baked and delivered across Colombo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/shop"
                  className="w-full sm:w-auto text-center block px-8 py-4 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-bold rounded-xl shadow-lg shadow-[#9D5CDB]/30 transition-colors"
                >
                  Order Online Now
                </Link>
              </motion.div>

              <motion.a
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                href="https://www.facebook.com/share/1KGEzKfUu9/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-bold rounded-xl transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enquire on FB</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}