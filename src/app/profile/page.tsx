"use client";

import React, { useState, useEffect, useRef } from "react";
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

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-4">
        <UserIcon className="w-12 h-12 text-purple-400 mx-auto animate-pulse" />
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

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2F0538] via-[#1E0124] to-[#4A1054] text-white py-16 sm:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#9D5CDB] filter blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#f59e0b] filter blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 flex items-center gap-5">
          {/* Profile Picture */}
          <div className="relative shrink-0">
            <div
              onClick={handlePhotoClick}
              className={`relative w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center shrink-0 overflow-hidden ${
                isEditing ? "cursor-pointer group" : ""
              }`}
            >
              {photoPreview ? (
                <img src={photoPreview} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-8 h-8 text-[#C292F0]" />
              )}

              {isEditing && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  {isUploadingPhoto ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
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

            {/* Remove photo button — only when editing and a photo is set */}
            {isEditing && photoPreview && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                title="Remove photo"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md border-2 border-[#2F0538] transition"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black">{displayName}</h1>
            <p className="text-purple-200/80 text-sm mt-1">{displayEmail}</p>
            {isEditing && (
              <p className="text-purple-200/60 text-[11px] mt-1">
                Tap the photo to upload, or use the trash icon to remove it.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-purple-100 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-[#2F0538]">Account Details</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#9D5CDB] hover:bg-[#8545C2] disabled:opacity-60 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition"
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
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition disabled:opacity-60"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {savedMessage && (
                <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                  <Check className="w-3.5 h-3.5" />
                  <span>Profile updated.</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  <X className="w-3.5 h-3.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Name */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 bg-white border border-purple-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{displayName}</p>
                    )}
                  </div>
                </div>

                {/* Email (read-only) */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{displayEmail}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 077 123 4567"
                        className="w-full mt-1 bg-white border border-purple-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{phone || "Not added yet"}</p>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Address</label>
                    {isEditing ? (
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street, city, and any delivery notes"
                        rows={2}
                        className="w-full mt-1 bg-white border border-purple-200 rounded-lg py-2 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition resize-none"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{address || "Not added yet"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">Quick Actions</h3>

              <Link
                href="/orders"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-purple-50/60 hover:bg-purple-50 text-purple-700 text-sm font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  My Orders
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/cart"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Current Cart
                  {cart.length > 0 && (
                    <span className="ml-1 text-[10px] bg-[#f59e0b] text-white font-bold px-1.5 py-0.5 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-red-200 bg-red-50/30 hover:bg-red-50 text-red-600 text-sm font-semibold transition mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}