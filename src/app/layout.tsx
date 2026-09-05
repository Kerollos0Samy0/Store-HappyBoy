import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const cairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "HappyBoy Store",
  description: "المتجر الرسمي لمنتجات HappyBoy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-8 text-center">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} HappyBoy</p>
        </footer>
      </body>
    </html>
  );
}
