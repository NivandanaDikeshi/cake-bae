"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, Database, Cake, X, Star } from "lucide-react";
import { useAppState, Product } from "@/context/StateContext";
import { ImageUpload } from "@/components/ImageUpload";

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAppState();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Modal / Slide-over form state
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState(categories[0] || "Celebration Cakes");
  const [image, setImage] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [flavours, setFlavours] = useState<string[]>([]);
  const [leadTime, setLeadTime] = useState("24 Hours");
  
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

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice(0);
    setCategory(categories[0] || "Celebration Cakes");
    setImage("");
    setSizes(["500g", "1kg", "2kg"]);
    setFlavours(["Chocolate", "Vanilla"]);
    setLeadTime("24 Hours");
    setError(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setImage(product.image);
    setSizes(product.sizes);
    setFlavours(product.flavours);
    setLeadTime(product.leadTime);
    setError(null);
    setIsOpen(true);
  };

  const handleAddSize = () => {
    if (newSizeInput.trim() && !sizes.includes(newSizeInput.trim())) {
      setSizes([...sizes, newSizeInput.trim()]);
      setNewSizeInput("");
    }
  };

  const handleRemoveSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const handleAddFlavour = () => {
    if (newFlavourInput.trim() && !flavours.includes(newFlavourInput.trim())) {
      setFlavours([...flavours, newFlavourInput.trim()]);
      setNewFlavourInput("");
    }
  };

  const handleRemoveFlavour = (flavour: string) => {
    setFlavours(flavours.filter((f) => f !== flavour));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !description || price <= 0) {
      setError("Please fill out Name, Description, and valid Price.");
      return;
    }

    const payload = {
      name,
      description,
      price: Number(price),
      category,
      image: image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
      sizes,
      flavours,
      leadTime,
      rating: 4.8
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }

    setIsOpen(false);
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
          className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-[#9D5CDB] hover:bg-[#8545C2] text-white font-bold text-xs rounded-xl shadow-md transition h-fit w-fit"
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
                ? "bg-[#2F0538] border-[#2F0538] text-white shadow-xs"
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
                  ? "bg-[#2F0538] border-[#2F0538] text-white shadow-xs"
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
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4">Lead Time</th>
                <th className="px-6 py-4">Sizes & Flavours</th>
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
                    <td className="px-6 py-4 font-bold text-slate-900">Rs. {p.price.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold">{p.leadTime}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-[9px]">
                        <span className="truncate max-w-xs"><strong>Sizes:</strong> {p.sizes.join(", ")}</span>
                        <span className="truncate max-w-xs"><strong>Flavours:</strong> {p.flavours.join(", ")}</span>
                      </div>
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
                          onClick={() => deleteProduct(p.id)}
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
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
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
            className="relative bg-white border border-purple-100 rounded-3xl w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 z-10"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-800">
                {editingId ? "Edit Cake Product" : "Add New Cake Product"}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"
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
                    className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category Selection *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Base Price (LKR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price || ""}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Preparation Lead Time Required *</label>
                  <select
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                    className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB]"
                  >
                    <option value="12 Hours">12 Hours (Fast)</option>
                    <option value="24 Hours">24 Hours (Standard)</option>
                    <option value="48 Hours">48 Hours (Complex)</option>
                    <option value="72 Hours">72 Hours (Large Wedding)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe your cake composition, toppings, and icing details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-purple-100 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#9D5CDB] resize-none"
                />
              </div>

              {/* Variants sizes */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">Sizes / Weights Variants</label>
                <div className="flex flex-wrap gap-1.5">
                  {sizes.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-100 text-purple-700 px-2.5 py-1 rounded-lg text-xs font-bold"
                    >
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(size)}
                        className="text-purple-400 hover:text-purple-700"
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
                    className="flex-1 bg-white border border-purple-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl text-xs font-bold transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Variants flavours */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">Available Flavours</label>
                <div className="flex flex-wrap gap-1.5">
                  {flavours.map((flavour) => (
                    <span
                      key={flavour}
                      className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold"
                    >
                      <span>{flavour}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFlavour(flavour)}
                        className="text-slate-400 hover:text-slate-700"
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
                    className="flex-1 bg-white border border-purple-100 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFlavour}
                    className="px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

            {/* Actions */}
            <div className="border-t border-slate-100 pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-purple-100 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#9D5CDB] hover:bg-[#8545C2] text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                {editingId ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
