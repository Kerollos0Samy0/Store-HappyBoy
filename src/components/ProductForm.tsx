"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function ProductForm({ product }: { product: any }) {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedColor) return alert("برجاء اختيار اللون");
    if (!selectedSize) return alert("برجاء اختيار المقاس");

    addToCart({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      modelNumber: product.modelNumber,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    });
    
    alert("تم إضافة المنتج للسلة بنجاح!");
  };

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">اللون المتاح:</h3>
        <div className="flex flex-wrap gap-3">
          {(product.colors || []).map((c: any, i: number) => {
             // In real app, might want to check c.quantity > 0, but for now we just show it
             return (
              <button
                key={i}
                onClick={() => setSelectedColor(c.name)}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                  selectedColor === c.name
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {c.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">المقاس:</h3>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((s: string, i: number) => (
              <button
                key={i}
                onClick={() => setSelectedSize(s)}
                className={`w-12 h-12 rounded-md border text-sm font-medium transition-all flex items-center justify-center ${
                  selectedSize === s
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="pt-6">
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          أضف إلى السلة
        </button>
      </div>
    </div>
  );
}
