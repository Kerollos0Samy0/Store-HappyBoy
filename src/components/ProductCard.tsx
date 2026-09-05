"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  // Store quantities for each color: { "أحمر": 1, "أزرق": 2 }
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const piecesPerPack = product.sizes ? product.sizes.length : 1;

  const updateQuantity = (color: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[color] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [color]: next };
    });
  };

  const handleQuickAdd = () => {
    const selectedColors = Object.entries(quantities).filter(([_, qty]) => qty > 0);
    
    if (selectedColors.length === 0) {
      return alert("برجاء اختيار كمية للون واحد على الأقل");
    }

    selectedColors.forEach(([color, qty]) => {
      addToCart({
        id: `${product.id}-${color}-pack`,
        productId: product.id,
        modelNumber: product.modelNumber,
        name: product.name,
        price: product.price, // Assuming price is per piece? Or per pack? We'll leave it as price and they can confirm
        color: color,
        size: `ثري (${piecesPerPack} قطع)`,
        quantity: qty, // quantity of packs
      });
    });
    
    setShowQuickAdd(false);
    setQuantities({});
    alert("تم إضافة الكميات للسلة بنجاح!");
  };

  const totalSelectedPacks = Object.values(quantities).reduce((a, b) => a + b, 0);

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
        <div className="absolute inset-0 bg-white/95 z-10 p-5 flex flex-col backdrop-blur-sm transition-all border-2 border-[#4B9B9E] rounded-2xl shadow-xl">
          <button 
            onClick={() => { setShowQuickAdd(false); setQuantities({}); }}
            className="absolute top-3 left-3 text-gray-500 hover:text-[#A3292E] bg-gray-100 rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h4 className="font-bold text-gray-900 mb-2 mt-1">تحديد الكميات</h4>
          
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 mb-1">المقاسات داخل الثري ({piecesPerPack} قطع):</p>
              <div className="flex flex-wrap gap-1">
                {product.sizes.map((s: string, i: number) => (
                  <span key={i} className="text-xs bg-white border px-1.5 py-0.5 rounded text-gray-700">{s}</span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex-grow space-y-3 overflow-y-auto pr-1 custom-scrollbar">
            <p className="text-sm font-semibold text-[#4B9B9E]">اختر الكمية (بالثري) لكل لون:</p>
            
            {(product.colors || []).map((c: any, i: number) => {
              const qty = quantities[c.name] || 0;
              return (
                <div key={i} className={`flex items-center justify-between p-2 rounded-lg border ${qty > 0 ? 'border-[#4B9B9E] bg-teal-50' : 'border-gray-200 bg-white'}`}>
                  <span className="font-medium text-sm text-gray-800">{c.name}</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(c.name, -1)}
                      className={`w-7 h-7 flex items-center justify-center rounded-full ${qty > 0 ? 'bg-[#A3292E] text-white hover:bg-opacity-80' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                      disabled={qty === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold w-4 text-center">{qty}</span>
                    <button 
                      onClick={() => updateQuantity(c.name, 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-[#4B9B9E] text-white hover:bg-opacity-80"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <button 
            onClick={handleQuickAdd}
            disabled={totalSelectedPacks === 0}
            className={`w-full py-3 rounded-lg font-bold mt-4 transition-colors ${totalSelectedPacks > 0 ? 'bg-[#A3292E] text-white hover:bg-opacity-90 shadow-md' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            أضف للسلة ({totalSelectedPacks} ثري)
          </button>
        </div>
      )}
    </div>
  );
}
