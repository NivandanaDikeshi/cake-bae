"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Star, Cake, SlidersHorizontal, RefreshCw, X, ChevronDown, PackageSearch, ChevronRight } from "lucide-react";
import { useAppState } from "@/context/StateContext";

export default function ShopCatalog() {
  const { products, categories } = useAppState();
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read URL query params on load
  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [searchParams]);

  // Item count per category, for the sidebar
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const product of products) {
      counts[product.category] = (counts[product.category] || 0) + 1;
    }
    return counts;
  }, [products]);

  // Filters logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term);
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // default order
      });
  }, [products, searchTerm, selectedCategory, sortBy]);

  const hasActiveFilters = searchTerm !== "" || selectedCategory !== "All" || sortBy !== "default";

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setMobileFiltersOpen(false);
    const params = new URLSearchParams();
    if (category !== "All") {
      params.set("category", category);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortBy("default");
    setMobileFiltersOpen(false);
    router.push("/shop");
  };

  const sortLabels: Record<string, string> = {
    default: "Default Popularity",
    "price-low": "Price: Low to High",
    "price-high": "Price: High to Low",
    rating: "Rating: Highest First",
  };

  return (
<<<<<<< HEAD
    <div className="bg-[#F7F1FB] min-h-screen font-body">
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
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen font-sans">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
          <div>
<<<<<<< HEAD
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#9D5CDB] font-bold text-xs tracking-[0.18em] uppercase border border-[#9D5CDB]/20 shadow-sm">
              <span>Full Collection</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2F0538] tracking-tight mt-3">
=======
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-50 text-[#9D5CDB] font-bold text-xs tracking-[0.15em] uppercase shadow-sm shadow-purple-200/60">
              <span>Full Collection</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#2F0538] tracking-tight mt-3">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              Shop Our Cakes &amp; Desserts
            </h1>
          </div>

          {/* Search + mobile filter toggle */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
<<<<<<< HEAD
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9D5CDB]/40" />
=======
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              <input
                type="text"
                placeholder="Search cakes, flavours, brownies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
<<<<<<< HEAD
                className="w-full bg-white border border-[#9D5CDB]/20 rounded-xl py-3 pl-10 pr-9 text-sm text-[#2F0538] placeholder-[#241129]/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/30 focus:border-[#9D5CDB] transition"
=======
                className="w-full bg-white border border-purple-200 rounded-xl py-3 pl-10 pr-9 text-sm text-[#2F0538] placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/30 focus:border-[#9D5CDB] transition"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
<<<<<<< HEAD
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9D5CDB]/40 hover:text-[#9D5CDB] transition"
=======
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-[#9D5CDB] transition"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileFiltersOpen((v) => !v)}
<<<<<<< HEAD
              className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#9D5CDB]/20 rounded-xl text-sm font-semibold text-[#2F0538] shadow-sm shrink-0"
=======
              className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-purple-200 rounded-xl text-sm font-semibold text-purple-700 shadow-sm shrink-0"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Sidebar Filters */}
          <div className={`space-y-6 lg:sticky lg:top-28 self-start ${mobileFiltersOpen ? "block" : "hidden"} lg:block`}>
            {/* Categories Filter */}
<<<<<<< HEAD
            <div className="bg-white border border-[#9D5CDB]/15 rounded-2xl p-6 shadow-sm">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#2F0538] mb-4 flex items-center gap-2">
=======
            <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2F0538] mb-4 flex items-center gap-2">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                <SlidersHorizontal className="w-4 h-4 text-[#9D5CDB]" />
                <span>Categories</span>
              </h3>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleCategorySelect("All")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                    selectedCategory === "All"
<<<<<<< HEAD
                      ? "bg-[#F7F1FB] text-[#9D5CDB] font-semibold"
                      : "text-[#241129]/60 hover:bg-[#F7F1FB]/60"
                  }`}
                >
                  <span>All Cakes &amp; Desserts</span>
                  <span className="font-mono text-xs font-semibold text-[#9D5CDB]/60">{products.length}</span>
=======
                      ? "bg-purple-50 text-purple-700 font-semibold"
                      : "text-slate-500 hover:bg-purple-50/60"
                  }`}
                >
                  <span>All Cakes &amp; Desserts</span>
                  <span className="text-xs font-semibold text-purple-300">{products.length}</span>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                      selectedCategory === cat
<<<<<<< HEAD
                        ? "bg-[#F7F1FB] text-[#9D5CDB] font-semibold"
                        : "text-[#241129]/60 hover:bg-[#F7F1FB]/60"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="font-mono text-xs font-semibold text-[#9D5CDB]/60">{categoryCounts[cat] || 0}</span>
