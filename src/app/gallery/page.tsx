"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAppState } from "@/context/StateContext";
import { X, ZoomIn, Sparkles, Shuffle, ImageIcon } from "lucide-react";

type GalleryImage = {
  url: string;
  title: string;
  category: string;
  description: string;
  featured?: boolean;
};

// Fisher-Yates shuffle — unbiased, doesn't mutate the original array
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function GalleryPage() {
  const { products } = useAppState();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [shuffleKey, setShuffleKey] = useState(0);

  const fallbackList = [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
    "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=800",
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800",
    "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800",
    "https://images.unsplash.com/photo-1518047601542-79f18c655718?w=800",
    "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800",
    "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=800",
    "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800"
  ];

  // Build gallery images directly from real product data, then shuffle.
  // shuffleKey is in the dependency array so clicking "Shuffle" re-randomizes.
  const galleryImages: GalleryImage[] = useMemo(() => {
    const base = products
      .filter((p) => !!p.image)
      .map((p, index) => ({
        url: p.image,
        title: p.name,
        category: p.category,
        description: p.description || "Handcrafted fresh, just for your celebration.",
        featured: index % 5 === 0
      }));
    return shuffleArray(base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, shuffleKey]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...unique];
  }, [products]);

  const filteredImages =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const handleShuffle = useCallback(() => {
    setShuffleKey((prev) => prev + 1);
  }, []);

  return (
<<<<<<< HEAD
    <div className="pb-0 bg-white min-h-screen font-body">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
          font-optical-sizing: auto;
        }
        .font-body {
          font-family: "Plus Jakarta Sans", sans-serif;
        }
        .font-mono {
          font-family: "IBM Plex Mono", monospace;
        }
      `}</style>

=======
    <div className="pb-0 bg-white min-h-screen">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
      <Header />

      {/* Page Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2F0538] via-[#1E0124] to-[#4A1054] text-white py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#9D5CDB] filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#9D5CDB] filter blur-3xl animate-pulse"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
<<<<<<< HEAD
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[#F7F1FB] font-semibold text-xs tracking-[0.15em] uppercase border border-white/10">
            <span>Our Portfolio</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]">
            Sweet Inspiration{" "}
            <span className="italic font-medium bg-gradient-to-r from-[#F7F1FB] to-[#9D5CDB] bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="text-[#F7F1FB]/85 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
=======
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[#C292F0] font-semibold text-xs tracking-[0.15em] uppercase border border-white/10">
            <span>Our Portfolio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Sweet Inspiration <span className="bg-gradient-to-r from-[#C292F0] to-[#E9D9FB] bg-clip-text text-transparent">Gallery</span>
          </h1>
          <p className="text-purple-100/90 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
            A curated look at our handcrafted cakes, bento boxes, and desserts — each one baked fresh and designed to make celebrations unforgettable.
          </p>
        </div>
      </section>

      {/* Category Filter + Shuffle */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
<<<<<<< HEAD
        <div className="bg-white rounded-2xl border border-[#9D5CDB]/15 shadow-lg shadow-[#2F0538]/5 p-4 sm:p-5">
=======
        <div className="bg-white rounded-2xl border border-purple-100 shadow-lg shadow-purple-900/5 p-4 sm:p-5">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
<<<<<<< HEAD
                  className="px-3.5 py-1.5 bg-[#F7F1FB] hover:bg-[#2F0538] hover:text-white text-[#9D5CDB] text-xs font-bold rounded-lg transition-colors duration-300"

=======
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-[#9D5CDB] border-[#9D5CDB] text-white shadow-md shadow-[#9D5CDB]/30"
                      : "bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-700"
                  }`}
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={handleShuffle}
<<<<<<< HEAD
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold border border-[#9D5CDB]/20 text-[#9D5CDB] bg-[#F7F1FB] hover:bg-[#2F0538] hover:border-[#9D5CDB] hover:text-white transition-all duration-200 shrink-0 group"
=======
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold border border-purple-200 text-purple-700 bg-purple-50 hover:bg-[#9D5CDB] hover:border-[#9D5CDB] hover:text-white transition-all duration-200 shrink-0 group"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
            >
              <Shuffle className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
          {filteredImages.map((image, index) => (
            <button
              key={`${shuffleKey}-${image.title}-${index}`}
              onClick={() => setSelectedImage(image)}
              style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
<<<<<<< HEAD
              className={`relative rounded-2xl overflow-hidden group bg-[#F7F1FB] border border-[#9D5CDB]/15 text-left shadow-sm hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB] animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both ${
=======
              className={`relative rounded-2xl overflow-hidden group bg-purple-50 border border-purple-100 text-left shadow-sm hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB] animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both ${
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                image.featured ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500 ease-out"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackList[index % fallbackList.length];
                }}
              />
<<<<<<< HEAD
              <div className="absolute inset-0 bg-gradient-to-t from-[#2F0538]/90 via-[#2F0538]/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                <span className="font-mono text-[#F7F1FB]/80 text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-1">
                  {image.category}
                </span>
                <span className="font-display text-white text-sm sm:text-base font-semibold leading-tight">
                  {image.title}
                </span>
                <span className="text-[#F7F1FB]/70 text-[11px] sm:text-xs leading-snug mt-1 line-clamp-2">
                  {image.description}
                </span>
              </div>
              <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#241129]/12 text-[#241129]/50 text-xs font-bold hover:bg-[#241129]/[0.05] transition-colors duration-300">
                <ZoomIn className="w-4 h-4 text-[#9D5CDB]" />
=======
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-950/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                <span className="text-purple-200 text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-1">
                  {image.category}
                </span>
                <span className="text-white text-sm sm:text-base font-black leading-tight">
                  {image.title}
                </span>
                <span className="text-purple-200/80 text-[11px] sm:text-xs leading-snug mt-1 line-clamp-2">
                  {image.description}
                </span>
              </div>
              <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-md">
                <ZoomIn className="w-4 h-4 text-purple-700" />
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              </div>
            </button>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
<<<<<<< HEAD
            <div className="w-16 h-16 rounded-2xl bg-[#F7F1FB] flex items-center justify-center mb-4">
              <ImageIcon className="w-7 h-7 text-[#9D5CDB]/50" />
            </div>
            <p className="text-[#241129]/70 text-sm font-semibold">No images found in this category yet.</p>
            <p className="text-[#241129]/50 text-xs mt-1">Try selecting a different category above.</p>
=======
            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
              <ImageIcon className="w-7 h-7 text-purple-300" />
            </div>
            <p className="text-slate-500 text-sm font-semibold">No images found in this category yet.</p>
            <p className="text-slate-400 text-xs mt-1">Try selecting a different category above.</p>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
<<<<<<< HEAD
          className="fixed inset-0 z-50 bg-[#2F0538]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
=======
          className="fixed inset-0 z-50 bg-purple-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
<<<<<<< HEAD
            className="absolute top-5 right-5 sm:top-8 sm:right-8 w-10 h-10 rounded-xl bg-white/10 hover:bg-[#9D5CDB] border border-white/20 hover:border-[#9D5CDB] flex items-center justify-center text-white transition-all duration-200"
=======
            className="absolute top-5 right-5 sm:top-8 sm:right-8 w-10 h-10 rounded-full bg-white/10 hover:bg-[#9D5CDB] border border-white/20 hover:border-[#9D5CDB] flex items-center justify-center text-white transition-all duration-200 hover:rotate-90"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative max-w-3xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
<<<<<<< HEAD
              className="w-full h-full object-contain bg-[#2F0538]"
=======
              className="w-full h-full object-contain bg-purple-950"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackList[0];
              }}
            />
<<<<<<< HEAD
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2F0538]/95 via-[#2F0538]/70 to-transparent p-6 pt-20">
              <span className="inline-block font-mono px-2.5 py-0.5 rounded-lg bg-white/10 text-[#F7F1FB]/80 text-[10px] font-semibold tracking-wider uppercase mb-2">
                {selectedImage.category}
              </span>
              <h3 className="font-display text-white text-xl sm:text-2xl font-semibold">{selectedImage.title}</h3>
              <p className="text-[#F7F1FB]/85 text-sm mt-2 leading-relaxed max-w-xl">
=======
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-950/95 via-purple-950/70 to-transparent p-6 pt-20">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-purple-200 text-[10px] font-bold tracking-wider uppercase mb-2">
                {selectedImage.category}
              </span>
              <h3 className="text-white text-xl sm:text-2xl font-black">{selectedImage.title}</h3>
              <p className="text-purple-100/90 text-sm mt-2 leading-relaxed max-w-xl">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}