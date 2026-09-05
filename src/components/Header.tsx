"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";

const navigation = [
  {
    title: "شتوي",
    subcategories: [
      {
        title: "اولادي",
        links: [
          { name: "بيبي", href: "/category/winter/boys/baby" },
          { name: "وسط", href: "/category/winter/boys/middle" },
          { name: "محير", href: "/category/winter/boys/junior" },
        ],
      },
      {
        title: "بناتي",
        links: [
          { name: "بيبي", href: "/category/winter/girls/baby" },
          { name: "وسط", href: "/category/winter/girls/middle" },
          { name: "محير", href: "/category/winter/girls/junior" },
        ],
      },
    ],
  },
  {
    title: "رياضي",
    subcategories: [
      {
        title: "رياضي",
        links: [
          { name: "وسط", href: "/category/sports/middle" },
          { name: "محير", href: "/category/sports/junior" },
        ],
      },
    ],
  },
  {
    title: "سمر ميلتون",
    subcategories: [
      {
        title: "اولادي",
        links: [
          { name: "وسط", href: "/category/summer/boys/middle" },
          { name: "محير", href: "/category/summer/boys/junior" },
        ],
      },
      {
        title: "بناتي",
        links: [
          { name: "وسط", href: "/category/summer/girls/middle" },
          { name: "محير", href: "/category/summer/girls/junior" },
        ],
      },
    ],
  },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
              Happy<span className="text-blue-600">Boy</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 space-x-reverse h-full">
            {navigation.map((category) => (
              <div
                key={category.title}
                className="relative group h-full flex items-center"
                onMouseEnter={() => setActiveDropdown(category.title)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium px-3 py-2 text-lg transition-colors">
                  {category.title}
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>

                {/* Mega Menu Dropdown */}
                {activeDropdown === category.title && (
                  <div className="absolute top-20 right-0 w-max bg-white shadow-xl rounded-b-xl border-t-2 border-blue-600 grid grid-cols-2 gap-8 p-6 transition-all duration-200">
                    {category.subcategories.map((sub) => (
                      <div key={sub.title} className="flex flex-col">
                        {category.title !== "رياضي" && (
                          <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">
                            {sub.title}
                          </h3>
                        )}
                        <ul className="space-y-2">
                          {sub.links.map((link) => (
                            <li key={link.name}>
                              <Link
                                href={link.href}
                                className="text-gray-600 hover:text-blue-600 hover:translate-x-1 block transition-all"
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

          {/* Cart Icon */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link href="/cart" className="relative text-gray-700 hover:text-blue-600 transition-colors p-2">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                0
              </span>
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
                  <div key={sub.title} className="pl-4 border-r-2 border-gray-100 pr-4">
                    {category.title !== "رياضي" && (
                      <h4 className="font-semibold text-gray-700 mt-2 mb-1">{sub.title}</h4>
                    )}
                    <ul className="space-y-2">
                      {sub.links.map((link) => (
                         <li key={link.name}>
                          <Link
                            href={link.href}
                            className="text-gray-600 block py-1 hover:text-blue-600"
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
    </header>
  );
}
