"use client";
import React, { useState } from "react";
import Image from "next/image";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function HeroAdminClient({ initialImages, initialLabels, initialOffsets }: { initialImages: string[], initialLabels: string[], initialOffsets: number[] }) {
  const [offsets, setOffsets] = useState(initialOffsets);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "hero"), { offsets });
      alert("تم الحفظ بنجاح!");
    } catch(e) {
      alert("حدث خطأ أثناء الحفظ");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 shadow-sm mb-8 flex justify-between items-center px-8">
        <h1 className="text-2xl font-bold">تعديل أماكن صور الرئيسية</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#4B9B9E] text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </button>
      </div>

      <div className="mb-12 border-y-4 border-red-500 relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-t-lg font-bold">
          معاينة حية
        </div>
        {/* Preview Section - EXACTLY like page.tsx */}
        <section className="relative bg-gray-900 text-white overflow-hidden min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 z-0 flex scale-110 -skew-x-[20deg] transform">
            {initialImages.map((img, i) => (
              <div key={i} className={`flex-1 h-full relative overflow-hidden ${i < initialImages.length - 1 ? 'border-r-4 border-white/30' : ''}`}>
                <div className="absolute inset-0 w-[150%] h-full skew-x-[20deg]" style={{ left: `${offsets[i]}%` }}>
                  <Image src={img} alt="" fill sizes="16vw" className="object-cover object-top opacity-70 brightness-90 transition-transform duration-1000 hover:scale-110 hover:opacity-100" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto text-center py-24 px-4 pointer-events-none">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              أناقة طفلك تبدأ من هنا HappyBoy
            </h1>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <span className="bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded-full shadow-xl inline-block border-b-4 border-[#4B9B9E]">
                تسوق ولادي
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-bold mb-6 text-center">أدوات التحكم في الإزاحة (يمين / يسار)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {initialImages.map((img, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-bold mb-2">{initialLabels[i]}</h3>
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-500 w-12 text-left">{offsets[i]}%</span>
                <input 
                  type="range" 
                  min="-100" 
                  max="50" 
                  value={offsets[i]}
                  onChange={(e) => {
                    const newOffsets = [...offsets];
                    newOffsets[i] = parseInt(e.target.value);
                    setOffsets(newOffsets);
                  }}
                  className="w-full flex-grow cursor-pointer"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">حرك المؤشر لليمين أو اليسار لضبط موقع الموديل</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
