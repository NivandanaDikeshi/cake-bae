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
    <div className="bg-gradient-to-b from-[#F6F1FE] to-white min-h-screen font-sans">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E7DBFB]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0E8FD] text-[#6D28D9] font-semibold text-xs tracking-wider uppercase border border-[#E1D2FA] mb-3">
              <Cake className="w-3.5 h-3.5" />
              <span>Full Collection</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#241436] tracking-tight">
              Shop Our Cakes &amp; Desserts
            </h1>
            <p className="text-[#6B6178] text-sm mt-2 max-w-xl leading-relaxed">
              Choose from our signature collections, or customize sizes, flavours, and messages to make it yours.
            </p>
          </div>

          {/* Search + mobile filter toggle */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A78BE0]" />
              <input
                type="text"
                placeholder="Search cakes, flavours, brownies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#E1D2FA] rounded-xl py-3 pl-10 pr-9 text-sm text-[#241436] placeholder-[#B3A3D6] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C9BBEA] hover:text-[#7C3AED] transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#E1D2FA] rounded-xl text-sm font-semibold text-[#6D28D9] shadow-sm shrink-0"
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
            <div className="bg-white border border-[#E7DBFB] rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#241436] mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#7C3AED]" />
                <span>Categories</span>
              </h3>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleCategorySelect("All")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                    selectedCategory === "All"
                      ? "bg-[#F0E8FD] text-[#6D28D9] font-semibold"
                      : "text-[#6B6178] hover:bg-[#FAF7FE]"
                  }`}
                >
                  <span>All Cakes &amp; Desserts</span>
                  <span className="text-xs font-semibold text-[#B3A3D6]">{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                      selectedCategory === cat
                        ? "bg-[#F0E8FD] text-[#6D28D9] font-semibold"
                        : "text-[#6B6178] hover:bg-[#FAF7FE]"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-xs font-semibold text-[#B3A3D6]">{categoryCounts[cat] || 0}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By Filter */}
            <div className="bg-white border border-[#E7DBFB] rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#241436] mb-4">Sort By</h3>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white border border-[#E1D2FA] rounded-xl p-3 pr-9 text-sm text-[#241436] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
                >
                  {Object.entries(sortLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A78BE0] pointer-events-none" />
              </div>
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="w-full inline-flex items-center justify-center gap-2 py-3 border border-dashed border-[#F3B6B6] text-[#C4433C] font-semibold text-sm rounded-xl bg-[#FDF3F2] hover:bg-[#FBE9E7] transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Summary */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B6178] font-medium">
              <span>
                Showing <span className="text-[#241436] font-semibold">{filteredProducts.length}</span> item
                {filteredProducts.length === 1 ? "" : "s"}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1.5 bg-[#F0E8FD] text-[#6D28D9] font-semibold px-2.5 py-1 rounded-md">
                    {selectedCategory}
                    <button onClick={() => handleCategorySelect("All")} aria-label="Remove category filter">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 bg-[#F0E8FD] text-[#6D28D9] font-semibold px-2.5 py-1 rounded-md">
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
                    className="bg-white rounded-2xl border border-[#E7DBFB] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-[#F6F1FE] border-b border-[#F0E8FD]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500 ease-out"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80";
                        }}
                      />
                      <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 bg-[#F5A524] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-white" />
                        {product.rating}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-[#8B5CF6] tracking-wider uppercase">
                          {product.category}
                        </span>
                        <h3 className="font-display text-base font-bold text-[#241436] line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#6B6178] line-clamp-2 leading-relaxed">{product.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-display text-base font-bold text-[#241436]">
                          Rs. {product.price.toLocaleString()}
                        </span>
                        <Link
                          href={`/shop/${product.id}`}
                          className="px-4 py-2 bg-[#F0E8FD] hover:bg-[#7C3AED] text-[#6D28D9] hover:text-white text-xs font-semibold rounded-lg transition-colors duration-300"
                        >
                          Order / Customize
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-[#E7DBFB] rounded-3xl space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F0E8FD] flex items-center justify-center mx-auto text-[#8B5CF6]">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#241436]">No cakes found</h3>
                <p className="text-sm text-[#6B6178] max-w-sm mx-auto leading-relaxed">
                  We couldn't find anything matching your search. Try a different term or reset your filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-sm rounded-xl transition"
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