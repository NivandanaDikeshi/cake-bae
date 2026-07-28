"use client";

import React from "react";
import Link from "next/link";
import { Heart, Mail, Phone, MapPin, Cake } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2F0538] text-white border-t border-[#4A1054]">
      {/* Upper Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#4A1054] bg-[#F7F1FB] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="Cake Bae"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <Cake className="w-5 h-5 text-[#9D5CDB] absolute" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white">
                  Cake <span className="text-[#9D5CDB]">Bae</span>
                </span>
                <span className="text-[8px] text-[#F7F1FB]/70 tracking-wide">BY SAVI WIJAYALATH</span>
              </div>
            </Link>
            <p className="text-sm text-[#F7F1FB]/70 leading-relaxed">
              Serving custom-crafted premium celebration cakes, adorable bento cakes, and rich gourmet desserts in Colombo and suburbs.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/share/1KGEzKfUu9/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#4A1054] hover:bg-[#9D5CDB] rounded-full transition-colors text-white"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
              <a
                href="#"
                className="p-2 bg-[#4A1054] hover:bg-[#9D5CDB] rounded-full transition-colors text-white"
                title="Instagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9D5CDB] mb-4">Categories</h3>
            <ul className="space-y-2">
              {["Celebration Cakes", "Cupcakes", "Bento Cakes", "Desserts"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(cat)}`}
                    className="text-sm text-[#F7F1FB]/70 hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9D5CDB] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-sm text-[#F7F1FB]/70 hover:text-white transition-colors">
                  Online Shop
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm text-[#F7F1FB]/70 hover:text-white transition-colors">
                  Our Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-[#F7F1FB]/70 hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-[#F7F1FB]/70 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9D5CDB] mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-sm text-[#F7F1FB]/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9D5CDB] mt-0.5 flex-shrink-0" />
                <span>Nawala Road, Rajagiriya, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9D5CDB] flex-shrink-0" />
                <span>+94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9D5CDB] flex-shrink-0" />
                <span>hello@cakebae.lk</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#4A1054] bg-[#1E0124] py-6 text-center text-xs text-[#F7F1FB]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Cake Bae. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 fill-[#9D5CDB] text-[#9D5CDB]" /> by{" "}
            <span className="font-semibold text-white">Nivandana</span>
          </p>
        </div>
      </div>
    </footer>
  );
};