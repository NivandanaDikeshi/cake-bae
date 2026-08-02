"use client";

import React, { useState } from "react";
import { Upload, Image as ImageIcon, Loader2, X } from "lucide-react";
import { useAppState } from "@/context/StateContext";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const { cloudinaryCloudName, cloudinaryUploadPreset } = useAppState();

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // Validate image type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
      setError("Cloudinary configuration missing. Check your environment variables.");
      return;
    }

    try {
      setIsUploading(true);

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

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        throw new Error("No image URL returned");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Image upload failed");
    } finally {
      setIsUploading(false);
      // reset input
      e.target.value = "";
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-3">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap");
        .font-display {
          font-family: "Fraunces", ui-serif, Georgia, serif;
          letter-spacing: -0.01em;
        }
        .font-body {
          font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
        }
      `}</style>

      <div className="flex items-center gap-5 font-body">
        {/* Preview */}
        {value ? (
          <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-[#9D5CDB]/20 bg-[#F7F1FB]">
            <img src={value} alt="Cake preview" className="w-full h-full object-cover" />

            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-[#2F0538] text-white rounded-full p-1 hover:bg-[#4A1054] transition-colors duration-200"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="w-28 h-28 rounded-xl border-2 border-dashed border-[#9D5CDB]/30 flex items-center justify-center bg-[#F7F1FB] text-[#9D5CDB] transition-colors duration-200">
            <ImageIcon size={38} />
          </div>
        )}

        {/* Upload Button */}
        <div>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#9D5CDB] text-white font-semibold rounded-lg cursor-pointer hover:bg-[#4A1054] transition-colors duration-200 shadow-sm">
            {isUploading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} />
                Select Cake Image
              </>
            )}

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              disabled={isUploading}
              onChange={handleFileChange}
            />
          </label>

          <p className="text-xs text-[#241129]/40 mt-2">PNG, JPG, WEBP | Maximum 5MB</p>

          {error && <p className="text-xs text-red-500 font-medium mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};