import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit, orderBy } from "firebase/firestore";

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

export const revalidate = 60;

export default async function Home(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams.tab || "new";

  const productsRef = collection(db, "products");
  
  // Fake logic to show different products for now: 
  // 'new' -> order by modelNumber desc (or name)
  // 'best' -> order by modelNumber asc
  const q = query(
    productsRef, 
    orderBy("modelNumber", activeTab === "best" ? "asc" : "desc"), 
    limit(8)
  );
  
  const snapshot = await getDocs(q);
  const products: any[] = [];
  snapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() });
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        {/* Brand Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4B9B9E] to-[#A3292E] opacity-90 z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center py-24 px-4 sm:py-32">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md">
            أناقة طفلك تبدأ من هنا HappyBoy
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-white font-medium drop-shadow">
            أحدث كولكشن ملابس الأطفال ولادي وبناتي بأعلى خامة وأفضل سعر
          </p>
          <Link 
            href="/category/winter/boys/middle" 
            className="bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded-full shadow-xl hover:bg-gray-100 transition-all hover:scale-105 inline-block border-b-4 border-[#A3292E]"
          >
            تسوق كوليكشن الشتاء الآن
          </Link>
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
