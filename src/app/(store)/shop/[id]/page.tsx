"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Plus, Minus, ShoppingBag, Clock, CheckCircle2, Star } from "lucide-react";
import { useAppState, Product } from "@/context/StateContext";

export default function ProductDetailsPage() {
  const { id } = useParams() as { id: string };
  const { products, addToCart } = useAppState();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFlavour, setSelectedFlavour] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    if (!id || products.length === 0) return;

    const found = products.find((p) => p.id === id);

    if (found) {
      setProduct(found);

      if (found.sizes.length > 0) {
        setSelectedSize(found.sizes[0]);
      }

      if (found.flavours.length > 0) {
        setSelectedFlavour(found.flavours[0]);
      }
    }
  }, [id, products]);

  // Automatically recalculates whenever the product, selected size, or
  // selected flavour changes. Falls back to the base price / no add-on
  // if sizePrices / flavourPrices aren't set for the product in Firestore.
  const unitPrice = useMemo(() => {
    if (!product) return 0;

    const sizePrices = product.sizePrices;
    const flavourPrices = product.flavourPrices;

    const basePrice =
      sizePrices && selectedSize && sizePrices[selectedSize] !== undefined
        ? sizePrices[selectedSize]
        : product.price;

    const flavourAddOn =
      flavourPrices && selectedFlavour && flavourPrices[selectedFlavour] !== undefined
        ? flavourPrices[selectedFlavour]
        : 0;

    return basePrice + flavourAddOn;
  }, [product, selectedSize, selectedFlavour]);

  const totalPrice = unitPrice * quantity;

  if (!product) {
    return (
      <div className="light mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-4 bg-white">
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap");
          .font-display {
            font-family: "Fraunces", ui-serif, Georgia, serif;
            letter-spacing: -0.01em;
          }
          body { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
        `}</style>
        <ShieldAlert className="w-12 h-12 text-[#9D5CDB] mx-auto animate-pulse" />
        <h2 className="font-display text-xl font-semibold text-[#2F0538]">Cake not found</h2>
        <p className="text-sm text-[#241129]/60">
          The cake you are looking for might have been removed or doesn't exist.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 font-bold text-[#9D5CDB] hover:underline text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity,
      selectedSize,
      selectedFlavour,
      customMessage,
      unitPrice,
    });

    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
      router.push("/cart");
    }, 1200);
  };

  const handleQuantityIncrease = () => setQuantity((prev) => prev + 1);
  const handleQuantityDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="light mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-white">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap");
        .font-display {
          font-family: "Fraunces", ui-serif, Georgia, serif;
          letter-spacing: -0.01em;
        }
        body { font-family: "Inter", ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      {/* Back Button */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#241129]/60 hover:text-[#9D5CDB] mb-8 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to online shop</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 bg-white">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F7F1FB] border border-[#9D5CDB]/15 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80";
              }}
            />
            <Star className="w-2.5 h-2.5 fill-[#F7F1FB]" />
            <span className="absolute top-4 left-4 text-xs font-bold text-[#9D5CDB] tracking-wider uppercase bg-[#F7F1FB] px-2.5 py-1 rounded-md border border-[#9D5CDB]/15 inline-block">  
              {product.rating} ★ Rating
            </span>
          </div>
        </div>

        {/* Right: Product Customization Form */}
        <div className="lg:col-span-6 space-y-6 bg-white">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#9D5CDB] tracking-wider uppercase bg-[#F7F1FB] px-2.5 py-1 rounded-md border border-[#9D5CDB]/15 inline-block">
              {product.category}
            </span>
            <h1 className="font-display text-3xl font-semibold text-[#2F0538]">{product.name}</h1>
            <p className="text-base text-[#241129]/60 leading-relaxed">{product.description}</p>
          </div>

          {/* Pricing & Prep Time — updates automatically as size/flavour change */}
          <div className="flex items-center gap-6 p-4 bg-[#F7F1FB]/50 rounded-2xl border border-[#9D5CDB]/15">
            <div>
              <span className="text-xs text-[#241129]/60 font-medium block">Price</span>
              <span
                key={unitPrice}
                className="text-2xl font-bold text-[#2F0538] transition-all duration-200 animate-[fadeIn_0.2s_ease-in-out]"
              >
                Rs. {unitPrice.toLocaleString()}
              </span>
            </div>
            <div className="h-8 w-px bg-[#9D5CDB]/20"></div>
            <div>
              <span className="text-xs text-[#241129]/60 font-medium block">Lead Time Required</span>
              <span className="text-sm font-semibold text-[#2F0538] flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-[#9D5CDB]" />
                {product.leadTime}
              </span>
            </div>
          </div>

          <div className="space-y-5 pt-4 border-t border-[#9D5CDB]/15">
            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#9D5CDB]">Select Cake Size / Portions</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                        selectedSize === size
                          ? "bg-[#9D5CDB] border-[#9D5CDB] text-white shadow-sm"
                          : "bg-white border-[#9D5CDB]/15 text-[#241129] hover:bg-[#F7F1FB]/50"
                      }`}
                    >
                      {size}
                      {product.sizePrices && product.sizePrices[size] !== undefined && (
                        <span className="ml-1.5 opacity-70 font-medium">
                          Rs. {product.sizePrices[size].toLocaleString()}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Flavour Selector */}
            {product.flavours.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2F0538]">Select Cake Flavour</label>
                <div className="flex flex-wrap gap-2">
                  {product.flavours.map((flavour) => (
                    <button
                      key={flavour}
                      onClick={() => setSelectedFlavour(flavour)}
                      className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition ${
                        selectedFlavour === flavour
                          ? "bg-[#9D5CDB] border-[#9D5CDB] text-white shadow-sm"
                          : "bg-white border-[#9D5CDB]/15 text-[#241129] hover:bg-[#F7F1FB]/50"
                      }`}
                    >
                      {flavour}
                      {product.flavourPrices &&
                        product.flavourPrices[flavour] !== undefined &&
                        product.flavourPrices[flavour] > 0 && (
                          <span className="ml-1.5 opacity-70 font-medium">
                            +Rs. {product.flavourPrices[flavour].toLocaleString()}
                          </span>
                        )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Message input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#2F0538]">Writing on Cake (Optional)</label>
                <span className="text-[10px] text-[#241129]/40 font-medium">Max 30 characters</span>
              </div>
              <input
                type="text"
                placeholder="e.g. Happy Birthday Savi!"
                maxLength={30}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-white border border-[#9D5CDB]/20 rounded-xl py-3 px-4 text-sm text-[#2F0538] placeholder-[#241129]/40 focus:outline-none focus:ring-2 focus:ring-[#9D5CDB]/20 focus:border-[#9D5CDB] transition"
              />
            </div>

            {/* Quantity and Actions */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center border border-[#9D5CDB]/20 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={handleQuantityDecrease}
                  className="p-3 text-[#241129]/60 hover:bg-[#F7F1FB] transition"
                  title="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-[#2F0538]">{quantity}</span>
                <button
                  onClick={handleQuantityIncrease}
                  className="p-3 text-[#241129]/60 hover:bg-[#F7F1FB] transition"
                  title="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addedMessage}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-sm shadow-md transition transform ${
                  addedMessage
                    ? "bg-[#2F0538] text-white translate-y-0"
                    : "bg-[#9D5CDB] hover:bg-[#4A1054] text-white hover:-translate-y-0.5 shadow-[#9D5CDB]/25"
                }`}
              >
                {addedMessage ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Order Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Total Price Summary */}
            <div className="flex items-center justify-between pt-2 text-sm">
              <span className="text-[#241129]/60 font-medium">
                Total for {quantity} {quantity > 1 ? "items" : "item"}
              </span>
              <span className="text-lg font-bold text-[#2F0538]">
                Rs. {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}