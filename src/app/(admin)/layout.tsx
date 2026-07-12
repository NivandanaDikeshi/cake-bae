"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Database,
  Calendar,
  ShieldCheck,
  Users,
  Settings,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Cake,
  FileImage,
  Lock,
  ChevronRight
} from "lucide-react";
import { useAppState } from "@/context/StateContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, currentRole, logout } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isClient && !currentUser) {
      router.push("/admin/login");
    }
  }, [currentUser, isClient, router]);

  if (!isClient || !currentUser || !currentRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Sidebar Links
  const sidebarLinks = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      module: "dashboard",
      action: "read"
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
      module: "orders",
      action: "read"
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Database,
      module: "products",
      action: "read"
    },
    {
      name: "Calendar",
      href: "/admin/calendar",
      icon: Calendar,
      module: "calendar",
      action: "read"
    },
    {
      name: "Roles",
      href: "/admin/roles",
      icon: ShieldCheck,
      module: "roles",
      action: "read"
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      module: "roles", // Users falls under roles module permissions
      action: "read"
    },
    {
      name: "Cloudinary Settings",
      href: "/admin/cloudinary",
      icon: FileImage,
      module: "dashboard", // Settings under dashboard permissions
      action: "read"
    }
  ];

  // Check if current user role has permissions for this path
  const hasPermissionForPath = (path: string) => {
    if (currentRole.isAdminPrivileges) return true;
    
    const matchingLink = sidebarLinks.find((l) => path.startsWith(l.href));
    if (!matchingLink) return true; // generic paths allowed

    const modulePermissions = currentRole.permissions[matchingLink.module as keyof typeof currentRole.permissions] || [];
    return modulePermissions.includes(matchingLink.action);
  };

  const allowedLinks = sidebarLinks.filter((link) => {
    if (currentRole.isAdminPrivileges) return true;
    const modulePermissions = currentRole.permissions[link.module as keyof typeof currentRole.permissions] || [];
    return modulePermissions.includes(link.action);
  });

  const pathAllowed = hasPermissionForPath(pathname);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#2F0538] text-white fixed h-full border-r border-[#3F0F4A] z-20">
        {/* Brand / Logo */}
        <div className="flex h-20 items-center px-6 border-b border-[#3F0F4A] gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#5E1B73] bg-purple-100 flex items-center justify-center flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="Cake Bae"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <Cake className="w-5 h-5 text-purple-600 absolute" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white tracking-tight">Cake Bae</span>
            <span className="text-[9px] text-purple-300 font-semibold tracking-wide">ADMIN PORTAL</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {allowedLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#9D5CDB] text-white shadow-md shadow-[#9D5CDB]/20"
                    : "text-purple-200 hover:bg-[#3F0F4A] hover:text-white"
                }`}
              >
                <link.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-purple-300"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Logged-in profile */}
        <div className="p-4 border-t border-[#3F0F4A] bg-[#22022B] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#9D5CDB] flex items-center justify-center text-xs font-bold text-white flex-shrink-0 border border-purple-300">
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-white truncate">{currentUser.name}</span>
              <span className="text-[10px] text-purple-300 font-semibold truncate bg-purple-900/60 px-1.5 py-0.5 rounded border border-purple-800 w-fit">
                {currentRole.name}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-purple-300 hover:text-red-400 rounded-lg hover:bg-[#3F0F4A] transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Page Layout Wrapper */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-30 h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Open Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 rounded-lg md:hidden hover:bg-slate-100 transition"
              title="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-semibold text-slate-400">Welcome back,</span>
              <h2 className="text-sm font-bold text-slate-800">{currentUser.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile badge matching screenshots */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#2F0538] text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">{currentUser.name}</span>
              <span className="text-[9px] font-bold bg-[#f59e0b] text-white px-2 py-0.5 rounded-full uppercase scale-90">
                {currentRole.name}
              </span>
            </div>
            
            <Link
              href="/"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:bg-purple-50 px-3.5 py-2 rounded-lg border border-purple-100 transition"
            >
              <span>View Storefront</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 relative">
          {pathAllowed ? (
            children
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 p-6">
              <div className="max-w-md w-full bg-white border border-purple-100 rounded-3xl p-8 text-center space-y-5 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
                  <p className="text-sm text-slate-500">
                    Your account role <span className="font-semibold text-purple-700">({currentRole.name})</span> does not have permissions to access the `{pathname.split("/").pop()}` module.
                  </p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Please request access from a Super Admin if you need permissions for this feature.
                </p>
                <button
                  onClick={() => router.push("/admin/dashboard")}
                  className="px-6 py-2.5 bg-[#2F0538] hover:bg-[#4A1054] text-white font-bold text-sm rounded-xl transition"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer Sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Drawer content */}
          <div className="relative flex flex-col w-64 bg-[#2F0538] text-white h-full z-10 p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-[#3F0F4A] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.jpg"
                    alt="Cake Bae"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <Cake className="w-4 h-4 text-purple-600 absolute" />
                </div>
                <span className="text-base font-bold text-white">Cake Bae</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-purple-300 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-grow space-y-1">
              {allowedLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#9D5CDB] text-white"
                        : "text-purple-200 hover:bg-[#3F0F4A] hover:text-white"
                    }`}
                  >
                    <link.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-purple-300"}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-[#3F0F4A] pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-[#9D5CDB] flex items-center justify-center text-xs font-bold text-white">
                  {currentUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-white truncate">{currentUser.name}</span>
                  <span className="text-[9px] text-purple-300 truncate font-semibold bg-purple-900/60 px-1 py-0.5 rounded">
                    {currentRole.name}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-purple-300 hover:text-red-400"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
