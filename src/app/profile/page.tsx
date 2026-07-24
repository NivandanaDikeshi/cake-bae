"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  LogOut,
  ShoppingBag,
  Pencil,
  Check,
  X,
  ArrowRight,
  Camera,
  Loader2,
  Trash2,
  Receipt,
  Wallet,
  CalendarDays,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useAppState } from "@/context/StateContext";

export default function ProfilePage() {
  const {
    currentUser,
    logout,
    cart,
    updateUser,
    cloudinaryCloudName,
    cloudinaryUploadPreset,
    orders,
  } = useAppState();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Profile picture state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Redirect guests to login — profile requires an account
  useEffect(() => {
    if (currentUser === null) {
      router.push("/login");
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setPhone(currentUser.phone || "");
      setAddress(currentUser.address || "");
      setPhotoPreview(currentUser.photoURL || null);
      setRemovePhoto(false);
    }
  }, [currentUser]);

  // --- Order stats (computed from this customer's own orders) ---
  const myOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders
      .filter(
        (o) =>
          o.userId === currentUser.id ||
          (o.customerEmail && o.customerEmail.toLowerCase() === currentUser.email?.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, currentUser]);

  const totalOrders = myOrders.length;
  const totalSpent = useMemo(
    () =>
      myOrders
        .filter((o) => o.status !== "Cancelled")
        .reduce((sum, o) => sum + o.totalPrice, 0),
    [myOrders]
  );
  const memberSince = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-4">
        <UserIcon className="w-12 h-12 text-[#C23CDD] mx-auto animate-pulse" />
        <h2 className="text-xl font-bold text-slate-800">Loading your profile...</h2>
      </div>
    );
  }

  const displayName = currentUser.name || "Cake Bae Customer";
  const displayEmail = currentUser.email || "—";
  const currentPhotoURL = currentUser.photoURL || null;

  // --- Profile picture handlers ---
  const handlePhotoClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image must be smaller than 5MB.");
      return;
    }

    setErrorMessage("");
    setPhotoFile(file);
    setRemovePhoto(false);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoFile(null);
    setPhotoPreview(null);
    setRemovePhoto(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Upload to Cloudinary (unsigned preset — same pattern the rest of the app uses)
  // Returns the new photo URL, "" if the photo should be cleared, or the
  // existing photo URL if nothing changed.
  const resolvePhotoURL = async (): Promise<string> => {
    if (photoFile) {
      if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
        throw new Error("Image upload isn't configured yet. Please contact support.");
      }

      setIsUploadingPhoto(true);
      try {
        const formData = new FormData();
        formData.append("file", photoFile);
        formData.append("upload_preset", cloudinaryUploadPreset);
        formData.append("folder", "profile-pictures");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!res.ok) {
          throw new Error("Image upload failed. Please try again.");
        }

        const data = await res.json();
        return data.secure_url as string;
      } finally {
        setIsUploadingPhoto(false);
      }
    }

    if (removePhoto) return "";

    return currentPhotoURL || "";
  };

  // --- Save / cancel / logout handlers ---
  const handleSave = async () => {
    setErrorMessage("");
    setIsSaving(true);

    try {
      const photoURL = await resolvePhotoURL();

      await updateUser(currentUser.id, {
        name,
        phone,
        address,
        photoURL,
      });

      setPhotoFile(null);
      setRemovePhoto(false);
      setIsEditing(false);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setErrorMessage(err?.message || "Something went wrong while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(currentUser.name || "");
    setPhone(currentUser.phone || "");
    setAddress(currentUser.address || "");
    setPhotoPreview(currentPhotoURL);
    setPhotoFile(null);
    setRemovePhoto(false);
    setErrorMessage("");
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Confirmed":
        return "bg-[#FBF5FC] text-[#5A066B] border-[#F7EBF9]";
      case "Baking/Decorating":
        return "bg-[#F7EBF9] text-[#4B0259] border-[#EFD7F4]";
      case "Ready for Dispatch":
        return "bg-[#EFD7F4] text-[#1D0123] border-[#E5BAEE]";
      case "Delivered":
      case "Completed":
        return "bg-[#1D0123] text-white border-[#1D0123]";
      case "Cancelled":
        return "bg-slate-50 text-slate-500 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#FBF5FC]/40 via-white to-white min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1D0123] via-[#3A0246] to-[#4B0259] text-white pb-24 pt-16 sm:pt-20">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#9E05BD] filter blur-3xl"></div>
          <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-[#9E05BD] filter blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Profile Picture */}
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div
                onClick={handlePhotoClick}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 backdrop-blur-sm ring-4 ring-white/15 flex items-center justify-center shrink-0 overflow-hidden shadow-2xl ${
                  isEditing ? "cursor-pointer group" : ""
                }`}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-10 h-10 sm:w-12 sm:h-12 text-[#E389F5]" />
                )}

                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    {isUploadingPhoto ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {isEditing && photoPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  title="Remove photo"
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#1D0123] hover:bg-[#4B0259] text-white flex items-center justify-center shadow-md border-2 border-white transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E389F5] mb-2">
                <span>Cake Bae Member</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">{displayName}</h1>
              <p className="text-[#EFD7F4]/80 text-sm mt-1.5 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {displayEmail}
              </p>
              {isEditing && (
                <p className="text-[#EFD7F4]/60 text-[11px] mt-2">
                  Tap the photo to upload, or use the trash icon to remove it.
                </p>
              )}
            </div>
          </div>
        </div>    
      </section>
      
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-14 pb-16 sm:pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Account Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#F7EBF9] rounded-3xl p-6 sm:p-8 shadow-lg shadow-[#1D0123]/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-black text-[#1D0123]">Account Details</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Keep your info up to date for smoother deliveries.</p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A066B] hover:text-white bg-[#FBF5FC] hover:bg-[#9E05BD] px-3.5 py-2 rounded-xl transition shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#9E05BD] hover:bg-[#7D0495] disabled:opacity-60 disabled:cursor-not-allowed px-3.5 py-2 rounded-xl shadow-sm transition"
                    >
                      {isSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>{isSaving ? "Saving..." : "Save"}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-2 rounded-xl hover:bg-slate-50 transition disabled:opacity-60"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {savedMessage && (
                <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#1D0123] bg-[#FBF5FC] border border-[#F7EBF9] rounded-xl px-3.5 py-2.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Profile updated.</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#1D0123] bg-[#FBF5FC] border border-[#EFD7F4] rounded-xl px-3.5 py-2.5">
                  <X className="w-3.5 h-3.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FBF5FC] flex items-center justify-center text-[#7A0891] shrink-0">
                    <UserIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 bg-white border border-[#EFD7F4] rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#9E05BD]/20 focus:border-[#9E05BD] transition"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 mt-1">{displayName}</p>
                    )}
                  </div>
                </div>

                {/* Email (read-only) */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FBF5FC] flex items-center justify-center text-[#7A0891] shrink-0">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <p className="text-sm font-semibold text-slate-800 mt-1 truncate">{displayEmail}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FBF5FC] flex items-center justify-center text-[#7A0891] shrink-0">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 077 123 4567"
                        className="w-full mt-1 bg-white border border-[#EFD7F4] rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#9E05BD]/20 focus:border-[#9E05BD] transition"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 mt-1">{phone || "Not added yet"}</p>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FBF5FC] flex items-center justify-center text-[#7A0891] shrink-0">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Address</label>
                    {isEditing ? (
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street, city, and any delivery notes"
                        rows={2}
                        className="w-full mt-1 bg-white border border-[#EFD7F4] rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#9E05BD]/20 focus:border-[#9E05BD] transition resize-none"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 mt-1">{address || "Not added yet"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white border border-[#F7EBF9] rounded-3xl p-6 shadow-lg shadow-[#1D0123]/5 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">Quick Actions</h3>

              <Link
                href="/orders"
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-[#FBF5FC]/60 hover:bg-[#FBF5FC] text-[#5A066B] text-sm font-semibold transition group"
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  My Orders
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/cart"
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition group"
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  Current Cart
                  {cart.length > 0 && (
                    <span className="ml-1 text-[10px] bg-[#9E05BD] text-white font-bold px-1.5 py-0.5 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border border-dashed border-[#EFD7F4] bg-[#FBF5FC]/30 hover:bg-[#FBF5FC] text-[#5A066B] text-sm font-semibold transition mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>

            {/* Little summary card */}
            <div className="bg-gradient-to-br from-[#1D0123] to-[#4B0259] text-white rounded-3xl p-6 shadow-lg shadow-[#1D0123]/10">
              <p className="text-sm font-bold leading-relaxed">
                Thanks for being part of the Cake Bae family, {currentUser.name?.split(" ")[0] || "friend"}!
              </p>
              <p className="text-xs text-[#EFD7F4]/70 mt-2 leading-relaxed">
                Every order helps a small bakery do what it loves. Sweet things ahead.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}