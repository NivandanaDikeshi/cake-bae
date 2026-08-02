"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, Database, Cake, X, Star, AlertTriangle } from "lucide-react";
import { useAppState, Product } from "@/context/StateContext";
import { ImageUpload } from "@/components/ImageUpload";

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAppState();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal / Slide-over form state
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form fields state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0] || "Celebration Cakes");
  const [image, setImage] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [flavours, setFlavours] = useState<string[]>([]);
  const [leadTime, setLeadTime] = useState("24 Hours");

  // Per-size price drafts, keyed by size label. Kept as strings while
  // editing so the input can be empty mid-typing without becoming NaN.
  // Every size REQUIRES a price — no base price fallback.
  const [sizePriceDrafts, setSizePriceDrafts] = useState<Record<string, string>>({});

  // Per-flavour price drafts (additional cost on top of the size price).
  // Blank/empty is treated as 0 — most flavours are free, only premium
  // ones (e.g. Red Velvet) would carry an upcharge here.
  const [flavourPriceDrafts, setFlavourPriceDrafts] = useState<Record<string, string>>({});

  // Custom variant inputs
  const [newSizeInput, setNewSizeInput] = useState("");
  const [newFlavourInput, setNewFlavourInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isProductPriced = (product: Product) =>
    product.sizes.length > 0 && product.sizes.every((size) => product.sizePrices?.[size] !== undefined);

  const handleOpenAdd = () => {
    const defaultSizes = ["500g", "1kg", "2kg"];
    const defaultFlavours = ["Chocolate", "Vanilla"];
    setEditingId(null);
    setName("");
    setDescription("");
    setCategory(categories[0] || "Celebration Cakes");
    setImage("");
    setSizes(defaultSizes);
    setFlavours(defaultFlavours);
    setLeadTime("24 Hours");
    // Leave price drafts empty so the admin explicitly sets them per size.
    setSizePriceDrafts(Object.fromEntries(defaultSizes.map((s) => [s, ""])));
    // Flavour price drafts start empty (= free / no upcharge).
    setFlavourPriceDrafts(Object.fromEntries(defaultFlavours.map((f) => [f, ""])));
    setError(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setCategory(product.category);
    setImage(product.image);
    setSizes(product.sizes);
    setFlavours(product.flavours);
    setLeadTime(product.leadTime);

    const sizeDrafts: Record<string, string> = {};
    product.sizes.forEach((size) => {
      const existing = product.sizePrices?.[size];
      sizeDrafts[size] = existing !== undefined ? String(existing) : "";
    });
    setSizePriceDrafts(sizeDrafts);

    const flavourDrafts: Record<string, string> = {};
    product.flavours.forEach((flavour) => {
      const existing = product.flavourPrices?.[flavour];
      flavourDrafts[flavour] = existing !== undefined ? String(existing) : "";
    });
    setFlavourPriceDrafts(flavourDrafts);

    setError(null);
    setIsOpen(true);
  };

  const handleAddSize = () => {
    const trimmed = newSizeInput.trim();
    if (trimmed && !sizes.includes(trimmed)) {
      setSizes([...sizes, trimmed]);
      setSizePriceDrafts((prev) => ({ ...prev, [trimmed]: "" }));
      setNewSizeInput("");
    }
  };

  const handleRemoveSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
    setSizePriceDrafts((prev) => {
      const next = { ...prev };
      delete next[size];
      return next;
    });
  };

  const handleSizePriceChange = (size: string, value: string) => {
    // Digits only, but allow empty while typing.
    if (value !== "" && !/^\d*$/.test(value)) return;
    setSizePriceDrafts((prev) => ({ ...prev, [size]: value }));
  };

  const handleAddFlavour = () => {
    const trimmed = newFlavourInput.trim();
    if (trimmed && !flavours.includes(trimmed)) {
      setFlavours([...flavours, trimmed]);
      setFlavourPriceDrafts((prev) => ({ ...prev, [trimmed]: "" }));
      setNewFlavourInput("");
    }
  };

  const handleRemoveFlavour = (flavour: string) => {
    setFlavours(flavours.filter((f) => f !== flavour));
    setFlavourPriceDrafts((prev) => {
      const next = { ...prev };
      delete next[flavour];
      return next;
    });
  };

  const handleFlavourPriceChange = (flavour: string, value: string) => {
    // Digits only, but allow empty while typing (empty = free / 0 upcharge).
    if (value !== "" && !/^\d*$/.test(value)) return;
    setFlavourPriceDrafts((prev) => ({ ...prev, [flavour]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !description) {
      setError("Please fill out Name and Description.");
      return;
    }

    if (sizes.length === 0) {
      setError("Add at least one size and set its price.");
      return;
    }

    const missingSizePrice = sizes.some((size) => {
      const raw = sizePriceDrafts[size];
      return raw === undefined || raw === "" || !Number.isFinite(Number(raw)) || Number(raw) <= 0;
    });
    if (missingSizePrice) {
      setError("Please set a valid price for every size.");
      return;
    }

    // Build the sizePrices map straight from the drafts — no base price
    // fallback, every size carries its own price.
    const sizePrices: Record<string, number> = {};
    sizes.forEach((size) => {
      sizePrices[size] = Number(sizePriceDrafts[size]);
    });

    // Build the flavourPrices map. Blank/invalid entries default to 0
    // (i.e. that flavour has no upcharge over the size price).
    const flavourPrices: Record<string, number> = {};
    flavours.forEach((flavour) => {
      const raw = flavourPriceDrafts[flavour];
      const num = raw !== undefined && raw !== "" ? Number(raw) : 0;
      flavourPrices[flavour] = Number.isFinite(num) ? num : 0;
    });

    // Derived "starting from" price for catalog/storefront display —
    // cheapest size + cheapest flavour upcharge.
    const cheapestSize = Math.min(...Object.values(sizePrices));
    const cheapestFlavourUpcharge = flavours.length > 0 ? Math.min(...Object.values(flavourPrices)) : 0;
    const startingPrice = cheapestSize + cheapestFlavourUpcharge;

    const payload = {
      name,
      description,
      price: startingPrice,
      category,
      image: image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
      sizes,
      flavours,
      leadTime,
      rating: 4.8,
      sizePrices,
      flavourPrices,
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }

    setIsOpen(false);
  };

  // Opens the delete confirmation modal instead of deleting immediately.
  const handleRequestDelete = (product: Product) => {
    setDeleteTarget(product);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
      // Keep the modal open with the target set so the admin can retry,
      // rather than silently closing on failure.
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Product & Categories</h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage cake catalogs, edit variants, set prices, and upload photos.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-bold text-xs rounded-xl shadow-md transition h-fit w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-purple-100 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-2 rounded-lg text-xs font-bold border transition ${
              selectedCategory === "All"
                ? "bg-[#4A1054] border-[#4A1054] text-white shadow-xs"
                : "bg-white border-purple-50 text-slate-600 hover:bg-purple-50"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-bold border transition ${
                selectedCategory === cat
                  ? "bg-[#4A1054] border-[#4A1054] text-white shadow-xs"
                  : "bg-white border-purple-50 text-slate-600 hover:bg-purple-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Cake Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Starting Price</th>
                <th className="px-6 py-4">Lead Time</th>
                <th className="px-6 py-4">Sizes & Flavours</th>
                <th className="px-6 py-4">Pricing Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-100 bg-purple-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-bold text-slate-800 block">{p.name}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">{p.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{p.category}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {p.sizes.length > 0 ? `Rs. ${p.price.toLocaleString()}` : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-6 py-4 font-semibold">{p.leadTime}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-[9px]">
                        <span className="truncate max-w-xs"><strong>Sizes:</strong> {p.sizes.join(", ")}</span>
                        <span className="truncate max-w-xs"><strong>Flavours:</strong> {p.flavours.join(", ")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.sizes.length === 0 ? (
                        <span className="text-slate-300">—</span>
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                            isProductPriced(p)
                              ? "bg-green-50 text-green-700 border-green-100"
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}
                        >
                          {isProductPriced(p) ? "Configured" : "Incomplete Pricing"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRequestDelete(p)}
                          className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <Database className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <span>No products found in catalog.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsOpen(false)}></div>
          <form
            onSubmit={handleSubmit}
            className="relative bg-white border border-[#9D5CDB]/20 rounded-3xl w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 z-10"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-800">
                {editingId ? "Edit Cake Product" : "Add New Cake Product"}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:bg-[#9D5CDB]/10 hover:text-[#4A1054] rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Cloudinary Image Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Product Image *</label>
                <ImageUpload value={image} onChange={setImage} />
              </div>

              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Cake Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chocolate Fudge Gateau"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#9D5CDB]/20 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB] transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category Selection *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-[#9D5CDB]/20 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB] transition"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Preparation Lead Time Required *</label>
                <select
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full bg-white border border-[#9D5CDB]/20 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB] transition"
                >
                  <option value="12 Hours">12 Hours (Fast)</option>
                  <option value="24 Hours">24 Hours (Standard)</option>
                  <option value="48 Hours">48 Hours (Complex)</option>
                  <option value="72 Hours">72 Hours (Large Wedding)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe your cake composition, toppings, and icing details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-[#9D5CDB]/20 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB] transition resize-none"
                />
              </div>

              {/* Variants sizes */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">Sizes / Weights Variants</label>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1.5 bg-[#9D5CDB]/10 border border-[#9D5CDB]/20 text-[#4A1054] px-2.5 py-1 rounded-lg text-xs font-bold"
                    >
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(size)}
                        className="text-[#9D5CDB] hover:text-[#2F0538] transition"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    placeholder="Add Size (e.g. 500g, 1.5kg)"
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    className="flex-1 bg-white border border-[#9D5CDB]/20 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB] transition"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-3 bg-[#9D5CDB]/15 hover:bg-[#9D5CDB]/25 text-[#4A1054] rounded-xl text-xs font-bold transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Per-size pricing */}
              {sizes.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    Price Per Size (LKR) *
                  </label>
                  <p className="text-[10px] text-slate-400 -mt-2">
                    Every size needs its own price — there is no fallback base price.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {sizes.map((size) => (
                      <div key={size} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          {size}
                        </label>
                        <div className="flex items-center border border-[#9D5CDB]/20 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#9D5CDB]/20 focus-within:border-[#9D5CDB] transition">
                          <span className="pl-3 text-[10px] text-[#9D5CDB] font-semibold">Rs.</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            required
                            value={sizePriceDrafts[size] ?? ""}
                            onChange={(e) => handleSizePriceChange(size, e.target.value)}
                            placeholder="0"
                            className="w-full py-2 px-2 text-xs font-bold text-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants flavours */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">Available Flavours</label>
                <div className="flex flex-wrap gap-1.5">
                  {flavours.map((flavour) => (
                    <span
                      key={flavour}
                      className="inline-flex items-center gap-1.5 bg-[#9D5CDB]/10 border border-[#9D5CDB]/20 text-[#4A1054] px-2.5 py-1 rounded-lg text-xs font-bold"
                    >
                      <span>{flavour}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFlavour(flavour)}
                        className="text-[#9D5CDB] hover:text-[#2F0538] transition"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    placeholder="Add Flavour (e.g. Red Velvet, Almond)"
                    value={newFlavourInput}
                    onChange={(e) => setNewFlavourInput(e.target.value)}
                    className="flex-1 bg-white border border-[#9D5CDB]/20 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB] transition"
                  />
                  <button
                    type="button"
                    onClick={handleAddFlavour}
                    className="px-3 bg-[#9D5CDB]/15 hover:bg-[#9D5CDB]/25 text-[#4A1054] rounded-xl text-xs font-bold transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Per-flavour pricing (upcharge) */}
              {flavours.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    Extra Price Per Flavour (LKR)
                  </label>
                  <p className="text-[10px] text-slate-400 -mt-2">
                    Added on top of the selected size price. Leave blank for no extra charge (e.g. standard flavours like Vanilla).
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {flavours.map((flavour) => (
                      <div key={flavour} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          {flavour}
                        </label>
                        <div className="flex items-center border border-[#9D5CDB]/20 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#9D5CDB]/20 focus-within:border-[#9D5CDB] transition">
                          <span className="pl-3 text-[10px] text-[#9D5CDB] font-semibold">+Rs.</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={flavourPriceDrafts[flavour] ?? ""}
                            onChange={(e) => handleFlavourPriceChange(flavour, e.target.value)}
                            placeholder="0"
                            className="w-full py-2 px-2 text-xs font-bold text-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

            {/* Actions */}
            <div className="border-t border-slate-100 pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-[#9D5CDB]/20 text-slate-600 hover:bg-[#9D5CDB]/5 font-bold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#9D5CDB] hover:bg-[#4A1054] text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                {editingId ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          ></div>
          <div className="relative bg-white border border-red-100 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-5 z-10">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">Delete Product?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to delete <span className="font-bold text-slate-700">{deleteTarget.name}</span>?
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}