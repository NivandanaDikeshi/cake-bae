"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
  ChevronRight,
  DollarSign,
  MessageSquare,
  Bell,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2
} from "lucide-react";
import { useAppState } from "@/context/StateContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";

// How long `currentUser` must remain null before we treat it as a real
// logout and redirect. This protects against transient null states that
// are NOT a real logout, e.g.:
//   - StateProvider remounting on navigation (isLoaded resets, currentUser
//     resets to its initial null value before loadState()/onAuthStateChanged
//     finish re-resolving it)
//   - onAuthStateChanged briefly being mid-flight while it fetches the
//     Firestore user doc after a CRUD call touches auth-adjacent state
// A real logout (explicit logout(), inactive account, expired session)
// stays null well past this window, so the redirect still fires correctly.
const LOGOUT_REDIRECT_DELAY_MS = 800;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, currentRole, logout, orders, updateOrderStatus } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Notifications State
  const [messages, setMessages] = useState<any[]>([]);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Listen to contactMessages collection
  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name,
            email: data.email ?? null,
            phone: data.phone ?? null,
            message: data.message,
            status: data.status === "replied" || data.status === "Replied" ? "Replied" : "New",
            createdAt: data.createdAt,
          };
        })
      );
    });
    return () => unsub();
  }, []);

  // Sync read notifications with Local Storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cb_read_notifications");
      if (stored) {
        setReadNotificationIds(JSON.parse(stored));
      }
    }
  }, []);

  // Dropdown click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generate combined notifications list
  const combinedNotifications = useMemo(() => {
    const list: any[] = [];

    // Process orders
    orders.forEach((o) => {
      list.push({
        id: `order-${o.id}`,
        type: "order",
        title: "New Order Placed",
        subtitle: `Order #${o.id} by ${o.customerName || "Guest"}`,
        message: `${o.items?.length || 0} item(s) · Rs. ${o.totalPrice.toLocaleString()}`,
        timestamp: o.createdAt ? new Date(o.createdAt) : new Date(),
        data: o,
      });
    });

    // Process messages
    messages.forEach((m) => {
      list.push({
        id: `msg-${m.id}`,
        type: "message",
        title: "New Contact Message",
        subtitle: `Inquiry from ${m.name}`,
        message: m.message,
        timestamp: m.createdAt?.toDate ? m.createdAt.toDate() : new Date(m.createdAt || Date.now()),
        data: m,
      });
    });

    // Sort descending by timestamp
    return list.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 15);
  }, [orders, messages]);

  const unreadCount = useMemo(() => {
    return combinedNotifications.filter((n) => !readNotificationIds.includes(n.id)).length;
  }, [combinedNotifications, readNotificationIds]);

  const handleNotificationClick = (n: any) => {
    // Mark as read
    if (!readNotificationIds.includes(n.id)) {
      const updated = [...readNotificationIds, n.id];
      setReadNotificationIds(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("cb_read_notifications", JSON.stringify(updated));
      }
    }
    setSelectedNotification(n);
    setNotificationsOpen(false);
  };

  const markAllAsRead = () => {
    const allIds = combinedNotifications.map((n) => n.id);
    setReadNotificationIds(allIds);
    if (typeof window !== "undefined") {
      localStorage.setItem("cb_read_notifications", JSON.stringify(allIds));
    }
  };

  const handleUpdateMsgStatus = async (msgId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      await updateDoc(doc(db, "contactMessages", msgId), {
        status: newStatus,
      });
      // Update selected notification local data
      if (selectedNotification && selectedNotification.data.id === msgId) {
        setSelectedNotification({
          ...selectedNotification,
          data: {
            ...selectedNotification.data,
            status: newStatus,
          },
        });
      }
    } catch (err) {
      console.error("Failed to update message status:", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: any) => {
    setIsUpdatingStatus(true);
    try {
      const paymentStatus = (newStatus === "Delivered" || newStatus === "Completed") ? "Paid" as const : undefined;
      await updateOrderStatus(orderId, newStatus, paymentStatus);
      // Update selected notification local data
      if (selectedNotification && selectedNotification.data.id === orderId) {
        setSelectedNotification({
          ...selectedNotification,
          data: {
            ...selectedNotification.data,
            status: newStatus,
            ...(paymentStatus ? { paymentStatus } : {}),
          },
        });
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Tracks whether we've EVER seen a currentUser in this mount. Used so we
  // don't show a "not authenticated" flash for a brand-new visitor who is
  // genuinely logged out (no debounce needed there — nothing to protect),
  // while still debouncing the redirect for a user who WAS authenticated
  // and had currentUser drop out transiently.
  const hasSeenUserRef = useRef(false);
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (currentUser) {
      hasSeenUserRef.current = true;
    }
  }, [currentUser]);

  // Redirect to login if not authenticated — debounced to survive
  // transient currentUser=null blips without logging the user out.
  useEffect(() => {
    if (!isClient) return;

    // Always clear any pending redirect first; if currentUser is present
    // again, this cancels a scheduled false-positive redirect.
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }

    if (!currentUser) {
      const delay = hasSeenUserRef.current ? LOGOUT_REDIRECT_DELAY_MS : 0;
      redirectTimeoutRef.current = setTimeout(() => {
        router.push("/admin/login");
      }, delay);
    }

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    };
  }, [currentUser, isClient, router]);

  // Only block render on currentUser — NOT on currentRole. currentRole is
  // fetched in a second async step after currentUser resolves, so requiring
  // it here caused the same spinner (and, combined with the old undebounced
  // redirect effect, occasional redirects) on every navigation/CRUD call
  // while the role doc re-fetched. We now render with a safe fallback role
  // if currentRole hasn't resolved yet, instead of blocking the whole page.
  if (!isClient || !currentUser) {
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
      module: "dashboard" as const,
      action: "read" as const
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
      module: "orders" as const,
      action: "read" as const
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Database,
      module: "products" as const,
      action: "read" as const
    },

    {
      name: "Calendar",
      href: "/admin/calendar",
      icon: Calendar,
      module: "calendar" as const,
      action: "read" as const
    },

    {
      name: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      module: "messages" as const,
      action: "read" as const
    },

    {
      name: "Roles",
      href: "/admin/roles",
      icon: ShieldCheck,
      module: "roles" as const,
      action: "read" as const
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      module: "users" as const, 
      action: "read" as const
    },
    {
      name: "Cloudinary Settings",
      href: "/admin/cloudinary",
      icon: FileImage,
      module: "dashboard" as const, 
      action: "read" as const
    }
  ];

  // Safe fallback while currentRole is still resolving, so the sidebar/nav
  // can render immediately instead of waiting and re-blocking on every
  // navigation. Real permissions apply as soon as currentRole loads.
  const effectiveRole = currentRole || {
    id: "",
    name: "…",
    status: "Active" as const,
    isAdminPrivileges: false,
    permissionCount: 0,
    permissions: {
      dashboard: [] as string[],
      products: [] as string[],
      orders: [] as string[],
      users: [] as string[],
      calendar: [] as string[],
      roles: [] as string[],
      messages: [] as string[],
    },
  };

  // Check if current user role has permissions for this path
  const hasPermissionForPath = (path: string) => {
    if (effectiveRole.isAdminPrivileges) return true;

    const matchingLink = sidebarLinks.find((l) => path.startsWith(l.href));
    if (!matchingLink) return true; // generic paths allowed

    const modulePermissions = effectiveRole.permissions[matchingLink.module as keyof typeof effectiveRole.permissions] || [];
    return modulePermissions.includes(matchingLink.action);
  };

  const allowedLinks = sidebarLinks.filter((link) => {
    if (effectiveRole.isAdminPrivileges) return true;
    const modulePermissions = effectiveRole.permissions[link.module as keyof typeof effectiveRole.permissions] || [];
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
                {effectiveRole.name}
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
            {/* Notifications Dropdown */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 text-slate-500 hover:text-[#9D5CDB] hover:bg-purple-50 rounded-xl transition duration-200 cursor-pointer"
                title="System Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col py-1">
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Recent System Updates</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-[#9D5CDB] hover:text-[#4A1054] hover:underline transition cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {/* Dropdown Body / Notification items */}
                  <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100">
                    {combinedNotifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-slate-400 text-xs">
                        <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                        <p className="font-semibold">All caught up!</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">No recent updates detected.</p>
                      </div>
                    ) : (
                      combinedNotifications.map((n) => {
                        const isRead = readNotificationIds.includes(n.id);
                        return (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`flex gap-3 px-4 py-3 text-xs hover:bg-[#F7F1FB]/30 cursor-pointer transition duration-150 relative items-start group ${
                              !isRead ? "bg-[#F7F1FB]/15 font-semibold text-slate-900" : "text-slate-600"
                            }`}
                          >
                            {/* Unread indicator dot */}
                            {!isRead && (
                              <span className="absolute left-2.5 top-[18px] w-1.5 h-1.5 rounded-full bg-[#9D5CDB]" />
                            )}
                            
                            {/* Icon column */}
                            <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
                              n.type === "order" ? "bg-purple-50 text-purple-600" : "bg-pink-50 text-pink-600"
                            }`}>
                              {n.type === "order" ? (
                                <ShoppingBag className="w-4 h-4" />
                              ) : (
                                <MessageSquare className="w-4 h-4" />
                              )}
                            </div>

                            {/* Text column */}
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-[11px] font-bold truncate ${!isRead ? "text-slate-800" : "text-slate-600"}`}>
                                  {n.title}
                                </span>
                                <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">
                                  {new Date(n.timestamp).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true })}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-bold truncate">{n.subtitle}</p>
                              <p className="text-[10px] text-slate-400 truncate line-clamp-1">{n.message}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile badge matching screenshots */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#2F0538] text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">{currentUser.name}</span>
              <span className="text-[9px] font-bold bg-[#f59e0b] text-white px-2 py-0.5 rounded-full uppercase scale-90">
                {effectiveRole.name}
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
                    Your account role <span className="font-semibold text-purple-700">({effectiveRole.name})</span> does not have permissions to access the `{pathname.split("/").pop()}` module.
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
                    {effectiveRole.name}
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

      {/* Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedNotification(null)}
          ></div>
          <div className="relative bg-white border border-purple-100 rounded-3xl w-full max-w-lg p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl space-y-6 z-10 animate-fade-in">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  selectedNotification.type === "order" ? "bg-purple-50 text-purple-600" : "bg-pink-50 text-pink-600"
                }`}>
                  {selectedNotification.type === "order" ? (
                    <ShoppingBag className="w-5 h-5" />
                  ) : (
                    <MessageSquare className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {selectedNotification.type === "order" ? "Order Notification" : "Message Notification"}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Received: {new Date(selectedNotification.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {selectedNotification.type === "order" ? (
              <div className="space-y-4 text-xs">
                {/* Order Meta details */}
                <div className="bg-[#F7F1FB]/50 border border-purple-100/50 rounded-2xl p-4 space-y-2">
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">Order ID:</span>
                    <span className="font-mono font-extrabold text-purple-700">{selectedNotification.data.id}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">Customer:</span>
                    <span className="font-bold text-slate-800">{selectedNotification.data.customerName || "Guest"}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">Contact:</span>
                    <span className="font-semibold text-slate-700">
                      {selectedNotification.data.customerPhone} · {selectedNotification.data.customerEmail}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">Scheduled Delivery:</span>
                    <span className="font-bold text-slate-800">
                      {selectedNotification.data.deliveryDate} ({
                        selectedNotification.data.deliveryTime === "10:00" ? "Morning Slot" : 
                        selectedNotification.data.deliveryTime === "14:00" ? "Afternoon Slot" : 
                        "Evening Slot"
                      })
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">Delivery Address:</span>
                    <span className="font-medium text-slate-700 text-right max-w-[200px] truncate" title={selectedNotification.data.deliveryAddress}>
                      {selectedNotification.data.deliveryAddress}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">Payment Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                      selectedNotification.data.paymentStatus === "Paid" 
                        ? "bg-green-50 text-green-700 border-green-100" 
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>
                      {selectedNotification.data.paymentStatus || "Unpaid"}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">Current Status:</span>
                    <span className="font-extrabold text-[#9D5CDB]">{selectedNotification.data.status}</span>
                  </p>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-700 text-[10px] uppercase tracking-wider">Ordered Items</h4>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50">
                    {selectedNotification.data.items?.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50/30 flex justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-800">{item.product?.name || "Signature Cake"}</p>
                          <p className="text-[10px] text-slate-400">
                            Size: {item.selectedSize || "Standard"} · Flavour: {item.selectedFlavour || "Classic"}
                          </p>
                          {item.customMessage && (
                            <p className="text-[10px] text-pink-600 italic mt-0.5">"Message: {item.customMessage}"</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-slate-800">Rs. {item.unitPrice?.toLocaleString() || item.product?.price?.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Totals */}
                <div className="flex justify-between items-center pt-2 font-bold text-sm text-slate-800">
                  <span>Grand Total:</span>
                  <span className="text-base text-slate-900">Rs. {selectedNotification.data.totalPrice?.toLocaleString()}</span>
                </div>

                {/* Quick Status Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-700 text-[10px] uppercase tracking-wider">Update Order Status</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["Pending", "Confirmed", "Baking/Decorating", "Ready for Dispatch", "Delivered", "Cancelled"].map((st) => (
                      <button
                        key={st}
                        disabled={isUpdatingStatus || selectedNotification.data.status === st}
                        onClick={() => handleUpdateOrderStatus(selectedNotification.data.id, st)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[10px] border transition cursor-pointer ${
                          selectedNotification.data.status === st
                            ? "bg-purple-600 border-purple-600 text-white shadow-xs"
                            : "bg-white hover:bg-purple-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5 text-xs">
                {/* Message detail view */}
                <div className="bg-[#F7F1FB]/50 border border-purple-100/50 rounded-2xl p-4 space-y-2">
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">From Name:</span>
                    <span className="font-bold text-slate-800">{selectedNotification.data.name}</span>
                  </p>
                  {selectedNotification.data.email && (
                    <p className="flex justify-between">
                      <span className="font-semibold text-slate-500">Email Address:</span>
                      <span className="font-medium text-[#9D5CDB]">{selectedNotification.data.email}</span>
                    </p>
                  )}
                  {selectedNotification.data.phone && (
                    <p className="flex justify-between">
                      <span className="font-semibold text-slate-500">Phone Number:</span>
                      <span className="font-semibold text-slate-700">{selectedNotification.data.phone}</span>
                    </p>
                  )}
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">Read Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                      selectedNotification.data.status === "Replied"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-purple-50 text-purple-700 border-purple-100"
                    }`}>
                      {selectedNotification.data.status}
                    </span>
                  </p>
                </div>

                {/* Message body */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-700 text-[10px] uppercase tracking-wider">Inquiry Content</h4>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-700 leading-relaxed italic text-sm">
                    "{selectedNotification.data.message}"
                  </div>
                </div>

                {/* Message quick actions */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  {selectedNotification.data.phone && (
                    <a
                      href={`https://wa.me/${selectedNotification.data.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-md shadow-green-500/10 active:scale-[0.98] text-center"
                    >
                      <Phone className="w-4 h-4" />
                      <span>WhatsApp Customer</span>
                    </a>
                  )}
                  {selectedNotification.data.status !== "Replied" ? (
                    <button
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateMsgStatus(selectedNotification.data.id, "Replied")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-bold rounded-xl transition shadow-md shadow-purple-500/10 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark as Replied</span>
                    </button>
                  ) : (
                    <button
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateMsgStatus(selectedNotification.data.id, "New")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold rounded-xl transition cursor-pointer"
                    >
                      <span>Mark as Unreplied</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}