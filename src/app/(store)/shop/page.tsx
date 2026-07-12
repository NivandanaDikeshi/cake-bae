"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/navigation";
import { Search, Star, Cake, Grid, Filter, RefreshCw } from "lucide-react";
import { useAppState } from "@/context/StateContext";

export default function ShopCatalog() {
  const { products, categories } = useAppState();
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // Read URL query params on load
  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [searchParams]);

  // Filters logic
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // default order
    });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Update url search params
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
    router.push("/shop");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2F0538] flex items-center gap-2">
            <Cake className="w-8 h-8 text-[#9D5CDB]" />
            <span>Cake Bae Shop</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Choose from our signature collections or customize sizes, flavours, and messages.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search cakes, flavours, brownies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-purple-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] transition"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Sidebar Filters */}
        <div className="space-y-6 lg:sticky lg:top-28 self-start">
          {/* Categories Filter */}
          <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#9D5CDB]" />
              <span>Categories</span>
            </h3>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => handleCategorySelect("All")}
                className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === "All"
                    ? "bg-purple-50 text-[#9D5CDB] font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                All Cakes & Desserts
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat
                      ? "bg-purple-50 text-[#9D5CDB] font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By Filter */}
          <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white border border-purple-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
            >
              <option value="default">Default Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating: Highest First</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(searchTerm !== "" || selectedCategory !== "All" || sortBy !== "default") && (
            <button
              onClick={handleResetFilters}
              className="w-full inline-flex items-center justify-center gap-2 py-3 border border-dashed border-red-200 text-red-600 font-semibold text-sm rounded-xl bg-red-50/30 hover:bg-red-50 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Showing {filteredProducts.length} items</span>
            {selectedCategory !== "All" && (
              <span className="bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-md">
                Category: {selectedCategory}
              </span>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full group"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-purple-50 border-b border-purple-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80";
                      }}
                    />
                    <span className="absolute top-2.5 right-2.5 bg-[#f59e0b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {product.rating} ★
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-purple-500 tracking-wider uppercase">
                        {product.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-base font-black text-slate-900">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      <a
                        href={`/shop/${product.id}`}
                        className="px-4 py-2 bg-purple-50 hover:bg-[#9D5CDB] text-purple-700 hover:text-white text-xs font-bold rounded-lg transition"
                      >
                        Order / Customize
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-purple-100 rounded-3xl space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto text-purple-400">
                <Grid className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No cakes found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any cakes matching your search. Try resetting your search or category selection filters!
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
