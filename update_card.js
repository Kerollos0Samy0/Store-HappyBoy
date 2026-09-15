const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

code = code.replace(
  'import { ShoppingCart, X, Plus, Minus } from "lucide-react";',
  'import { ShoppingCart, X, Plus, Minus, ChevronRight, ChevronLeft } from "lucide-react";'
);

code = code.replace(
  'const [quantities, setQuantities] = useState<{ [key: string]: number }>({});',
  `const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const colorKeys = product.colorImages ? Object.keys(product.colorImages) : [];
  const images = colorKeys.length > 0 ? colorKeys.map(k => ({ color: k, url: product.colorImages[k] })) : (product.mainImage ? [{ color: 'main', url: product.mainImage }] : []);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);`
);

const targetHTML = `<div className="h-64 bg-gray-100 relative overflow-hidden flex items-center justify-center">
        {product.mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.mainImage} alt={product.name} className="object-cover w-full h-full" />
        ) : (
          <span className="text-gray-400">صورة الموديل {product.modelNumber}</span>
        )}
      </div>`;

const replacementHTML = `<div className="h-96 bg-gray-100 relative overflow-hidden flex items-center justify-center group/img">
        {images.length > 0 ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[currentImgIndex]?.url} alt={product.name} className="object-cover w-full h-full" />
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover/img:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover/img:opacity-100 transition-opacity"
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
      </div>`;

code = code.replace(targetHTML, replacementHTML);

const targetColors = `<div className="flex flex-wrap gap-1 mb-3">
          {(product.colors || []).map((c: any, i: number) => (
            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
              {c.name}
            </span>
          ))}
        </div>`;

const replacementColors = `<div className="flex flex-wrap gap-1 mb-3">
          {(product.colors || []).map((c: any, i: number) => {
            const imgIndex = images.findIndex((img) => img.color === c.name);
            const isSelectable = imgIndex >= 0;
            return (
              <button 
                key={i} 
                onClick={(e) => { e.preventDefault(); if (isSelectable) setCurrentImgIndex(imgIndex); }}
                className={\`text-xs px-2 py-1 rounded transition-colors \${isSelectable && currentImgIndex === imgIndex ? 'bg-[#4B9B9E] text-white font-bold shadow-sm' : (isSelectable ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer' : 'bg-gray-50 text-gray-400 cursor-default')}\`}
              >
                {c.name}
              </button>
            );
          })}
        </div>`;

code = code.replace(targetColors, replacementColors);

fs.writeFileSync('src/components/ProductCard.tsx', code, 'utf8');
console.log('done!');
