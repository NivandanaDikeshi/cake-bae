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
  Mail,
  Send,
  User,
  Phone,
  MessageSquare,
  CheckCircle2
} from "lucide-react";

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
type FAQItem = {
  question: string;
  answer: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// WhatsApp business number for Cake Bae (update with the real number, country code, no + or spaces)
const WHATSAPP_NUMBER = "94771234567";

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

  // ---- Contact / Message form state ----
  const [formData, setFormData] = useState<ContactFormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<ContactFormState>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof ContactFormState]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: Partial<ContactFormState> = {};
    if (!formData.name.trim()) errors.name = "Please enter your name";
    if (!formData.message.trim()) errors.message = "Please enter a message";
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errors.email = "Please enter a valid email";
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      errors.phone = "Add an email or phone number so we can reach you";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const lines = [
      `Hi Cake Bae! I'm ${formData.name}.`,
      formData.email ? `Email: ${formData.email}` : null,
      formData.phone ? `Phone: ${formData.phone}` : null,
      "",
      formData.message,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

    setSubmitted(true);
    window.open(url, "_blank", "noopener,noreferrer");

    setFormData({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pb-0 bg-white">
<<<<<<< HEAD
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap");
        .font-display {
          font-family: "Fraunces", ui-serif, Georgia, serif;
          letter-spacing: -0.01em;
        }
        body { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
      `}</style>

=======
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
      <Header />

      {/* Page Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2F0538] via-[#1E0124] to-[#4A1054] text-white py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#9D5CDB] filter blur-3xl animate-pulse"></div>
<<<<<<< HEAD
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#9D5CDB] filter blur-3xl animate-pulse"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[#F7F1FB] font-semibold text-xs tracking-[0.15em] uppercase border border-white/10">
            <span>Got Questions?</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]">
            Frequently Asked{" "}
            <span className="italic bg-gradient-to-r from-[#F7F1FB] to-[#9D5CDB] bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-[#F7F1FB]/85 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
=======
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#f59e0b] filter blur-3xl animate-pulse"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[#C292F0] font-semibold text-xs tracking-[0.15em] uppercase border border-white/10">
            <span>Got Questions?</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Frequently Asked <span className="bg-gradient-to-r from-[#C292F0] to-[#E9D9FB] bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-purple-100/90 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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
<<<<<<< HEAD
                    ? "border-[#9D5CDB]/20 shadow-md"
                    : "border-[#9D5CDB]/10 shadow-sm hover:border-[#9D5CDB]/15 hover:shadow-md"
=======
                    ? "border-purple-200 shadow-md"
                    : "border-slate-100 shadow-sm hover:border-purple-100 hover:shadow-md"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center gap-4 p-5 sm:p-6 text-left transition"
                  aria-expanded={isOpen}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
<<<<<<< HEAD
                      isOpen ? "bg-[#2F0538] text-white" : "bg-[#F7F1FB] text-[#9D5CDB]"
=======
                      isOpen ? "bg-[#2F0538] text-white" : "bg-purple-50 text-purple-600"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                    }`}
                  >
                    <faq.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`flex-grow font-bold text-sm sm:text-base transition-colors ${
<<<<<<< HEAD
                      isOpen ? "text-[#2F0538]" : "text-[#241129]"
=======
                      isOpen ? "text-purple-800" : "text-slate-800"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
<<<<<<< HEAD
                        ? "bg-[#F7F1FB] border-[#9D5CDB]/20 rotate-45"
                        : "bg-white border-[#9D5CDB]/15"
                    }`}
                  >
                    <Plus className="w-4 h-4 text-[#9D5CDB]" />
=======
                        ? "bg-purple-50 border-purple-200 rotate-45"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <Plus className="w-4 h-4 text-purple-600" />
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-6 pl-[4.25rem] sm:pl-[4.75rem] -mt-1">
<<<<<<< HEAD
                      <p className="text-sm sm:text-base text-[#241129]/60 leading-relaxed">
=======
                      <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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

      {/* Send Us A Message */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-20 sm:pb-24">
        <div className="text-center space-y-3 mb-10">
<<<<<<< HEAD
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F1FB] text-[#9D5CDB] font-bold text-xs tracking-wider uppercase border border-[#9D5CDB]/15">
            <span>Get In Touch</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2F0538]">
            Send Us A Message
          </h2>
          <p className="text-[#241129]/60 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
=======
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-[#8545C2] font-bold text-xs tracking-wider uppercase border border-purple-100">
            <span>Get In Touch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2F0538]">
            Send Us A Message
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
            Didn't find your answer above? Send us a note and we'll get back to you on WhatsApp.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
<<<<<<< HEAD
          className="rounded-2xl border border-[#9D5CDB]/15 bg-[#F7F1FB]/40 p-6 sm:p-10 space-y-6"
=======
          className="rounded-2xl border border-purple-100 bg-purple-50/30 p-6 sm:p-10 space-y-6"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
        >
          {submitted && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Thanks! We've opened WhatsApp with your message ready to send.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-[#2F0538] uppercase tracking-wide">
                Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#9D5CDB] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
<<<<<<< HEAD
                    formErrors.name ? "border-red-300 bg-red-50" : "border-[#9D5CDB]/20 bg-white"
                  } text-sm text-[#241129] placeholder:text-[#241129]/40 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/40 focus:border-[#9D5CDB] transition-colors`}
=======
                    formErrors.name ? "border-red-300 bg-red-50" : "border-purple-100 bg-white"
                  } text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/40 focus:border-[#9D5CDB] transition-colors`}
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                />
              </div>
              {formErrors.name && (
                <p className="text-xs text-red-500 font-medium">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-[#2F0538] uppercase tracking-wide">
                Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#9D5CDB] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="07X XXX XXXX"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
<<<<<<< HEAD
                    formErrors.phone ? "border-red-300 bg-red-50" : "border-[#9D5CDB]/20 bg-white"
                  } text-sm text-[#241129] placeholder:text-[#241129]/40 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/40 focus:border-[#9D5CDB] transition-colors`}
=======
                    formErrors.phone ? "border-red-300 bg-red-50" : "border-purple-100 bg-white"
                  } text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/40 focus:border-[#9D5CDB] transition-colors`}
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                />
              </div>
              {formErrors.phone && (
                <p className="text-xs text-red-500 font-medium">{formErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-[#2F0538] uppercase tracking-wide">
<<<<<<< HEAD
              Email <span className="text-[#241129]/40 normal-case font-medium">(optional)</span>
=======
              Email <span className="text-slate-400 normal-case font-medium">(optional)</span>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9D5CDB] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
<<<<<<< HEAD
                  formErrors.email ? "border-red-300 bg-red-50" : "border-[#9D5CDB]/20 bg-white"
                } text-sm text-[#241129] placeholder:text-[#241129]/40 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/40 focus:border-[#9D5CDB] transition-colors`}
=======
                  formErrors.email ? "border-red-300 bg-red-50" : "border-purple-100 bg-white"
                } text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/40 focus:border-[#9D5CDB] transition-colors`}
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              />
            </div>
            {formErrors.email && (
              <p className="text-xs text-red-500 font-medium">{formErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="text-xs font-bold text-[#2F0538] uppercase tracking-wide">
              Message
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-[#9D5CDB] absolute left-3.5 top-3.5" />
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Ask us anything about flavors, sizes, delivery, or custom designs."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
<<<<<<< HEAD
                  formErrors.message ? "border-red-300 bg-red-50" : "border-[#9D5CDB]/20 bg-white"
                } text-sm text-[#241129] placeholder:text-[#241129]/40 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/40 focus:border-[#9D5CDB] transition-colors resize-none`}
=======
                  formErrors.message ? "border-red-300 bg-red-50" : "border-purple-100 bg-white"
                } text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/40 focus:border-[#9D5CDB] transition-colors resize-none`}
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              />
            </div>
            {formErrors.message && (
              <p className="text-xs text-red-500 font-medium">{formErrors.message}</p>
            )}
          </div>

          <button
            type="submit"
<<<<<<< HEAD
            className="px-3.5 py-1.5 bg-[#F7F1FB] hover:bg-[#2F0538] hover:text-white text-[#9D5CDB] text-xs font-bold rounded-lg transition-colors duration-300"
=======
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#2F0538] hover:bg-[#4A1054] text-white text-sm font-bold rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
}