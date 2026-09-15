"use client";
import { useState } from "react";

export default function ColorsClient({ initialMapping, dbModels }: any) {
  const [mapping, setMapping] = useState(initialMapping);

  const handleDeleteImage = (model: string, imgIdx: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;
    const newMap = { ...mapping };
    newMap[model].images.splice(imgIdx, 1);
    // If no images left, maybe delete the model? Let's leave it empty.
    setMapping(newMap);
  };

  const handleColorChange = (model: string, imgIdx: number, color: string) => {
    const newMap = { ...mapping };
    newMap[model].images[imgIdx].color = color;
    setMapping(newMap);
  };

  const saveMapping = async () => {
    await fetch("/api/save-mapping", {
      method: "POST",
      body: JSON.stringify(mapping)
    });
    alert("Saved!");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">تححديد ألوان الصور</h1>
      <button onClick={saveMapping} className="bg-blue-600 text-white px-4 py-2 mb-6 rounded">حفظ الةعديلتt</button>
      <div className="space-y-12">
        {Object.keys(mapping).map(model => {
          const modelData = dbModels ? Object.values(dbModels).find((m: any) => String(m.modelNumber) === String(model)) as any : null;
          const colors = modelData && modelData.colors ? modelData.colors.map((c: any) => c.name) : [];
          return (
            <div key={model} className="border p-4 rounded-lg bg-gray-50">
              <h2 className="text-xl font-bold mb-4">موديل {model} (/{mapping[model].category})</h2>
              <div className="flex flex-wrap gap-4">
                {mapping[model].images.map((img: any, idx: number) => (
                  <div key={idx} className="border p-2 bg-white rounded flex flex-col">
                    <img src={img.path} alt="" className="w-48 h-48 object-cover mb-2 rounded" />
                    <select 
                      value={img.color} 
                      onChange={e => handleColorChange(model, idx, e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option value="">اختر اللوَ</option>
                      {colors.map((c: string) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={() => handleDeleteImage(model, idx)} className="mt-2 text-red-600 text-sm font-bold border border-red-200 rounded py-1 hover:bg-red-50 transition-colors">حذف الصورة</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
