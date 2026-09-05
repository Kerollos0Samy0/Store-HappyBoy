"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { Plus, Minus } from "lucide-react";

export default function ProductForm({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const piecesPerPack = product.sizes ? product.sizes.length : 1;

  const updateQuantity = (color: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[color] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [color]: next };
    });
  };

  const handleAddToCart = () => {
    const selectedColors = Object.entries(quantities).filter(([_, qty]) => qty > 0);
    
    if (selectedColors.length === 0) {
      return alert("برجاء تحديد كمية للون واحد على الأقل");
    }

    selectedColors.forEach(([color, qty]) => {
      const colorObj = product.colors?.find((c: any) => c.name === color);
      
      addToCart({
        id: `${product.id}-${color}-pack`,
        productId: product.id,
        modelNumber: product.modelNumber,
        name: product.name,
        price: product.price,
        color: color,
        colorBarcode: colorObj?.barcode || "", // Added barcode
        size: `ثري (${piecesPerPack} قطع)`,
        quantity: qty,
      });
    });
    
    setQuantities({});
    alert("تم إضافة الكميات للسلة بنجاح!");
  };

  const totalSelectedPacks = Object.values(quantities).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Sizes in Pack Info */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">المقاسات المتاحة داخل الثري (الباكيت):</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s: string, i: number) => (
              <span
                key={i}
                className="w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 font-bold flex items-center justify-center cursor-default"
                title={`الثري يحتوي على ${piecesPerPack} قطع بهذه المقاسات`}
              >
                {s}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">* البيع بالثري الكامل ({piecesPerPack} قطع) لكل لون.</p>
        </div>
      )}

      {/* Colors and Quantity */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">حدد الكمية (بالثري) لكل لون:</h3>
        <div className="space-y-3">
          {(product.colors || []).map((c: any, i: number) => {
             const qty = quantities[c.name] || 0;
             return (
               <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${qty > 0 ? 'border-[#4B9B9E] bg-teal-50 shadow-sm' : 'border-gray-200 bg-white'}`}>
                 <span className="font-bold text-gray-800">{c.name}</span>
                 <div className="flex items-center gap-4">
                   <button 
                     onClick={() => updateQuantity(c.name, -1)}
                     className={`w-10 h-10 flex items-center justify-center rounded-lg ${qty > 0 ? 'bg-[#A3292E] text-white hover:bg-opacity-80 shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                     disabled={qty === 0}
                   >
                     <Minus className="w-5 h-5" />
                   </button>
                   <span className="font-bold text-xl w-6 text-center">{qty}</span>
                   <button 
                     onClick={() => updateQuantity(c.name, 1)}
                     className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#4B9B9E] text-white hover:bg-opacity-80 shadow-md"
                   >
                     <Plus className="w-5 h-5" />
                   </button>
                 </div>
               </div>
            )
          })}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="pt-6 border-t border-gray-100">
        <button
          onClick={handleAddToCart}
          disabled={totalSelectedPacks === 0}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all shadow-md flex items-center justify-center gap-3 ${totalSelectedPacks > 0 ? 'bg-[#A3292E] text-white hover:bg-opacity-90 hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          أضف إلى السلة ({totalSelectedPacks} ثري)
        </button>
      </div>
    </div>
  );
}
