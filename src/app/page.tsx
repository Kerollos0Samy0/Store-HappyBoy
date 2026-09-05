import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore";

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

export default async function Home() {
  const productsRef = collection(db, "products");
  const q = query(productsRef, limit(8));
  const snapshot = await getDocs(q);
  const products: any[] = [];
  snapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() });
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-teal text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            مرحباً بك في متجر HappyBoy
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-teal-100">
            أحدث وأفضل موديلات الملابس الولادي والبناتي بجودة لا تقارن
          </p>
          <Link 
            href="/category/winter/boys/middle" 
            className="bg-brand-red text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all hover:scale-105 inline-block"
          >
            تسوق الكوليكشن الجديد الآن
          </Link>
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section className="max-w-7xl mx-auto py-16 px-4 w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center relative">
          <span className="bg-gray-50 px-4 relative z-10">وصل حديثاً</span>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
