"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { ShoppingCart, X, Plus, Minus, ChevronRight, ChevronLeft, ZoomIn } from "lucide-react";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  // Store quantities for each color: { "أحمر": 1, "أزرق": 2 }
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const colorKeys = product.colorImages ? Object.keys(product.colorImages) : [];
  const images = colorKeys.length > 0 ? colorKeys.flatMap(k => {
    const urls = Array.isArray(product.colorImages[k]) ? product.colorImages[k] : [product.colorImages[k]];
    return urls.map(url => ({ color: k, url }));
  }) : (product.mainImage ? [{ color: 'main', url: product.mainImage }] : []);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight' && lightbox) {
        const idx = images.findIndex(img => img.url === lightbox);
        if (idx > 0) setLightbox(images[idx - 1].url);
      }
      if (e.key === 'ArrowLeft' && lightbox) {
        const idx = images.findIndex(img => img.url === lightbox);
        if (idx < images.length - 1) setLightbox(images[idx + 1].url);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, images]);

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
      // Find the corresponding color object to get the barcode
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
    
    setShowQuickAdd(false);
    setQuantities({});
    alert("تم إضافة الكميات للسلة بنجاح!");
  };

  const totalSelectedPacks = Object.values(quantities).reduce((a, b) => a + b, 0);

  return (
    <>
    {/* Lightbox Modal */}
    {lightbox && (
      <div
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        onClick={() => setLightbox(null)}
      >
        <button
          onClick={() => setLightbox(null)}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 z-10"
        >
          <X className="w-7 h-7" />
        </button>
        {/* Prev */}
        {images.length > 1 && (() => {
          const idx = images.findIndex(img => img.url === lightbox);
          return idx > 0 ? (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(images[idx - 1].url); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          ) : null;
        })()}
        {/* Next */}
        {images.length > 1 && (() => {
          const idx = images.findIndex(img => img.url === lightbox);
          return idx < images.length - 1 ? (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(images[idx + 1].url); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          ) : null;
        })()}
        <div
          className="relative max-w-4xl max-h-[90vh] w-full h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={lightbox}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        {/* Color label */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-1.5 rounded-full text-sm">
          {images.find(img => img.url === lightbox)?.color}
        </div>
      </div>
    )}

    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group relative">
      <div className="h-96 bg-gray-100 relative overflow-hidden flex items-center justify-center group/img">
        {images.length > 0 ? (
          <>
            <Image
              src={images[currentImgIndex]?.url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover cursor-zoom-in"
              onClick={() => setLightbox(images[currentImgIndex].url)}
            />
            {/* Zoom hint */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLightbox(images[currentImgIndex].url); }}
              className="absolute top-2 right-2 bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-1.5 rounded-full shadow-md opacity-100 md:opacity-0 md:group-hover/img:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-1.5 rounded-full shadow-md opacity-100 md:opacity-0 md:group-hover/img:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
                  {images[currentImgIndex].color}
                </div>
              </>
            )}
          </>
        ) : (
          <span className="text-gray-400">صورة الموديل {product.modelNumber}</span>
        )}
      </div>
      <div className="p-5">
        <p className="text-sm text-[#4B9B9E] font-semibold mb-1">{product.modelNumber}</p>
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {(product.colors || []).map((c: any, i: number) => {
            const imgIndex = images.findIndex((img) => img.color === c.name);
            const isSelectable = imgIndex >= 0;
            return (
              <button 
                key={i} 
                onClick={(e) => { e.preventDefault(); if (isSelectable) setCurrentImgIndex(imgIndex); }}
                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${isSelectable && currentImgIndex === imgIndex ? 'bg-[#4B9B9E] text-white font-bold shadow-sm' : (isSelectable ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer' : 'bg-gray-50 text-gray-400 cursor-default')}`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xl font-bold text-[#A3292E]">{product.price} ج.م</span>
            {product.price && !isNaN(Number(product.price)) && (
              <span className="text-xl font-bold text-green-700" dir="ltr">${(Number(product.price) / 52.13).toFixed(2)}</span>
            )}
          </div>
          <button 
            onClick={() => setShowQuickAdd(true)}
            className="flex items-center gap-2 bg-[#4B9B9E] text-white px-6 py-2.5 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-colors"
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
                      className={`w-9 h-9 flex items-center justify-center rounded-full ${qty > 0 ? 'bg-[#A3292E] text-white hover:bg-opacity-80' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                      disabled={qty === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold w-4 text-center">{qty}</span>
                    <button 
                      onClick={() => updateQuantity(c.name, 1)}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-[#4B9B9E] text-white hover:bg-opacity-80"
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
    </>
  );
}
