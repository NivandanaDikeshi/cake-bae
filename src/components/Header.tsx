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
<<<<<<< HEAD
    { name: "About", href: "/about" },
    { name: "Contact Us", href: "/faq" },
=======
    { name: "About Us", href: "/about" },
    { name: "Contact & FAQ", href: "/faq" },
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleMobileLinkClick = () => setMobileMenuOpen(false);

  return (
<<<<<<< HEAD
    <header className="sticky top-0 z-40 w-full border-b border-[#9D5CDB]/15 bg-white/80 backdrop-blur-md">
=======
    <header className="sticky top-0 z-40 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
<<<<<<< HEAD
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#9D5CDB]/20 shadow-sm bg-gradient-to-br from-[#F7F1FB] to-white flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
=======
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-purple-200 shadow-sm bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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
<<<<<<< HEAD
              <span className="text-[10px] text-[#241129]/50 font-medium tracking-wide">
=======
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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
<<<<<<< HEAD
                className="text-sm font-bold text-[#9D5CDB] hover:text-[#2F0538] bg-[#F7F1FB] hover:bg-[#9D5CDB]/15 border border-[#9D5CDB]/20 px-3 py-1.5 rounded-lg transition"
=======
                className="text-sm font-bold text-[#8545C2] hover:text-[#2F0538] bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-lg transition"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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
<<<<<<< HEAD
              className="relative p-2.5 rounded-full hover:bg-[#F7F1FB] text-[#2F0538] transition-colors"
=======
              className="relative p-2.5 rounded-full hover:bg-purple-50 text-[#2F0538] transition-colors"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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
<<<<<<< HEAD
                      ? "text-[#9D5CDB] bg-[#F7F1FB]"
                      : "text-[#241129]/70 hover:text-[#9D5CDB] hover:bg-[#F7F1FB]"
=======
                      ? "text-[#9D5CDB] bg-purple-50"
                      : "text-slate-600 hover:text-[#9D5CDB] hover:bg-slate-50"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My profile</span>
                </Link>
                <button
                  onClick={logout}
<<<<<<< HEAD
                  className="p-2 text-[#241129]/40 hover:text-[#9D5CDB] rounded-lg hover:bg-[#F7F1FB] transition"
=======
                  className="p-2 text-slate-400 hover:text-[#9D5CDB] rounded-lg hover:bg-purple-50 transition"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
<<<<<<< HEAD
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#241129]/70 hover:text-[#9D5CDB] px-3.5 py-2 rounded-lg hover:bg-[#F7F1FB] transition"
=======
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#9D5CDB] px-3.5 py-2 rounded-lg hover:bg-slate-50 transition"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
<<<<<<< HEAD
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#9D5CDB] hover:bg-[#4A1054] px-4 py-2 rounded-lg transition shadow-sm"
=======
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#9D5CDB] hover:bg-[#8545C2] px-4 py-2 rounded-lg transition shadow-sm"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
<<<<<<< HEAD
              className="p-2 rounded-lg md:hidden text-[#241129]/70 hover:bg-[#F7F1FB] transition"
=======
              className="p-2 rounded-lg md:hidden text-slate-600 hover:bg-slate-100 transition"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
<<<<<<< HEAD
        <div className="md:hidden border-t border-[#9D5CDB]/10 bg-white px-4 py-6 space-y-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
=======
        <div className="md:hidden border-t border-purple-50 bg-white px-4 py-6 space-y-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={handleMobileLinkClick}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition ${
                isActive(link.href)
<<<<<<< HEAD
                  ? "bg-[#F7F1FB] text-[#9D5CDB]"
                  : "text-[#2F0538] hover:bg-[#F7F1FB]"
=======
                  ? "bg-purple-50 text-[#9D5CDB]"
                  : "text-[#2F0538] hover:bg-slate-50"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              }`}
            >
              {link.name}
            </Link>
          ))}

<<<<<<< HEAD
          <div className="pt-4 mt-2 border-t border-[#9D5CDB]/10 flex flex-col gap-2">
=======
          <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-2">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
            {currentUser ? (
              <>
                {isStaff && (
                  <Link
                    href="/admin/dashboard"
                    onClick={handleMobileLinkClick}
<<<<<<< HEAD
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#9D5CDB] hover:bg-[#4A1054] text-white rounded-lg text-sm font-bold transition shadow-xs"
=======
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#9D5CDB] hover:bg-[#8545C2] text-white rounded-lg text-sm font-bold transition shadow-xs"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                  >
                    <span>Admin Panel</span>
                  </Link>
                )}
                <Link
                  href="/orders"
                  onClick={handleMobileLinkClick}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold transition ${
                    isActive("/orders")
<<<<<<< HEAD
                      ? "bg-[#9D5CDB]/15 text-[#9D5CDB]"
                      : "bg-[#F7F1FB] text-[#9D5CDB] hover:bg-[#9D5CDB]/15"
=======
                      ? "bg-purple-100 text-[#8545C2]"
                      : "bg-purple-50 text-[#8545C2] hover:bg-purple-100"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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
<<<<<<< HEAD
                      ? "border-[#9D5CDB]/30 bg-[#F7F1FB] text-[#9D5CDB]"
                      : "border-[#9D5CDB]/15 text-[#9D5CDB] hover:bg-[#F7F1FB]"
=======
                      ? "border-purple-300 bg-purple-50 text-[#8545C2]"
                      : "border-purple-100 text-[#8545C2] hover:bg-purple-50"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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
<<<<<<< HEAD
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#F7F1FB] text-[#9D5CDB] rounded-lg text-sm font-semibold hover:bg-[#9D5CDB]/15 transition"
=======
                  className="flex items-center justify-center gap-2 w-full py-3 bg-purple-50 text-[#8545C2] rounded-lg text-sm font-semibold hover:bg-purple-100 transition"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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
<<<<<<< HEAD
                  className="flex items-center justify-center gap-2 w-full py-3 border border-[#9D5CDB]/15 rounded-lg text-[#241129] text-sm font-semibold hover:bg-[#F7F1FB] transition"
=======
                  className="flex items-center justify-center gap-2 w-full py-3 border border-slate-200 rounded-lg text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  onClick={handleMobileLinkClick}
<<<<<<< HEAD
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#9D5CDB] text-white rounded-lg text-sm font-semibold hover:bg-[#4A1054] transition"
=======
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#9D5CDB] text-white rounded-lg text-sm font-semibold hover:bg-[#8545C2] transition"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
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