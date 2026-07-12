"use client";

import React, { useState } from "react";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useAppState } from "@/context/StateContext";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const { cloudinaryCloudName, cloudinaryUploadPreset } = useAppState();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      setIsUploading(false);
      return;
    }

    try {
      // 1. Try uploading to Cloudinary
      if (cloudinaryCloudName && cloudinaryUploadPreset) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinaryUploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.secure_url) {
            onChange(data.secure_url);
            setIsUploading(false);
            return;
          }
        }
      }
      
      // 2. Fallback to Local Base64 Reader if Cloudinary credentials are empty or fail
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
        }
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError("Error reading file.");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Cloudinary upload failed, falling back to base64", err);
      // Fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-purple-100 flex-shrink-0 bg-purple-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded cake"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
              title="Remove image"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-purple-200 flex items-center justify-center flex-shrink-0 bg-purple-50 text-purple-400">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}

        <div className="flex-1">
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 rounded-lg text-sm font-medium text-purple-700 shadow-sm hover:bg-purple-50 cursor-pointer transition">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-purple-500" />
                <span>Select Cake Image</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
          <p className="text-xs text-slate-500 mt-1">
            PNG, JPG or WEBP. Uploads to Cloudinary, falls back to local storage if credentials are not configured.
          </p>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
};
