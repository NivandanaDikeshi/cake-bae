"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Cake,
  LogIn,
  UserPlus,
  ReceiptText,
} from "lucide-react";
import { useAppState } from "@/context/StateContext";

// ── Brand palette (Cake Bae) — used identically on every page ──────────
// Aubergine #2F0538  — deep bg / primary dark surface
// Plum      #4A1054  — gradient partner / hover depth
// Orchid    #9D5CDB  — primary accent, buttons, active states
// Lavender  #F7F1FB  — light section bg
// Ink       #241129  — body text color
// Gold      #F0B429  — reserved for one meaning only: "Ready for Dispatch"
// Fonts: Fraunces (display) + Inter (body) — used site-wide, see BRAND_FONTS.
// ──────────────────────────────────────────────────────────────────────

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { cart, currentUser, roles, logout } = useAppState();
  const isStaff = currentUser && roles?.some((r) => r.id === currentUser.roleId);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Order Cakes", href: "/shop" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact Us", href: "/faq" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleMobileLinkClick = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#9D5CDB]/15 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#9D5CDB]/20 shadow-sm bg-gradient-to-br from-[#F7F1FB] to-white flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              {!logoError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/logo.jpg"
                  alt="Cake Bae"
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <Cake className="w-6 h-6 text-[#9D5CDB]" />
              )}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold tracking-tight text-[#2F0538]">
                Cake <span className="text-[#9D5CDB]">Bae</span>
              </span>
              <span className="text-[10px] text-[#241129]/50 font-medium tracking-wide">
                BY SAVI WIJAYALATH
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#9D5CDB] ${
                  isActive(link.href)
                    ? "text-[#9D5CDB] font-semibold"
                    : "text-[#2F0538]/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {currentUser && (
              <Link
                href="/orders"
                className={`text-sm font-medium transition-colors hover:text-[#9D5CDB] ${
                  isActive("/orders")
                    ? "text-[#9D5CDB] font-semibold"
                    : "text-[#2F0538]/80"
                }`}
              >
                My Orders
              </Link>
            )}
            {currentUser && isStaff && (
              <Link
                href="/admin/dashboard"
                className="text-sm font-bold text-[#9D5CDB] hover:text-[#2F0538] bg-[#F7F1FB] hover:bg-[#9D5CDB]/15 border border-[#9D5CDB]/20 px-3 py-1.5 rounded-lg transition"
              >
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Actions Section */}
          <div className="flex items-center gap-3">
            {/* Cart Link */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full hover:bg-[#F7F1FB] text-[#2F0538] transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6 stroke-[2]" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#9D5CDB] text-[10px] font-bold text-white ring-2 ring-white animate-bounce-slow">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/profile"
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition ${
                    isActive("/profile")
                      ? "text-[#9D5CDB] bg-[#F7F1FB]"
                      : "text-[#241129]/70 hover:text-[#9D5CDB] hover:bg-[#F7F1FB]"
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-[#241129]/40 hover:text-[#9D5CDB] rounded-lg hover:bg-[#F7F1FB] transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#241129]/70 hover:text-[#9D5CDB] px-3.5 py-2 rounded-lg hover:bg-[#F7F1FB] transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#9D5CDB] hover:bg-[#4A1054] px-4 py-2 rounded-lg transition shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 rounded-lg md:hidden text-[#241129]/70 hover:bg-[#F7F1FB] transition"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#9D5CDB]/10 bg-white px-4 py-6 space-y-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={handleMobileLinkClick}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition ${
                isActive(link.href)
                  ? "bg-[#F7F1FB] text-[#9D5CDB]"
                  : "text-[#2F0538] hover:bg-[#F7F1FB]"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 mt-2 border-t border-[#9D5CDB]/10 flex flex-col gap-2">
            {currentUser ? (
              <>
                {isStaff && (
                  <Link
                    href="/admin/dashboard"
                    onClick={handleMobileLinkClick}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#9D5CDB] hover:bg-[#4A1054] text-white rounded-lg text-sm font-bold transition shadow-xs"
                  >
                    <span>Admin Panel</span>
                  </Link>
                )}
                <Link
                  href="/orders"
                  onClick={handleMobileLinkClick}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold transition ${
                    isActive("/orders")
                      ? "bg-[#9D5CDB]/15 text-[#9D5CDB]"
                      : "bg-[#F7F1FB] text-[#9D5CDB] hover:bg-[#9D5CDB]/15"
                  }`}
                >
                  <ReceiptText className="w-4 h-4" />
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/profile"
                  onClick={handleMobileLinkClick}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold border transition ${
                    isActive("/profile")
                      ? "border-[#9D5CDB]/30 bg-[#F7F1FB] text-[#9D5CDB]"
                      : "border-[#9D5CDB]/15 text-[#9D5CDB] hover:bg-[#F7F1FB]"
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    handleMobileLinkClick();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#F7F1FB] text-[#9D5CDB] rounded-lg text-sm font-semibold hover:bg-[#9D5CDB]/15 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={handleMobileLinkClick}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-[#9D5CDB]/15 rounded-lg text-[#241129] text-sm font-semibold hover:bg-[#F7F1FB] transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  onClick={handleMobileLinkClick}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#9D5CDB] text-white rounded-lg text-sm font-semibold hover:bg-[#4A1054] transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};