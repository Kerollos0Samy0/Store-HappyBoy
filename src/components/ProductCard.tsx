"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { ShoppingCart, X } from "lucide-react";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const handleQuickAdd = () => {
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
    
    setShowQuickAdd(false);
    setSelectedColor("");
    setSelectedSize("");
    alert("تم الإضافة للسلة!");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group relative">
      <div className="h-64 bg-gray-100 relative overflow-hidden flex items-center justify-center">
        <span className="text-gray-400">صورة الموديل {product.modelNumber}</span>
      </div>
      <div className="p-5">
        <p className="text-sm text-[#4B9B9E] font-semibold mb-1">{product.modelNumber}</p>
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {(product.colors || []).map((c: any, i: number) => (
            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
              {c.name}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
          <span className="text-xl font-bold text-[#A3292E]">{product.price} ج.م</span>
          <button 
            onClick={() => setShowQuickAdd(true)}
            className="flex items-center gap-2 bg-[#4B9B9E] text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            شراء
          </button>
        </div>
      </div>

      {/* Quick Add Modal Overlay */}
      {showQuickAdd && (
        <div className="absolute inset-0 bg-white/95 z-10 p-5 flex flex-col backdrop-blur-sm transition-all">
          <button 
            onClick={() => setShowQuickAdd(false)}
            className="absolute top-3 left-3 text-gray-500 hover:text-[#A3292E]"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h4 className="font-bold text-gray-900 mb-4 mt-2">إضافة السريع</h4>
          
          <div className="flex-grow space-y-4 overflow-y-auto">
            <div>
              <p className="text-sm font-semibold mb-2 text-[#4B9B9E]">اللون:</p>
              <div className="flex flex-wrap gap-2">
                {(product.colors || []).map((c: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c.name)}
                    className={`px-3 py-1 text-sm rounded border ${
                      selectedColor === c.name ? "bg-[#4B9B9E] text-white border-[#4B9B9E]" : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2 text-[#4B9B9E]">المقاس:</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(s)}
                      className={`w-10 h-10 flex items-center justify-center text-sm rounded border ${
                        selectedSize === s ? "bg-[#A3292E] text-white border-[#A3292E]" : "border-gray-300 text-gray-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleQuickAdd}
            className="w-full bg-[#A3292E] text-white py-3 rounded-lg font-bold mt-4 hover:bg-opacity-90"
          >
            أضف إلى السلة
          </button>
        </div>
      )}
    </div>
  );
}
