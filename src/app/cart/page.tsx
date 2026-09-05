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
        customerPhone: phone,
        address: address,
        status: "قيد المراجعة",
        total: totalPrice,
        createdAt: serverTimestamp(),
        items: items.map(item => ({
          model: item.modelNumber,
          modelNumber: item.modelNumber, // just in case
          color: item.color,
          selectedColor: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        })),
        source: "Store"
      };

      await addDoc(collection(db, "orders"), order);
      
      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Error creating order: ", error);
      alert("حدث خطأ أثناء إرسال الطلب. برجاء المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-green-50 text-green-700 p-8 rounded-2xl">
          <h1 className="text-3xl font-bold mb-4">تم إرسال طلبك بنجاح! 🎉</h1>
          <p className="text-lg mb-8">سنتواصل معك قريباً لتأكيد الطلب وتحديد موعد الاستلام.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
            العودة للتسوق
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">سلة المشتريات</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-6">السلة فارغة حالياً.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
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
                  <li key={item.id} className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        رقم الموديل: {item.modelNumber} | اللون: {item.color} | المقاس: {item.size}
                      </p>
                      <p className="text-blue-600 font-bold mt-2">{item.price} ج.م</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-sm font-semibold hover:text-red-700 p-2"
                    >
                      حذف
                    </button>
                  </li>
                ))}
              </ul>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-gray-700 font-bold">الإجمالي:</span>
                <span className="text-2xl font-bold text-gray-900">{totalPrice} ج.م</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">إتمام الطلب (الدفع عند الاستلام)</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالكامل</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان بالتفصيل</label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors mt-4 disabled:bg-gray-400"
                >
                  {isSubmitting ? "جاري الإرسال..." : "تأكيد الطلب الآن"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
