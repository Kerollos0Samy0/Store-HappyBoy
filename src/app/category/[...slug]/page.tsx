import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { use } from "react";
import ProductCard from "@/components/ProductCard";

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

export const revalidate = 60; // Revalidate every 60 seconds

async function getProductsByCategory(slug: string[]) {
  const productsRef = collection(db, "products");
  let q;

  if (slug[0] === "winter") {
    const mainCat = slug[1] === "boys" ? "ولادي" : "بناتي";
    let subCat = "";
    if (slug[2] === "baby") subCat = "بيبي";
    if (slug[2] === "middle") subCat = "وسط";
    if (slug[2] === "junior") subCat = "محير";

    q = query(
      productsRef,
      where("mainCategory", "==", mainCat),
      where("subCategory", "==", subCat)
    );
  } else if (slug[0] === "sports") {
    const subCat = slug[1] === "middle" ? "وسط" : "محير";
    q = query(
      productsRef,
      where("mainCategory", "==", "رياضي"),
      where("subCategory", "==", subCat)
    );
  } else if (slug[0] === "summer") {
    const gender = slug[1] === "boys" ? "ولادي" : "بناتي";
    const subCat = slug[2] === "middle" ? "وسط" : "محير";
    q = query(
      productsRef,
      where("mainCategory", "==", "سمر ميلتون"),
      where("subCategory", "==", subCat),
      where("gender", "==", gender)
    );
  } else {
    return [];
  }

  const snapshot = await getDocs(q);
  const products: any[] = [];
  snapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() });
  });

  return products;
}

function getCategoryTitle(slug: string[]) {
  let title = "";
  if (slug[0] === "winter") title += "شتوي ";
  if (slug[0] === "sports") title += "رياضي ";
  if (slug[0] === "summer") title += "سمر ميلتون ";

  if (slug[1] === "boys") title += "- ولادي ";
  if (slug[1] === "girls") title += "- بناتي ";

  const last = slug[slug.length - 1];
  if (last === "baby") title += "- بيبي";
  if (last === "middle") title += "- وسط";
  if (last === "junior") title += "- محير";

  return title;
}

export default async function CategoryPage(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  const products = await getProductsByCategory(params.slug);
  const title = getCategoryTitle(params.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b">
        {title} ({products.length} موديل)
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          لا توجد موديلات في هذا القسم حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
