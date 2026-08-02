"use client";

import React, { useState } from "react";
import { Cloud, FileImage, ShieldCheck, Check, Settings, ShieldAlert } from "lucide-react";
import { useAppState } from "@/context/StateContext";

export default function CloudinarySettingsPage() {
  const { cloudinaryCloudName, cloudinaryUploadPreset, setCloudinaryConfig } = useAppState();

  const [cloudName, setCloudName] = useState(cloudinaryCloudName);
  const [preset, setPreset] = useState(cloudinaryUploadPreset);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCloudinaryConfig(cloudName.trim(), preset.trim());
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Cloudinary Media Integration</h1>
        <p className="text-slate-500 text-xs mt-0.5">Configure cloud credentials to handle storefront & catalog image uploads directly to your Cloudinary storage.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 text-purple-700">
          <Cloud className="w-6 h-6 text-[#9D5CDB]" />
          <h3 className="text-base font-bold text-slate-800">Cloudinary API Configuration</h3>
        </div>

        {/* Status Indicator */}
        <div className={`p-4 rounded-xl border flex gap-3 text-xs leading-relaxed ${
          cloudinaryCloudName && cloudinaryUploadPreset
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-amber-50 border-amber-200 text-amber-800"
        }`}>
          {cloudinaryCloudName && cloudinaryUploadPreset ? (
            <>
              <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <span className="font-bold block">Cloudinary Upload Active</span>
                <span>All cake image selections will be uploaded directly to Cloudinary cloud storage under account <strong className="font-semibold text-green-950">"{cloudinaryCloudName}"</strong>.</span>
              </div>
            </>
          ) : (
            <>
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <span className="font-bold block">Cloudinary Inactive (Local Fallback Mode)</span>
                <span>No API credentials detected. The system is falling back to Local Base64 storage. Images will load locally but won't sync to external servers.</span>
              </div>
            </>
          )}
        </div>

        {/* Settings form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Cloudinary Cloud Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. dzxuzqg5g"
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Unsigned Upload Preset *</label>
              <input
                type="text"
                required
                placeholder="e.g. cakebae_preset"
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              {success ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Settings Saved!</span>
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Guide Block */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 text-xs space-y-4">
        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">How to retrieve these values?</h4>
        <ol className="list-decimal list-inside space-y-2 text-slate-600 leading-relaxed font-medium">
          <li>Register or log in to your dashboard on <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-purple-700 font-bold hover:underline">Cloudinary.com</a>.</li>
          <li>Find your <strong className="text-slate-800">Cloud Name</strong> displayed at the top of your Cloudinary Console dashboard.</li>
          <li>Go to <strong className="text-slate-800">Settings &gt; Upload</strong> tab in your Cloudinary Console.</li>
          <li>Scroll down to the <strong className="text-slate-800">Upload presets</strong> section.</li>
          <li>Click <strong className="text-slate-800">Add upload preset</strong>. Configure the mode to <strong className="text-purple-700">Unsigned</strong> (this is required for secure client-side uploads without server signing secrets), and save it.</li>
          <li>Copy the generated <strong className="text-slate-800">Upload Preset name</strong> and paste it into the field above!</li>
        </ol>
      </div>
    </div>
  );
}
