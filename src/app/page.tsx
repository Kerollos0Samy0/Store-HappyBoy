import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query, doc, getDoc } from "firebase/firestore";

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
  const heroImages = [
    "https://firebasestorage.googleapis.com/v0/b/happyboy01-39e92.firebasestorage.app/o/hero%2Fhappyboy-Ph12862.jpg?alt=media&token=b18eef9f-8423-4425-b888-711bc5efbb05", // Baby Boy
    "https://firebasestorage.googleapis.com/v0/b/happyboy01-39e92.firebasestorage.app/o/hero%2Fhappyboy-Ph11756.jpg?alt=media&token=c2530200-df9b-4693-8965-67ca6a857ddb", // Middle Boy
    "https://firebasestorage.googleapis.com/v0/b/happyboy01-39e92.firebasestorage.app/o/hero%2Fhappyboy-Ph11917.jpg?alt=media&token=d8242f5a-6728-4667-a144-3667d08a01c8", // Junior Boy
    "https://firebasestorage.googleapis.com/v0/b/happyboy01-39e92.firebasestorage.app/o/hero%2Fhappyboy-Ph13081.jpg?alt=media&token=fe83cf80-67c1-4c57-a819-92edf389634a", // Baby Girl
    "https://firebasestorage.googleapis.com/v0/b/happyboy01-39e92.firebasestorage.app/o/hero%2Fhappyboy-Ph14053.jpg?alt=media&token=e001c900-81f1-4274-881b-e694f0471f87", // Middle Girl
    "https://firebasestorage.googleapis.com/v0/b/happyboy01-39e92.firebasestorage.app/o/hero%2Fhappyboy-Ph13696.jpg?alt=media&token=9d2f0758-3553-4e1f-812b-c83e99ad79df"  // Junior Girl
  ];
  const savedOffsets = [-25, -5, -15, -15, -25, -15];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden min-h-screen flex items-center justify-center">
        {/* Dynamic Images Background */}
        <div className="absolute inset-0 z-0 flex">
          {heroImages.length > 0 ? (
            heroImages.map((img, i) => (
              <div key={i} className="flex-1 h-full relative overflow-hidden">
                {/* Dynamic left offset to align models */}
                <div className="absolute -inset-x-4 inset-y-0 h-full">
                  <Image src={img} alt="Hero" fill unoptimized quality={100} priority className="object-cover object-top opacity-95" />
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


    </div>
  );
}