=======
                        ? "bg-purple-50 text-purple-700 font-semibold"
                        : "text-slate-500 hover:bg-purple-50/60"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-xs font-semibold text-purple-300">{categoryCounts[cat] || 0}</span>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By Filter */}
<<<<<<< HEAD
            <div className="bg-white border border-[#9D5CDB]/15 rounded-2xl p-6 shadow-sm">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#2F0538] mb-4">Sort By</h3>
=======
            <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2F0538] mb-4">Sort By</h3>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
<<<<<<< HEAD
                  className="w-full appearance-none bg-white border border-[#9D5CDB]/20 rounded-xl p-3 pr-9 text-sm text-[#2F0538] focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/30 focus:border-[#9D5CDB]"
=======
                  className="w-full appearance-none bg-white border border-purple-200 rounded-xl p-3 pr-9 text-sm text-[#2F0538] focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/30 focus:border-[#9D5CDB]"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                >
                  {Object.entries(sortLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
<<<<<<< HEAD
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9D5CDB]/40 pointer-events-none" />
=======
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300 pointer-events-none" />
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              </div>
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
<<<<<<< HEAD
                className="w-full inline-flex items-center justify-center gap-2 py-3 border border-dashed border-[#9D5CDB]/30 text-[#9D5CDB] font-semibold text-sm rounded-xl bg-[#F7F1FB] hover:bg-[#9D5CDB]/10 transition"
=======
                className="w-full inline-flex items-center justify-center gap-2 py-3 border border-dashed border-purple-200 text-purple-700 font-semibold text-sm rounded-xl bg-purple-50 hover:bg-purple-100 transition"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Summary */}
<<<<<<< HEAD
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#241129]/60 font-medium">
=======
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
              <span>
                Showing <span className="text-[#2F0538] font-semibold">{filteredProducts.length}</span> item
                {filteredProducts.length === 1 ? "" : "s"}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategory !== "All" && (
<<<<<<< HEAD
                  <span className="inline-flex items-center gap-1.5 bg-[#F7F1FB] text-[#9D5CDB] font-semibold px-2.5 py-1 rounded-md">
=======
                  <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 font-semibold px-2.5 py-1 rounded-md">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                    {selectedCategory}
                    <button onClick={() => handleCategorySelect("All")} aria-label="Remove category filter">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchTerm && (
<<<<<<< HEAD
                  <span className="inline-flex items-center gap-1.5 bg-[#F7F1FB] text-[#9D5CDB] font-semibold px-2.5 py-1 rounded-md">
=======
                  <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 font-semibold px-2.5 py-1 rounded-md">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                    "{searchTerm}"
                    <button onClick={() => setSearchTerm("")} aria-label="Clear search filter">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
<<<<<<< HEAD
                    className="group bg-white rounded-2xl border border-[#9D5CDB]/15 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-[#F7F1FB] border-b border-[#9D5CDB]/10">
=======
                    className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-purple-50 border-b border-purple-50">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500 ease-out"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80";
                        }}
                      />
<<<<<<< HEAD
                      <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 bg-[#2F0538] text-[#F7F1FB] text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-[#F7F1FB]" />
=======
                      <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 bg-[#9D5CDB] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-white" />
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                        {product.rating}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
<<<<<<< HEAD
                        <h3 className="font-display text-base font-semibold text-[#2F0538] line-clamp-1">
=======
                        <h3 className="font-display text-base font-bold text-[#2F0538] line-clamp-1">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-2">
<<<<<<< HEAD
                        <span className="font-display text-2xl font-semibold text-[#9D5CDB]">
=======
                        <span className="font-display text-base font-bold text-[#2F0538]">
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                          Rs. {product.price.toLocaleString()}
                        </span>
                        <Link
                          href={`/shop/${product.id}`}
<<<<<<< HEAD
                          className="px-3.5 py-1.5 bg-[#F7F1FB] hover:bg-[#2F0538] hover:text-white text-[#9D5CDB] text-xs font-bold rounded-lg transition-colors duration-300"
                        >
                          <span>Customize</span>
=======
                          className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-900 hover:text-white text-purple-700 text-xs font-bold rounded-lg transition-colors duration-300"
                        >
                          <span>Custermize</span>
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
<<<<<<< HEAD
              <div className="text-center py-20 bg-white border border-[#9D5CDB]/15 rounded-2xl space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F7F1FB] flex items-center justify-center mx-auto text-[#9D5CDB]/60">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#2F0538]">No cakes found</h3>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-bold text-sm rounded-xl transition"
=======
              <div className="text-center py-20 bg-white border border-purple-100 space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto text-purple-300">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#2F0538]">No cakes found</h3>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#9D5CDB] hover:bg-[#8545C2] text-white font-semibold text-sm rounded-xl transition"
>>>>>>> 361d8431e4c3dd781c757de7630e56f73e3f6744
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}