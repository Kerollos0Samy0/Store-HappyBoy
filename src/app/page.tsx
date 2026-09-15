import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";

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

export const revalidate = 60;

export default async function Home(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams.tab || "new";

  const productsRef = collection(db, "products");
  const snapshot = await getDocs(query(productsRef));
  
  let allProducts: any[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (Number(data.modelNumber) < 1000) {
      allProducts.push({ id: doc.id, ...data });
    }
  });

  // Sort logic
  if (activeTab === "best") {
    // Dummy logic for best sellers
    allProducts.sort((a, b) => Number(a.modelNumber) - Number(b.modelNumber));
  } else {
    // New arrivals
    allProducts.sort((a, b) => Number(b.modelNumber) - Number(a.modelNumber));
  }

  const combos = [
    { c: "ولادي", s: "بيبي", label: "بيبي ولادي" },
    { c: "ولادي", s: "وسط", label: "وسط ولادي" },
    { c: "ولادي", s: "محير", label: "محير ولادي" },
    { c: "بناتي", s: "بيبي", label: "بيبي بناتي" },
    { c: "بناتي", s: "وسط", label: "وسط بناتي" },
    { c: "بناتي", s: "محير", label: "محير بناتي" }
  ];

  let displayedProducts: any[] = [];
  let heroImages: string[] = [];

  combos.forEach(combo => {
    const matches = allProducts.filter(p => p.mainCategory === combo.c && p.subCategory === combo.s && p.mainImage);
    if (matches.length > 0 && matches[0].mainImage) {
      heroImages.push(matches[0].mainImage);
    }
    // Take exactly 2 from each category
    displayedProducts.push(...matches.slice(0, 2));
  });

  // Fallback if we don't have 6 images
  while (heroImages.length > 0 && heroImages.length < 6) {
    heroImages.push(heroImages[0]);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden min-h-[500px] flex items-center justify-center">
        {/* Dynamic Images Background */}
        <div className="absolute inset-0 z-0 flex scale-110 -skew-x-[20deg] transform">
          {heroImages.length > 0 ? (
            heroImages.map((img, i) => (
              <div key={i} className={`flex-1 h-full relative overflow-hidden ${i < heroImages.length - 1 ? 'border-r-4 border-white/30' : ''}`}>
                <div className="absolute inset-0 w-[150%] -left-[25%] h-full skew-x-[20deg]">
                  <Image src={img} alt="Hero" fill sizes="16vw" className="object-cover object-top opacity-40 mix-blend-luminosity brightness-75 transition-transform duration-1000 hover:scale-110 hover:opacity-70 hover:mix-blend-normal" />
                </div>
              </div>
            ))
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#4B9B9E] to-[#A3292E] opacity-90"></div>
          )}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center py-24 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            أناقة طفلك تبدأ من هنا HappyBoy
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-white font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] max-w-3xl mx-auto">
            أحدث كولكشن ملابس الأطفال ولادي وبناتي بأعلى خامة وأفضل سعر
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link 
              href="/category/boys/all" 
              className="bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded-full shadow-xl hover:bg-gray-100 transition-all hover:scale-105 inline-block border-b-4 border-[#4B9B9E]"
            >
              تسوق ولادي
            </Link>
            <Link 
              href="/category/girls/all" 
              className="bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded-full shadow-xl hover:bg-gray-100 transition-all hover:scale-105 inline-block border-b-4 border-[#A3292E]"
            >
              تسوق بناتي
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto py-16 px-4 w-full">
        <div className="relative mb-12 text-center flex justify-center">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
          <div className="bg-gray-50 px-6 relative z-10 flex gap-6 sm:gap-12 justify-center">
            <Link 
              href="/?tab=new"
              scroll={false}
              className={`text-2xl sm:text-3xl font-bold pb-2 transition-colors ${
                activeTab !== "best" 
                  ? "text-gray-900 border-b-4 border-[#4B9B9E] cursor-default" 
                  : "text-gray-400 border-b-4 border-transparent hover:text-[#4B9B9E] hover:border-gray-300"
              }`}
            >
              وصل حديثاً
            </Link>
            <Link 
              href="/?tab=best"
              scroll={false}
              className={`text-2xl sm:text-3xl font-bold pb-2 transition-colors ${
                activeTab === "best" 
                  ? "text-gray-900 border-b-4 border-[#4B9B9E] cursor-default" 
                  : "text-gray-400 border-b-4 border-transparent hover:text-[#4B9B9E] hover:border-gray-300"
              }`}
            >
              الأكثر مبيعاً
            </Link>
          </div>
        </div>
        
        {/* Group the products by category label visually */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
