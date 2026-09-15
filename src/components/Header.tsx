"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, ChevronDown, Eye } from "lucide-react";
import { useCart } from "./CartProvider";

const navigation = [
  {
    title: "اولادي",
    subcategories: [
      {
        title: "اولادي",
        links: [
          { name: "بيبي", href: "/category/boys/baby" },
          { name: "وسط", href: "/category/boys/middle" },
          { name: "محير", href: "/category/boys/junior" },
        ],
      },
    ],
  },
  {
    title: "بناتي",
    subcategories: [
      {
        title: "بناتي",
        links: [
          { name: "بيبي", href: "/category/girls/baby" },
          { name: "وسط", href: "/category/girls/middle" },
          { name: "محير", href: "/category/girls/junior" },
        ],
      },
    ],
  },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { totalItems } = useCart();
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    import("firebase/app").then(async ({ initializeApp, getApps }) => {
      const { getFirestore, doc, getDoc, setDoc, increment } = await import("firebase/firestore");
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
      const visitRef = doc(db, "counters", "visits");
      
      const countView = async () => {
        try {
          if (!sessionStorage.getItem("visited")) {
            sessionStorage.setItem("visited", "true");
            await setDoc(visitRef, { count: increment(1) }, { merge: true });
          }
          const snap = await getDoc(visitRef);
          if (snap.exists()) {
            setVisitCount(snap.data().count);
          }
        } catch(e) {
          console.error("Error updating visit count:", e);
        }
      };
      countView();
    });
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center py-2">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
                <Image src="/logo.svg" alt="HappyBoy Logo" width={200} height={70} className="object-contain max-h-20" />
              </Link>
            </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-center gap-8 lg:gap-16 h-full">
            {navigation.map((category) => (
              <div
                key={category.title}
                className="relative group h-full flex items-center"
                onMouseEnter={() => setActiveDropdown(category.title)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center text-gray-700 hover:text-[#4B9B9E] font-bold px-4 py-2 text-xl transition-colors tracking-wide">
                  {category.title}
                  <ChevronDown className="mr-2 w-5 h-5 text-[#A3292E]" />
                </button>

                {/* Mega Menu Dropdown */}
                {activeDropdown === category.title && (
                  <div className="absolute top-20 right-0 w-max bg-white shadow-xl rounded-b-xl border-t-2 border-[#4B9B9E] grid grid-cols-2 gap-8 p-6 transition-all duration-200">
                    {category.subcategories.map((sub) => (
                      <div key={sub.title} className="flex flex-col">
                        <ul className="space-y-2 mt-2">
                          {sub.links.map((link) => (
                            <li key={link.name}>
                              <Link
                                href={link.href}
                                className="text-gray-600 hover:text-[#4B9B9E] hover:translate-x-1 block transition-all"
                              >
                                {link.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Stats & Cart Icon */}
          <div className="flex items-center space-x-6 space-x-reverse">
            {visitCount !== null && (
              <div className="flex items-center text-gray-500 text-sm gap-1.5 font-medium border border-gray-100 bg-gray-50 px-3 py-1.5 rounded-full" title="عدد زوار الموقع">
                <Eye className="w-4 h-4" />
                <span>{visitCount}</span>
              </div>
            )}
            
            <Link href="/cart" className="relative text-gray-700 hover:text-[#4B9B9E] transition-colors p-2">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#A3292E] rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navigation.map((category) => (
              <div key={category.title} className="space-y-2">
                <h3 className="font-bold text-gray-900 text-lg border-b pb-2 mt-4">{category.title}</h3>
                {category.subcategories.map((sub) => (
                  <div key={sub.title} className="pl-4 border-r-2 border-gray-100 pr-4 mt-2">
                    <ul className="space-y-2">
                      {sub.links.map((link) => (
                         <li key={link.name}>
                          <Link
                            href={link.href}
                            className="text-gray-600 block py-1 hover:text-[#4B9B9E]"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            - {link.name}
                          </Link>
                         </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* The Two Brand Stripes */}
      <div className="w-full flex flex-col">
        <div className="h-1 w-full bg-[#4B9B9E]"></div>
        <div className="h-1 w-full bg-[#A3292E] mt-[1px]"></div>
      </div>
    </header>
  );
}
