"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Sparkles,
  MessageCircle,
  Plus,
  Clock,
  Truck,
  Palette,
  CreditCard,
  Mail
} from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function FAQPage() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How far in advance do I need to place my order?",
      answer: "We require at least 24 hours notice for standard cakes, cupcakes, and bento cakes. For custom celebration or wedding cakes with complex designs, please place orders at least 48 to 72 hours in advance.",
      icon: Clock
    },
    {
      question: "Where do you deliver and what are the charges?",
      answer: "We deliver across Colombo 1-15, Rajagiriya, Nugegoda, Nawala, Mount Lavinia, and other Colombo suburbs. Delivery fees range from 200 LKR to 600 LKR depending on the distance from our kitchen in Rajagiriya.",
      icon: Truck
    },
    {
      question: "Can I customize the flavor, size, and writing on the cake?",
      answer: "Yes, absolutely! On our website, you can select your preferred size, flavor, and input custom message writing. For bespoke 3D design requests, please contact us directly via WhatsApp.",
      icon: Palette
    },
    {
      question: "What are your payment options?",
      answer: "We accept Cash on Delivery (COD) and direct Bank Transfers. Card payments can also be selected during checkout, and bank transfer receipt slips can be messaged to us on WhatsApp.",
      icon: CreditCard
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

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
            <span>Got Questions?</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Frequently Asked <span className="bg-gradient-to-r from-[#C292F0] to-[#E9D9FB] bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-purple-100/90 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Everything you need to know about ordering, customizing, and receiving your Cake Bae treats.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-20 sm:py-24">
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFAQ === index;
            return (
              <div
                key={faq.question}
                className={`border rounded-2xl bg-white overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-purple-200 shadow-md"
                    : "border-slate-100 shadow-sm hover:border-purple-100 hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center gap-4 p-5 sm:p-6 text-left transition"
                  aria-expanded={isOpen}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                      isOpen ? "bg-[#2F0538] text-white" : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    <faq.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`flex-grow font-bold text-sm sm:text-base transition-colors ${
                      isOpen ? "text-purple-800" : "text-slate-800"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? "bg-purple-50 border-purple-200 rotate-45"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <Plus className="w-4 h-4 text-purple-600" />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-6 pl-[4.25rem] sm:pl-[4.75rem] -mt-1">
                      <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2F0538] via-[#1E0124] to-[#4A1054] px-8 py-14 sm:px-16 sm:py-16 text-center text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#9D5CDB] filter blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#f59e0b] filter blur-3xl"></div>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6 text-[#C292F0]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Still Have Questions?</h2>
            <p className="text-purple-100/90 max-w-xl mx-auto text-sm sm:text-base font-medium leading-relaxed">
              Can't find what you're looking for? Message us directly and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="https://www.facebook.com/share/1KGEzKfUu9/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#9D5CDB] hover:bg-[#8545C2] text-white font-bold rounded-xl shadow-lg shadow-[#9D5CDB]/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Message Us on Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}