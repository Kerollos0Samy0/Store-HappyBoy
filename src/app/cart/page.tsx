"use client";

import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import { useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Initialize Firebase securely
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

export default function CartPage() {
  const { items, removeFromCart, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Create order object matching the admin panel's structure
      const order = {
        customerName: name,
        shopName: shopName,
        governorate: governorate,
        city: city,
        customerPhone: phone,
        address: address,
        status: "قيد المراجعة",
        total: totalPrice,
        createdAt: serverTimestamp(),
        items: items.map(item => ({
          model: item.modelNumber,
          modelNumber: item.modelNumber,
          color: item.color,
          selectedColor: item.color,
          size: item.size,
          quantity: item.quantity, // This is now number of packs (ثري)
          price: item.price
        })),
        source: "Store"
      };

      await addDoc(collection(db, "orders"), order);
      
      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Error creating order: ", error);
      alert("حدث خطأ أثناء إرسال الطلب. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total packs
  const totalPacks = items.reduce((sum, item) => sum + item.quantity, 0);

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-[#4B9B9E]/10 text-[#4B9B9E] p-8 rounded-2xl border border-[#4B9B9E]/20">
          <h1 className="text-3xl font-bold mb-4">تم إرسال طلبك بنجاح! 🎉</h1>
          <p className="text-lg mb-8 text-gray-700">سنتواصل معك قريباً لتأكيد تفاصيل الشحن وموعد الاستلام.</p>
          <Link href="/" className="bg-[#A3292E] text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90">
            العودة للتسوق
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-r-4 border-[#A3292E] pr-4">سلة المشتريات</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg mb-6">السلة فارغة حالياً.</p>
          <Link href="/" className="bg-[#4B9B9E] text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-colors">
            تصفح الموديلات
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {items.map((item) => (
                  <li key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <p><span className="font-semibold text-gray-500">الموديل:</span> {item.modelNumber}</p>
                        <p><span className="font-semibold text-gray-500">اللون:</span> {item.color}</p>
                        <p><span className="font-semibold text-gray-500">الكمية:</span> {item.quantity} ثري (باكيت)</p>
                        <p className="text-xs text-gray-400">({item.size})</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <p className="text-[#A3292E] font-bold text-lg">{item.price} ج.م</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-sm font-semibold hover:text-white hover:bg-red-500 px-3 py-1 rounded transition-colors border border-red-500"
                      >
                        حذف
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div>
                  <span className="text-gray-700 font-bold block">الإجمالي:</span>
                  <span className="text-sm text-gray-500">عدد الثريهات: {totalPacks}</span>
                </div>
                <span className="text-3xl font-black text-[#A3292E]">{totalPrice} ج.م</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#4B9B9E] rounded"></span>
                إتمام الطلب
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالكامل</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#4B9B9E] focus:ring-[#4B9B9E] border p-2.5 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم المحل</label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#4B9B9E] focus:ring-[#4B9B9E] border p-2.5 outline-none transition-all"
                    placeholder="مثال: محلات السعادة"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">البلد / المركز</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#4B9B9E] focus:ring-[#4B9B9E] border p-2.5 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">المحافظة</label>
                    <input
                      type="text"
                      required
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#4B9B9E] focus:ring-[#4B9B9E] border p-2.5 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف (واتساب)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#4B9B9E] focus:ring-[#4B9B9E] border p-2.5 outline-none transition-all text-left"
                    dir="ltr"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان بالتفصيل</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#4B9B9E] focus:ring-[#4B9B9E] border p-2.5 outline-none transition-all"
                    placeholder="اسم الشارع، رقم العمارة، أقرب علامة مميزة"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#A3292E] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all mt-6 shadow-md disabled:bg-gray-400 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? "جاري الإرسال..." : "تأكيد وإرسال الطلب الآن"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
